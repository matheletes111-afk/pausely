# Deploy to Vercel - Step by Step Commands

Since Vercel CLI requires interactive authentication, run these commands in your terminal:

## Step 1: Login to Vercel (if not already logged in)

```bash
vercel login
```

This will open your browser for authentication.

## Step 2: Link Your Project

```bash
cd /Volumes/Myssd/REACT/pausely
vercel link
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (for first time)
- **Project name?** → `pausely` (or your preferred name)
- **Directory?** → `apps/web` (IMPORTANT: Set this to apps/web)

## Step 3: Configure Environment Variables

After linking, add environment variables:

```bash
# Add DATABASE_URL
vercel env add DATABASE_URL

# Add JWT_SECRET
vercel env add JWT_SECRET

# Add JWT_REFRESH_SECRET
vercel env add JWT_REFRESH_SECRET

# Add OPENAI_API_KEY
vercel env add OPENAI_API_KEY

# Add Stripe keys
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_PREMIUM_PRICE_ID

# Add app URLs (optional - Vercel auto-sets these)
vercel env add NEXT_PUBLIC_APP_URL
vercel env add NEXT_PUBLIC_API_URL
```

**For each variable:**
- Select environment: `Production`, `Preview`, and `Development` (or just Production)
- Enter the value when prompted

## Step 4: Update Vercel Project Settings

After linking, update the project configuration:

```bash
# Set root directory to apps/web
vercel --cwd apps/web
```

Or configure in Vercel Dashboard:
1. Go to your project on vercel.com
2. Settings → General
3. Set **Root Directory** to: `apps/web`
4. Save

## Step 5: Deploy

```bash
# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

## Alternative: Deploy via Vercel Dashboard

If CLI is having issues, use the web dashboard:

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import Git Repository → Select `matheletes111-afk/pausely`
3. Configure Project:
   - **Root Directory:** `apps/web`
   - **Framework Preset:** Next.js
   - **Build Command:** `pnpm install && cd apps/web && pnpm build`
   - **Output Directory:** `.next` (leave default)
   - **Install Command:** `pnpm install`
4. Add Environment Variables (see Step 3 above)
5. Click **Deploy**

## Step 6: Run Database Migrations

After first deployment, run migrations:

```bash
# Make sure you're linked
vercel link

# Run migrations (this uses your production DATABASE_URL)
cd packages/db
DATABASE_URL=$(vercel env pull | grep DATABASE_URL | cut -d'=' -f2) pnpm migrate:deploy
```

Or manually:
1. Get your DATABASE_URL from Vercel dashboard
2. Set it locally: `export DATABASE_URL="your-production-url"`
3. Run: `cd packages/db && pnpm migrate:deploy`

## Step 7: Verify Deployment

1. Visit your Vercel URL (shown after deployment)
2. Test the API: `https://your-project.vercel.app/api/auth/register`
3. Check logs: `vercel logs`

## Troubleshooting

### Build Fails
- Check Root Directory is set to `apps/web`
- Verify all environment variables are set
- Check build logs: `vercel logs`

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database allows connections from Vercel IPs
- Check database is running

### Environment Variables Not Working
- Restart deployment after adding variables
- Check variable names match exactly
- Verify variables are set for correct environment (Production/Preview)

