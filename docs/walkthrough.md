# TopTierModels - User Walkthrough

Step-by-step guide to process a Hugging Face model from URL to publication.

---

## Prerequisites

Before starting, ensure you have:

1. **Python 3.10+** installed
2. **Node.js 18+** installed
3. **API Key** for one LLM provider (OpenAI, Anthropic, or Ollama)
4. **(Optional)** Supabase project for publishing

---

## Step 1: Setup Environment

### 1.1 Clone and Install

```bash
# Clone repository
git clone https://github.com/OnlyShoky/TopTierModels.git
cd TopTierModels

# Backend setup
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
```

### 1.2 Configure Environment

```bash
# From project root
cp .env.example .env
```

Edit `.env` with your API keys:

```bash
# Choose ONE LLM provider:
OPENAI_API_KEY=sk-your-openai-key

# OR
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# OR (for local LLM)
OLLAMA_BASE_URL=http://localhost:11434
```

---

## Step 2: Find a Model

1. Go to [Hugging Face](https://huggingface.co/models)
2. Browse models by category (Text, Image, Audio, etc.)
3. Copy the model URL, e.g.:
   ```
   https://huggingface.co/Tongyi-MAI/Z-Image-Turbo
   ```

---

## Step 3: Process the Model

### 3.1 Run the Processing Command

```bash
cd backend
python process_model.py --url https://huggingface.co/Tongyi-MAI/Z-Image-Turbo
```

### 3.2 What Happens

The script will:

```
🚀 Processing: https://huggingface.co/Tongyi-MAI/Z-Image-Turbo

1. Validating URL... ✓
2. Initializing database... ✓
3. Scraping content... ✓ (Z-Image-Turbo)
4. Classifying category... ✓ (Image Generation)
5. Generating article... ✓ (2847 chars)
6. Generating LinkedIn post... ✓ (412 chars)
7. Calculating scores... ✓ (95/100 - S Tier)
8. Downloading images... ✓ (3 images)
9. Saving preview... ✓

✅ Processing complete!
📋 Preview ID: a1b2c3d4
```

### 3.3 Preview Opens Automatically

Your browser opens to:
```
http://localhost:3001/preview/a1b2c3d4
```

---

## Step 4: Preview and Edit

The preview page shows:

### Left Panel - Article Preview
- Full generated article
- Markdown rendered with code highlighting
- Model metadata

### Right Panel - Controls
- **LinkedIn Post** with character count
- **Tier Badge** (S/A/B/C/D)
- **Score Breakdown** (Performance, Usability, etc.)

### Actions Available
| Button | Action |
|--------|--------|
| **Publish** | Upload to Supabase |
| **Copy LinkedIn** | Copy post to clipboard |
| **Regenerate** | Generate new content |
| **Discard** | Delete preview |

---

## Step 5: Publish (Optional)

### 5.1 Setup Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Run the migration:
   ```sql
   -- Execute content of supabase/migrations/001_initial_schema.sql
   ```
3. Add credentials to `.env`:
   ```bash
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

### 5.2 Click Publish

The publish button will:
1. Upload images to Supabase Storage
2. Insert model, article, and scores
3. Trigger Netlify rebuild (if configured)

---

## Step 6: View Live Site

### Development Mode

```bash
cd frontend
npm run dev
# Opens http://localhost:5173
```

### Production Deployment

```bash
cd frontend
npm run build
# Deploy dist/ folder to Netlify
```

---

## Common Workflows

### Process Multiple Models

```bash
# Process one model at a time
python process_model.py --url https://huggingface.co/model-1
python process_model.py --url https://huggingface.co/model-2
```

### View All Previews

```bash
# List previews via API
curl http://localhost:3001/api/previews
```

### Use Local Ollama (Free)

```bash
# Install Ollama
winget install Ollama.Ollama

# Pull a model
ollama pull llama3.1

# Update .env
OLLAMA_BASE_URL=http://localhost:11434
LLM_MODEL=llama3.1
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Invalid URL` | Ensure URL format: `huggingface.co/org/model` |
| `LLM Error` | Check API key in `.env` |
| `Rate Limited` | Wait 1-2 minutes, has built-in delays |
| `No images` | Some models don't have images |
| `Publish fails` | Verify Supabase credentials |

---

## Next Steps

1. **Customize prompts** in `backend/app/services/llm_processor.py`
2. **Adjust scoring weights** in `backend/app/services/scoring_engine.py`
3. **Add categories** in `backend/app/models/schemas.py`
4. **Deploy frontend** to Netlify or Vercel
