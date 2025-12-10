-- Seed data for TopTierModels testing
-- Run this after 001_initial_schema.sql

-- Insert sample models
INSERT INTO models (id, huggingface_url, model_name, display_name, organization, category, description, license, tags, downloads, likes, status) VALUES
('11111111-1111-1111-1111-111111111111', 'https://huggingface.co/Tongyi-MAI/Z-Image-Turbo', 'Tongyi-MAI/Z-Image-Turbo', 'Z-Image-Turbo', 'Tongyi-MAI', 'Image Generation', 'Revolutionary image generation model with unprecedented speed and quality.', 'MIT', '["text-to-image", "diffusion", "turbo"]', 125000, 4500, 'active'),
('22222222-2222-2222-2222-222222222222', 'https://huggingface.co/meta-llama/Llama-3-8B-Instruct', 'meta-llama/Llama-3-8B-Instruct', 'Llama 3 8B Instruct', 'Meta', 'Text Generation', 'State-of-the-art instruction-tuned language model by Meta.', 'Llama 3 Community', '["text-generation", "llm", "instruct"]', 890000, 12000, 'active'),
('33333333-3333-3333-3333-333333333333', 'https://huggingface.co/openai/whisper-large-v3', 'openai/whisper-large-v3', 'Whisper Large V3', 'OpenAI', 'Audio Processing', 'OpenAI powerful speech recognition and transcription model.', 'Apache 2.0', '["automatic-speech-recognition", "audio", "whisper"]', 560000, 8900, 'active'),
('44444444-4444-4444-4444-444444444444', 'https://huggingface.co/openai/clip-vit-large-patch14', 'openai/clip-vit-large-patch14', 'CLIP ViT-L/14', 'OpenAI', 'Multimodal Models', 'Contrastive Language-Image Pre-training model for zero-shot classification.', 'MIT', '["zero-shot-image-classification", "clip", "multimodal"]', 340000, 5600, 'active'),
('55555555-5555-5555-5555-555555555555', 'https://huggingface.co/ultralytics/yolov8', 'ultralytics/yolov8', 'YOLOv8', 'Ultralytics', 'Computer Vision', 'Real-time object detection with state-of-the-art performance.', 'AGPL-3.0', '["object-detection", "yolo", "computer-vision"]', 780000, 9200, 'active'),
('66666666-6666-6666-6666-666666666666', 'https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0', 'stabilityai/stable-diffusion-xl-base-1.0', 'Stable Diffusion XL', 'Stability AI', 'Image Generation', 'High-resolution image generation with enhanced quality.', 'CreativeML Open RAIL++-M', '["text-to-image", "stable-diffusion", "sdxl"]', 1200000, 15000, 'active');

-- Insert model scores
INSERT INTO model_scores (model_id, overall_score, tier, quality_score, speed_score, freedom_score) VALUES
('11111111-1111-1111-1111-111111111111', 94.00, 'S', 98.00, 95.00, 89.00),
('22222222-2222-2222-2222-222222222222', 92.00, 'S', 95.00, 92.00, 89.00),
('33333333-3333-3333-3333-333333333333', 90.00, 'S', 96.00, 90.00, 84.00),
('44444444-4444-4444-4444-444444444444', 85.00, 'A', 88.00, 85.00, 82.00),
('55555555-5555-5555-5555-555555555555', 78.00, 'B', 80.00, 85.00, 69.00),
('66666666-6666-6666-6666-666666666666', 88.00, 'A', 92.00, 85.00, 87.00);

-- Insert articles
INSERT INTO articles (id, model_id, title, slug, excerpt, content, read_time_minutes, author, published) VALUES
('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Z-Image-Turbo: Revolutionary Fast Image Generation', 'z-image-turbo', 'A breakthrough in AI image generation combining unprecedented speed with exceptional quality.', '## Overview

Z-Image-Turbo represents a significant leap forward in AI-powered image generation technology. Developed by Tongyi-MAI, this model combines cutting-edge architecture with unprecedented processing speed.

## Key Features

- **Lightning Fast Generation**: Generate high-quality images in under 2 seconds
- **Superior Quality**: State-of-the-art image fidelity and detail
- **Versatile Applications**: From art creation to product visualization

## Performance Benchmarks

| Metric | Z-Image-Turbo | Previous Best |
|--------|---------------|---------------|
| Generation Time | 1.8s | 4.2s |
| FID Score | 8.2 | 12.1 |

## Code Example

```python
from transformers import pipeline
generator = pipeline("text-to-image", model="Tongyi-MAI/Z-Image-Turbo")
image = generator("A beautiful sunset over mountains")
```

## Conclusion

Z-Image-Turbo sets a new standard for image generation, offering unmatched speed and quality.', 8, 'TopTierModels AI', true),

('aaaa2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Llama 3 8B Instruct: Next-Generation Language Model', 'llama-3-8b-instruct', 'Meta latest instruction-tuned LLM with remarkable capabilities for chat and reasoning.', '## Overview

Llama 3 8B Instruct represents Meta commitment to open AI development. This instruction-tuned model excels at following complex instructions and generating high-quality responses.

## Key Features

- **Enhanced Reasoning**: Superior logical and analytical capabilities
- **Instruction Following**: Precise adherence to user instructions
- **Multilingual Support**: Works across multiple languages

## Conclusion

A top-tier choice for developers seeking a powerful, open-source language model.', 10, 'TopTierModels AI', true),

('aaaa3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Whisper V3: State-of-the-Art Speech Recognition', 'whisper-large-v3', 'OpenAI most capable speech recognition model with exceptional accuracy across languages.', '## Overview

Whisper Large V3 is OpenAI flagship automatic speech recognition (ASR) model, trained on a vast dataset of multilingual audio.

## Key Features

- **Multilingual**: Supports 99+ languages
- **Robust**: Handles noise, accents, and technical terminology
- **Transcription & Translation**: Can translate to English while transcribing

## Conclusion

The gold standard for speech-to-text applications.', 6, 'TopTierModels AI', true),

('aaaa4444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'CLIP ViT-L/14: Vision-Language Understanding', 'clip-vit-large', 'Contrastive vision-language model enabling zero-shot image classification.', '## Overview

CLIP (Contrastive Language-Image Pre-training) connects text and images, enabling powerful zero-shot classification.

## Key Features

- **Zero-shot Classification**: Classify images without fine-tuning
- **Flexible Prompts**: Use natural language to define categories
- **Robust Representations**: Excellent for downstream tasks

## Conclusion

Essential for building multimodal AI applications.', 7, 'TopTierModels AI', true),

('aaaa5555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'YOLOv8: Real-Time Object Detection', 'yolov8', 'The latest YOLO iteration bringing improvements in speed and accuracy for object detection.', '## Overview

YOLOv8 by Ultralytics continues the legacy of real-time object detection with significant improvements.

## Key Features

- **Real-time Speed**: Inference in milliseconds
- **High Accuracy**: Competitive with larger models
- **Easy to Use**: Simple API and CLI

## Conclusion

The go-to choice for production object detection.', 5, 'TopTierModels AI', true),

('aaaa6666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'Stable Diffusion XL: High-Resolution Image Synthesis', 'stable-diffusion-xl', 'Stability AI flagship model for high-resolution, high-quality image generation.', '## Overview

SDXL represents the next evolution in the Stable Diffusion family, offering enhanced resolution and quality.

## Key Features

- **High Resolution**: Native 1024x1024 output
- **Enhanced Quality**: Improved coherence and detail
- **Refinement Pipeline**: Two-stage generation for best results

## Conclusion

A powerful choice for creative applications requiring high-quality outputs.', 8, 'TopTierModels AI', true);

-- Insert LinkedIn posts
INSERT INTO simplified_articles (article_id, model_id, content, hook, key_points, call_to_action, hashtags, character_count) VALUES
('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '🚀 Just discovered Z-Image-Turbo - a game-changer in AI image generation!

Key highlights:
⚡ Generate images in under 2 seconds
🎨 State-of-the-art quality
🔧 Easy integration

This model is redefining what fast image generation means.

Check out our full analysis 👇

#AI #ImageGeneration #MachineLearning #Tech #Innovation', '🚀 Just discovered Z-Image-Turbo - a game-changer in AI image generation!', ARRAY['Generate images in under 2 seconds', 'State-of-the-art quality', 'Easy integration'], 'Check out our full analysis 👇', ARRAY['AI', 'ImageGeneration', 'MachineLearning', 'Tech', 'Innovation'], 380),

('aaaa2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '🦙 Llama 3 8B Instruct is here, and it is impressive!

What makes it special:
🧠 Enhanced reasoning capabilities
📝 Precise instruction following
🌍 Multilingual support

Meta continues to push the boundaries of open-source AI.

Full breakdown on our blog ↗️

#LLM #AI #OpenSource #Meta #NLP', '🦙 Llama 3 8B Instruct is here, and it is impressive!', ARRAY['Enhanced reasoning capabilities', 'Precise instruction following', 'Multilingual support'], 'Full breakdown on our blog ↗️', ARRAY['LLM', 'AI', 'OpenSource', 'Meta', 'NLP'], 350);

-- Update tierlist counts
UPDATE tierlists SET model_count = 2 WHERE category = 'Image Generation';
UPDATE tierlists SET model_count = 1 WHERE category = 'Text Generation';
UPDATE tierlists SET model_count = 1 WHERE category = 'Audio Processing';
UPDATE tierlists SET model_count = 1 WHERE category = 'Multimodal Models';
UPDATE tierlists SET model_count = 1 WHERE category = 'Computer Vision';
