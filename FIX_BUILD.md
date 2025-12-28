# Fix Vercel Build Error

## The Problem
The build is failing because:
1. Vercel is using `apps/web` as root directory
2. But `vercel.json` is in the root directory
3. Build command needs to account for monorepo structure

## Solution

I've created `apps/web/vercel.json` with the correct build commands.

## Next Steps

### Option 1: Update Vercel Project Settings (Recommended)

1. Go to: https://vercel.com/dashboard
2. Click on your **pausely** project
3. Go to **Settings** → **General**
4. **Root Directory:** Change from `apps/web` to **`.`** (root)
5. **Build & Development Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web`
   - **Build Command:** `cd ../.. && pnpm install && cd apps/web && pnpm build`
   - **Output Directory:** `.next` (default)
   - **Install Command:** `cd ../.. && pnpm install`
6. **Save**

### Option 2: Keep Root as apps/web

If you want to keep root as `apps/web`, the `apps/web/vercel.json` I created should work.

## Try Deploying Again

```bash
vercel --prod
```

## Check Build Logs

If it still fails, check the build logs:

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the failed deployment
3. Check the **Build Logs** tab to see the exact error

## Common Build Issues

### Issue: "Cannot find module @pausely/..."
**Fix:** Make sure `installCommand` runs from root: `cd ../.. && pnpm install`

### Issue: "Prisma Client not generated"
**Fix:** Add to build command: `cd packages/db && pnpm generate && cd ../../apps/web && pnpm build`

### Issue: "TypeScript errors"
**Fix:** Check that all packages are built: `pnpm build` from root first

## Updated Build Command (if needed)

If the build still fails, use this in Vercel settings:

```bash
cd ../.. && pnpm install && cd packages/db && pnpm generate && cd ../../apps/web && pnpm build
```

This ensures:
1. Install all dependencies (from root)
2. Generate Prisma client
3. Build Next.js app

