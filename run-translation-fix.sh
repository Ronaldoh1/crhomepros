#!/bin/bash

# ============================================
# CR HOME PROS — Apply Translation Fix + Run
# ============================================
# Usage:
#   ./run-translation-fix.sh dev      → apply fix + run dev server
#   ./run-translation-fix.sh deploy   → apply fix + deploy to Vercel preview
#   ./run-translation-fix.sh prod     → apply fix + deploy to production

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

MODE=${1:-dev}

echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  CR HOME PROS — Spanish Translation Fix       ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════╝${NC}"
echo ""

# ── Step 0: Make sure we're in the project root ──
if [ ! -f "package.json" ] || ! grep -q '"crhomepros"' package.json 2>/dev/null; then
    echo -e "${RED}❌ Run this from the crhomepros project root.${NC}"
    echo "   cd /path/to/crhomepros && ./run-translation-fix.sh $MODE"
    exit 1
fi

# ── Step 1: Apply the translation fix ──
ZIP="crhomepros-translation-fix.zip"

if [ -f "$ZIP" ]; then
    echo -e "${YELLOW}📦 Applying translation fix from $ZIP...${NC}"
    unzip -o "$ZIP" -d .
    echo -e "${GREEN}✅ Files updated:${NC}"
    echo "   lib/i18n/en.ts"
    echo "   lib/i18n/es.ts"
    echo "   components/sections/ (12 components)"
    echo ""
else
    echo -e "${YELLOW}⚠  No $ZIP found — assuming files are already in place.${NC}"
    echo ""
fi

# ── Step 2: Install deps if needed ──
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📥 Installing dependencies...${NC}"
    npm install
    echo ""
fi

# ── Step 3: Type check ──
echo -e "${BLUE}🔍 Running TypeScript check...${NC}"
if npx tsc --noEmit 2>&1; then
    echo -e "${GREEN}✅ TypeScript OK${NC}"
else
    echo ""
    echo -e "${RED}❌ TypeScript errors above — fix before deploying.${NC}"
    echo -e "${YELLOW}   You can still run dev to see the site: npm run dev${NC}"
    if [ "$MODE" != "dev" ]; then
        exit 1
    fi
fi
echo ""

# ── Step 4: Run based on mode ──
case $MODE in
    dev)
        echo -e "${GREEN}🚀 Starting dev server...${NC}"
        echo -e "${CYAN}   Open http://localhost:3000/en  (English)${NC}"
        echo -e "${CYAN}   Open http://localhost:3000/es  (Spanish) ← verify this one${NC}"
        echo ""
        npm run dev
        ;;

    dev:turbo)
        echo -e "${GREEN}🚀 Starting dev server (turbo)...${NC}"
        echo -e "${CYAN}   Open http://localhost:3000/en  (English)${NC}"
        echo -e "${CYAN}   Open http://localhost:3000/es  (Spanish) ← verify this one${NC}"
        echo ""
        npm run dev:turbo
        ;;

    deploy|preview)
        echo -e "${BLUE}🏗  Building...${NC}"
        npm run build
        echo ""
        echo -e "${BLUE}📤 Deploying to Vercel preview...${NC}"
        vercel
        echo ""
        echo -e "${GREEN}✅ Preview deployed! Check /es route on the preview URL.${NC}"
        ;;

    prod|production)
        echo -e "${BLUE}🏗  Building...${NC}"
        npm run build
        echo ""
        echo -e "${RED}⚠️  PRODUCTION DEPLOYMENT${NC}"
        echo "   This will push to https://crhomepros.com"
        echo ""
        read -p "   Deploy to production? (yes/no): " confirm
        if [[ "$confirm" == "yes" ]]; then
            vercel --prod --yes
            echo ""
            echo -e "${GREEN}╔═══════════════════════════════════════════════╗${NC}"
            echo -e "${GREEN}║  ✅ PRODUCTION LIVE — crhomepros.com          ║${NC}"
            echo -e "${GREEN}╚═══════════════════════════════════════════════╝${NC}"
        else
            echo -e "${YELLOW}   Cancelled.${NC}"
        fi
        ;;

    *)
        echo "Usage: ./run-translation-fix.sh [mode]"
        echo ""
        echo "Modes:"
        echo "  dev          Run local dev server (default)"
        echo "  dev:turbo    Run local dev server with turbo"
        echo "  deploy       Deploy to Vercel preview"
        echo "  prod         Deploy to production"
        exit 1
        ;;
esac
