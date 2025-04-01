
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

    // Get user ID from the request URL or body
    const url = new URL(req.url);
    let userId = url.searchParams.get("userId");
    
    if (!userId) {
      // If not in URL, try to get from request body
      try {
        const body = await req.json();
        userId = body.userId;
      } catch {
        // No body or invalid JSON
      }
    }
    
    if (!userId) {
      return new Response(
        JSON.stringify({
          error: "Missing userId parameter",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Fetching dispute letters for user ${userId}`);

    // Query dispute letters for the user
    const { data: letters, error: lettersError } = await supabase
      .from("dispute_letters")
      .select("*")
      .eq("user_id", userId)
      .order("generated_at", { ascending: false });

    if (lettersError) {
      console.error("Error fetching dispute letters:", lettersError);
      return new Response(
        JSON.stringify({
          error: "Error fetching dispute letters",
          details: lettersError,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        letters,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error handling dispute letters request:", error);
    
    return new Response(
      JSON.stringify({
        error: "Error handling dispute letters request",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
