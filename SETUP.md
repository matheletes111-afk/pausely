# Pausely Setup Guide

## Prisma Schema Location
- **Schema file:** `packages/db/prisma/schema.prisma` ✓
- **Root `.env`:** Exists ✓
- **Next.js `.env.local`:** Needs to be created

## Step-by-Step Setup

### 1. Verify Root .env File
Your root `.env` file should be at: `/Volumes/Myssd/REACT/pausely/.env`

Make sure it contains at minimum:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/pausely?schema=public"
```

### 2. Create Next.js .env.local
```bash
# From the root directory
cp .env apps/web/.env.local
```

### 3. Verify DATABASE_URL in Root .env

**IMPORTANT:** Make sure your root `.env` file has `DATABASE_URL` set and it's NOT commented out:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pausely?schema=public"
```

Check that:
- The line starts with `DATABASE_URL=` (no `#` before it)
- The connection string is correct for your PostgreSQL database

### 4. Install dotenv-cli (if not already installed)

```bash
pnpm install
```

This will install `dotenv-cli` which allows Prisma to load the root `.env` file.

### 5. Run Prisma Commands

**Use workspace commands (RECOMMENDED)**
```bash
# From root directory
pnpm db:generate    # Generate Prisma client
pnpm db:migrate     # Create and run migrations
```

**Option B: Use npx with schema path and env file**
```bash
# From root directory
npx dotenv -e .env -- prisma migrate dev --schema=./packages/db/prisma/schema.prisma
```

### 6. Verify Setup

After migrations, verify:
```bash
pnpm db:studio  # Opens Prisma Studio to view database
```

## Troubleshooting

### If Prisma can't find schema:
- Always specify `--schema=./packages/db/prisma/schema.prisma` when running from root
- Or use the workspace commands: `pnpm db:migrate`

### If DATABASE_URL not found:
1. **Check your root `.env` file exists:** `/Volumes/Myssd/REACT/pausely/.env`
2. **Verify `DATABASE_URL` is set and NOT commented:**
   ```bash
   # Should show the DATABASE_URL line
   grep "^DATABASE_URL" .env
   ```
3. **If missing, add this line to your root `.env`:**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/pausely?schema=public"
   ```
4. **Make sure you've run `pnpm install`** to install `dotenv-cli`
5. **Try running the command again:**
   ```bash
   pnpm db:migrate
   ```

### If Next.js can't read env vars:
- Create `apps/web/.env.local` with the same variables
- Restart the Next.js dev server after creating `.env.local`

