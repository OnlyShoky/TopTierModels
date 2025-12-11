-- Migration 003: Update schema for new metadata and remove deprecated fields

-- 1. Remove downloads and likes from models table
ALTER TABLE models DROP COLUMN IF EXISTS downloads;
ALTER TABLE models DROP COLUMN IF EXISTS likes;

-- 2. Add new metadata fields to models table
ALTER TABLE models ADD COLUMN IF NOT EXISTS safetensors BOOLEAN DEFAULT NULL;
ALTER TABLE models ADD COLUMN IF NOT EXISTS model_size TEXT DEFAULT NULL;
ALTER TABLE models ADD COLUMN IF NOT EXISTS tensor_types TEXT[] DEFAULT '{}';

-- 3. Add same fields to articles if needed? 
-- No, the front-end fetches from 'models', but 'seo_keywords' is in 'articles'.
-- 'seo_keywords' is already in 'articles' table (from 001 schema).

-- 4. Ensure model_scores has the correct columns (already in 001: overall, quality, speed, freedom)
-- 001 has: overall_score, quality_score, speed_score, freedom_score. This matches.
