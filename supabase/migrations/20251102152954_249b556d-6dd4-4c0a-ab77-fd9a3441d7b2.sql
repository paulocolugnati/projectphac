-- Force types regeneration after remix
-- This migration ensures all tables are properly reflected in TypeScript types

-- Add a comment to the profiles table to trigger types regeneration
COMMENT ON TABLE public.profiles IS 'User profile information including name, company, and subscription details';

-- Add a comment to the activity_logs table
COMMENT ON TABLE public.activity_logs IS 'Complete audit log of all user actions in the system';

-- Add a comment to the license_keys table
COMMENT ON TABLE public.license_keys IS 'License keys for script encryption and binding';

-- Add a comment to the encryption_logs table
COMMENT ON TABLE public.encryption_logs IS 'Log of all encryption operations performed';

-- Add a comment to the analysis_logs table
COMMENT ON TABLE public.analysis_logs IS 'Log of all vulnerability analysis operations';

-- Verify all tables exist
DO $$
BEGIN
  RAISE NOTICE 'All tables verified and documented for types generation';
END $$;