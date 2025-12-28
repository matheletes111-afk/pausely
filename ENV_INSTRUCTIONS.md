# How to Add Environment Variables to Vercel

## The Issue
The Vercel CLI requires **interactive selection** of environments. You need to:
1. Run `vercel env add VARIABLE_NAME`
2. Enter the value when prompted
3. **Press SPACE** to select environments (Production, Preview, Development)
4. **Press ENTER** to confirm

## Step-by-Step Instructions

### For Each Variable:

1. **Run the command:**
   ```bash
   vercel env add DATABASE_URL
   ```

2. **When prompted "Mark as sensitive?"** → Type `yes` and press ENTER

3. **When prompted "What's the value?"** → Paste your value and press ENTER

4. **When prompted "Add to which Environments?"** → 
   - Use **SPACE** key to select/deselect
   - Select: ✅ Production, ✅ Preview, ✅ Development (or just Production)
   - Press **ENTER** to confirm

### Complete List of Commands:

Run these **one at a time** and follow the prompts:

```bash
# 1. Database
vercel env add DATABASE_URL

# 2. JWT Secrets
vercel env add JWT_SECRET
vercel env add JWT_REFRESH_SECRET

# 3. OpenAI
vercel env add OPENAI_API_KEY

# 4. Stripe
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_PREMIUM_PRICE_ID
```

## Easier Alternative: Use Vercel Dashboard

**This is MUCH easier!** No CLI needed:

1. Go to: https://vercel.com/dashboard
2. Click on your **pausely** project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. For each variable:
   - **Name:** `DATABASE_URL` (or other variable name)
   - **Value:** Paste your value
   - **Environments:** Check ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

Repeat for all 8 variables.

## Quick Reference: What Values You Need

| Variable | Where to Get It |
|----------|----------------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `JWT_SECRET` | Generate: `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | Generate: `openssl rand -base64 32` |
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| `STRIPE_SECRET_KEY` | https://dashboard.stripe.com/apikeys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → Create endpoint |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | https://dashboard.stripe.com/apikeys |
| `STRIPE_PREMIUM_PRICE_ID` | Create product in Stripe, copy Price ID |

## Verify Variables Are Added

```bash
vercel env ls
```

This should show all your variables.

## After Adding Variables

Redeploy to apply changes:
```bash
vercel --prod
```

