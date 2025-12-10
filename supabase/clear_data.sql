-- ⚠️ WARNING: This will DELETE ALL ROWS from your tables.
-- The table structure (schema) will remain intact.
-- Run this in Supabase SQL Editor to clear your data.

TRUNCATE TABLE 
    public.simplified_articles,
    public.model_scores,
    public.images,
    public.code_snippets,
    public.articles,
    public.models,
    public.tierlists
RESTART IDENTITY CASCADE;
