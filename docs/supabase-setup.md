# Supabase Setup Guide

This guide walks you through configuring your Supabase project for TopTierModels.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/) and create a new project.
2. Note down your **Project URL** and **API Keys** from Project Settings → API.

## 2. Get Your API Keys

Navigate to **Project Settings → API** and copy:

| Key Name | Environment Variable | Usage |
|----------|---------------------|-------|
| Project URL | `SUPABASE_URL` | Both backend and frontend |
| `anon` `public` | `SUPABASE_ANON_KEY` | Frontend only (safe for browser) |
| `service_role` `secret` | `SUPABASE_SERVICE_ROLE_KEY` | Backend only (never expose!) |

> ⚠️ **Security Warning**: Never commit your `service_role` key or expose it in frontend code.

## 3. Run Database Migrations

1. Open the **SQL Editor** in your Supabase dashboard.
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`.
3. Paste and click **Run**.

This creates all required tables:
- `models` - AI model metadata
- `articles` - Generated articles
- `simplified_articles` - LinkedIn posts
- `model_scores` - Quality, Speed, Freedom scores
- `tierlists` - Category groupings
- `images` - Uploaded image references
- `code_snippets` - Code examples

## 4. Create Storage Bucket

1. Go to **Storage** in Supabase.
2. Click **New Bucket**.
3. Name: `model-images`
4. ✅ Check "Public bucket"
5. Click **Create bucket**.

## 5. Configure Environment Variables

### Backend (`.env`)

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJh...your-service-role-key...
```

### Frontend (`.env` or Netlify)

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...your-anon-key...
```

## 6. Verify Connection

Run a test model processing:

```bash
cd backend
python process_model.py --url https://huggingface.co/some-model
```

Then click **Publish** in the preview interface. Check your Supabase Table Editor to confirm data was inserted.

## Troubleshooting

| Error | Solution |
|-------|----------|
| `supabase_key is required` | Check `SUPABASE_SERVICE_ROLE_KEY` in `.env` |
| `Invalid API key` | Verify key has no typos (should start with `eyJ`) |
| `duplicate key value violates unique constraint` | Model already exists; this is handled by upsert |
| `Could not find function increment_tierlist_count` | Run `002_add_increment_function.sql` in SQL Editor |
