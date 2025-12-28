# Fix Vercel Build Error

## The Issue
Your build is failing because Vercel needs to:
1. Install dependencies from the root (monorepo)
2. Generate Prisma client
3. Build the Next.js app

## Quick Fix: Update Vercel Project Settings

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Click on your **pausely** project
3. Go to **Settings** → **General**

### Step 2: Update Build Settings
Scroll to **Build & Development Settings**:

- **Root Directory:** `apps/web` (keep this)
- **Framework Preset:** Next.js
- **Build Command:** 
  ```
  cd ../.. && pnpm install && cd packages/db && pnpm generate && cd ../../apps/web && pnpm build
  ```
- **Output Directory:** `.next` (default)
- **Install Command:** 
  ```
  cd ../.. && pnpm install
  ```

### Step 3: Save and Redeploy
1. Click **Save**
2. Go to **Deployments** tab
3. Click **"Redeploy"** on the latest deployment
4. Or run: `vercel --prod`

## Alternative: Check Build Logs First

To see the exact error:

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the failed deployment (the one with the error)
3. Click **"View Build Logs"**
4. Scroll to see the actual error message

Common errors:
- **"Cannot find module"** → Need to install from root
- **"Prisma Client not generated"** → Need to run `pnpm generate`
- **"TypeScript errors"** → Check type errors in logs

## If Still Failing

Share the build log error and I'll help fix it. The most common issue is that Prisma client needs to be generated before building.

