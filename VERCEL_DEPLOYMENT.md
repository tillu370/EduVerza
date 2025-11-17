# Vercel Deployment Guide

## Important: Environment Variables Setup

Before deploying, you **MUST** add these environment variables in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```
VITE_SUPABASE_URL=https://xmzijxxrbbweygymsnvb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtemlqeHhyYmJ3ZXlneW1zbnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMDE4NDgsImV4cCI6MjA3ODc3Nzg0OH0.Y-cjzvLcF_4cwL9X3-o-SptaVxSCjPpcCp7dRfg1tFI
```

4. Make sure to add them for **Production**, **Preview**, and **Development** environments
5. Click **Save**
6. **Redeploy** your application after adding the variables

## Deployment Steps

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically detect it's a Vite project
4. **IMPORTANT**: Add environment variables (see above)
5. Deploy!

## Troubleshooting Blank Screen

If you see a blank screen after deployment:

1. **Check Environment Variables**: Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Vercel
2. **Check Browser Console**: Open DevTools (F12) and check for errors
3. **Redeploy**: After adding environment variables, trigger a new deployment
4. **Check Build Logs**: In Vercel dashboard, check if the build completed successfully

## Build Configuration

The `vercel.json` file is already configured for:
- SPA routing (all routes redirect to index.html)
- Vite build output (dist folder)
- Proper framework detection

