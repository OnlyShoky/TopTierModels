# TopTierModels - How It Works

This document explains the complete architecture and workflow of TopTierModels.

## System Overview

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Hugging Face   │───▶  │  Local Studio   │───▶  │    Supabase     │
│    (Source)     │      │   (Processing)  │      │  (Production)   │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │                        │                        │
        │                        ▼                        ▼
        │               ┌─────────────────┐      ┌─────────────────┐
        │               │  Preview Page   │      │  Live Frontend  │
        │               │  (localhost)    │      │   (Netlify)     │
        └───────────────└─────────────────┘      └─────────────────┘
```

## Components

### 1. Backend Services (`backend/app/services/`)

| Service | Purpose |
|---------|---------|
| `scraper.py` | Fetches model data from Hugging Face |
| `llm_processor.py` | Generates articles and LinkedIn posts |
| `scoring_engine.py` | Calculates scores and assigns tier |
| `uploader.py` | Uploads to Supabase and triggers rebuild |

### 2. Database

- **Local**: SQLite (`backend/data/previews.db`) - Stores preview sessions
- **Production**: Supabase PostgreSQL - Stores published content

### 3. Frontend (`frontend/`)

- **Preview Page**: For reviewing content before publishing
- **Production Pages**: Home, Tierlist, Article, About

## Data Flow

### Step 1: Scraping

```python
# Input: Hugging Face URL
url = "https://huggingface.co/Tongyi-MAI/Z-Image-Turbo"

# Output: ScrapedModel
{
  "model_name": "Tongyi-MAI/Z-Image-Turbo",
  "description": "...",
  "readme_content": "...",
  "tags": ["text-to-image", "diffusion"],
  "downloads": 125000,
  "likes": 4500
}
```

### Step 2: Category Classification

Based on tags and description, the model is classified into:
- Image Generation
- Text Generation
- Audio Processing
- Computer Vision
- Multimodal

### Step 3: Content Generation

The LLM generates:
1. **Article** (1500-2000 words) - Technical overview, features, benchmarks, usage
2. **LinkedIn Post** (< 3000 chars) - Hook, key points, CTA, hashtags

### Step 4: Scoring

| Criterion | Weight | Factors |
|-----------|--------|---------|
| Performance | 30% | FPS, latency, accuracy benchmarks |
| Usability | 25% | Documentation, API quality, examples |
| Innovation | 20% | Novel architecture, research impact |
| Adoption | 15% | Downloads, likes, community |
| Production | 10% | Deployment options, stability |

**Tier Assignment:**
- S: 90-100 points
- A: 80-89 points
- B: 70-79 points
- C: 60-69 points
- D: 0-59 points

### Step 5: Local Preview

Content is saved to SQLite and the preview server opens:
```
http://localhost:3001/preview/{session_id}
```

### Step 6: Publishing

When you click "Publish":
1. Images uploaded to Supabase Storage
2. Records inserted into PostgreSQL
3. Netlify rebuild triggered (if configured)
4. Content goes live

## File Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI server
│   ├── config.py         # Environment settings
│   ├── database.py       # SQLite operations
│   ├── cache.py          # Performance caching
│   ├── websocket.py      # Real-time updates
│   ├── models/
│   │   └── schemas.py    # Pydantic models
│   ├── routers/
│   │   └── preview.py    # API endpoints
│   └── services/
│       ├── scraper.py    # Hugging Face scraping
│       ├── llm_processor.py  # Content generation
│       ├── scoring_engine.py # Tier scoring
│       └── uploader.py   # Supabase upload
└── process_model.py      # CLI entry point
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/preview/{id}` | Get preview data |
| GET | `/api/previews` | List all previews |
| POST | `/api/publish` | Publish to Supabase |
| DELETE | `/api/preview/{id}` | Delete preview |
| WS | `/ws/{id}` | Real-time updates |

## Environment Variables

```bash
# LLM Provider (choose one)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OLLAMA_BASE_URL=http://localhost:11434

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Optional
NETLIFY_BUILD_HOOK_URL=https://api.netlify.com/build_hooks/...
```
