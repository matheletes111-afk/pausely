# Quick Environment Variables Setup for Vercel

## Method 1: Use the Interactive Script (Easiest)

```bash
# Make script executable (already done)
chmod +x add-vercel-env.sh

# Run the script
./add-vercel-env.sh
```

The script will prompt you for each variable. Just copy-paste the values when asked.

## Method 2: Add via Vercel Dashboard (Recommended for First Time)

1. **Go to your Vercel project**: https://vercel.com/dashboard
2. **Select your project** → **Settings** → **Environment Variables**
3. **Add each variable** using the template below:

### Required Variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/pausely?schema=public` | Your PostgreSQL connection string |
| `JWT_SECRET` | `[generate with: openssl rand -base64 32]` | Strong random string |
| `JWT_REFRESH_SECRET` | `[generate with: openssl rand -base64 32]` | Another strong random string |
| `OPENAI_API_KEY` | `sk-...` | From OpenAI dashboard |
| `STRIPE_SECRET_KEY` | `sk_live_...` | From Stripe dashboard (use live for prod) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | From Stripe webhook settings |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | From Stripe dashboard |
| `STRIPE_PREMIUM_PRICE_ID` | `price_...` | Create product in Stripe, copy price ID |

### Optional Variables:

- `JWT_EXPIRES_IN` = `7d` (default)
- `JWT_REFRESH_EXPIRES_IN` = `30d` (default)
- `NEXT_PUBLIC_APP_URL` = Auto-set by Vercel
- `NEXT_PUBLIC_API_URL` = Auto-set by Vercel

**For each variable:**
- Select environments: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

## Method 3: Quick CLI Commands (One by One)

```bash
# Database
vercel env add DATABASE_URL production preview development
# Paste: postgresql://user:password@host:5432/pausely?schema=public

# JWT Secrets (generate first)
JWT_SECRET=$(openssl rand -base64 32)
echo "Use this JWT_SECRET: $JWT_SECRET"
vercel env add JWT_SECRET production preview development

JWT_REFRESH_SECRET=$(openssl rand -base64 32)
echo "Use this JWT_REFRESH_SECRET: $JWT_REFRESH_SECRET"
vercel env add JWT_REFRESH_SECRET production preview development

# OpenAI
vercel env add OPENAI_API_KEY production preview development
# Paste: sk-your-openai-api-key

# Stripe
vercel env add STRIPE_SECRET_KEY production preview development
vercel env add STRIPE_WEBHOOK_SECRET production preview development
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production preview development
vercel env add STRIPE_PREMIUM_PRICE_ID production preview development
```

## Generate Secure Secrets

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate JWT_REFRESH_SECRET
openssl rand -base64 32
```

## Verify Variables

After adding, verify they're set:

```bash
vercel env ls
```

## After Adding Variables

1. **Redeploy** to apply changes:
   ```bash
   vercel --prod
   ```

2. **Or trigger redeploy** from Vercel dashboard:
   - Go to Deployments
   - Click "..." on latest deployment
   - Click "Redeploy"

## Need Help Getting Values?

### DATABASE_URL
- **Vercel Postgres**: Go to Storage → Create Postgres → Copy connection string
- **Supabase**: Project Settings → Database → Connection string
- **Railway/Other**: Check your database provider dashboard

### Stripe Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Copy **Secret key** → `STRIPE_SECRET_KEY`
3. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. For webhook: Developers → Webhooks → Create endpoint → Copy signing secret

### OpenAI Key
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy the key (starts with `sk-`)

## Troubleshooting

**Variables not working?**
- Make sure you selected the correct environments (Production/Preview/Development)
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

**Can't add variables?**
- Make sure you're logged in: `vercel login`
- Make sure project is linked: `vercel link`
- Try using Vercel Dashboard instead

