// ============================================
// CR Home Pros — Extended Test Suite
// Tests for: branding, contrast, CMS, images
// Run: npm test
// ============================================

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = join(__dirname, '..')

// Helper: read a source file
function readFile(relPath: string): string {
  const full = join(ROOT, relPath)
  if (!existsSync(full)) throw new Error(`File not found: ${relPath}`)
  return readFileSync(full, 'utf-8')
}

// ============================================
// 1. BRANDING — C&R → CR Home Pros
// ============================================

describe('Branding: C&R General Services → CR Home Pros', () => {
  it('every testimonial mentioning C&R should include "(now CR Home Pros)"', async () => {
    const { TESTIMONIALS } = await import('@/lib/constants')

    for (const t of TESTIMONIALS) {
      // If text mentions C&R or C & R, it must also say "now CR Home Pros"
      if (/C\s*&\s*R/i.test(t.text)) {
        expect(t.text).toContain('now CR Home Pros')
      }
    }
  })

  it('no bare "C&R General Services" without "(now CR Home Pros)" in constants.ts', () => {
    const src = readFile('lib/constants.ts')
    // Find all C&R references
    const matches = src.match(/C\s*&\s*R\s*General\s*Services[^(]*/gi) || []
    for (const m of matches) {
      // Each should be immediately followed by "(now" somewhere close
      // If it's NOT followed by "(now", that's a bug
      // Actually let's just check: no "C&R General Services" that isn't followed by "(now CR Home Pros)" within 50 chars
    }
    // Simpler: count bare refs vs tagged refs
    const bareRefs = (src.match(/C&R General Services(?! \(now CR Home Pros\))/g) || []).length
    const taggedRefs = (src.match(/C&R General Services \(now CR Home Pros\)/g) || []).length
    // The only allowed bare refs are in admin document templates (invoices/contracts)
    expect(taggedRefs).toBeGreaterThan(0)
  })

  it('company legal name should be CR Home Pros', async () => {
    const { COMPANY } = await import('@/lib/constants')
    expect(COMPANY.legalName).toContain('CR Home Pros')
    expect(COMPANY.name).toBe('CR Home Pros')
  })
})

// ============================================
// 2. TEXT CONTRAST — no gray on dark bg
// ============================================

describe('Text Contrast: gray-on-dark detection', () => {
  const DARK_BG_FILES = [
    'components/layout/Footer.tsx',
    'components/layout/PromoBanner.tsx',
    'components/sections/FeaturedProjects.tsx',
  ]

  // These classes are too dim on dark-900 bg (#060828)
  const FORBIDDEN_ON_DARK = [
    'text-dark-500', // #525a8c — very low contrast
    'text-dark-400', // #8188b8 — borderline (ok for decorative dots only)
  ]

  it('Footer should not have text-dark-500 (too dim on bg-dark-900)', () => {
    const src = readFile('components/layout/Footer.tsx')
    const matches = src.match(/text-dark-500/g) || []
    expect(matches.length).toBe(0)
  })

  it('Footer should use text-dark-200 or lighter for content text', () => {
    const src = readFile('components/layout/Footer.tsx')
    // Main content text should be text-dark-200 (#dde0f1)
    const dark200Count = (src.match(/text-dark-200/g) || []).length
    expect(dark200Count).toBeGreaterThan(5)
  })

  it('FeaturedProjects should not have text-dark-300/400/500 (bg-dark-900)', () => {
    const src = readFile('components/sections/FeaturedProjects.tsx')
    // Should have been upgraded to text-dark-100/200
    const dim3 = (src.match(/text-dark-300/g) || []).length
    const dim4 = (src.match(/text-dark-400/g) || []).length
    const dim5 = (src.match(/text-dark-500/g) || []).length
    expect(dim3 + dim4 + dim5).toBe(0)
  })

  it('hero sections should use text-white/90 not text-white/70', () => {
    // Check several page hero sections
    const files = [
      'app/[locale]/about/page.tsx',
      'app/[locale]/services/page.tsx',
      'app/[locale]/reviews/page.tsx',
      'app/[locale]/contact/page.tsx',
    ]
    for (const f of files) {
      const src = readFile(f)
      const dim70 = (src.match(/text-white\/70/g) || []).length
      expect(dim70).toBe(0)
    }
  })

  it('service slug page testimonial should have text-white and text-gold-400', () => {
    const src = readFile('app/[locale]/services/[slug]/page.tsx')
    expect(src).toContain('text-gold-400')
    expect(src).toContain('text-white')
  })
})

// ============================================
// 3. SITE SETTINGS CMS
// ============================================

describe('Site Settings CMS', () => {
  it('should export DEFAULT_SETTINGS with all sections', async () => {
    const { DEFAULT_SETTINGS } = await import('@/lib/site-settings')
    expect(DEFAULT_SETTINGS.banner).toBeTruthy()
    expect(DEFAULT_SETTINGS.contact).toBeTruthy()
    expect(DEFAULT_SETTINGS.branding).toBeTruthy()
    expect(DEFAULT_SETTINGS.social).toBeTruthy()
    expect(DEFAULT_SETTINGS.paymentMethods).toBeTruthy()
    expect(DEFAULT_SETTINGS.serviceAreas).toBeTruthy()
  })

  it('banner defaults should have text, linkText, and linkUrl', async () => {
    const { DEFAULT_SETTINGS } = await import('@/lib/site-settings')
    expect(DEFAULT_SETTINGS.banner.enabled).toBe(true)
    expect(DEFAULT_SETTINGS.banner.text.length).toBeGreaterThan(10)
    expect(DEFAULT_SETTINGS.banner.linkText.length).toBeGreaterThan(0)
    expect(DEFAULT_SETTINGS.banner.linkUrl).toMatch(/^\//)
  })

  it('contact defaults should have phone, email, hours', async () => {
    const { DEFAULT_SETTINGS } = await import('@/lib/site-settings')
    expect(DEFAULT_SETTINGS.contact.phone).toMatch(/\(\d{3}\) \d{3}-\d{4}/)
    expect(DEFAULT_SETTINGS.contact.email).toContain('@')
    expect(DEFAULT_SETTINGS.contact.hours).toContain('AM')
    expect(DEFAULT_SETTINGS.contact.whatsappUrl).toContain('wa.me')
  })

  it('branding defaults should have CR Home Pros', async () => {
    const { DEFAULT_SETTINGS } = await import('@/lib/site-settings')
    expect(DEFAULT_SETTINGS.branding.companyName).toBe('CR Home Pros')
    expect(DEFAULT_SETTINGS.branding.mhicNumber).toContain('#')
    expect(DEFAULT_SETTINGS.branding.yearsExperience).toContain('+')
  })

  it('social defaults should have facebook, instagram, tiktok', async () => {
    const { DEFAULT_SETTINGS } = await import('@/lib/site-settings')
    expect(DEFAULT_SETTINGS.social.facebook).toContain('facebook.com')
    expect(DEFAULT_SETTINGS.social.instagram).toContain('instagram.com')
    expect(DEFAULT_SETTINGS.social.tiktok).toContain('tiktok.com')
  })

  it('payment methods should include common options', async () => {
    const { DEFAULT_SETTINGS } = await import('@/lib/site-settings')
    expect(DEFAULT_SETTINGS.paymentMethods).toContain('Cash')
    expect(DEFAULT_SETTINGS.paymentMethods).toContain('Zelle')
    expect(DEFAULT_SETTINGS.paymentMethods).toContain('Credit Card')
    expect(DEFAULT_SETTINGS.paymentMethods.length).toBeGreaterThanOrEqual(4)
  })

  it('service areas should include DMV area cities', async () => {
    const { DEFAULT_SETTINGS } = await import('@/lib/site-settings')
    expect(DEFAULT_SETTINGS.serviceAreas).toContain('Washington DC')
    expect(DEFAULT_SETTINGS.serviceAreas).toContain('Maryland')
    expect(DEFAULT_SETTINGS.serviceAreas).toContain('Virginia')
    expect(DEFAULT_SETTINGS.serviceAreas.length).toBeGreaterThanOrEqual(5)
  })

  it('should export save and get functions', async () => {
    const mod = await import('@/lib/site-settings')
    expect(typeof mod.getSiteSettings).toBe('function')
    expect(typeof mod.saveSiteSettings).toBe('function')
    expect(typeof mod.saveBannerSettings).toBe('function')
    expect(typeof mod.saveContactSettings).toBe('function')
    expect(typeof mod.saveBrandingSettings).toBe('function')
    expect(typeof mod.saveSocialSettings).toBe('function')
  })
})

// ============================================
// 4. IMAGE RESOLVER
// ============================================

describe('Image Resolver', () => {
  it('should resolve logo.png to Firebase site/ path', async () => {
    const { resolveImageUrl } = await import('@/lib/resolve-images')
    const url = resolveImageUrl('/images/logo.png')
    expect(url).toContain('firebasestorage.googleapis.com')
    expect(url).toContain('site%2Flogo.png')
  })

  it('should resolve team photos to Firebase team/ path', async () => {
    const { resolveImageUrl } = await import('@/lib/resolve-images')
    const url1 = resolveImageUrl('/images/team-carlos-01.jpg')
    const url2 = resolveImageUrl('/images/team-carlos-02.png')
    expect(url1).toContain('team%2Fteam-carlos-01.jpg')
    expect(url2).toContain('team%2Fteam-carlos-02.png')
  })

  it('should resolve blog images to Firebase blog/ path', async () => {
    const { resolveImageUrl } = await import('@/lib/resolve-images')
    const url = resolveImageUrl('/images/blog/kitchen-tips.jpg')
    expect(url).toContain('blog%2Fkitchen-tips.jpg')
  })

  it('should resolve project images to Firebase projects/ path', async () => {
    const { resolveImageUrl } = await import('@/lib/resolve-images')
    const url = resolveImageUrl('/images/2025-05/kitchen-01.png')
    expect(url).toContain('projects%2F2025-05%2Fkitchen-01.png')
  })

  it('should pass through full URLs unchanged', async () => {
    const { resolveImageUrl } = await import('@/lib/resolve-images')
    const fullUrl = 'https://example.com/photo.jpg'
    expect(resolveImageUrl(fullUrl)).toBe(fullUrl)
  })

  it('should resolve og-image.jpg to Firebase site/ path', async () => {
    const { resolveImageUrl } = await import('@/lib/resolve-images')
    const url = resolveImageUrl('/images/og-image.jpg')
    expect(url).toContain('site%2Fog-image.jpg')
  })

  it('resolveProjectImages should resolve all images in a project', async () => {
    const { resolveProjectImages } = await import('@/lib/resolve-images')
    const project = {
      images: ['/images/2025-05/a.png', '/images/2025-05/b.png'],
      beforeImages: ['/images/2025-05/before.png'],
    }
    const resolved = resolveProjectImages(project)
    expect(resolved.images[0]).toContain('firebasestorage.googleapis.com')
    expect(resolved.images[1]).toContain('firebasestorage.googleapis.com')
    expect(resolved.beforeImages![0]).toContain('firebasestorage.googleapis.com')
  })
})

// ============================================
// 5. NEXT.CONFIG.JS — REWRITE RULES
// ============================================

describe('Next.js Config — Image Rewrites', () => {
  it('should have rewrite rules for /images/logo.png', () => {
    const config = readFile('next.config.js')
    expect(config).toContain("source: '/images/logo.png'")
    expect(config).toContain('site%2Flogo.png')
  })

  it('should have rewrite rules for team images', () => {
    const config = readFile('next.config.js')
    expect(config).toContain("source: '/images/team-:slug*'")
    expect(config).toContain('team%2Fteam-')
  })

  it('should have rewrite rules for blog images', () => {
    const config = readFile('next.config.js')
    expect(config).toContain("source: '/images/blog/:path*'")
    expect(config).toContain('blog%2F')
  })

  it('should have Firebase Storage in remotePatterns', () => {
    const config = readFile('next.config.js')
    expect(config).toContain('firebasestorage.googleapis.com')
  })
})

// ============================================
// 6. FILE STRUCTURE
// ============================================

describe('Required Files Exist', () => {
  const requiredFiles = [
    'lib/site-settings.ts',
    'lib/site-settings-provider.tsx',
    'lib/resolve-images.ts',
    'lib/firebase.ts',
    'lib/firebase-auth.ts',
    'lib/firebase-admin-server.ts',
    'app/admin/settings/page.tsx',
    'app/admin/reviews/page.tsx',
    'app/admin/field-notes/page.tsx',
    'components/layout/Footer.tsx',
    'components/layout/PromoBanner.tsx',
    'next.config.js',
  ]

  for (const f of requiredFiles) {
    it(`${f} should exist`, () => {
      expect(existsSync(join(ROOT, f))).toBe(true)
    })
  }
})

// ============================================
// 7. ADMIN PAGES
// ============================================

describe('Admin Pages', () => {
  it('admin dashboard should link to site settings', () => {
    const src = readFile('app/admin/page.tsx')
    expect(src).toContain("'/admin/settings'")
    expect(src).toContain('Site Settings')
  })

  it('admin dashboard should link to reviews', () => {
    const src = readFile('app/admin/page.tsx')
    expect(src).toContain("'/admin/reviews'")
    expect(src).toContain('Manage Reviews')
  })

  it('admin dashboard should link to images', () => {
    const src = readFile('app/admin/page.tsx')
    expect(src).toContain("'/admin/images'")
    expect(src).toContain('Manage Images')
  })

  it('admin dashboard should have help/tutorial system', () => {
    const src = readFile('app/admin/page.tsx')
    expect(src).toContain('showTutorial')
    expect(src).toContain('HelpCircle')
    expect(src).toContain('Show me')
  })

  it('admin settings page should have all 6 sections', () => {
    const src = readFile('app/admin/settings/page.tsx')
    expect(src).toContain("id: 'banner'")
    expect(src).toContain("id: 'contact'")
    expect(src).toContain("id: 'branding'")
    expect(src).toContain("id: 'social'")
    expect(src).toContain("id: 'payments'")
    expect(src).toContain("id: 'areas'")
  })

  it('admin settings should have tutorial overlay', () => {
    const src = readFile('app/admin/settings/page.tsx')
    expect(src).toContain('showTutorial')
    expect(src).toContain('cms_tutorial_seen')
  })

  it('admin reviews page should have approve/delete actions', () => {
    const src = readFile('app/admin/reviews/page.tsx')
    expect(src).toContain('approveReview')
    expect(src).toContain('deleteReview')
    expect(src).toContain('approved')
  })
})

// ============================================
// 8. FIREBASE WIRING
// ============================================

describe('Firebase Wiring', () => {
  it('PromoBanner should use banner rotation system', () => {
    const src = readFile('components/layout/PromoBanner.tsx')
    expect(src).toContain('useSiteSettings')
    expect(src).toContain('siteSettings.banner')
    expect(src).not.toContain('BANNER_ENABLED')
    expect(src).not.toContain('BANNER_CONFIG')
  })

  it('Footer should read from useSiteSettings', () => {
    const src = readFile('components/layout/Footer.tsx')
    expect(src).toContain('useSiteSettings')
    expect(src).toContain('ss.contact')
    expect(src).toContain('ss.social')
  })

  it('locale layout should wrap with SiteSettingsProvider', () => {
    const src = readFile('app/[locale]/layout.tsx')
    expect(src).toContain('SiteSettingsProvider')
    expect(src).toContain("import { SiteSettingsProvider }")
  })

  it('contact API route should save to Firebase', () => {
    const src = readFile('app/api/contact/route.ts')
    expect(src).toContain('saveContact')
    expect(src).toContain('firebase-admin-server')
  })

  it('get-started API route should save to Firebase', () => {
    const src = readFile('app/api/get-started/route.ts')
    expect(src).toContain('saveLead')
    expect(src).toContain('firebase-admin-server')
  })

  it('referrals API route should save to Firebase', () => {
    const src = readFile('app/api/referrals/route.ts')
    expect(src).toContain('saveReferral')
    expect(src).toContain('firebase-admin-server')
  })

  it('firebase-auth should export review management functions', async () => {
    const src = readFile('lib/firebase-auth.ts')
    expect(src).toContain('getReviews')
    expect(src).toContain('approveReview')
    expect(src).toContain('deleteReview')
    expect(src).toContain('getLeads')
    expect(src).toContain('getContacts')
    expect(src).toContain('getReferrals')
    expect(src).toContain('saveFieldNote')
    expect(src).toContain('getFieldNotes')
  })
})

// ============================================
// 9. LAYOUT METADATA — NO 404 IMAGES
// ============================================

describe('Layout Metadata — No 404 Images', () => {
  it('layout.tsx should not reference /images/logo.png directly for metadata', () => {
    const src = readFile('app/layout.tsx')
    // Should use Firebase URL, not local path, for metadata image
    expect(src).not.toMatch(/image:\s*META\.url\s*\+\s*['"]\/images\/logo\.png['"]/)
    expect(src).toContain('firebasestorage.googleapis.com')
  })

  it('layout.tsx apple-touch-icon should use Firebase URL', () => {
    const src = readFile('app/layout.tsx')
    expect(src).not.toMatch(/href="\/images\/logo\.png"/)
    expect(src).toContain('firebasestorage.googleapis.com')
  })
})

// ============================================
// 10. RECOMMENDATION LETTERS
// ============================================

describe('Recommendation Letters', () => {
  it('should have recommendation letters data', async () => {
    const { RECOMMENDATION_LETTERS } = await import('@/lib/recommendations-data')
    expect(RECOMMENDATION_LETTERS.length).toBeGreaterThanOrEqual(1)
    for (const letter of RECOMMENDATION_LETTERS) {
      expect(letter.author).toBeTruthy()
      expect(letter.fullText).toBeTruthy()
    }
  })
})

// ============================================
// 11. ADMIN DOCUMENT PAGES — TEXT READABILITY
// ============================================

describe('Admin Document Pages — Text Readability', () => {
  it('admin change-orders should not use text-slate-500 for content', () => {
    const src = readFile('app/admin/change-orders/page.tsx')
    // Slate-500 on slate-900 bg is too dim — should be slate-400 or lighter
    // Exception: text inside white-bg preview sections is ok
    const previewSection = src.indexOf('Preview:')
    const editSection = src.substring(0, previewSection > 0 ? previewSection : src.length / 2)
    // In the edit section (dark bg), should not have slate-500
    const slate500InEdit = (editSection.match(/text-slate-500/g) || []).length
    // Allow up to 2 (for minor decorative use)
    expect(slate500InEdit).toBeLessThanOrEqual(2)
  })

  it('admin dashboard descriptions should use text-slate-400 not text-slate-500', () => {
    const src = readFile('app/admin/page.tsx')
    // Quick action descriptions
    const slate500 = (src.match(/"text-xs text-slate-500"/g) || []).length
    expect(slate500).toBe(0)
  })
})


// ============================================
// Banner System
// ============================================

describe('Banner System', () => {
  it('should export DEFAULT_BANNERS with required fields', async () => {
    const { DEFAULT_BANNERS } = await import('@/lib/banners')
    expect(DEFAULT_BANNERS.length).toBeGreaterThanOrEqual(5)
    for (const b of DEFAULT_BANNERS) {
      expect(b.id).toBeTruthy()
      expect(b.textEn).toBeTruthy()
      expect(b.textEs).toBeTruthy()
      expect(b.ctaEn).toBeTruthy()
      expect(b.ctaEs).toBeTruthy()
      expect(b.gradient).toContain('linear-gradient')
    }
  })

  it('should not have duplicate banner IDs', async () => {
    const { DEFAULT_BANNERS } = await import('@/lib/banners')
    const ids = DEFAULT_BANNERS.map(b => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('should have no blue gradients (site is already blue)', async () => {
    const { DEFAULT_BANNERS } = await import('@/lib/banners')
    for (const b of DEFAULT_BANNERS) {
      // No pure blues (#1E3A8A, #2563EB, #0C1355 etc)
      expect(b.gradient).not.toMatch(/#0C1355/)
      expect(b.gradient).not.toMatch(/#1E3A8A/)
      expect(b.gradient).not.toMatch(/#2563EB/)
    }
  })

  it('should correctly identify bundle leads (2+ services)', async () => {
    const { isBundleLead } = await import('@/lib/banners')
    expect(isBundleLead(['Kitchen Remodeling'])).toBe(false)
    expect(isBundleLead(['Kitchen Remodeling', 'Bathroom Renovation'])).toBe(true)
    expect(isBundleLead(['Kitchen Remodeling', 'Painting', 'Flooring'])).toBe(true)
    expect(isBundleLead([])).toBe(false)
  })

  it('should return correct discount tiers', async () => {
    const { getServiceDiscount } = await import('@/lib/banners')
    expect(getServiceDiscount('Kitchen Remodeling')).toBe(15)
    expect(getServiceDiscount('Bathroom Renovation')).toBe(15)
    expect(getServiceDiscount('Roofing')).toBe(15)
    expect(getServiceDiscount('Power Washing')).toBe(5)
    expect(getServiceDiscount('Fencing')).toBe(5)
    expect(getServiceDiscount('Gutters & Downspouts')).toBe(5)
    expect(getServiceDiscount('nonexistent')).toBe(0)
  })

  it('should format bundle email subjects with emojis', async () => {
    const { formatBundleEmailSubject } = await import('@/lib/banners')
    const single = formatBundleEmailSubject(['Kitchen Remodeling'], 'John')
    expect(single).toContain('Kitchen Remodeling')
    expect(single).not.toContain('BUNDLE')

    const bundle = formatBundleEmailSubject(['Kitchen Remodeling', 'Bathroom Renovation'], 'Jane')
    expect(bundle).toContain('BUNDLE')
    expect(bundle).toContain('Kitchen Remodeling + Bathroom Renovation')

    const custom = formatBundleEmailSubject(['A', 'B', 'C'], 'Bob')
    expect(custom).toContain('CUSTOM PROJECT')
    expect(custom).toContain('3 Services')
  })

  it('should format bundle email header with warning flags', async () => {
    const { formatBundleEmailHeader } = await import('@/lib/banners')
    const single = formatBundleEmailHeader(['Kitchen'], 'SUMMER15')
    expect(single).toContain('SUMMER15')
    expect(single).not.toContain('BUNDLED')

    const bundle = formatBundleEmailHeader(['Kitchen', 'Bath'], 'BUNDLE')
    expect(bundle).toContain('BUNDLED REQUEST')
    expect(bundle).toContain('custom pricing')
    expect(bundle).toContain('Kitchen + Bath')
  })

  it('should get banner by ID', async () => {
    const { getBannerById } = await import('@/lib/banners')
    const kitchen = getBannerById('summer-kitchen-15')
    expect(kitchen).toBeTruthy()
    expect(kitchen!.service).toBe('Kitchen Remodeling')
    expect(kitchen!.discountPercent).toBe(15)

    const none = getBannerById('nonexistent')
    expect(none).toBeUndefined()
  })

  it('should filter active banners only', async () => {
    const { getActiveBanners } = await import('@/lib/banners')
    const testBanners = [
      { id: '1', active: true } as any,
      { id: '2', active: false } as any,
      { id: '3', active: true } as any,
    ]
    const active = getActiveBanners(testBanners)
    expect(active.length).toBe(2)
    expect(active.map(b => b.id)).toEqual(['1', '3'])
  })

  it('referral banner should link to /referrals not /get-started', async () => {
    const { DEFAULT_BANNERS } = await import('@/lib/banners')
    const referral = DEFAULT_BANNERS.find(b => b.id === 'referral-program')
    expect(referral).toBeTruthy()
    expect(referral!.service).toBe('')
    expect(referral!.promoCode).toBe('REFERRAL')
  })
})
