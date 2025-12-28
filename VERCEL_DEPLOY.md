# Vercel Deployment Guide for Pausely

## Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub (already done ✅)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Database**: Set up PostgreSQL (can use Vercel Postgres, Supabase, or any PostgreSQL provider)

## Step-by-Step Deployment

### 1. Connect GitHub Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository: `matheletes111-afk/pausely`
4. Vercel will detect it's a monorepo

### 2. Configure Project Settings

In the Vercel project settings, configure:

**Root Directory:**
- Set to: `apps/web`

**Build Settings:**
- **Framework Preset:** Next.js
- **Build Command:** `cd ../.. && pnpm install && cd apps/web && pnpm build`
- **Output Directory:** `.next` (default)
- **Install Command:** `pnpm install`
- **Node.js Version:** 18.x or higher

**OR use the vercel.json file** (already created in root):
- Vercel will automatically detect `vercel.json` and use those settings

### 3. Set Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

#### Required Variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/pausely?schema=public

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=30d

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Stripe
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PREMIUM_PRICE_ID=price_your-premium-price-id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key

# App URLs (Vercel will auto-set these, but you can override)
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXT_PUBLIC_API_URL=https://your-project.vercel.app/api
```

**Important:**
- Use **Production** values for all environments (or set separately for Preview/Development)
- Replace placeholder values with your actual credentials
- For Stripe, use **live keys** in production (not test keys)

### 4. Database Setup

**Option A: Vercel Postgres (Recommended)**
1. In Vercel Dashboard → Your Project → Storage
2. Create a new Postgres database
3. Copy the connection string to `DATABASE_URL`

**Option B: External Database (Supabase, Railway, etc.)**
1. Set up your PostgreSQL database
2. Copy the connection string to `DATABASE_URL` in Vercel

### 5. Run Database Migrations

After deployment, you need to run Prisma migrations:

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Run migrations (this will use your production DATABASE_URL)
cd packages/db
pnpm migrate:deploy
```

**Option B: Using Vercel Build Command**
Add to your build command:
```bash
cd ../.. && pnpm install && cd packages/db && pnpm migrate:deploy && cd ../../apps/web && pnpm build
```

**Option C: Manual Migration**
Connect to your production database and run migrations manually.

### 6. Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-project.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in Vercel

### 7. Deploy

1. Click **"Deploy"** in Vercel
2. Vercel will:
   - Install dependencies
   - Build the Next.js app
   - Deploy to production

### 8. Post-Deployment

1. **Run Database Migrations** (if not done in build)
2. **Seed Database** (optional):
   ```bash
   cd packages/db
   pnpm seed
   ```
3. **Test the deployment:**
   - Visit your Vercel URL
   - Test API endpoints
   - Test authentication flow

## Monorepo Configuration

Since this is a monorepo, Vercel needs to know:
- **Root Directory:** `apps/web` (set in Vercel dashboard)
- **Build Command:** Uses `vercel.json` or custom command
- **Workspace Dependencies:** Vercel will handle `workspace:*` dependencies automatically

## Troubleshooting

### Build Fails: "Cannot find module"
- Make sure `Root Directory` is set to `apps/web`
- Verify all workspace dependencies are listed in `package.json`

### Database Connection Issues
- Check `DATABASE_URL` is set correctly in Vercel
- Ensure database allows connections from Vercel IPs
- For Vercel Postgres, connection string is auto-provided

### Environment Variables Not Working
- Make sure variables are set for the correct environment (Production/Preview/Development)
- Restart deployment after adding new variables
- Check variable names match exactly (case-sensitive)

### Prisma Client Not Generated
- Add to build command: `cd packages/db && pnpm generate && cd ../../apps/web`

## Custom Domain

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

## Continuous Deployment

Vercel automatically deploys:
- **Production:** Pushes to `main` branch
- **Preview:** Pull requests and other branches

Each deployment gets a unique URL for testing.

## Next Steps

After deployment:
1. Update mobile app `EXPO_PUBLIC_API_URL` to point to your Vercel URL
2. Test all API endpoints
3. Set up monitoring and error tracking
4. Configure backups for your database

