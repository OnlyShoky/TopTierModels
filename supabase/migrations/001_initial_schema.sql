-- TopTierModels Supabase Database Schema
-- Version 1.0

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- Table: models
-- =====================
CREATE TABLE models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    huggingface_url TEXT UNIQUE NOT NULL,
    model_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    organization TEXT,
    category TEXT NOT NULL,
    description TEXT,
    readme_content TEXT,
    license TEXT,
    tags JSONB DEFAULT '[]',
    model_metadata JSONB DEFAULT '{}',
    featured_image_url TEXT,
    downloads INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    scraped_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_models_category ON models(category);
CREATE INDEX idx_models_status ON models(status);
CREATE INDEX idx_models_organization ON models(organization);

-- =====================
-- Table: articles
-- =====================
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    hero_image_url TEXT,
    read_time_minutes INTEGER,
    author TEXT DEFAULT 'TopTierModels AI',
    version INTEGER DEFAULT 1,
    seo_keywords TEXT[],
    related_model_ids UUID[],
    published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_articles_model_id ON articles(model_id);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(published);

-- =====================
-- Table: simplified_articles (LinkedIn posts)
-- =====================
CREATE TABLE simplified_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    hook TEXT,
    key_points TEXT[],
    call_to_action TEXT,
    hashtags TEXT[],
    character_count INTEGER,
    posted_to_linkedin BOOLEAN DEFAULT FALSE,
    linkedin_post_id TEXT,
    posted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_simplified_articles_article_id ON simplified_articles(article_id);
CREATE INDEX idx_simplified_articles_model_id ON simplified_articles(model_id);

-- =====================
-- Table: model_scores
-- =====================
CREATE TABLE model_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID UNIQUE NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    overall_score DECIMAL(5,2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    tier TEXT NOT NULL CHECK (tier IN ('S', 'A', 'B', 'C', 'D')),
    quality_score DECIMAL(5,2) CHECK (quality_score >= 0 AND quality_score <= 100),
    speed_score DECIMAL(5,2) CHECK (speed_score >= 0 AND speed_score <= 100),
    freedom_score DECIMAL(5,2) CHECK (freedom_score >= 0 AND freedom_score <= 100),
    benchmarks JSONB DEFAULT '{}',
    metrics_details JSONB DEFAULT '{}',
    scoring_methodology TEXT,
    scored_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_model_scores_model_id ON model_scores(model_id);
CREATE INDEX idx_model_scores_tier ON model_scores(tier);
CREATE INDEX idx_model_scores_overall_score ON model_scores(overall_score DESC);

-- =====================
-- Table: tierlists
-- =====================
CREATE TABLE tierlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    model_count INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tierlists_category ON tierlists(category);

-- =====================
-- Table: images
-- =====================
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES models(id) ON DELETE CASCADE,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    source_url TEXT NOT NULL,
    storage_path TEXT UNIQUE NOT NULL,
    public_url TEXT NOT NULL,
    thumbnail_url TEXT,
    alt_text TEXT,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    mime_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_images_model_id ON images(model_id);
CREATE INDEX idx_images_article_id ON images(article_id);

-- =====================
-- Table: code_snippets
-- =====================
CREATE TABLE code_snippets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    language TEXT NOT NULL,
    code TEXT NOT NULL,
    snippet_type TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_code_snippets_model_id ON code_snippets(model_id);

-- =====================
-- Row Level Security
-- =====================

-- Enable RLS on all tables
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE simplified_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE tierlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_snippets ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read access" ON models FOR SELECT USING (status = 'active');
CREATE POLICY "Public read access" ON articles FOR SELECT USING (published = TRUE);
CREATE POLICY "Public read access" ON simplified_articles FOR SELECT USING (TRUE);
CREATE POLICY "Public read access" ON model_scores FOR SELECT USING (TRUE);
CREATE POLICY "Public read access" ON tierlists FOR SELECT USING (TRUE);
CREATE POLICY "Public read access" ON images FOR SELECT USING (TRUE);
CREATE POLICY "Public read access" ON code_snippets FOR SELECT USING (TRUE);

-- Service role full access (for backend uploads)
CREATE POLICY "Service role full access" ON models FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON articles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON simplified_articles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON model_scores FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON tierlists FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON images FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON code_snippets FOR ALL USING (auth.role() = 'service_role');

-- =====================
-- Functions
-- =====================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_models_updated_at BEFORE UPDATE ON models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_simplified_articles_updated_at BEFORE UPDATE ON simplified_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_model_scores_updated_at BEFORE UPDATE ON model_scores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tierlists_updated_at BEFORE UPDATE ON tierlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_code_snippets_updated_at BEFORE UPDATE ON code_snippets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment model count for a tierlist category (used by backend)
CREATE OR REPLACE FUNCTION increment_tierlist_count(cat TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE tierlists
  SET model_count = model_count + 1
  WHERE category = cat;
END;
$$ LANGUAGE plpgsql;

-- =====================
-- Initial Tierlists Data
-- =====================
INSERT INTO tierlists (category, display_name, description, icon) VALUES
    ('Image Generation', 'Image Generation', 'Models for generating images from text or other inputs', '🎨'),
    ('Text Generation', 'Text Generation', 'Large Language Models for text generation', '📝'),
    ('Computer Vision', 'Computer Vision', 'Models for image classification, detection, and analysis', '👁️'),
    ('Natural Language Processing', 'Natural Language Processing', 'Models for NLP tasks like sentiment, NER, etc.', '💬'),
    ('Multimodal Models', 'Multimodal Models', 'Models that work with multiple data modalities', '🔮'),
    ('Audio Processing', 'Audio Processing', 'Models for speech, music, and audio generation', '🎵'),
    ('Video Generation', 'Video Generation', 'Models for video synthesis and editing', '🎬'),
    ('Reinforcement Learning', 'Reinforcement Learning', 'Models trained with reinforcement learning', '🎮'),
    ('Other', 'Other', 'Other emerging AI model categories', '🔧');
