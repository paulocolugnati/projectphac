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

    const { fileContent, fileName, licenseKeyId, protectionLevel, customName } = await req.json();

    console.log('Starting encryption for user:', user.id);

    // Get user profile to check credits and plan
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('credits, plan')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const creditsNeeded = 4;
    
    if (profile.plan !== 'infinite' && profile.credits < creditsNeeded) {
      return new Response(JSON.stringify({ error: 'Insufficient credits' }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get license key
    const { data: licenseKey } = await supabaseClient
      .from('license_keys')
      .select('*')
      .eq('id', licenseKeyId)
      .eq('user_id', user.id)
      .single();

    if (!licenseKey || licenseKey.status !== 'active') {
      return new Response(JSON.stringify({ error: 'Invalid or inactive license key' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Simulate bytecode obfuscation and encryption
    const encryptedContent = btoa(fileContent); // Simple base64 encoding for simulation
    const loaderCode = `-- PhacProtect Encrypted Script
-- Protection Level: ${protectionLevel}
-- License Key: ${licenseKey.key_value}

local function decrypt()
  return "${encryptedContent}"
end

local decrypted = decrypt()
-- Execute decrypted code
load(atob(decrypted))()`;

    // Calculate expiration based on plan
    let expirationDate;
    if (profile.plan === 'trial') {
      expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    } else if (profile.plan === 'basic') {
      expirationDate = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours
    } else {
      expirationDate = new Date('2099-12-31'); // Infinite
    }

    // Upload encrypted file to storage
    const filePath = `${user.id}/${crypto.randomUUID()}_${fileName}`;
    const { error: uploadError } = await supabaseClient.storage
      .from('encrypted-files')
      .upload(filePath, new Blob([encryptedContent]), {
        contentType: 'text/plain',
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(JSON.stringify({ error: 'Failed to upload encrypted file' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create encryption log
    const { data: encryptionLog, error: logError } = await supabaseClient
      .from('encryption_logs')
      .insert({
        user_id: user.id,
        file_name: customName || fileName,
        file_type: 'lua',
        protection_level: protectionLevel,
        license_key_id: licenseKeyId,
        encrypted_file_url: filePath,
        loader_code: loaderCode,
        credits_used: creditsNeeded,
        expiration_date: expirationDate.toISOString(),
        status: 'completed',
      })
      .select()
      .single();

    if (logError) {
      console.error('Log error:', logError);
    }

    // Update license key script count
    await supabaseClient
      .from('license_keys')
      .update({ scripts_count: (licenseKey.scripts_count || 0) + 1 })
      .eq('id', licenseKeyId);

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
        action: 'encrypt',
        item_name: customName || fileName,
        status: 'completed',
        credits_used: creditsNeeded,
        details: `Protection: ${protectionLevel}`,
      });

    console.log('Encryption completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        encryptionLogId: encryptionLog?.id,
        loaderCode,
        fileName 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Encryption error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});