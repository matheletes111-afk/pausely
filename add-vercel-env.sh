#!/bin/bash
# Script to add all environment variables to Vercel
# Run this script and it will prompt you for each variable

echo "🔐 Adding Environment Variables to Vercel"
echo "=========================================="
echo ""
echo "This script will help you add all required environment variables."
echo "You'll be prompted to enter the value for each variable."
echo ""
echo "IMPORTANT: When asked to select environments, press SPACE to select, then ENTER"
echo "Select: Production, Preview, and Development (or just Production)"
echo ""
read -p "Press Enter to continue..."

# Database
echo ""
echo "📊 DATABASE_URL"
echo "Example: postgresql://user:password@host:5432/pausely?schema=public"
echo "When prompted, select environments with SPACE key, then press ENTER"
vercel env add DATABASE_URL

# JWT Secrets
echo ""
echo "🔑 JWT_SECRET"
echo "Example: your-super-secret-jwt-key-change-in-production"
echo "Press SPACE to select environments, then ENTER"
vercel env add JWT_SECRET

echo ""
echo "🔑 JWT_REFRESH_SECRET"
echo "Example: your-refresh-token-secret"
echo "Press SPACE to select environments, then ENTER"
vercel env add JWT_REFRESH_SECRET

echo ""
echo "⏱️  JWT_EXPIRES_IN (optional, default: 7d)"
echo "Press SPACE to select environments, then ENTER"
vercel env add JWT_EXPIRES_IN

echo ""
echo "⏱️  JWT_REFRESH_EXPIRES_IN (optional, default: 30d)"
echo "Press SPACE to select environments, then ENTER"
vercel env add JWT_REFRESH_EXPIRES_IN

# OpenAI
echo ""
echo "🤖 OPENAI_API_KEY"
echo "Example: sk-your-openai-api-key"
echo "Press SPACE to select environments, then ENTER"
vercel env add OPENAI_API_KEY

# Stripe
echo ""
echo "💳 STRIPE_SECRET_KEY"
echo "Example: sk_live_your-stripe-secret-key (use live keys for production)"
echo "Press SPACE to select environments, then ENTER"
vercel env add STRIPE_SECRET_KEY

echo ""
echo "💳 STRIPE_WEBHOOK_SECRET"
echo "Example: whsec_your-webhook-secret"
echo "Press SPACE to select environments, then ENTER"
vercel env add STRIPE_WEBHOOK_SECRET

echo ""
echo "💳 NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "Example: pk_live_your-stripe-publishable-key"
echo "Press SPACE to select environments, then ENTER"
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

echo ""
echo "💳 STRIPE_PREMIUM_PRICE_ID"
echo "Example: price_your-premium-price-id"
echo "Press SPACE to select environments, then ENTER"
vercel env add STRIPE_PREMIUM_PRICE_ID

# App URLs (optional - Vercel auto-sets these)
echo ""
echo "🌐 NEXT_PUBLIC_APP_URL (optional - Vercel will auto-set)"
echo "Leave empty or enter your custom domain"
echo "Press SPACE to select environments, then ENTER"
vercel env add NEXT_PUBLIC_APP_URL

echo ""
echo "🌐 NEXT_PUBLIC_API_URL (optional - usually same as APP_URL/api)"
echo "Press SPACE to select environments, then ENTER"
vercel env add NEXT_PUBLIC_API_URL

echo ""
echo "✅ All environment variables added!"
echo ""
echo "Next steps:"
echo "1. Verify variables: vercel env ls"
echo "2. Deploy: vercel --prod"

