
-- Migration: 20251102063247

-- Migration: 20251102061805

-- Migration: 20251102061542

-- Migration: 20251102054239

-- Migration: 20251102051725
-- Criar enum para tipos de plano
CREATE TYPE plan_type AS ENUM ('trial', 'basic', 'pro', 'infinite');

-- Criar enum para níveis de proteção
CREATE TYPE protection_level AS ENUM ('standard', 'advanced', 'undetectable');

-- Criar enum para status de processo
CREATE TYPE process_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Criar enum para níveis de risco
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');

-- Tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18),
  plan plan_type NOT NULL DEFAULT 'trial',
  credits INTEGER NOT NULL DEFAULT 100,
  name_change_used BOOLEAN NOT NULL DEFAULT false,
  theme_preference TEXT DEFAULT 'dark',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de chaves de licença
CREATE TABLE public.license_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL,
  key_value UUID NOT NULL DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'revoked')),
  scripts_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de logs de criptografia
CREATE TABLE public.encryption_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  protection_level protection_level NOT NULL,
  license_key_id UUID REFERENCES public.license_keys(id),
  status process_status NOT NULL DEFAULT 'pending',
  credits_used INTEGER NOT NULL DEFAULT 0,
  encrypted_file_url TEXT,
  loader_code TEXT,
  expiration_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de logs de análise de vulnerabilidade
CREATE TABLE public.analysis_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  risk_level risk_level,
  vulnerabilities JSONB,
  suggestions JSONB,
  status process_status NOT NULL DEFAULT 'pending',
  credits_used INTEGER NOT NULL DEFAULT 2,
  expiration_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de histórico geral
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  item_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failure')),
  credits_used INTEGER NOT NULL DEFAULT 0,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encryption_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas RLS para license_keys
CREATE POLICY "Users can view own keys"
  ON public.license_keys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own keys"
  ON public.license_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own keys"
  ON public.license_keys FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own keys"
  ON public.license_keys FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas RLS para encryption_logs
CREATE POLICY "Users can view own encryption logs"
  ON public.encryption_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own encryption logs"
  ON public.encryption_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para analysis_logs
CREATE POLICY "Users can view own analysis logs"
  ON public.analysis_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis logs"
  ON public.analysis_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para activity_logs
CREATE POLICY "Users can view own activity logs"
  ON public.activity_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, company_name, age)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Company'),
    COALESCE((NEW.raw_user_meta_data->>'age')::INTEGER, 18)
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_license_keys_updated_at
  BEFORE UPDATE ON public.license_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_encryption_logs_updated_at
  BEFORE UPDATE ON public.encryption_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- Migration: 20251102055759
-- Ensure all tables exist with proper structure

-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  credits INTEGER NOT NULL DEFAULT 100,
  plan TEXT NOT NULL DEFAULT 'trial',
  theme_preference TEXT DEFAULT 'dark',
  name_change_used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create license_keys table if not exists
CREATE TABLE IF NOT EXISTS public.license_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL,
  key_value UUID NOT NULL DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'active',
  scripts_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create encryption_logs table if not exists
CREATE TABLE IF NOT EXISTS public.encryption_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  protection_level TEXT NOT NULL,
  license_key_id UUID REFERENCES public.license_keys(id),
  credits_used INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  encrypted_file_url TEXT,
  loader_code TEXT,
  expiration_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create analysis_logs table if not exists
CREATE TABLE IF NOT EXISTS public.analysis_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  credits_used INTEGER NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'pending',
  risk_level TEXT,
  vulnerabilities JSONB,
  suggestions JSONB,
  expiration_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create activity_logs table if not exists
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  item_name TEXT NOT NULL,
  status TEXT NOT NULL,
  credits_used INTEGER NOT NULL DEFAULT 0,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encryption_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- License keys policies
DROP POLICY IF EXISTS "Users can view own keys" ON public.license_keys;
CREATE POLICY "Users can view own keys" ON public.license_keys FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own keys" ON public.license_keys;
CREATE POLICY "Users can insert own keys" ON public.license_keys FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own keys" ON public.license_keys;
CREATE POLICY "Users can update own keys" ON public.license_keys FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own keys" ON public.license_keys;
CREATE POLICY "Users can delete own keys" ON public.license_keys FOR DELETE USING (auth.uid() = user_id);

-- Encryption logs policies
DROP POLICY IF EXISTS "Users can view own encryption logs" ON public.encryption_logs;
CREATE POLICY "Users can view own encryption logs" ON public.encryption_logs FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own encryption logs" ON public.encryption_logs;
CREATE POLICY "Users can insert own encryption logs" ON public.encryption_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Analysis logs policies
DROP POLICY IF EXISTS "Users can view own analysis logs" ON public.analysis_logs;
CREATE POLICY "Users can view own analysis logs" ON public.analysis_logs FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own analysis logs" ON public.analysis_logs;
CREATE POLICY "Users can insert own analysis logs" ON public.analysis_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activity logs policies
DROP POLICY IF EXISTS "Users can view own activity logs" ON public.activity_logs;
CREATE POLICY "Users can view own activity logs" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own activity logs" ON public.activity_logs;
CREATE POLICY "Users can insert own activity logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create or replace update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_license_keys_updated_at ON public.license_keys;
CREATE TRIGGER update_license_keys_updated_at BEFORE UPDATE ON public.license_keys
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_encryption_logs_updated_at ON public.encryption_logs;
CREATE TRIGGER update_encryption_logs_updated_at BEFORE UPDATE ON public.encryption_logs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_analysis_logs_updated_at ON public.analysis_logs;
CREATE TRIGGER update_analysis_logs_updated_at BEFORE UPDATE ON public.analysis_logs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Migration: 20251102055829
-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Migration: 20251102060138
-- Update default credits to 10 for trial plan
ALTER TABLE public.profiles ALTER COLUMN credits SET DEFAULT 10;



-- Migration: 20251102061929
-- Create storage bucket for encrypted files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('encrypted-files', 'encrypted-files', false, 52428800, ARRAY['text/plain', 'application/octet-stream', 'text/x-lua']);

-- Create RLS policies for encrypted files bucket
CREATE POLICY "Users can upload their own encrypted files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'encrypted-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own encrypted files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'encrypted-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own encrypted files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'encrypted-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

