# Vercel Environment Variables Setup (IMPORTANT!)

## ⚠️ Supabase Integration Not Working?

If your UI is showing but Supabase data is not loading, you need to add environment variables in Vercel.

## Step-by-Step Instructions:

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your project (EduVerza)

### 2. Navigate to Settings
- Click on your project
- Click **Settings** tab (top navigation)
- Click **Environment Variables** (left sidebar)

### 3. Add Environment Variables

Click **Add New** and add these **TWO** variables:

#### Variable 1:
- **Key**: `VITE_SUPABASE_URL`
- **Value**: `https://xmzijxxrbbweygymsnvb.supabase.co`
- **Environment**: Select **Production**, **Preview**, and **Development** (all three)

#### Variable 2:
- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtemlqeHhyYmJ3ZXlneW1zbnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMDE4NDgsImV4cCI6MjA3ODc3Nzg0OH0.Y-cjzvLcF_4cwL9X3-o-SptaVxSCjPpcCp7dRfg1tFI`
- **Environment**: Select **Production**, **Preview**, and **Development** (all three)

### 4. Save and Redeploy

1. Click **Save** after adding each variable
2. Go to **Deployments** tab
3. Click the **three dots (⋯)** on the latest deployment
4. Click **Redeploy**
5. Wait for deployment to complete

### 5. Verify

After redeploy:
1. Open your website
2. Open Browser DevTools (F12)
3. Check Console tab
4. You should see: `✅ Supabase configured successfully`
5. If you see errors, check the console for details

## Common Issues:

### Issue: Still not working after adding variables
**Solution**: Make sure you:
- Selected all three environments (Production, Preview, Development)
- Clicked **Save** after adding each variable
- **Redeployed** the application (not just saved)

### Issue: Variables not showing in build
**Solution**: 
- Variables are only available after redeploy
- Make sure variable names are EXACTLY: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- No spaces, no typos

### Issue: Console shows "Supabase not configured"
**Solution**:
- Double-check variable names match exactly
- Make sure values are correct (no extra spaces)
- Redeploy after adding variables

## Quick Checklist:

- [ ] Added `VITE_SUPABASE_URL` in Vercel
- [ ] Added `VITE_SUPABASE_ANON_KEY` in Vercel
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Clicked Save
- [ ] Redeployed the application
- [ ] Checked browser console for confirmation

## Need Help?

If still not working:
1. Check Vercel build logs for errors
2. Check browser console (F12) for error messages
3. Verify Supabase project is active and accessible
4. Make sure `resources` table exists in Supabase

