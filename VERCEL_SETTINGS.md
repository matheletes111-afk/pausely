# Vercel Project Settings Configuration

## Current Issue
Vercel root directory is set to `apps/web`, but the build command is trying to `cd apps/web` which doesn't exist from that context.

## Solution: Update Vercel Dashboard Settings

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Click on **pausely** project
3. Go to **Settings** → **General**

### Step 2: Update Build & Development Settings

**Root Directory:** `apps/web` (keep this)

**Install Command:**
```bash
cd ../.. && pnpm install
```

**Build Command:**
```bash
cd ../.. && pnpm install && pnpm --filter @pausely/db generate && pnpm --filter @pausely/web build
```

**Output Directory:** `.next` (default)

**Framework Preset:** Next.js

### Step 3: Save and Redeploy
1. Click **Save**
2. Go to **Deployments** tab
3. Click **"Redeploy"** on latest deployment

## Alternative: Use Root Directory

If the above doesn't work, change root directory:

1. **Root Directory:** Change from `apps/web` to `.` (root of repo)
2. **Build Command:**
   ```bash
   pnpm install && pnpm --filter @pausely/db generate && pnpm --filter @pausely/web build
   ```
3. **Install Command:**
   ```bash
   pnpm install
   ```

## Why This Works

- `cd ../..` goes from `apps/web` up to monorepo root
- `pnpm install` installs all workspace dependencies
- `pnpm --filter @pausely/db generate` generates Prisma client
- `pnpm --filter @pausely/web build` builds the Next.js app

This uses pnpm workspace filters which work correctly in monorepos.

