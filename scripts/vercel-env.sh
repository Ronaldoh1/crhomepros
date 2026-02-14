#!/bin/bash
# ============================================
# Push .env.local variables to Vercel
# ============================================
# Run: chmod +x scripts/vercel-env.sh && ./scripts/vercel-env.sh
#
# This reads .env.local and sets each variable
# in Vercel for production, preview, and development.
# ============================================

set -e
cd "$(dirname "$0")/.."

if [ ! -f .env.local ]; then
  echo "❌ No .env.local found"
  exit 1
fi

if ! command -v vercel &> /dev/null; then
  echo "Installing Vercel CLI..."
  npm i -g vercel
fi

echo "🔐 Pushing environment variables to Vercel..."
echo ""

while IFS= read -r line; do
  # Skip comments and empty lines
  [[ "$line" =~ ^#.*$ ]] && continue
  [[ -z "$line" ]] && continue
  
  # Extract key and value
  key="${line%%=*}"
  value="${line#*=}"
  
  # Remove surrounding quotes from value
  value="${value%\"}"
  value="${value#\"}"
  
  # Skip if key is empty
  [[ -z "$key" ]] && continue
  
  echo "  Setting $key..."
  echo "$value" | vercel env add "$key" production preview development 2>/dev/null || \
  echo "  ⚠️  $key already exists (use Vercel dashboard to update)"
  
done < .env.local

echo ""
echo "✅ Environment variables pushed to Vercel"
echo ""
echo "Now redeploy to pick up the new env vars:"
echo "  vercel --prod"
echo ""
