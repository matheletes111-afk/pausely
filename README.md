# Pausely - Impulse Control App for Adults

A production-grade MVP for helping adults manage impulsive behaviors (phone addiction, binge eating, shopping addiction, doom scrolling) using AI-guided interventions, delayed gratification timers, and accountability streaks.

## Architecture Overview

Pausely is built as a monorepo using pnpm workspaces with the following structure:

- **Mobile App** (`apps/mobile`) - Expo React Native app with TypeScript
- **Web Dashboard** (`apps/web`) - Next.js 16 admin dashboard with App Router
- **Database Package** (`packages/db`) - Prisma schema and client
- **Shared Package** (`packages/shared`) - Shared TypeScript types
- **UI Package** (`packages/ui`) - Shared UI utilities (shadcn/ui)
- **Auth Package** (`packages/auth`) - JWT utilities and password hashing

## Tech Stack

- **Mobile**: Expo (React Native, TypeScript)
- **Web**: Next.js 16 (App Router, TypeScript)
- **UI**: shadcn/ui + Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT (email/password, OAuth-ready)
- **Payments**: Stripe (subscriptions)
- **AI**: OpenAI API (GPT-4)
- **State Management**: React Query / TanStack Query
- **Notifications**: Expo Push Notifications

## Prerequisites

- Node.js 18+ and pnpm 8+
- PostgreSQL database
- OpenAI API key
- Stripe account (for payments)
- Expo account (for push notifications)

## Setup Instructions

### 1. Install Dependencies

```bash
# Install all dependencies for the monorepo
pnpm install
```

**Note:** This will install dependencies for all packages in the workspace. Make sure you have network access.

### 2. Database Setup

1. Create a PostgreSQL database
2. Create a `.env` file in the **root directory** (parallel to `package.json`) with the following content:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pausely?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="your-refresh-token-secret"
JWT_REFRESH_EXPIRES_IN="30d"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
STRIPE_PREMIUM_PRICE_ID="price_your-premium-price-id"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"

# App URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Expo
EXPO_PUBLIC_API_URL="http://localhost:3000/api"
EXPO_PUBLIC_PROJECT_ID="your-expo-project-id"
```

3. Generate Prisma client and run migrations:

**Use the workspace commands (recommended):**
```bash
# Generate Prisma client
pnpm db:generate

# Create and run migrations
pnpm db:migrate
```

**Or use npx with explicit schema path:**
```bash
# From root directory
npx prisma migrate dev --schema=./packages/db/prisma/schema.prisma
```

**Note:** 
- The schema is located at `packages/db/prisma/schema.prisma`
- If you run `npx prisma` from root, you must specify `--schema=./packages/db/prisma/schema.prisma`
- The workspace commands (`pnpm db:*`) automatically use the correct schema path
- If you encounter "prisma: command not found", make sure you've run `pnpm install` first

### 3. Environment Variables

**Important:** You need `.env` files in two locations:

1. **Root `.env`** (already created in step 2) - Used by Prisma for database migrations
2. **`apps/web/.env.local`** - Needed for Next.js to read environment variables at runtime

Create `apps/web/.env.local` with the same content as the root `.env` file. Next.js automatically reads from `.env.local` in its directory.

**Quick setup:**
```bash
# Copy root .env to apps/web/.env.local (update the values as needed)
cp .env apps/web/.env.local
```

Update all the placeholder values with your actual credentials in both files.

### 4. Seed Database (Optional)

Seed impulse types:

```bash
cd packages/db
pnpm seed
```

### 5. Run Development Servers

**Web Dashboard:**
```bash
cd apps/web
pnpm dev
```

Access at `http://localhost:3000`

**Mobile App:**
```bash
cd apps/mobile
pnpm start
```

## Development Workflow

### Monorepo Commands

```bash
# Install all dependencies
pnpm install

# Run all dev servers
pnpm dev

# Build all packages
pnpm build

# Type check all packages
pnpm type-check

# Lint all packages
pnpm lint

# Format code
pnpm format
```

### Database Commands

```bash
# Generate Prisma client
pnpm db:generate

# Create migration
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio
```

### Package-Specific Commands

Each package has its own scripts defined in `package.json`. Run them with:

```bash
pnpm --filter @pausely/web dev
pnpm --filter @pausely/mobile start
```

## Project Structure

```
pausely/
├── apps/
│   ├── mobile/          # Expo React Native app
│   │   ├── app/         # Expo Router pages
│   │   └── lib/         # Mobile app utilities
│   └── web/             # Next.js admin dashboard
│       ├── app/          # Next.js App Router
│       │   ├── api/      # API routes
│       │   └── (admin)/  # Admin pages
│       └── lib/          # Web app utilities
├── packages/
│   ├── db/              # Prisma schema and client
│   ├── shared/          # Shared TypeScript types
│   ├── ui/              # Shared UI utilities
│   └── auth/            # Auth utilities (JWT, password hashing)
└── package.json         # Root workspace config
```

## Key Features

### Mobile App

1. **Authentication** - Signup, login, onboarding with impulse type selection
2. **Urge Intervention** - "I feel an urge" button triggers:
   - Delayed gratification timer (customizable 5-30 minutes)
   - AI Coach chat interface (dark mode, calming UI)
   - Breathing animations
   - Success/relapse tracking
3. **Streak Tracking** - Daily streaks with gentle recovery logic
4. **Dashboard** - View streaks, impulse frequency, session history
5. **Push Notifications** - Timer completion notifications

### Web Admin Dashboard

1. **User Management** - View users, streaks, sessions
2. **Organization Management** - Corporate wellness orgs with seat tracking
3. **Analytics** - Charts for streaks, AI usage, impulse categories
4. **Subscription Management** - View user subscriptions

### API Routes

- `/api/auth/*` - Authentication (register, login, refresh, logout)
- `/api/users/*` - User management
- `/api/urge-sessions/*` - Urge session management
- `/api/streaks/*` - Streak tracking
- `/api/ai/*` - AI chat and summarization
- `/api/organizations/*` - Organization management
- `/api/subscriptions/*` - Stripe subscription management
- `/api/webhooks/stripe` - Stripe webhook handler

## Database Schema

Key models:
- `User` - Authentication and profile
- `Profile` - User preferences and settings
- `ImpulseType` - Phone, LateNightEating, Shopping, DoomScrolling
- `UrgeSession` - Core intervention sessions
- `AIMessage` - Messages within sessions
- `Streak` - Daily streak tracking
- `Subscription` - Stripe subscription details
- `Organization` - Corporate wellness organizations

See `packages/db/prisma/schema.prisma` for full schema.

## AI Coach

The AI coach uses OpenAI GPT-4 with a carefully crafted system prompt that:
- Is non-judgmental and empathetic
- Focuses on delay, not abstinence
- Uses calm, reassuring language
- Keeps responses short and mobile-friendly
- Encourages self-compassion

## Stripe Integration

- Free tier: 5 AI sessions/month
- Premium tier: Unlimited AI, advanced analytics
- Checkout flow via Stripe Checkout
- Webhook handling for subscription events

## Testing

Currently, testing is not included in the MVP. To add testing:

1. Install Jest/Vitest
2. Add test scripts to package.json
3. Create test files alongside source files

## Deployment

### Web Dashboard - Vercel (Recommended)

See [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) for detailed deployment instructions.

**Quick Steps:**
1. Push code to GitHub (already done ✅)
2. Import repository in Vercel
3. Set Root Directory to `apps/web`
4. Add environment variables in Vercel dashboard
5. Deploy!

**Manual Deployment:**

Deploy to any Node.js hosting:

```bash
cd apps/web
pnpm build
pnpm start
```

### Mobile App

Build and deploy via Expo:

```bash
cd apps/mobile
pnpm build:ios    # iOS
pnpm build:android # Android
```

### Database

Run migrations in production:

```bash
pnpm db:migrate:deploy
```

## Environment Variables Reference

See `.env.example` for all required environment variables.

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check database exists and user has permissions

### Prisma Client Not Generated

```bash
cd packages/db
pnpm generate
```

### Expo Issues

- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`

## License

Proprietary - All rights reserved

## Support

For issues or questions, please contact the development team.

