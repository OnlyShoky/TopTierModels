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
        '# ChatGPT (GPT-4) Analysis

## The Benchmark for General Intelligence
GPT-4 remains the undisputed king of large language models, setting the standard against which all others are measured. Its ability to handle complex reasoning, nuanced instructions, and multimodal inputs makes it the most versatile tool available.

### Key Strengths
*   **Reasoning Capabilities**: Unmatched performance in logic puzzles, math, and coding.
*   **Multimodality**: Seamlessly processes text and images.
*   **Instruction Following**: Adheres to complex system prompts better than any competitor.

## Performance Analysis
While slower than some lightweight models, GPT-4''s output quality justifies the latency. It rarely hallucinates compared to predecessors and maintains coherence over long context windows.

### Scoring Breakdown
*   **Quality (98/100)**: Almost flawless in general tasks.
*   **Speed (85/100)**: Improved with Turbo, but still heavy.
*   **Freedom (40/100)**: Highly guarded and proprietary.

## Use Cases
*   Complex coding architectures
*   Creative writing and storytelling
*   Data analysis and visualization',
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
        '# Claude 3.5 Sonnet Analysis

## The Developer''s New Best Friend
Anthropic''s Claude 3.5 Sonnet has rapidly become the preferred model for software engineers. Its "Artefacts" UI feature, combined with superior coding logic, allows for an interactive development loop that feels futuristic.

### Why It Stands Out
*   **Coding Proficiency**: rigorous benchmarks show it outperforming GPT-4o in many coding tasks.
*   **Visual Logic**: excellent at interpreting charts and diagrams.
*   **Speed/Cost Ratio**: Significantly cheaper and faster than Opus, yet smarter.

## Performance Analysis
Sonnet strikes the perfect balance. It is fast enough for chat but smart enough for system architecture.

### Scoring Breakdown
*   **Quality (97/100)**: Exceptional for code and logic.
*   **Speed (95/100)**: Blazing fast for its intelligence class.
*   **Freedom (40/100)**: Strict safety guardrails.

## Use Cases
*   Full-stack web development
*   Refactoring legacy codebases
*   Technical documentation writing',
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
        '# Gemini 1.5 Pro Analysis

## Infinite Context, Infinite Possibilities
Google''s Gemini 1.5 Pro redefines what is possible with RAG (Retrieval-Augmented Generation) by offering a staggering 2 million token context window. You can dump entire repositories, books, or codebases into the prompt, and it attends to them with near-perfect recall.

### Key Features
*   **2M Context Window**: The largest standard window in the industry.
*   **Native Multimodality**: Processes hours of video and audio natively.
*   **Integration**: deeply integrated into the Google Workspace ecosystem.

## Performance Analysis
While it can sometimes be "lazy" with output length, its retrieval accuracy over massive contexts is S-Tier.

### Scoring Breakdown
*   **Quality (95/100)**: Excellent retrieval and summary.
*   **Speed (90/100)**: Fast token generation, though prompt processing takes time.
*   **Freedom (45/100)**: Proprietary and filtered.

## Use Cases
*   Analyzing hour-long video meetings
*   Chatting with entire code repositories
*   Large-scale document summarization',
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
        '# DeepSeek V3 Analysis

## The Open Weight Champion
DeepSeek V3 is a revelation for the open-source community. It demonstrates that you do not need a closed ecosystem to achieve GPT-4 class performance. Its Mixture-of-Experts (MoE) architecture allows it to be efficient during inference while maintaining massive knowledge.

### Why It Matters
*   **Open Weights**: Researchers and companies can host and fine-tune it.
*   **Coding Chopps**: Trained on massive amounts of code, it rivals Claude in generation.
*   **Efficiency**: The MoE architecture means only a fraction of parameters are active per token.

## Performance Analysis
It stands toe-to-toe with the giants. The fact that this is open/accessible is a game changer for privacy-focused enterprises.

### Scoring Breakdown
*   **Quality (94/100)**: Rivals top proprietary models.
*   **Speed (85/100)**: Efficient inference for its size.
*   **Freedom (95/100)**: MIT license allows broad usage.

## Use Cases
*   Self-hosted enterprise assistants
*   Fine-tuning for specific domains (law, medical)
*   Academic research',
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
        '# FLUX.1 [dev] Analysis

## The New King of Image Generation
Black Forest Labs has completely disrupted the image generation space with FLUX.1. It solves the biggest pain point of Stable Diffusion: prompt adherence. If you ask for text, complex compositions, or specific counts of objects, FLUX delivers.

### Key Strengths
*   **Typography**: Can render perfect text within images.
*   **Prompt Adherence**: Follows complex, multi-part instructions faithfully.
*   **Visual Quality**: Photorealistic lighting and texture without looking "plastic".

## Performance Analysis
It is a heavy model, requiring significant VRAM, but the results are indistinguishable from Midjourney v6.

### Scoring Breakdown
*   **Quality (98/100)**: Currently the best open model output.
*   **Speed (70/100)**: Heavy model, requires good hardware.
*   **Freedom (85/100)**: Open weights (Dev license).

## Use Cases
*   Marketing assets with text
*   Concept art
*   Photorealistic stock photo replacement',
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
        '# Stable Diffusion 3.5 Large Analysis

## A Strong Return to Form
After a rocky launch with SD3 Medium, Stability AI has redeemed itself with SD 3.5 Large. It fixes the anatomical issues of its predecessor and offers a robust, highly creative model that actively listens to prompts.

### Improvements
*   **Anatomy**: Greatly improved hands and limb coherence.
*   **Stylization**: More flexible than FLUX for artistic/painterly styles.
*   **License**: Community license is friendly for most creators.

## Performance Analysis
A solid reliable workhorse. While FLUX might edge it out in text rendering, SD 3.5 is often more "creative" (better at artistic interpretation).

### Scoring Breakdown
*   **Quality (92/100)**: Great artistic capabilities.
*   **Speed (80/100)**: Standard diffusion speed.
*   **Freedom (85/100)**: Open weights with community license.

## Use Cases
*   Digital art and illustration
*   Game asset generation
*   Style transfer workflows',
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
        '# Whisper v3 Analysis

## The Universal Translator
OpenAI''s Whisper v3 requires little introduction. It is the gold standard for open-source Automatic Speech Recognition (ASR). It handles accents, background noise, and technical jargon with human-level accuracy.

### Why It Is Essential
*   **Multilingual**: Supports practically every major language.
*   **Robustness**: Works well even with poor audio quality.
*   **Sequence-to-Sequence**: Can translate audio directly to English text.

## Performance Analysis
There is almost no reason to use paid APIs for transcription when Whisper v3 exists and can be run locally.

### Scoring Breakdown
*   **Quality (98/100)**: Industry leading ASR.
*   **Speed (85/100)**: Reasonably fast on GPUs.
*   **Freedom (95/100)**: MIT license, run anywhere.

## Use Cases
*   Video sublimation
*   Meeting transcription
*   Voice-controlled interfaces',
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
        '# AudioLDM 2 Analysis

## Painting with Sound
AudioLDM 2 takes the concept of "Stable Diffusion" and applies it to audio. You can describe a sound—"a campfire crackling by a flowing river at night"—and it generates a high-fidelity audio clip.

### Capabilities
*   **Text-to-Audio**: Generate sound effects.
*   **Text-to-Music**: Create musical snippets.
*   **Inpainting**: Fill in missing parts of audio.

## Performance Analysis
While not a replacement for a professional DAW or composer, it is an incredible tool for rapid prototyping and foley work.

### Scoring Breakdown
*   **Quality (85/100)**: Good fidelity, sometimes noisy.
*   **Speed (80/100)**: Decent generation times.
*   **Freedom (70/100)**: Creative Commons license.

## Use Cases
*   Game sound effects
*   Background ambience for videos
*   Musical idea generation',
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
        '# LLaVA-NeXT Analysis

## Vision-Language Efficiency
LLaVA-NeXT (v1.6) proves that you don''t need proprietary giants for basic vision tasks. Built on top of Mistral 7B, it punches typically above its weight class in describing images and answering questions about visual inputs.

### Key Strengths
*   **Resolution**: Handles higher resolution images than predecessors.
*   **Logic**: Better reasoning thanks to the Mistral backbone.
*   **Efficiency**: Runs on consumer GPUs.

## Performance Analysis
For an open model, it is incredibly capable. It can serve as a local "eye" for agents and robots.

### Scoring Breakdown
*   **Quality (90/100)**: Excellent for its size category.
*   **Speed (92/100)**: Very fast inference.
*   **Freedom (95/100)**: Apache 2.0 license.

## Use Cases
*   Image captioning pipelines
*   Visual QA systems
*   Edge device vision',
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
        '# Idefics2 Analysis

## The Document Expert
Idefics2 is Hugging Face''s answer to multimodal document parsing. It excels at OCR-free document understanding—looking at a chart or PDF page and answering questions directly from the pixels.

### Features
*   **Native Multimodal**: Trained from scratch on image-text pairs.
*   **Document UI**: Specifically fine-tuned for charts and UIs.
*   **Compact**: 8B parameters means it is deployable.

## Performance Analysis
A specialized tool that beats generalist models at specific document understanding tasks.

### Scoring Breakdown
*   **Quality (88/100)**: Specialized strength in documents.
*   **Speed (85/100)**: Good throughput.
*   **Freedom (95/100)**: Apache 2.0 license.

## Use Cases
*   Invoice processing
*   Chart analysis
*   Screenshot-to-code',
        ARRAY['Computer Vision', 'VLM', 'Document QA', 'Open Source', 'license:Apache-2.0'], 
        5, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 87.0, 'A', 88.0, 85.0, 95.0 FROM a;

COMMIT;
