-- ⚠️ WARNING: This will DELETE ALL DATA in your database
-- Run this in Supabase SQL Editor to wipe the slate clean

-- 1. Drop Tables (Order matters because of dependencies)
DROP TABLE IF EXISTS public.simplified_articles CASCADE;
DROP TABLE IF EXISTS public.model_scores CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.models CASCADE;
DROP TABLE IF EXISTS public.tierlists CASCADE;
DROP TABLE IF EXISTS public.images CASCADE;
DROP TABLE IF EXISTS public.code_snippets CASCADE;

-- 2. Drop Functions
DROP FUNCTION IF EXISTS public.increment_tierlist_count;
DROP FUNCTION IF EXISTS public.update_updated_at_column;

-- Now you can re-run:
-- 1. migrations/001_initial_schema.sql
-- 2. migrations/002_add_increment_function.sql
-- 3. migrations/003_update_schema.sql
-- 4. seed.sql (optional)
