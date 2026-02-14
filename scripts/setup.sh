#!/bin/bash

# ============================================
# CR HOME PROS - PROJECT SETUP SCRIPT
# ============================================
# This script sets up your development environment
# Run: chmod +x scripts/setup.sh && ./scripts/setup.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   CR HOME PROS - Environment Setup         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Check Node.js
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js 20+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18 or higher${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Check git
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}⚠ Git is not installed (optional but recommended)${NC}"
else
    echo -e "${GREEN}✓ Git $(git --version | cut -d' ' -f3)${NC}"
fi

echo ""
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

echo ""
echo -e "${YELLOW}Creating environment files...${NC}"

# Create .env.local
if [ ! -f .env.local ]; then
    cat > .env.local << 'ENVLOCAL'
# ============================================
# CR HOME PROS - LOCAL DEVELOPMENT
# ============================================
# This file is gitignored - safe for secrets
# Fill in your actual values below

# App
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="CR Home Pros (DEV)"

# Firebase (Get from Firebase Console → Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (Get from Firebase Console → Service Accounts)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Email - Resend (https://resend.com)
RESEND_API_KEY=
EMAIL_FROM=noreply@crhomepros.com
EMAIL_TO_LEADS=carlos@crhomepros.com

# SMS - Twilio (Optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Google (Optional)
GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
ENVLOCAL
    echo -e "${GREEN}✓ Created .env.local${NC}"
else
    echo -e "${YELLOW}⚠ .env.local already exists, skipping${NC}"
fi

# Create .env.development
if [ ! -f .env.development ]; then
    cat > .env.development << 'ENVDEV'
# ============================================
# CR HOME PROS - DEVELOPMENT/BETA SERVER
# ============================================

NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_URL=https://beta.crhomepros.com
NEXT_PUBLIC_SITE_NAME="CR Home Pros (BETA)"

# Firebase Development Project
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=crhomepros-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=crhomepros-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=crhomepros-dev.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
ENVDEV
    echo -e "${GREEN}✓ Created .env.development${NC}"
else
    echo -e "${YELLOW}⚠ .env.development already exists, skipping${NC}"
fi

# Create .env.production
if [ ! -f .env.production ]; then
    cat > .env.production << 'ENVPROD'
# ============================================
# CR HOME PROS - PRODUCTION
# ============================================

NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_URL=https://crhomepros.com
NEXT_PUBLIC_SITE_NAME="CR Home Pros"

# Firebase Production Project
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=crhomepros-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=crhomepros-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=crhomepros-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
ENVPROD
    echo -e "${GREEN}✓ Created .env.production${NC}"
else
    echo -e "${YELLOW}⚠ .env.production already exists, skipping${NC}"
fi

# Create .env.example
cat > .env.example << 'ENVEXAMPLE'
# ============================================
# CR HOME PROS - ENVIRONMENT TEMPLATE
# ============================================
# Copy this to .env.local and fill in values

NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="CR Home Pros"

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

RESEND_API_KEY=
EMAIL_FROM=
EMAIL_TO_LEADS=
ENVEXAMPLE
echo -e "${GREEN}✓ Created .env.example${NC}"

# Update .gitignore
if ! grep -q ".env.local" .gitignore 2>/dev/null; then
    cat >> .gitignore << 'GITIGNORE'

# Environment files with secrets
.env.local
.env*.local
*.pem

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
GITIGNORE
    echo -e "${GREEN}✓ Updated .gitignore${NC}"
fi

# Make scripts executable
chmod +x scripts/*.sh 2>/dev/null || true

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ Setup Complete!                       ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo ""
echo "  1. Edit ${YELLOW}.env.local${NC} with your Firebase credentials"
echo "     (See SETUP_GUIDE.md for Firebase setup instructions)"
echo ""
echo "  2. Start the development server:"
echo "     ${GREEN}npm run dev${NC}"
echo ""
echo "  3. Open ${BLUE}http://localhost:3000${NC} in your browser"
echo ""
echo "  4. Open ${BLUE}http://localhost:3000/admin${NC} for admin portal"
echo ""
echo -e "${YELLOW}Happy coding! 🚀${NC}"
echo ""
