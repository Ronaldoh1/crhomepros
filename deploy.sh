#!/bin/bash
# ============================================
# CR Home Pros — One-Shot Setup & Deploy
# ============================================
# Run: chmod +x deploy.sh && ./deploy.sh
# 
# This script will:
# 1. Install dependencies
# 2. Set up .env.local
# 3. Upload images to Firebase Storage
# 4. Build the project
# 5. Deploy to Vercel
# ============================================

set -e
cd "$(dirname "$0")"

echo ""
echo "🏠 CR Home Pros — Setup & Deploy"
echo "================================="
echo ""

# ── 1. Install dependencies ──
echo "📦 Installing dependencies..."
rm -rf node_modules package-lock.json
npm install
echo "✅ Dependencies installed"
echo ""

# ── 2. Environment setup ──
if [ ! -f .env.local ]; then
  if [ -f .env.local.example ]; then
    cp .env.local.example .env.local
    echo "✅ Created .env.local from example"
  else
    echo "⚠️  No .env.local found — Firebase features may not work"
  fi
else
  echo "✅ .env.local already exists"
fi
echo ""

# ── 3. Upload images to Firebase ──
if [ -f scripts/firebase-service-account.json ]; then
  echo "📸 Uploading images to Firebase Storage..."
  node scripts/upload-images.mjs && echo "✅ Images uploaded" || echo "⚠️  Image upload had issues (non-fatal)"
else
  echo "⚠️  Skipping Firebase upload — no scripts/firebase-service-account.json"
  echo "   Images will load from /public/images/ locally instead"
fi
echo ""

# ── 4. Build ──
echo "🔨 Building project..."
npx next build
echo "✅ Build successful"
echo ""

# ── 5. Deploy to Vercel ──
echo "🚀 Deploying to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "   Installing Vercel CLI..."
  npm i -g vercel
fi

# Check if already linked to Vercel project
if [ -d .vercel ]; then
  echo "   Project already linked to Vercel"
  vercel --prod
else
  echo "   First-time deploy — follow the prompts:"
  echo "   • Set up and deploy? → Y"
  echo "   • Which scope? → Select your account"  
  echo "   • Link to existing project? → N (or Y if you already created one)"
  echo "   • Project name? → crhomepros"
  echo "   • Directory? → ./"
  echo "   • Override settings? → N"
  echo ""
  vercel --prod
fi

echo ""
echo "============================================"
echo "✅ DEPLOYED! Your site is live on Vercel."
echo ""
echo "Next steps:"
echo "  • Set environment variables in Vercel dashboard:"
echo "    vercel.com → crhomepros → Settings → Environment Variables"
echo "    Copy everything from .env.local"
echo ""
echo "  • Or set them via CLI:"
echo "    vercel env pull"
echo "============================================"
echo ""
