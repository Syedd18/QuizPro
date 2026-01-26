# Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy the project**
   ```bash
   vercel
   ```
   - Follow the prompts to link your project
   - Choose "QuizPro" as project name
   - Select "Other" as framework preset (Vite is auto-detected)

4. **Set environment variables in Vercel Dashboard**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_SUPABASE_URL = your_supabase_url
     VITE_SUPABASE_ANON_KEY = your_supabase_key
     ```

### Option 2: Deploy via GitHub Integration

1. **Push to GitHub** (already done)
   ```
   Repository: https://github.com/Syedd18/QuizPro
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub → Select `Syedd18/QuizPro`
   - Vercel will auto-detect Vite configuration
   - Add Environment Variables:
     ```
     VITE_SUPABASE_URL
     VITE_SUPABASE_ANON_KEY
     ```

3. **Deploy**
   - Click "Deploy"
   - Every push to `main` branch will auto-deploy

## Configuration Files

### vercel.json
- Specifies build command, output directory, and routes
- Configures caching for assets
- Sets up environment variables
- SPA routing (all requests → index.html)

### .env.example
- Copy to `.env.local` for development
- Add your Supabase credentials

### vite.config.ts
- Port changed to 3001 for consistency
- Output directory: `dist` (Vercel standard)
- Optimized build settings for production

### package.json
- Added `start` script for Vercel preview
- Build script compatible with Vercel

## Environment Variables Setup

### For Development
1. Copy `.env.example` to `.env.local`
   ```bash
   cp .env.example .env.local
   ```

2. Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### For Vercel Deployment
1. Open Vercel Dashboard
2. Select QuizPro project
3. Settings → Environment Variables
4. Add both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
5. Redeploy to apply changes

## Build & Preview Locally

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## Troubleshooting

### Build Fails
- Check Node.js version (16+ required)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for syntax errors: `npm run lint`

### Environment Variables Not Working
- Ensure `VITE_` prefix for client-side variables
- Rebuild after adding environment variables
- Check Vercel Dashboard for correct values

### 404 Errors on Routes
- vercel.json includes SPA routing configuration
- All routes redirect to index.html

### CORS Issues with Supabase
- Ensure Supabase project has correct CORS settings
- Add Vercel deployment URL to Supabase allowed origins

## Performance

- CSS optimized to 11.25 kB (gzipped)
- Code splitting for faster initial load
- Automatic HTTP/2 push with Vercel
- CDN caching for static assets (31536000s)

## Deployment URL

After successful deployment, your app will be available at:
```
https://quizpro.vercel.app
```

Or your custom domain if configured.

## CI/CD Pipeline

Vercel automatically:
- Detects changes to GitHub repository
- Runs build command
- Deploys to production
- Provides preview URLs for pull requests

## Rollback

If needed, rollback to previous deployment:
1. Go to Vercel Dashboard
2. Select QuizPro project
3. Deployments tab
4. Find previous successful deployment
5. Click "Redeploy"

---

**Your QuizPro app is now ready for production deployment on Vercel!**
