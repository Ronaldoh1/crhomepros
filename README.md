# CR Home Pros — Website

> **Your Home. Our Expertise.** — Modern website for CR Home Pros LLC  
> Built with Next.js 14, TypeScript, Tailwind CSS

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run locally
npm run dev
# → http://localhost:3000

# 3. Build for production
npm run build

# 4. Deploy to Vercel
npx vercel --prod --yes
```

### Environment Variables

Create `.env.local` in the project root:

```env
# Firebase (optional — forms work without it, just won't persist)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Email (optional — for contact form notifications)
SENDGRID_API_KEY=
NOTIFICATION_EMAIL=crgeneralservicesinc@gmail.com
```

---

## Architecture

```
crhomepros/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage
│   ├── about/page.tsx            # Company story, values, FAQ
│   ├── services/
│   │   ├── page.tsx              # All 12 services grid
│   │   └── [slug]/page.tsx       # Individual service detail
│   ├── projects/
│   │   ├── page.tsx              # Filterable gallery (accordion + lightbox)
│   │   └── [slug]/page.tsx       # Individual project detail
│   ├── blog/
│   │   ├── page.tsx              # Blog listing + category filters + featured post
│   │   └── [slug]/page.tsx       # Individual blog post
│   ├── reviews/
│   │   ├── page.tsx              # Customer testimonials
│   │   └── submit/page.tsx       # Review submission form
│   ├── contact/page.tsx          # Contact form + hours
│   ├── referrals/page.tsx        # Referral program ($100-$750+)
│   ├── get-started/page.tsx      # 5-step intake form
│   ├── estimate/page.tsx         # Interactive cost calculator
│   ├── admin/                    # Admin dashboard + lead hunter + field notes
│   ├── layout.tsx                # Root layout (fonts, meta, structured data, PWA)
│   ├── robots.ts                 # Robots.txt generation
│   ├── sitemap.ts                # XML sitemap generation
│   └── api/                      # API routes for form submissions
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Sticky nav with scroll-shrink logo
│   │   ├── Footer.tsx            # Footer with trust badges + service areas
│   │   ├── FloatingContact.tsx   # Floating phone/WhatsApp button
│   │   └── PromoBanner.tsx       # ⭐ Toggleable promotional banner
│   ├── sections/                 # Homepage sections
│   │   ├── Hero.tsx
│   │   ├── ServicesPreview.tsx
│   │   ├── FeaturedProjects.tsx
│   │   ├── MeetCarlos.tsx        # ⭐ Carlos intro + trust indicators
│   │   ├── HowWeWork.tsx         # ⭐ 4-step process visualization
│   │   ├── Stats.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── Testimonials.tsx
│   │   └── CallToAction.tsx
│   ├── forms/                    # Contact, Intake, Referral forms
│   └── ui/
│       └── LogoWatermark.tsx     # ⭐ Logo overlay with blue-blend effect
│
├── lib/
│   ├── constants.ts              # Company info, nav links, services, SEO
│   ├── blog-posts.ts             # ⭐ 14 blog posts with full articles
│   ├── gallery-data.ts           # Project images by category
│   ├── utils.ts                  # Helpers (cn, formatPhone, etc.)
│   ├── firebase.ts               # Firebase client config
│   ├── firebase-admin.ts         # Firebase admin config
│   ├── firebase-services.ts      # Firestore CRUD
│   └── email.ts                  # SendGrid email helper
│
├── public/
│   ├── images/
│   │   ├── logo.png              # ⭐ New CR Home Pros logo
│   │   ├── 2024-01/              # Project photos (Jan batch)
│   │   └── 2024-06/              # Project photos (Jun batch)
│   └── manifest.json             # ⭐ PWA manifest (Add to Home Screen)
│
├── styles/globals.css            # Tailwind + Google Fonts + custom utilities
├── tailwind.config.ts            # Design system (navy + gold)
└── package.json
```

---

## Feature Guide — Where to Make Changes

### 🔧 Promotional Banner

**File:** `components/layout/PromoBanner.tsx`

```typescript
const BANNER_ENABLED = true  // ← toggle on/off

const BANNER_CONFIG = {
  text: 'Winter Prep Special: 15% off roof inspections',
  subtext: 'Beat inflation with locked-in pricing',
  href: '/get-started',
  linkText: 'Claim Offer',
  countdownEnd: '',  // ISO date for countdown, e.g. '2026-03-01T00:00:00'
  style: 'gold',     // 'gold' | 'blue' | 'gradient'
}
```

### 📝 Blog Posts

**File:** `lib/blog-posts.ts`

14 posts included across categories: Team & Culture, Tips & Advice, Kitchen, Bathroom, Basement, Outdoor. Add a new post by appending to the `BLOG_POSTS` array:

```typescript
{
  slug: "your-post-slug",
  title: "Your Post Title",
  category: "Tips & Advice",
  author: "Carlos Hernandez",
  date: "2026-03-15",
  readTime: "6 min",
  image: "https://images.unsplash.com/...",
  excerpt: "Short description...",
  content: `Full article with ## headers and **bold** text`,
}
```

### 📸 Project Gallery

**File:** `lib/gallery-data.ts`

Add images to `public/images/` in a dated folder, then add an entry to `GALLERY_PROJECTS`.
File naming: lowercase `img_` prefix, uppercase `.JPEG`/`.PNG` extension.

### 🎨 Colors

**File:** `tailwind.config.ts`

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-900` | `#1e3554` | Main navy (logo match) |
| `primary-800` | `#243b53` | Navbar, dark sections |
| `gold-500` | `#c4a052` | CTA buttons, accents |
| `dark-900` | `#0f172a` | Text, footer |

### 🌐 Navigation

**File:** `lib/constants.ts` → `NAV_LINKS` (line ~78)

### 📱 PWA

**File:** `public/manifest.json` — Works on iOS + Android for "Add to Home Screen"

### 🔍 SEO

Meta + JSON-LD in `app/layout.tsx`, sitemap in `app/sitemap.ts`, robots in `app/robots.ts`

### 🌍 Company Info

**File:** `lib/constants.ts` — All centralized: name, phone, email, address, license, hours, service areas

---

## Deployment

```bash
# Deploy to Vercel (don't delete images!)
cd crhomepros && npm run build && npx vercel --prod --yes

# Overlay new code without deleting images:
unzip -o crhomepros.zip -d . && cd crhomepros && npm run build && npx vercel --prod --yes
```

---

## TODO Before Final Deploy

- [ ] Replace sample testimonials with real reviews
- [ ] Get Google/Yelp review links → update Reviews page
- [ ] Record video testimonials (English + Spanish) → embed via YouTube
- [ ] Set up Google Analytics (GA4)
- [ ] Set up Firebase for form persistence
- [ ] Configure SendGrid for email notifications
- [ ] Add Google Site Verification meta tag
- [ ] Consider Spanish language version
- [ ] Set up Mailchimp for blog newsletter
# crhomepros
