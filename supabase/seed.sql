-- Seed data for TopTierModels
-- Run this AFTER running migrations/001 -> 002 -> 003

BEGIN;

-- Clear existing data to avoid duplicates if re-running without full reset
TRUNCATE TABLE articles CASCADE;
TRUNCATE TABLE models CASCADE;
-- (Tierlists are static, defined in 001, so we don't truncate them)

-- =================================================================================================
-- 1. TEXT GENERATION MODELS (ChatGPT, Claude, Gemini, Deepseek)
-- =================================================================================================

-- ChatGPT (GPT-4)
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://huggingface.co/openai/gpt-4', 'gpt-4', 'ChatGPT (GPT-4)', 'Text Generation', 'OpenAI',
        'The latest multimodal model from OpenAI, offering state-of-the-art performance across reasoning, coding, and creative tasks.',
        'Proprietary', FALSE, '1.8T (Est)', '{}',
        'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'ChatGPT (GPT-4): The King of LLMs', 
        'chatgpt-gpt-4-analysis', 
        'An in-depth look at GPT-4, the industry standard for LLM performance, examining its reasoning capabilities and ecosystem dominance.', 
        '# ChatGPT (GPT-4) Analysis\n\nGPT-4 remains the benchmark for all other LLMs...',
        ARRAY['Large Language Model', 'OpenAI', 'Text Generation', 'Chatbot', 'Proprietary'], 
        7, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 92.0, 'S', 98.0, 85.0, 40.0 FROM a;

-- Claude 3.5 Sonnet
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://huggingface.co/anthropic/claude-3-5-sonnet', 'claude-3-5-sonnet', 'Claude 3.5 Sonnet', 'Text Generation', 'Anthropic',
        'Anthropic''s most balanced model, delivering top-tier performance at high speed and lower cost.',
        'Proprietary', FALSE, 'Unknown', '{}',
        'https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'Claude 3.5 Sonnet: Coding & Reasoning Specialist', 
        'claude-3-5-sonnet-review', 
        'Why developers are switching to Claude 3.5 Sonnet for coding tasks and complex reasoning.', 
        '# Claude 3.5 Sonnet\n\nAnthropic has delivered a masterpiece with Sonnet 3.5...',
        ARRAY['Anthropic', 'Coding Assistant', 'Text Generation', 'Proprietary'], 
        6, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 94.0, 'S', 97.0, 95.0, 40.0 FROM a;

-- Gemini 1.5 Pro
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://huggingface.co/google/gemini-1-5-pro', 'gemini-1-5-pro', 'Gemini 1.5 Pro', 'Text Generation', 'Google DeepMind',
        'Google''s flagship multimodal model with a massive 2M token context window.',
        'Proprietary', FALSE, 'Unknown', '{}',
        'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'Gemini 1.5 Pro: Infinite Context', 
        'gemini-1-5-pro-review', 
        'Analyzing how Gemini''s massive context window changes the game for document analysis.', 
        '# Gemini 1.5 Pro\n\nWith a 2 million token context window, Gemini 1.5 Pro allows...',
        ARRAY['Google', 'Multimodal', 'Long Context', 'Proprietary'], 
        6, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 90.0, 'S', 95.0, 90.0, 45.0 FROM a;

-- DeepSeek V3 (Open Weights)
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://huggingface.co/deepseek-ai/DeepSeek-V3', 'DeepSeek-V3', 'DeepSeek V3', 'Text Generation', 'DeepSeek',
        'A powerful open-weights Mixture-of-Experts model that rivals top proprietary models.',
        'license:MIT', TRUE, '671B', ARRAY['BF16', 'FP8'],
        'https://github.com/deepseek-ai.png'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'DeepSeek V3: Open Source Giant', 
        'deepseek-v3-analysis', 
        'DeepSeek V3 proves that open weights can compete with GPT-4 class models.', 
        '# DeepSeek V3\n\nA massive MoE model released with an MIT license...',
        ARRAY['DeepSeek', 'Open Weights', 'MoE', 'license:MIT'], 
        8, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 93.0, 'S', 94.0, 85.0, 95.0 FROM a;


-- =================================================================================================
-- 2. IMAGE GENERATION (FLUX.1, Stable Diffusion 3.5)
-- =================================================================================================

-- FLUX.1 [dev]
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://huggingface.co/black-forest-labs/FLUX.1-dev', 'FLUX.1-dev', 'FLUX.1 [dev]', 'Image Generation', 'Black Forest Labs',
        'State-of-the-art open weights image generation model with exceptional prompt adherence.',
        'license:other', TRUE, '12B', ARRAY['BF16'],
        'https://huggingface.co/black-forest-labs/FLUX.1-dev/resolve/main/assets/repo-header.jpg'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'FLUX.1 [dev]: The New King of Open Image Gen', 
        'flux-1-dev-review', 
        'FLUX.1 sets a new standard for text rendering and prompt adherence in open models.', 
        '# FLUX.1 Analysis\n\nBlack Forest Labs has released a monster model...',
        ARRAY['Image Generation', 'Text-to-Image', 'Open Weights', 'Black Forest Labs'], 
        5, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 91.0, 'S', 98.0, 70.0, 85.0 FROM a;

-- Stable Diffusion 3.5 Large
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://huggingface.co/stabilityai/stable-diffusion-3.5-large', 'stable-diffusion-3.5-large', 'Stable Diffusion 3.5', 'Image Generation', 'Stability AI',
        'The latest iteration of the legendary Stable Diffusion family, improved for realism.',
        'license:stability-community', TRUE, '8B', ARRAY['FP16', 'BF16'],
        'https://huggingface.co/stabilityai/stable-diffusion-3.5-large/resolve/main/banner.png'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'Stable Diffusion 3.5: Back on Track', 
        'stable-diffusion-3-5-review', 
        'Stability AI returns to form with a robust, highly prompt-adherent model.', 
        '# SD 3.5 Large\n\nAfter the hiccups of previous versions, SD 3.5 delivers...',
        ARRAY['Image Generation', 'Stability AI', 'Text-to-Image', 'Open Weights'], 
        5, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 88.0, 'A', 92.0, 80.0, 85.0 FROM a;


-- =================================================================================================
-- 3. AUDIO MODELS (Whisper v3, AudioLDM 2)
-- =================================================================================================

-- Whisper v3
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://huggingface.co/openai/whisper-large-v3', 'whisper-large-v3', 'Whisper v3', 'Audio Processing', 'OpenAI',
        'Robust speech recognition model capable of multilingual transcription and translation.',
        'license:MIT', TRUE, '1.5B', ARRAY['FP16'],
        'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/transformers/model_doc/whisper_architecture.svg'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'Whisper v3: The Gold Standard for ASR', 
        'whisper-v3-review', 
        'OpenAI''s Whisper v3 continues to dominate open-source speech recognition.', 
        '# Whisper v3\n\nFor subtitles and transcription, nothing beats Whisper...',
        ARRAY['Audio', 'ASR', 'Speech-to-Text', 'Open Source', 'license:MIT'], 
        4, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 96.0, 'S', 98.0, 85.0, 95.0 FROM a;

-- AudioLDM 2
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://huggingface.co/cvssp/audioldm2', 'audioldm2', 'AudioLDM 2', 'Audio Processing', 'Surrey',
        'Text-to-audio generation model for sound effects, music, and speech.',
        'license:cc-by-nc-sa-4.0', TRUE, '1.2B', ARRAY['FP16'],
        'https://huggingface.co/cvssp/audioldm2/resolve/main/audioldm2.png'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'AudioLDM 2: Versatile Sound Generation', 
        'audioldm-2-review', 
        'Generate sound effects and music from text descriptions with high fidelity.', 
        '# AudioLDM 2\n\nA versatile model for creative audio generation...',
        ARRAY['Audio', 'Text-to-Audio', 'Sound Generation', 'Open Source'], 
        4, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 82.0, 'A', 85.0, 80.0, 70.0 FROM a;


-- =================================================================================================
-- 4. VISION MODELS (LLaVA Next, Idefics2)
-- =================================================================================================

-- LLaVA-NeXT (v1.6)
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://huggingface.co/llava-hf/llava-v1.6-mistral-7b-hf', 'llava-v1.6-mistral-7b', 'LLaVA-NeXT (v1.6)', 'Computer Vision', 'LLaVA Team',
        'Improved Large Language-and-Vision Assistant built on Mistral 7B.',
        'license:apache-2.0', TRUE, '7.2B', ARRAY['FP16', 'BF16'],
        'https://huggingface.co/llava-hf/llava-v1.6-mistral-7b-hf/resolve/main/llava_v1_5_radar.jpg'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'LLaVA-NeXT: Vision-Language Efficiency', 
        'llava-next-review', 
        'LLaVA v1.6 demonstrates incredible vision-language capabilities in a compact package.', 
        '# LLaVA-NeXT\n\nBuilt on Mistral, this model excels at describing images...',
        ARRAY['Computer Vision', 'VLM', 'Image-to-Text', 'Open Source', 'license:Apache-2.0'], 
        5, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 89.0, 'A', 90.0, 92.0, 95.0 FROM a;

-- Idefics2
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://huggingface.co/HuggingFaceM4/idefics2-8b', 'idefics2-8b', 'Idefics2', 'Computer Vision', 'Hugging Face',
        'A powerful 8B vision-language model for document parsing and image QA.',
        'license:apache-2.0', TRUE, '8B', ARRAY['BF16'],
        'https://huggingface.co/HuggingFaceM4/idefics2-8b/resolve/main/idefics2.png'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'Idefics2: Validating Visual Documents', 
        'idefics2-review', 
        'Excellent performance on charts, documents, and visual reasoning tasks.', 
        '# Idefics2\n\nA native multimodal model from Hugging Face...',
        ARRAY['Computer Vision', 'VLM', 'Document QA', 'Open Source', 'license:Apache-2.0'], 
        5, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 87.0, 'A', 88.0, 85.0, 95.0 FROM a;

COMMIT;
