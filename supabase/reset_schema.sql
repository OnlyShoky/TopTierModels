-- ⚠️ WARNING: This will DELETE ALL DATA in your database
-- Run this in Supabase SQL Editor to wipe the slate clean

-- 1. Drop Tables (Order matters because of dependencies)
DROP TABLE IF EXISTS public.simplified_articles;
DROP TABLE IF EXISTS public.model_scores;
DROP TABLE IF EXISTS public.articles;
DROP TABLE IF EXISTS public.models;
DROP TABLE IF EXISTS public.tierlists;
DROP TABLE IF EXISTS public.images;
DROP TABLE IF EXISTS public.code_snippets;

-- 2. Drop Functions
DROP FUNCTION IF EXISTS public.increment_tierlist_count;
DROP FUNCTION IF EXISTS public.update_updated_at_column;

-- Now you can re-run:
-- 1. migrations/001_initial_schema.sql
-- 2. migrations/002_add_increment_function.sql
-- 3. seed.sql (optional)
