-- Seed data for TopTierModels
-- Generated based on Empirical Analysis (Dec 2025) Master Context
-- Run this AFTER running migrations

BEGIN;

-- Clear existing data
TRUNCATE TABLE articles CASCADE;
TRUNCATE TABLE models CASCADE;

-- =================================================================================================
-- 1. TEXT GENERATION MODELS
-- =================================================================================================

-- Llama 4 (Meta)
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://www.llama.com/', 'llama-4-70b', 'Llama 4', 'Text Generation', 'Meta',
        'Meta''s next-generation open weights model pushing the boundaries of reasoning and efficiency.',
        'license:llama-community', TRUE, '70B', ARRAY['BF16'],
        'https://huggingface.co/meta-llama/Llama-3.2-1B/resolve/main/original/header.png'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'Llama 4: Open Source Perfection', 
        'llama-4-analysis', 
        'Meta''s Llama 4 redefines what is possible with open weights, matching proprietary giants in reasoning.', 
        '## The New Standard for Open Reasoning
Meta has once again shattered expectations with the release of Llama 4. It represents a massive leap forward in reasoning capabilities, code generation, and multilingual understanding, firmly establishing open weights as a competitor to the best closed models.

### Key Features and Innovations
*   **Dense-MoE Hybrid Architecture**: Achieves massive knowledge retention with efficient inference.
*   **Reasoning Breakthroughs**: Significant improvements in Chain-of-Thought processing.
*   **Long Context**: Natively supports 128k context with perfect recall.

## Performance Analysis
Llama 4 is not just "good for an open model"—it is simply excellent. It handles complex instruction following with a nuance previously reserved for GPT-4 class models.

### Scoring Breakdown
*   **Quality (92/100)**: Matches top-tier proprietary models in most benchmarks.
*   **Speed (85/100)**: Highly optimized for modern GPU clusters.
*   **Freedom (100/100)**: The most open of the high-performance giants.

## Use Cases
*   Enterprise-grade chatbots
*   Complex data analysis pipelines
*   Sovereign AI deployments',
        ARRAY['Llama 4', 'Meta', 'Open Source', 'LLM', 'Text Generation'], 
        6, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 92.3, 'S', 92.0, 85.0, 100.0 FROM a;

-- Grok 3 (xAI)
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://x.ai/', 'grok-3', 'Grok 3', 'Text Generation', 'xAI',
        'The wittiest and most real-time aware model, integrated directly with X platform data.',
        'Proprietary', FALSE, 'Unknown', '{}',
        'https://upload.wikimedia.org/wikipedia/commons/4/4e/Grok_logo.svg'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'Grok 3: Real-Time Intelligence', 
        'grok-3-analysis', 
        'Grok 3 combines massive compute with real-time data access to create a uniquely capable assistant.', 
        '## The Pulse of the Internet
Grok 3 differentiates itself not just by raw intelligence, but by its "now-ness." Integrated deeply with real-time data streams, it provides answers that are up-to-the-second, a capability most static training runs lack.

### Key Features
*   **Real-Time Knowledge**: Access to current events as they happen.
*   **Unfiltered Personality**: Designed to be less preachy and more conversational.
*   **Visual Logic**: Strong multimodal capabilities for analyzing feeds.

## Performance Analysis
While uniquely capable in news and current events, it sometimes favors wit over strict accuracy in technical domains.

### Scoring Breakdown
*   **Quality (90/100)**: Intelligent but occasionally hallucinates on static facts.
*   **Speed (92/100)**: Extremely fast inference infrastructure.
*   **Freedom (40/100)**: Proprietary and bound to the X ecosystem.

## Use Cases
*   Trend analysis and news summarization
*   Creative and engaging conversational agents
*   Market sentiment analysis',
        ARRAY['xAI', 'Grok', 'Real-time', 'Chatbot', 'Proprietary'], 
        5, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 73.9, 'B', 90.0, 92.0, 40.0 FROM a;

-- Gemini 3.0 Pro
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://deepmind.google/models/gemini/pro/', 'gemini-3-0-pro', 'Gemini 3.0 Pro', 'Text Generation', 'Google DeepMind',
        'Google''s mid-tier powerhouse, balancing massive context with reasoning capabilities.',
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
        'Gemini 3.0 Pro: The Context King', 
        'gemini-3-pro-analysis', 
        'Gemini 3.0 Pro continues to push the boundaries of long-context understanding and retrieval.', 
        '## Massive Context, Moderate Freedom
Gemini 3.0 Pro is built for one thing above all else: handling massive amounts of information. With a context window that effectively lets you load entire libraries, it changes how we approach data retrieval.

### Key Features
*   **Infinite Context**: Successfully retrieves needles from massive haystacks.
*   **Ecosystem Integration**: Deeply woven into Google Workspace.
*   **Native Multimodality**: Processes video and text simultaneously.

## Performance Analysis
It is a highly capable model, but often feels overly guardrailed, refusing prompts that other models handle easily.

### Scoring Breakdown
*   **Quality (94/100)**: Excellent retrieval and reasoning.
*   **Speed (88/100)**: Solid performance, though long contexts take time.
*   **Freedom (20/100)**: Heavily filtered and restrictive.

## Use Cases
*   Legal document review
*   Video archive search
*   Codebase analysis',
        ARRAY['Google', 'Gemini', 'Long Context', 'Proprietary'], 
        5, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 67.3, 'C', 94.0, 88.0, 20.0 FROM a;

-- GPT-5 (OpenAI)
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://openai.com/', 'gpt-5', 'GPT-5', 'Text Generation', 'OpenAI',
        'The highly anticipated successor to GPT-4, focusing on deep reasoning and reliability.',
        'Proprietary', FALSE, 'Unknown', '{}',
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
        'GPT-5: Brilliant but Closed', 
        'gpt-5-analysis', 
        'GPT-5 sets a new high water mark for intelligence, but at the cost of speed and accessibility.', 
        '## Unmatched Intelligence, High Cost
GPT-5 represents the pinnacle of current AI reasoning. It solves problems that stump every other model. However, this intelligence comes with significant trade-offs in terms of speed and operational opacity.

### Key Features
*   **Deep Reasoning**: Solves complex multi-step physics and math problems.
*   **Reliability**: Extremely low hallucination rate.
*   **Agentic Capabilities**: Can autonomously plan and execute long tasks.

## Performance Analysis
While its quality is undeniable, it is slow, expensive, and extremely locked down.

### Scoring Breakdown
*   **Quality (99/100)**: The smartest model available.
*   **Speed (60/100)**: Heavy and slow.
*   **Freedom (15/100)**: Extremely restrictive API and policy.

## Use Cases
*   Scientific research assistance
*   Complex system architecture
*   Autonomous agent planning',
        ARRAY['OpenAI', 'GPT-5', 'AGI', 'Proprietary'], 
        6, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 58.0, 'D', 99.0, 60.0, 15.0 FROM a;

-- Claude 4.5 Sonnet
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://www.anthropic.com/claude', 'claude-4-5-sonnet', 'Claude 4.5 Sonnet', 'Text Generation', 'Anthropic',
        'Anthropic''s iterative update, focusing on coding nuances and safer outputs.',
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
        'Claude 4.5 Sonnet: The Coding Specialist', 
        'claude-4-5-sonnet-analysis', 
        'Claude remains the favorite for developers, with version 4.5 refining its coding intuition.', 
        '## Refined for Developers
Claude 4.5 Sonnet focuses on what Anthropic does best: coding and safe, steerable responses. It feels less like a chatbox and more like a pair programmer that understands intent.

### Key Features
*   **System Thinking**: Understands large codebases intuitively.
*   **Artifacts UI**: Enhanced generation of rendering UIs and charts.
*   **Safety**: Rigorous constitutional AI alignment.

## Performance Analysis
It is slightly slower than the 3.5 generation but brings higher accuracy. However, its strict safety filters can be frustrating.

### Scoring Breakdown
*   **Quality (97/100)**: Top-tier coding and writing.
*   **Speed (70/100)**: Slower than previous Sonnet iterations.
*   **Freedom (15/100)**: Very strict formatting and content filters.

## Use Cases
*   Software development
*   Technical specification writing
*   Safe enterprise chatbots',
        ARRAY['Anthropic', 'Claude', 'Coding', 'Proprietary'], 
        5, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 60.6, 'C', 97.0, 70.0, 15.0 FROM a;


-- =================================================================================================
-- 2. IMAGE GENERATION MODELS
-- =================================================================================================

-- Flux 1.1 Ultra
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://blackforestlabs.ai/', 'flux-1-1-ultra', 'Flux 1.1 Ultra', 'Image Generation', 'Black Forest Labs',
        'The definitive open model for photorealism and typography.',
        'license:other', TRUE, '16B', ARRAY['BF16'],
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
        'Flux 1.1 Ultra: Unbeatable Realism', 
        'flux-1-1-ultra-analysis', 
        'Flux 1.1 Ultra masters the hardest parts of AI imagery: hands, text, and composition.', 
        '## Photorealism Perfected
Flux 1.1 Ultra builds on the massive success of the Flux architecture to deliver images that are virtually indistinguishable from photography. It handles complex lighting, skin textures, and typography with ease.

### Key Features
*   **Typography**: Perfect text rendering in diverse fonts.
*   **Prompt Adherence**: Follows complex spatial instructions.
*   **Quality**: High dynamic range and detail.

## Performance Analysis
It is a large model requiring significant VRAM, but the output quality is currently unmatched in the open ecosystem.

### Scoring Breakdown
*   **Quality (96/100)**: Stunning visual fidelity.
*   **Speed (85/100)**: Optimized latent distillation.
*   **Freedom (95/100)**: Open weights, dev-friendly license.

## Use Cases
*   High-end advertising assets
*   Graphic design composition
*   Photorealistic rendering',
        ARRAY['Image Gen', 'Flux', 'Black Forest Labs', 'Open Source'], 
        5, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 91.9, 'S', 96.0, 85.0, 95.0 FROM a;

-- Ideogram v3
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://ideogram.ai/', 'ideogram-v3', 'Ideogram v3', 'Image Generation', 'Ideogram',
        'Specialized model for typography and design layouts.',
        'Proprietary', FALSE, 'Unknown', '{}',
        'https://pbs.twimg.com/profile_images/1694060938763538432/P2aaeiLp_400x400.jpg'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'Ideogram v3: The Designer''s Tool', 
        'ideogram-v3-analysis', 
        'Ideogram continues to lead the pack in integrating text and design elements into AI art.', 
        '## Design-First AI
Ideogram v3 is built for designers. While other models focus on generic photography, Ideogram excels at logos, t-shirt designs, and posters where text integration is crucial.

### Key Features
*   **Text Rendering**: Best-in-class integration of words into art.
*   **Style Logic**: Understands design principles better than pure art models.
*   **Magic Prompt**: Auto-enhances simple prompts for better results.

## Performance Analysis
Excellent quality, but locked behind a web interface/API.

### Scoring Breakdown
*   **Quality (94/100)**: Excellent for design work.
*   **Speed (80/100)**: Fast web generation.
*   **Freedom (30/100)**: Proprietary platform only.

## Use Cases
*   Logo design prototyping
*   Marketing materials
*   Print-on-demand designs',
        ARRAY['Ideogram', 'Design', 'Typography', 'Proprietary'], 
        4, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 67.9, 'C', 94.0, 80.0, 30.0 FROM a;

-- Imagen 4 (Google)
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://deepmind.google/technologies/imagen/', 'imagen-4', 'Imagen 4', 'Image Generation', 'Google',
        'Google''s photorealistic diffusion model, deeply integrated with Gemini.',
        'Proprietary', FALSE, 'Unknown', '{}',
        'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'Imagen 4: Google''s Visual Powerhouse', 
        'imagen-4-analysis', 
        'Imagen 4 delivers high-fidelity photorealism with Google''s safety and infrastructure.', 
        '## Safe and Realistic
Imagen 4 is Google''s answer to the high-fidelity image generation race. It prioritizes photorealism and safety, making it a favorite for corporate environments.

### Key Features
*   **Photorealism**: Exceptional handling of light and texture.
*   **Integration**: Works natively inside Gemini chat.
*   **Safety**: Strong filters against deepfakes and NSFW content.

## Performance Analysis
Great quality, but the heavy guardrails can limit creative freedom.

### Scoring Breakdown
*   **Quality (92/100)**: Very high fidelity.
*   **Speed (85/100)**: Fast via TPU infrastructure.
*   **Freedom (15/100)**: Highly restrictive and proprietary.

## Use Cases
*   Enterprise presentation assets
*   Safe stock imagery
*   Visual brainstorming',
        ARRAY['Google', 'Imagen', 'Proprietary', 'Safe AI'], 
        4, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 63.9, 'C', 92.0, 85.0, 15.0 FROM a;

-- Midjourney v7
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://www.midjourney.com/', 'midjourney-v7', 'Midjourney v7', 'Image Generation', 'Midjourney',
        'The artistic gold standard, known for its distinct style and improved coherence.',
        'Proprietary', FALSE, 'Unknown', '{}',
        'https://upload.wikimedia.org/wikipedia/commons/e/ed/Midjourney_Emblem.png'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'Midjourney v7: Pure Sytle', 
        'midjourney-v7-analysis', 
        'Midjourney v7 remains the most artistically pleasing model, despite usability hurdles.', 
        '## The Artistic Soul of AI
Midjourney v7 continues to dominate in pure aesthetic quality. While other models strive for perfect realism, Midjourney aims for "beauty," producing images that often look better than the prompt asked for.

### Key Features
*   **Aesthetics**: Unmatched color theory and composition.
*   **Stylization**: Huge range of artistic styles via parameters.
*   **Web Alpha**: Finally moving away from Discord-only generation.

## Performance Analysis
The visuals are stunning (Quality 98), but the closed ecosystem and slow generation times hurt its ranking.

### Scoring Breakdown
*   **Quality (98/100)**: The most beautiful output.
*   **Speed (50/100)**: Slow generation queues.
*   **Freedom (10/100)**: Fully closed, subscription only.

## Use Cases
*   High-concept art
*   Fashion design inspiration
*   Mood boarding',
        ARRAY['Midjourney', 'Art', 'Generative AI', 'Proprietary'], 
        5, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 52.7, 'D', 98.0, 50.0, 10.0 FROM a;

-- DALL-E 3 (GPT-5)
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://openai.com/dall-e-3', 'dall-e-3', 'DALL-E 3', 'Image Generation', 'OpenAI',
        'Integrated directly into ChatGPT, offering the best prompt adherence natural language interface.',
        'Proprietary', FALSE, 'Unknown', '{}',
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
        'DALL-E 3: Easiest to Use', 
        'dall-e-3-analysis', 
        'DALL-E 3 makes image generation accessible via natural language, though it lacks granular control.', 
        '## The Conversational Artist
DALL-E 3''s superpower is its integration with ChatGPT. You don''t need to learn "prompt engineering." You just talk to it, and it rewrites your request into a detailed visual description.

### Key Features
*   **NLP Integration**: Understands complex intent via LLM preprocessing.
*   **Accessibility**: Available to millions via ChatGPT Plus.
*   **Simplicity**: No complex parameters to tune.

## Performance Analysis
It is chemically incapable of generating bad images, but often struggles with the "plastic/smooth" AI look. Granular control is non-existent.

### Scoring Breakdown
*   **Quality (88/100)**: Solid, but identifiable "AI style."
*   **Speed (75/100)**: Decent speed via browser.
*   **Freedom (15/100)**: Very restrictive policies.

## Use Cases
*   Quick visualizations for slides
*   Ideation for non-technical users
*   Meme generation',
        ARRAY['OpenAI', 'DALL-E', 'ChatGPT', 'Proprietary'], 
        4, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 59.3, 'D', 88.0, 75.0, 15.0 FROM a;


-- =================================================================================================
-- 3. AUDIO PROCESSING MODELS
-- =================================================================================================

-- Cartesia (Sonic)
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://cartesia.ai/', 'sonic', 'Cartesia (Sonic)', 'Audio Processing', 'Cartesia',
        'Ultra-low latency real-time voice generation for interactive agents.',
        'Proprietary', FALSE, 'Unknown', '{}',
        'https://cartesia.ai/logo.png'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'Cartesia: The Fastest Voice AI', 
        'cartesia-sonic-analysis', 
        'Sonic separates itself with blazing fast latency, enabling true real-time voice conversations.', 
        '## Speed is the Feature
When building voice agents, latency is the killer. Cartesia''s Sonic model is engineered for sub-100ms response times, making it feel like a real conversation rather than a turn-based game.

### Key Features
*   **Ultra-Low Latency**: Generates audio faster than real-time.
*   **Expressiveness**: Captures nuance and emotion.
*   **Voice Cloning**: High-quality instant cloning.

## Performance Analysis
The quality is good, but the speed is transformational for developers building voice apps.

### Scoring Breakdown
*   **Quality (92/100)**: Very natural sounding.
*   **Speed (99/100)**: Best in class latency.
*   **Freedom (50/100)**: Developer-friendly API, but proprietary.

## Use Cases
*   Real-time voice assistants
*   Interactive gaming NPCs
*   Live translation',
        ARRAY['Audio', 'TTS', 'Real-time', 'Voice AI'], 
        4, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 80.3, 'A', 92.0, 99.0, 50.0 FROM a;

-- ElevenLabs v3
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://elevenlabs.io/', 'elevenlabs-v3', 'ElevenLabs v3', 'Audio Processing', 'ElevenLabs',
        'The industry standard for emotive, high-quality speech synthesis.',
        'Proprietary', FALSE, 'Unknown', '{}',
        'https://avatars.githubusercontent.com/u/120663473?s=200&v=4'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'ElevenLabs v3: Emotion Matcher', 
        'elevenlabs-v3-analysis', 
        'ElevenLabs remains the benchmark for quality, offering the most emotive and varied voices.', 
        '## The Voice of the Internet
ElevenLabs has effectively solved TTS quality. Version 3 improves on intonation and emotional range, allowing voices to whisper, shout, or laugh naturally. It detects context context perfectly.

### Key Features
*   **Emotional Range**: Can perform drama, news, or casual chat.
*   **Voice Design**: easy tools to create custom voices.
*   **Dubbing**: Automatic video dubbing with lip-sync.

## Performance Analysis
Quality is unmatched (S-tier), but it can be expensive at scale and is slower than Cartesia.

### Scoring Breakdown
*   **Quality (98/100)**: Indistinguishable from human.
*   **Speed (85/100)**: Good, but not instant.
*   **Freedom (30/100)**: Expensive proprietary API.

## Use Cases
*   Audiobook narration
*   Game character voicing
*   Content creation voiceovers',
        ARRAY['Audio', 'TTS', 'ElevenLabs', 'Proprietary'], 
        5, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 70.9, 'B', 98.0, 85.0, 30.0 FROM a;

-- Gemini 2.0 Flash (Audio)
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://deepmind.google/technologies/gemini/flash/', 'gemini-2-0-flash-audio', 'Gemini 2.0 Flash', 'Audio Processing', 'Google',
        'Multimodal model with native audio input/output for seamlessly fast interaction.',
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
        'Gemini 2.0 Flash: Audio Native', 
        'gemini-2-flash-audio-analysis', 
        'Gemini 2.0 Flash processes audio natively, skipping the transcription step for better nuance.', 
        '## Native Listening
Unlike traditional pipelines (Speech-to-Text -> LLM -> Text-to-Speech), Gemini 2.0 Flash handles audio natively. It hears the tone, the pause, and the emotion directly, allowing for much richer interactions.

### Key Features
*   **Native Modality**: No information loss in transcription.
*   **Speed**: "Flash" designation means it is optimized for throughput.
*   **Turn-taking**: Better at interrupting and natural conversation flow.

## Performance Analysis
Great for conversational understanding, though the voice output personality is less varied than dedicated TTS engines.

### Scoring Breakdown
*   **Quality (88/100)**: Good understanding, standard voice.
*   **Speed (98/100)**: Extremely fast end-to-end.
*   **Freedom (20/100)**: Locked to Google ecosystem.

## Use Cases
*   Customer service agents
*   Language learning partners
*   Meeting assistants',
        ARRAY['Audio', 'Multimodal', 'Google', 'Proprietary'], 
        4, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 68.6, 'C', 88.0, 98.0, 20.0 FROM a;

-- Suno v4
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://suno.com/', 'suno-v4', 'Suno v4', 'Audio Processing', 'Suno',
        'Generates full radio-quality songs from simple text prompts.',
        'Proprietary', FALSE, 'Unknown', '{}',
        'https://suno.com/images/logo_square.png'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'Suno v4: The AI Pop Star', 
        'suno-v4-analysis', 
        'Suno v4 can generate Billboard-quality tracks, raising massive questions about the future of music.', 
        '## Radio Ready
Suno v4 is a shock to the system for musicians. It generates coherently structured songs (verse, chorus, bridge) with high-fidelity vocals and instrumentation. It understands genre tags and lyrical cadence perfectly.

### Key Features
*   **Song Structure**: Understands musical progression.
*   **Vocals**: Surprisingly human-sounding singing voices.
*   **Speed**: Generates a 3-minute song in seconds.

## Performance Analysis
Musically impressive (Quality 95), but lacks granular control for producers (can''t edit just the drums).

### Scoring Breakdown
*   **Quality (95/100)**: Hits mainstream quality bars.
*   **Speed (40/100)**: Generation takes a moment.
*   **Freedom (15/100)**: Rights ownership is complex, proprietary.

## Use Cases
*   Commercial jingles
*   Content creation background music
*   Idea generation for artists',
        ARRAY['Music AI', 'Suno', 'Generative Audio', 'Proprietary'], 
        5, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 50.0, 'D', 95.0, 40.0, 15.0 FROM a;

-- Udio
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://www.udio.com/', 'udio-v1', 'Udio', 'Audio Processing', 'Udio',
        'High-fidelity music generation with a focus on electronic and complex genres.',
        'Proprietary', FALSE, 'Unknown', '{}',
        'https://www.udio.com/logo.png'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'Udio: Complex Harmonics', 
        'udio-analysis', 
        'Udio rivals Suno but focuses more on clarity and complex musical arrangements.', 
        '## The Producer''s Choice
While Suno aims for pop structure, Udio often generates richer, more textured audio. It excels at electronic genres, jazz, and complex instrumentals where clarity matters more than lyrical catchy-ness.

### Key Features
*   **Fidelity**: Crisp high-end and clear separation.
*   **Extension**: Start with a segment and extend it forwards/backwards.
*   **Genre Handling**: Excellent at niche sub-genres.

## Performance Analysis
Incredible quality (96), but the generation process is slower and the "slot machine" nature of prompting can be frustrating.

### Scoring Breakdown
*   **Quality (96/100)**: Audiophile quality.
*   **Speed (30/100)**: Slower generation.
*   **Freedom (15/100)**: Fully proprietary.

## Use Cases
*   Soundtrack composition
*   Electronic music production
*   Sampling',
        ARRAY['Music AI', 'Udio', 'Generative Audio', 'Proprietary'], 
        4, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 47.0, 'D', 96.0, 30.0, 15.0 FROM a;


-- =================================================================================================
-- 4. COMPUTER VISION MODELS
-- =================================================================================================

-- YOLOv12
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://www.ultralytics.com/', 'yolov12', 'YOLOv12', 'Computer Vision', 'Ultralytics',
        'The absolute standard for real-time object detection, now faster and more accurate.',
        'license:agpl-3.0', TRUE, 'Unknown', ARRAY['FP16', 'INT8'],
        'https://raw.githubusercontent.com/ultralytics/assets/main/yolov8/banner-yolov8.png'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'YOLOv12: Real-time King', 
        'yolov12-analysis', 
        'YOLOv12 continues the legacy of "You Only Look Once" with unmatched inference speeds.', 
        '## Speed Meets Accuracy
YOLOv12 is the latest evolution of the most popular object detection family. It optimizes the balance between accuracy (mAP) and latency, making it the default choice for edge devices and real-time video analysis.

### Key Features
*   **Efficiency**: Runs on Raspberry Pis and mobile phones.
*   **Versatility**: Detection, segmentation, and pose estimation.
*   **Ecosystem**: Massive support via Ultralytics libraries.

## Performance Analysis
It is S-Tier because it solves the practical problem of "vision on the edge" perfectly.

### Scoring Breakdown
*   **Quality (90/100)**: High enough mAP for production.
*   **Speed (99/100)**: Real-time at high FPS.
*   **Freedom (100/100)**: Open source (AGPL).

## Use Cases
*   Autonomous vehicles
*   Security camera analytics
*   Robotics',
        ARRAY['Computer Vision', 'Object Detection', 'Edge AI', 'Open Source', 'license:AGPL-3.0'], 
        5, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 96.3, 'S', 90.0, 99.0, 100.0 FROM a;

-- Florence-2 (MS)
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://www.microsoft.com/en-us/research/project/project-florence/', 'florence-2-large', 'Florence-2', 'Computer Vision', 'Microsoft',
        'A unified foundation model for vision capable of captioning, detection, and segmentation.',
        'license:mit', TRUE, '0.7B', ARRAY['FP16'],
        'https://huggingface.co/microsoft/Florence-2-large/resolve/main/cover.png'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'Florence-2: Small but Mighty', 
        'florence-2-analysis', 
        'Microsoft''s Florence-2 packs massive capability into a tiny parameter count.', 
        '## The Unified VLM
Florence-2 is stunning not because it is huge, but because it is tiny. At under 1B parameters, it outperforms models 10x its size on captioning and grounding tasks. It uses a unified text-to-text API for all vision tasks.

### Key Features
*   **Unified API**: Use text prompts to trigger detection, captioning, or OCR.
*   **Size**: Extremely lightweight (0.2B and 0.7B versions).
*   **Performance**: Beats specialized models on benchmarks.

## Performance Analysis
The efficiency here is S-tier. You can run this in the browser.

### Scoring Breakdown
*   **Quality (88/100)**: Incredible for its size.
*   **Speed (95/100)**: Blazing fast.
*   **Freedom (100/100)**: MIT License.

## Use Cases
*   On-device accessibility descriptions
*   Fast image tagging
*   Video indexing',
        ARRAY['Computer Vision', 'Microsoft', 'Small Model', 'Open Source', 'license:MIT'], 
        4, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 94.3, 'S', 88.0, 95.0, 100.0 FROM a;

-- SAM 3 (Meta)
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://segment-anything.com/', 'sam-3', 'SAM 3 (Meta)', 'Computer Vision', 'Meta',
        'Segment Anything Model 3, offering pixel-perfect object masks for any image.',
        'license:apache-2.0', TRUE, 'Unknown', ARRAY['BF16'],
        'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/transformers/model_doc/sam_architecture.jpg'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'SAM 3: Pixel Perfection', 
        'sam-3-analysis', 
        'Meta''s Segment Anything Model 3 makes image segmentation a solved problem.', 
        '## Cut Everything Out
SAM 3 takes the "zero-shot" capabilities of its predecessor and adds video handling and better semantic understanding. You can click on any object in an image or video, and SAM 3 gives you a perfect cut-out mask.

### Key Features
*   **Zero-Shot**: Works on objects it has never seen before.
*   **Video Support**: Tracks objects across frames.
*   **Ambiguity**: Handles overlapping objects gracefully.

## Performance Analysis
It is the standard utility for image editing pipelines.

### Scoring Breakdown
*   **Quality (95/100)**: Near perfect edges.
*   **Speed (80/100)**: Good, but video processing is heavy.
*   **Freedom (90/100)**: Open weights, permissive license.

## Use Cases
*   Photo editing (Magic Eraser)
*   Robotic grasping
*   Medical imaging analysis',
        ARRAY['Computer Vision', 'Segmentation', 'Meta', 'Open Source'], 
        5, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 88.3, 'A', 95.0, 80.0, 90.0 FROM a;

-- DINOv2
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://dinov2.metademolab.com/', 'dinov2-large', 'DINOv2', 'Computer Vision', 'Meta',
        'Self-supervised vision model that learns robust visual features without labels.',
        'license:apache-2.0', TRUE, '0.3B', ARRAY['FP16'],
        'https://huggingface.co/facebook/dinov2-large/resolve/main/assets/dino_v2.png'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'DINOv2: Seeing Like a Human', 
        'dinov2-analysis', 
        'DINOv2 learns features from images in a self-supervised way, creating powerful embeddings.', 
        '## Self-Supervised Vision
Most vision models learn from labelled data (this is a cat). DINOv2 learns by "looking" at massive amounts of data and figuring out relationships itself. This creates robust features that work well for classification, depth estimation, and retrieval.

### Key Features
*   **Robustness**: Works well on sketches, cartoons, and real photos.
*   **Depth Estimation**: Can perceive depth without explicit training.
*   **Embeddings**: Great for visual search engines.

## Performance Analysis
A foundational building block for other vision apps.

### Scoring Breakdown
*   **Quality (85/100)**: Strong general features.
*   **Speed (90/100)**: Efficient backbones.
*   **Freedom (90/100)**: Apache 2.0.

## Use Cases
*   Reverse image search
*   Content moderation
*   Visual similarity',
        ARRAY['Computer Vision', 'Embeddings', 'Meta', 'Open Source'], 
        4, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 88.3, 'A', 85.0, 90.0, 90.0 FROM a;

-- RF-DETR
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://roboflow.com/', 'rf-detr', 'RF-DETR', 'Computer Vision', 'OpenCV',
        'Receptive Field based Detection Transformer for accurate visual understanding.',
        'license:apache-2.0', TRUE, 'Unknown', '{}',
        'https://upload.wikimedia.org/wikipedia/commons/3/32/OpenCV_Logo_with_text_svg_version.svg'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'RF-DETR: Transformer Vision', 
        'rf-detr-analysis', 
        'RF-DETR brings the power of Transformers to object detection with improved accuracy.', 
        '## Vision Transformers
RF-DETR leverages the transformer architecture (like LLMs) to look at an image globally rather than using sliding windows. This allows it to understand context ("a bat" near "a player") better than older CNNs.

### Key Features
*   **Context Awareness**: Sees the whole image at once.
*   **Accuracy**: High mAP on COCO benchmarks.
*   **Modern Arch**: Easier to scale.

## Performance Analysis
Slightly heavier than YOLO but often more accurate on small or clustered objects.

### Scoring Breakdown
*   **Quality (89/100)**: High accuracy.
*   **Speed (85/100)**: Good optimization.
*   **Freedom (80/100)**: Open source.

## Use Cases
*   Drone imagery analysis
*   Crowd counting
*   Satellite view processing',
        ARRAY['Computer Vision', 'Transformers', 'Detection', 'Open Source'], 
        5, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 84.6, 'A', 89.0, 85.0, 80.0 FROM a;


-- =================================================================================================
-- 5. MULTIMODAL MODELS
-- =================================================================================================

-- Pixtral Large
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://mistral.ai/', 'pixtral-large', 'Pixtral Large', 'Multimodal', 'Mistral AI',
        'A multimodal powerhouse from Mistral, combining text and vision with high efficiency.',
        'license:mistral-community', TRUE, '123B', ARRAY['BF16'],
        'https://huggingface.co/mistralai/pixtral-large-2409/resolve/main/assets/banner_pixtral.jpg'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'Pixtral Large: Multimodal Excellence', 
        'pixtral-large-analysis', 
        'Mistral AI delivers a top-tier multimodal model that handles text and logic efficiently.', 
        '## The European Giant
Pixtral Large is Mistral AI''s flagship multimodal model. It combines the strong reasoning of Mistral Large with a new vision encoder, allowing it to interpret charts, code from screenshots, and complex diagrams with GPT-4 class accuracy.

### Key Features
*   **Native Resolution**: variable resolution support for clear vision.
*   **Reasoning**: Strong math and logic performance.
*   **Availability**: Open weights available for research/commercial use.

## Performance Analysis
It sits comfortably in the S-tier, offering a non-US alternative to the big labs with competitive performance.

### Scoring Breakdown
*   **Quality (90/100)**: Reliable and smart.
*   **Speed (85/100)**: Efficient MoE structure.
*   **Freedom (95/100)**: Permissive Mistral license.

## Use Cases
*   Financial report analysis
*   Automated UI testing
*   Visual assistants',
        ARRAY['Inference', 'Multimodal', 'Mistral', 'Open Weights'], 
        6, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 89.9, 'S', 90.0, 85.0, 95.0 FROM a;

-- Llama 4-Vision
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://ai.meta.com/blog/llama-4-multimodal-intelligence/', 'llama-4-vision', 'Llama 4-Vision', 'Multimodal', 'Meta',
        'The vision-enabled variant of Llama 4, bringing eyesight to the open ecosystem.',
        'license:llama-community', TRUE, '90B', ARRAY['BF16'],
        'https://huggingface.co/meta-llama/Llama-3.2-11B-Vision/resolve/main/original/header.png'
    ) RETURNING id
),
a AS (
    INSERT INTO articles (
        model_id, title, slug, excerpt, content, 
        seo_keywords, read_time_minutes, published
    ) 
    SELECT 
        id, 
        'Llama 4-Vision: Opening Eyes', 
        'llama-4-vision-analysis', 
        'Meta brings native vision capabilities to the Llama 4 family, empowering open source multimodal apps.', 
        '## Open Source Vision
Llama 4-Vision integrates a high-performance vision tower directly into the Llama 4 architecture. This allows users to build "ChatGPT-Vision" style applications entirely on their own infrastructure without sending data to an API.

### Key Features
*   **Video Understanding**: Can process short video clips.
*   **Chart Literacy**: Excellent at extracting data from plots.
*   **Integration**: Uses the same instruction format as text Llama.

## Performance Analysis
Very strong (A-tier), though perhaps slightly behind the specialized Pixtral in pure pixel-peeping tasks.

### Scoring Breakdown
*   **Quality (88/100)**: Solid general purpose vision.
*   **Speed (85/100)**: Good inference speed.
*   **Freedom (95/100)**: Open weights using Llama license.

## Use Cases
*   Local video indexing
*   Private medical imaging analysis
*   Robotics perception',
        ARRAY['Multimodal', 'Llama 4', 'Vision', 'Meta', 'Open Source'], 
        5, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 89.3, 'A', 88.0, 85.0, 95.0 FROM a;

-- Claude 3.5 Sonnet (Multimodal context)
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://www.anthropic.com/news/claude-3-5-sonnet', 'claude-3-5-sonnet-vlm', 'Claude 3.5 Sonnet', 'Multimodal', 'Anthropic',
        'Excellent visual reasoning capabilities, particularly for UI and document tasks.',
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
        'Claude 3.5 Sonnet: Visual Reasoning', 
        'claude-3-5-sonnet-vision-review', 
        'Claude 3.5 Sonnet excels at "understanding" images, not just describing them.', 
        '## Seeing the Logic
While many models can describe an image ("a cat on a mat"), Claude 3.5 Sonnet excels at reasoning about it ("the cat is waiting for food because the bowl is empty"). This makes it uniquely suited for screenshots-to-code and complex diagram analysis.

### Key Features
*   **UI to Code**: Converts screenshot mockups to React code perfectly.
*   **Graph Analysis**: Interprets trends in unlabeled charts.
*   **Handwriting**: Reads messy cursive with ease.

## Performance Analysis
High quality, but hampered by strict safety filters and proprietary API limits.

### Scoring Breakdown
*   **Quality (96/100)**: Top tier reasoning.
*   **Speed (75/100)**: Decent speed.
*   **Freedom (20/100)**: Closed ecosystem.

## Use Cases
*   Frontend development acceleration
*   Digitizing handwritten archives
*   Complex QA',
        ARRAY['Multimodal', 'Anthropic', 'Vision', 'Proprietary'], 
        5, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 63.6, 'C', 96.0, 75.0, 20.0 FROM a;

-- Gemini 3.0 Ultra
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://deepmind.google/technologies/gemini/', 'gemini-3-0-ultra', 'Gemini 3.0 Ultra', 'Multimodal', 'Google',
        'Google''s most capable multimodal model, designed for massive scale complex reasoning.',
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
        'Gemini 3.0 Ultra: The Heavyweight', 
        'gemini-3-ultra-analysis', 
        'Gemini 3.0 Ultra brings massive compute to bear on multimodal problems.', 
        '## Maximum Power
Gemini 3.0 Ultra is Google''s "no compromises" model. It is designed to achieve state-of-the-art results on benchmarks regardless of compute cost. It natively understands video, audio, and text in a single stream.

### Key Features
*   **Native Video**: Can watch movies and answer questions about plot.
*   **Complex Reasoning**: Solves multimodal math problems.
*   **Scale**: The largest model in the Gemini family.

## Performance Analysis
The quality is unquestionable (98), but it is very slow (Speed 60) and fully locked down (Freedom 15).

### Scoring Breakdown
*   **Quality (98/100)**: Benchmark leader.
*   **Speed (60/100)**: Heavy and slow.
*   **Freedom (15/100)**: Enterprise focused, proprietary.

## Use Cases
*   Scientific discovery
*   Long-form video processing
*   High-stakes financial analysis',
        ARRAY['Google', 'Gemini', 'Multimodal', 'Proprietary'], 
        6, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 57.6, 'D', 98.0, 60.0, 15.0 FROM a;

-- OpenAI o3
WITH m AS (
    INSERT INTO models (
        huggingface_url, model_name, display_name, category, organization, 
        description, license, safetensors, model_size, tensor_types, featured_image_url
    ) VALUES (
        'https://openai.com/index/introducing-o3-and-o4-mini/', 'openai-o3', 'OpenAI o3', 'Multimodal', 'OpenAI',
        'The next evolution of reasoning models, capable of vast coherent thought chains.',
        'Proprietary', FALSE, 'Unknown', '{}',
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
        'OpenAI o3: Deep Thought', 
        'openai-o3-analysis', 
        'OpenAI o3 pushes the "System 2" thinking paradigm to multimodal tasks.', 
        '## The Reasoning Engine
OpenAI o3 continues the "o" series legacy of "thinking before speaking." It creates massive internal chain-of-thought traces to verify its own logic before outputting an answer. This applies now to visual and auditory inputs as well.

### Key Features
*   **Self-Correction**: Catches its own hallucinations during the thinking phase.
*   **Planning**: Can outline and execute multi-step multimodal tasks.
*   **Accuracy**: Unmatched in hard science questions.

## Performance Analysis
It is the smartest model (Quality 99) but undoubtedly the slowest (Speed 20) due to compute-time thinking.

### Scoring Breakdown
*   **Quality (99/100)**: Near perfect reasoning.
*   **Speed (20/100)**: Very slow ("thinking" time).
*   **Freedom (10/100)**: A black box service.

## Use Cases
*   PhD-level research
*   Complex engineering problems
*   Autonomous agent brains',
        ARRAY['OpenAI', 'Reasoning', 'AGI', 'Proprietary'], 
        7, 
        TRUE
    FROM m RETURNING id, model_id
)
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score)
SELECT model_id, 43.0, 'D', 99.0, 20.0, 10.0 FROM a;

COMMIT;
