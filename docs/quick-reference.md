# Quick Reference

## Commands

```bash
# Process model
python process_model.py --url <huggingface-url>

# Start backend server
uvicorn app.main:app --port 3001 --reload

# Start frontend dev server
npm run dev

# Build frontend for production
npm run build
```

## Environment Variables

```bash
# Required: Choose ONE LLM provider
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OLLAMA_BASE_URL=http://localhost:11434

# Optional: For publishing
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NETLIFY_BUILD_HOOK_URL=https://...
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/preview/{id}` | Get preview |
| GET | `/api/previews` | List previews |
| POST | `/api/publish` | Publish to Supabase |
| DELETE | `/api/preview/{id}` | Delete preview |

## Tier Thresholds

| Tier | Score Range |
|------|-------------|
| S | 90-100 |
| A | 80-89 |
| B | 70-79 |
| C | 60-69 |
| D | 0-59 |

## Scoring Weights

| Criterion | Weight |
|-----------|--------|
| Performance | 30% |
| Usability | 25% |
| Innovation | 20% |
| Adoption | 15% |
| Production | 10% |

## Model Categories

- Image Generation
- Text Generation
- Audio Processing
- Computer Vision
- Multimodal
- Video Generation
- Reinforcement Learning
- Other
