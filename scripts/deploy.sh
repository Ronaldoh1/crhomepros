#!/bin/bash

# ============================================
# CR HOME PROS - DEPLOYMENT SCRIPT
# ============================================
# Usage: ./scripts/deploy.sh [dev|beta|prod]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ENV=${1:-dev}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   CR HOME PROS - Deployment                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI is not installed!${NC}"
    echo ""
    echo "Install it with:"
    echo "  npm install -g vercel"
    echo ""
    echo "Then login:"
    echo "  vercel login"
    exit 1
fi

# Pre-deployment checks
echo -e "${YELLOW}Running pre-deployment checks...${NC}"

# Type check
echo -n "  TypeScript check... "
if npx tsc --noEmit > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo -e "${RED}TypeScript errors found. Fix them before deploying.${NC}"
    npx tsc --noEmit
    exit 1
fi

# Lint check
echo -n "  ESLint check... "
if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ (warnings)${NC}"
fi

# Build check
echo -n "  Build check... "
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo -e "${RED}Build failed. Fix errors before deploying.${NC}"
    npm run build
    exit 1
fi

echo ""

# Deploy based on environment
case $ENV in
    dev|development|preview)
        echo -e "${BLUE}📦 Deploying to Development/Preview...${NC}"
        echo ""
        vercel
        echo ""
        echo -e "${GREEN}✅ Development deployment complete!${NC}"
        ;;

    beta|staging)
        echo -e "${BLUE}📦 Deploying to Beta/Staging...${NC}"
        echo ""
        # Deploy with beta alias
        vercel --yes
        DEPLOY_URL=$(vercel --yes 2>&1 | grep -o 'https://[^ ]*\.vercel\.app' | head -1)
        
        if [ -n "$DEPLOY_URL" ]; then
            echo "Setting beta alias..."
            vercel alias "$DEPLOY_URL" beta.crhomepros.com || true
        fi
        echo ""
        echo -e "${GREEN}✅ Beta deployment complete!${NC}"
        echo -e "URL: ${BLUE}https://beta.crhomepros.com${NC}"
        ;;

    prod|production)
        echo -e "${RED}⚠️  PRODUCTION DEPLOYMENT${NC}"
        echo ""
        echo "This will deploy to: https://crhomepros.com"
        echo ""
        read -p "Are you sure you want to deploy to PRODUCTION? (yes/no): " confirm
        
        if [[ $confirm == "yes" ]]; then
            echo ""
            echo -e "${BLUE}📦 Deploying to Production...${NC}"
            echo ""
            
            # Create git tag for this deployment
            if command -v git &> /dev/null; then
                git tag -a "deploy-prod-$TIMESTAMP" -m "Production deployment $TIMESTAMP" 2>/dev/null || true
            fi
            
            vercel --prod --yes
            echo ""
            echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
            echo -e "${GREEN}║   ✅ PRODUCTION DEPLOYMENT COMPLETE!       ║${NC}"
            echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
            echo ""
            echo -e "Live at: ${BLUE}https://crhomepros.com${NC}"
            echo -e "Deployed: ${YELLOW}$TIMESTAMP${NC}"
        else
            echo ""
            echo -e "${YELLOW}❌ Deployment cancelled${NC}"
            exit 0
        fi
        ;;

    *)
        echo -e "${RED}❌ Unknown environment: $ENV${NC}"
        echo ""
        echo "Usage: ./scripts/deploy.sh [environment]"
        echo ""
        echo "Environments:"
        echo "  dev, development, preview  - Deploy to preview URL"
        echo "  beta, staging              - Deploy to beta.crhomepros.com"
        echo "  prod, production           - Deploy to crhomepros.com"
        echo ""
        exit 1
        ;;
esac

echo ""
