
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";
import { extract_text } from "./text_extractor.ts";
import { detect_issues } from "./issue_detector.ts";
import { generate_letters } from "./letter_generator.ts";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const { credit_report_id } = await req.json();

    if (!credit_report_id) {
      return new Response(
        JSON.stringify({
          error: "Missing credit_report_id in request body",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Processing credit report ID: ${credit_report_id}`);

    // Get credit report information from database
    const { data: reportData, error: reportError } = await supabase
      .from("credit_reports")
      .select("*")
      .eq("id", credit_report_id)
      .single();

    if (reportError || !reportData) {
      console.error("Error fetching credit report:", reportError);
      return new Response(
        JSON.stringify({
          error: "Credit report not found",
          details: reportError,
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Download the credit report file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("credit_reports")
      .download(`${reportData.user_id}/${reportData.file_path}`);

    if (downloadError || !fileData) {
      console.error("Error downloading file:", downloadError);
      
      // Update the credit report record with the error
      await supabase
        .from("credit_reports")
        .update({
          processed: true,
          processing_error: `Error downloading file: ${downloadError.message}`,
        })
        .eq("id", credit_report_id);
      
      return new Response(
        JSON.stringify({
          error: "Error downloading credit report file",
          details: downloadError,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Extract text from the credit report
    console.log("Extracting text from credit report");
    const text = await extract_text(fileData, reportData.file_name);
    
    // Get user information
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", reportData.user_id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
    }

    // Detect issues in the credit report
    console.log("Detecting issues in credit report");
    const issues = detect_issues(text);
    
    if (issues.length === 0) {
      console.log("No issues detected in credit report");
      
      // Update the credit report record
      await supabase
        .from("credit_reports")
        .update({
          processed: true,
          processing_error: null,
        })
        .eq("id", credit_report_id);
      
      return new Response(
        JSON.stringify({
          message: "Credit report processed but no issues detected",
          credit_report_id,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    console.log(`Detected ${issues.length} issues in credit report`);
    
    // Get letter templates
    const { data: templates, error: templateError } = await supabase
      .from("letter_templates")
      .select("*");
    
    if (templateError) {
      console.error("Error fetching letter templates:", templateError);
      return new Response(
        JSON.stringify({
          error: "Error fetching letter templates",
          details: templateError,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Generate dispute letters
    console.log("Generating dispute letters");
    const letters = generate_letters(issues, userData || {}, text, templates);
    
    if (letters.length > 0) {
      // Insert letters into the database
      const letterRecords = letters.map((letter) => ({
        user_id: reportData.user_id,
        issue_type: letter.issue_type,
        letter_content: letter.content,
        credit_report_id,
        bureau: letter.bureau,
        account_number: letter.account_number,
        creditor_name: letter.creditor_name,
      }));
      
      const { data: insertedLetters, error: insertError } = await supabase
        .from("dispute_letters")
        .insert(letterRecords)
        .select();
      
      if (insertError) {
        console.error("Error inserting dispute letters:", insertError);
      } else {
        console.log(`Inserted ${insertedLetters.length} dispute letters`);
      }
    }
    
    // Update the credit report record
    await supabase
      .from("credit_reports")
      .update({
        processed: true,
        processing_error: null,
      })
      .eq("id", credit_report_id);
    
    return new Response(
      JSON.stringify({
        message: "Credit report processed successfully",
        credit_report_id,
        issues_detected: issues.length,
        letters_generated: letters.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing credit report:", error);
    
    return new Response(
      JSON.stringify({
        error: "Error processing credit report",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
