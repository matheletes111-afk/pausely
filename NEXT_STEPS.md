# Next Steps After Adding Environment Variables

## Step 1: Verify Environment Variables

Check that all variables are set:

```bash
vercel env ls
```

You should see all 8 variables listed.

## Step 2: Deploy to Vercel

Deploy your project:

```bash
vercel --prod
```

This will:
- Build your Next.js app
- Deploy to production
- Give you a URL like: `https://pausely.vercel.app`

**Or deploy from Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to **Deployments** tab
4. Click **"Redeploy"** on the latest deployment (or it will auto-deploy from GitHub)

## Step 3: Run Database Migrations

After deployment, you need to run Prisma migrations to create your database tables:

### Option A: Using Vercel CLI (Recommended)

```bash
# Pull environment variables to local file
vercel env pull .env.production

# Load the DATABASE_URL
export $(cat .env.production | grep DATABASE_URL | xargs)

# Run migrations
cd packages/db
pnpm migrate:deploy
```

### Option B: Manual Migration

1. Get your DATABASE_URL from Vercel:
   ```bash
   vercel env pull .env.production
   cat .env.production | grep DATABASE_URL
   ```

2. Set it locally and run migrations:
   ```bash
   export DATABASE_URL="your-production-database-url-from-vercel"
   cd packages/db
   pnpm migrate:deploy
   ```

### Option C: Using Vercel Dashboard

1. Go to your project → Settings → Environment Variables
2. Copy the `DATABASE_URL` value
3. Set it locally:
   ```bash
   export DATABASE_URL="your-copied-url"
   cd packages/db
   pnpm migrate:deploy
   ```

## Step 4: Seed Database (Optional)

Seed the impulse types:

```bash
cd packages/db
pnpm seed
```

This will create the default impulse types (Phone Usage, Late Night Eating, etc.)

## Step 5: Verify Deployment

1. **Visit your Vercel URL:**
   - Should show: "Pausely Admin Dashboard"
   - Navigate to: `https://your-project.vercel.app/admin/login`

2. **Test API Endpoints:**
   ```bash
   # Test registration endpoint
   curl https://your-project.vercel.app/api/auth/register \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123456"}'
   ```

3. **Check Vercel Logs:**
   ```bash
   vercel logs
   ```

## Step 6: Configure Stripe Webhook

1. Go to Stripe Dashboard: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. **Endpoint URL:** `https://your-project.vercel.app/api/webhooks/stripe`
4. **Select events:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add it to Vercel as `STRIPE_WEBHOOK_SECRET` (if not already added)

## Step 7: Update Mobile App Configuration

Update your mobile app to point to the production API:

1. In `apps/mobile/app.json`, update:
   ```json
   "extra": {
     "apiUrl": "https://your-project.vercel.app/api"
   }
   ```

2. Or set `EXPO_PUBLIC_API_URL` in your mobile app's environment

## Troubleshooting

### Build Fails
- Check Vercel build logs in dashboard
- Verify Root Directory is set to `apps/web`
- Check all environment variables are set

### Database Connection Fails
- Verify `DATABASE_URL` is correct
- Check database allows connections from Vercel IPs
- Ensure database is running

### API Returns 500 Errors
- Check Vercel function logs: `vercel logs`
- Verify all environment variables are set
- Check database migrations ran successfully

### Can't Access Admin Dashboard
- Make sure you deployed successfully
- Check the URL is correct
- Verify Next.js app built without errors

## Quick Checklist

- [ ] Environment variables added to Vercel
- [ ] Project deployed: `vercel --prod`
- [ ] Database migrations run: `pnpm migrate:deploy`
- [ ] Database seeded (optional): `pnpm seed`
- [ ] Stripe webhook configured
- [ ] Tested API endpoints
- [ ] Mobile app API URL updated

## Next: Test Your Deployment

1. **Create a test user:**
   - Visit: `https://your-project.vercel.app/admin/login`
   - Or use API: `POST /api/auth/register`

2. **Test the mobile app:**
   - Update API URL in mobile app
   - Test login/registration
   - Test urge intervention flow

3. **Monitor:**
   - Check Vercel Analytics
   - Monitor error logs
   - Test Stripe webhooks

