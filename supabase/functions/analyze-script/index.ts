import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { fileContent, fileName } = await req.json();

    console.log('Starting analysis for user:', user.id);

    // Get user profile
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('credits, plan')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const creditsNeeded = 2;
    
    if (profile.plan !== 'infinite' && profile.credits < creditsNeeded) {
      return new Response(JSON.stringify({ error: 'Insufficient credits' }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Simulate vulnerability analysis
    const vulnerabilities = [
      {
        type: 'SQL Injection',
        severity: 'high',
        line: Math.floor(Math.random() * 100),
        description: 'Potential SQL injection vulnerability detected'
      },
      {
        type: 'Hardcoded Credentials',
        severity: 'medium',
        line: Math.floor(Math.random() * 100),
        description: 'Hardcoded credentials found in script'
      }
    ];

    const suggestions = [
      'Use parameterized queries to prevent SQL injection',
      'Store credentials in environment variables',
      'Add input validation for user data',
      'Implement rate limiting'
    ];

    const riskLevel = vulnerabilities.length > 2 ? 'high' : vulnerabilities.length > 0 ? 'medium' : 'low';

    // Calculate expiration
    let expirationDate;
    if (profile.plan === 'trial') {
      expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    } else if (profile.plan === 'basic') {
      expirationDate = new Date(Date.now() + 72 * 60 * 60 * 1000);
    } else {
      expirationDate = new Date('2099-12-31');
    }

    // Create analysis log
    const { data: analysisLog, error: logError } = await supabaseClient
      .from('analysis_logs')
      .insert({
        user_id: user.id,
        file_name: fileName,
        risk_level: riskLevel,
        vulnerabilities,
        suggestions,
        credits_used: creditsNeeded,
        expiration_date: expirationDate.toISOString(),
        status: 'completed',
      })
      .select()
      .single();

    if (logError) {
      console.error('Log error:', logError);
    }

    // Deduct credits
    if (profile.plan !== 'infinite') {
      await supabaseClient
        .from('profiles')
        .update({ credits: profile.credits - creditsNeeded })
        .eq('id', user.id);
    }

    // Log activity
    await supabaseClient
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: 'analyze',
        item_name: fileName,
        status: 'completed',
        credits_used: creditsNeeded,
        details: `Risk Level: ${riskLevel}`,
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        analysisLogId: analysisLog?.id,
        riskLevel,
        vulnerabilities,
        suggestions
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});