# Fix Vercel Build Command Error

## The Problem
Vercel is using `apps/web` as the root directory, so when the build command runs `cd apps/web`, it fails because it's already in that directory.

## Solution: Update Vercel Project Settings

Since Vercel's root is `apps/web`, the build command needs to go UP to the monorepo root first.

### Update in Vercel Dashboard:

1. Go to: https://vercel.com/dashboard
2. Click your **pausely** project
3. **Settings** → **General** → **Build & Development Settings**

**Update these:**

**Root Directory:** `apps/web` (keep this)

**Install Command:**
```bash
cd ../.. && pnpm install
```

**Build Command:**
```bash
cd ../.. && pnpm install && cd packages/db && pnpm generate && cd ../../apps/web && pnpm build
```

**OR simpler version (if above doesn't work):**
```bash
cd ../.. && pnpm install && pnpm --filter @pausely/db generate && pnpm --filter @pausely/web build
```

**Output Directory:** `.next` (default)

4. **Save**
5. **Redeploy**

## Alternative: Change Root Directory

If the above doesn't work, change the root directory to the project root:

1. **Settings** → **General**
2. **Root Directory:** Change from `apps/web` to `.` (root)
3. **Build Command:** 
   ```bash
   pnpm install && cd packages/db && pnpm generate && cd ../../apps/web && pnpm build
   ```
4. **Install Command:**
   ```bash
   pnpm install
   ```
5. **Save and Redeploy**

## Test Locally First

Before deploying, test the build locally:

```bash
cd /Volumes/Myssd/REACT/pausely
pnpm install
cd packages/db && pnpm generate && cd ../../apps/web && pnpm build
```

If this works locally, use the same command in Vercel.

