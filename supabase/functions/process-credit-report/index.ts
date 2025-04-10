
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
      .download(reportData.file_path);

    if (downloadError || !fileData) {
      console.error("Error downloading file:", downloadError);
      
      // Update the credit report record with the error
      await supabase
        .from("credit_reports")
        .update({
          processed: true,
          processing_error: `Error downloading file: ${downloadError?.message || "Unknown error"}`,
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
    const issues = await detect_issues(text);
    
    // Log and store the detected issues
    console.log(`Found ${issues.length} issues in credit report`);
    
    if (issues.length > 0) {
      // Insert issues into the credit_report_issues table
      const issueRecords = issues.map(issue => ({
        credit_report_id,
        user_id: reportData.user_id,
        type: issue.type || "Unknown Issue",
        description: issue.description || "",
        severity: issue.severity || "medium",
        account_name: issue.account?.accountName,
        account_number: issue.account?.accountNumber,
        bureau: reportData.bureau || "Unknown",
        details: issue
      }));
      
      const { error: issueInsertError } = await supabase
        .from("credit_report_issues")
        .insert(issueRecords);
        
      if (issueInsertError) {
        console.error("Error storing issues:", issueInsertError);
      } else {
        console.log(`Stored ${issueRecords.length} issues in database`);
      }
    } else {
      console.log("No issues detected in credit report");
    }
    
    // Get letter templates
    const { data: templates, error: templateError } = await supabase
      .from("letter_templates")
      .select("*");
    
    if (templateError) {
      console.error("Error fetching letter templates:", templateError);
    }
    
    // Generate dispute letters
    console.log("Generating dispute letters");
    const letters = await generate_letters(issues, userData || {}, text, templates || []);
    
    if (letters.length > 0) {
      // Insert letters into the database
      const letterRecords = letters.map((letter) => ({
        user_id: reportData.user_id,
        title: letter.title || "Credit Report Dispute",
        letterContent: letter.content || letter.letterContent,
        content: letter.content || letter.letterContent,
        bureau: letter.bureau || reportData.bureau || "Unknown",
        accountNumber: letter.account_number || "",
        accountName: letter.creditor_name || letter.accountName || "Unknown Account",
        errorType: letter.issue_type || "General Dispute",
        status: "ready"
      }));
      
      const { data: insertedLetters, error: insertError } = await supabase
        .from("dispute_letters")
        .insert(letterRecords)
        .select();
      
      if (insertError) {
        console.error("Error inserting dispute letters:", insertError);
      } else {
        console.log(`Inserted ${insertedLetters.length} dispute letters into database`);
      }
    }
    
    // Update the credit report record
    await supabase
      .from("credit_reports")
      .update({
        processed: true,
        processing_error: null,
        status: "Processed"
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
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
