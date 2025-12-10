# Netlify Deployment Guide

Deploy the TopTierModels frontend to Netlify for production hosting.

## Prerequisites

- GitHub repository with the project
- Netlify account ([netlify.com](https://netlify.com))
- Supabase project configured (see [supabase-setup.md](./supabase-setup.md))

## Deployment Steps

### 1. Connect Repository

1. Log in to Netlify.
2. Click **Add new site** → **Import an existing project**.
3. Select **GitHub** and authorize Netlify.
4. Choose the `TopTierModels` repository.

### 2. Configure Build Settings

| Setting | Value |
|---------|-------|
| Base directory | `frontend` |
| Build command | `npm run build` |
| Publish directory | `frontend/dist` |

### 3. Set Environment Variables

Go to **Site configuration** → **Environment variables** and add:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://your-project-id.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase `anon` public key |

### 4. Deploy

Click **Deploy site**. Netlify will build and deploy automatically.

## Auto-Rebuild on Publish

To trigger a Netlify rebuild when you publish new content:

1. Go to **Site configuration** → **Build & deploy** → **Build hooks**.
2. Click **Add build hook**.
3. Name it (e.g., "TopTierModels Publish").
4. Copy the webhook URL.
5. Add to your backend `.env`:

```env
NETLIFY_BUILD_HOOK_URL=https://api.netlify.com/build_hooks/your-hook-id
```

Now, when you publish from the preview interface, Netlify will automatically rebuild with new content.

## Custom Domain (Optional)

1. Go to **Domain management** → **Add a custom domain**.
2. Follow the DNS configuration instructions.
3. Netlify provides free SSL certificates automatically.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check `frontend/` as base directory |
| Blank page | Verify VITE_SUPABASE_URL is set correctly |
| Data not loading | Check browser console for Supabase errors |
| 404 on refresh | Netlify needs `_redirects` file (already included in dist) |
