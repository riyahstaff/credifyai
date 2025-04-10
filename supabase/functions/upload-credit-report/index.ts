
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

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
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return new Response(
        JSON.stringify({
          error: "Missing file or userId in request",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Uploading credit report for user ${userId}: ${file.name}`);

    // Create folder path based on user ID
    const filePath = `${userId}/${file.name}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("credit_reports")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return new Response(
        JSON.stringify({
          error: "Error uploading file",
          details: uploadError,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create a record in the credit_reports table
    const { data: reportData, error: reportError } = await supabase
      .from("credit_reports")
      .insert({
        user_id: userId,
        file_name: file.name,
        file_path: filePath,
        status: "Uploading"
      })
      .select()
      .single();

    if (reportError) {
      console.error("Error creating credit report record:", reportError);
      return new Response(
        JSON.stringify({
          error: "Error creating credit report record",
          details: reportError,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Call the process-credit-report function to analyze the report
    const { data: processingResponse, error: processingError } = await supabase.functions.invoke(
      "process-credit-report",
      {
        body: {
          credit_report_id: reportData.id,
        },
      }
    );

    if (processingError) {
      console.error("Error processing credit report:", processingError);
      
      // Update the report status to reflect error
      await supabase
        .from("credit_reports")
        .update({
          status: "Failed"
        })
        .eq("id", reportData.id);
        
      return new Response(
        JSON.stringify({
          error: "Error processing credit report",
          details: processingError,
          credit_report_id: reportData.id,
        }),
        {
          status: 202, // Return 202 Accepted since the file was uploaded successfully
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Credit report uploaded and processed successfully",
        credit_report_id: reportData.id,
        processing_result: processingResponse,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error handling credit report upload:", error);
    
    return new Response(
      JSON.stringify({
        error: "Error handling credit report upload",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
