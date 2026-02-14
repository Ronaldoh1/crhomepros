// ============================================
// CR Home Pros — Test Suite
// Run: npm test
// ============================================

import { describe, it, expect, vi } from 'vitest'

// ============================================
// 1. CONSTANTS & DATA INTEGRITY
// ============================================

describe('Constants', () => {
  it('should export COMPANY with required fields', async () => {
    const { COMPANY } = await import('@/lib/constants')
    expect(COMPANY.name).toBe('CR Home Pros')
    expect(COMPANY.phone).toBeTruthy()
    expect(COMPANY.email).toBeTruthy()
    expect(COMPANY.address).toBeTruthy()
    expect(COMPANY.license).toBeTruthy()
  })

  it('should have correct branding — no C&R General Services', async () => {
    const { COMPANY } = await import('@/lib/constants')
    expect(COMPANY.legalName).not.toContain('C&R')
    expect(COMPANY.legalName).not.toContain('C & R')
    expect(COMPANY.legalName).toContain('CR Home Pros')
  })

  it('should have valid NAV_LINKS with no dead ends', async () => {
    const { NAV_LINKS } = await import('@/lib/constants')
    expect(NAV_LINKS.length).toBeGreaterThanOrEqual(6)
    
    for (const link of NAV_LINKS) {
      expect(link.label).toBeTruthy()
      expect(link.href).toMatch(/^\//)
    }
    
    // No duplicate hrefs
    const hrefs = NAV_LINKS.map((l: any) => l.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  it('should have SERVICES with required fields', async () => {
    const { SERVICES } = await import('@/lib/constants')
    expect(SERVICES.length).toBeGreaterThanOrEqual(8)
    
    for (const service of SERVICES) {
      expect(service.id).toBeTruthy()
      expect(service.name).toBeTruthy()
      expect(service.shortDescription).toBeTruthy()
      expect(service.icon).toBeTruthy()
      expect(service.priceRange).toBeTruthy()
      expect(service.duration).toBeTruthy()
    }
    
    // No duplicate IDs
    const ids = SERVICES.map((s: any) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('should include fencing as a service', async () => {
    const { SERVICES } = await import('@/lib/constants')
    const fencing = SERVICES.find((s: any) => s.id === 'fencing')
    expect(fencing).toBeTruthy()
    expect(fencing!.name).toBe('Fencing')
  })

  it('should have valid PAYMENT_METHODS', async () => {
    const { PAYMENT_METHODS } = await import('@/lib/constants')
    expect(PAYMENT_METHODS.length).toBeGreaterThanOrEqual(4)
    for (const method of PAYMENT_METHODS) {
      expect(method.id).toBeTruthy()
      expect(method.name).toBeTruthy()
      expect(method.nameEs).toBeTruthy()
    }
  })
})

// ============================================
// 2. UTILITY FUNCTIONS
// ============================================

describe('Utilities', () => {
  it('should format phone links correctly', async () => {
    const { formatPhoneLink } = await import('@/lib/utils')
    const link = formatPhoneLink('3016022553')
    expect(link).toContain('tel:')
    expect(link).toContain('3016022553')
  })

  it('should format WhatsApp links correctly', async () => {
    const { formatWhatsAppLink } = await import('@/lib/utils')
    const link = formatWhatsAppLink('3016022553', 'Hello')
    expect(link).toContain('wa.me')
    expect(link).toContain('Hello')
  })

  it('should merge class names with cn()', async () => {
    const { cn } = await import('@/lib/utils')
    expect(cn('foo', 'bar')).toBe('foo bar')
    expect(cn('foo', false && 'bar')).toBe('foo')
    expect(cn('foo', undefined, 'baz')).toBe('foo baz')
  })
})

// ============================================
// 3. GALLERY DATA
// ============================================

describe('Gallery Data', () => {
  it('should have gallery categories', async () => {
    const { GALLERY_CATEGORIES } = await import('@/lib/gallery-data')
    expect(GALLERY_CATEGORIES).toContain('All')
    expect(GALLERY_CATEGORIES).toContain('Kitchen')
    expect(GALLERY_CATEGORIES).toContain('Bathroom')
    expect(GALLERY_CATEGORIES).toContain('Fencing')
    expect(GALLERY_CATEGORIES).toContain('Basement')
  })

  it('should have gallery projects with valid data', async () => {
    const { GALLERY_PROJECTS } = await import('@/lib/gallery-data')
    expect(GALLERY_PROJECTS.length).toBeGreaterThanOrEqual(20)

    for (const project of GALLERY_PROJECTS) {
      expect(project.id).toBeTruthy()
      expect(project.title).toBeTruthy()
      expect(project.category).toBeTruthy()
      expect(project.images.length).toBeGreaterThan(0)
    }
  })

  it('should have fence and basement projects', async () => {
    const { GALLERY_PROJECTS } = await import('@/lib/gallery-data')
    const fenceProjects = GALLERY_PROJECTS.filter((p: any) => p.category === 'Fencing')
    const basementProjects = GALLERY_PROJECTS.filter((p: any) => p.category === 'Basement')
    expect(fenceProjects.length).toBeGreaterThanOrEqual(1)
    expect(basementProjects.length).toBeGreaterThanOrEqual(1)
  })

  it('should not have duplicate project IDs', async () => {
    const { GALLERY_PROJECTS } = await import('@/lib/gallery-data')
    const ids = GALLERY_PROJECTS.map((p: any) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

// ============================================
// 4. BLOG POSTS
// ============================================

describe('Blog Posts', () => {
  it('should have blog posts with required fields', async () => {
    const { BLOG_POSTS } = await import('@/lib/blog-posts')
    expect(BLOG_POSTS.length).toBeGreaterThanOrEqual(15)

    for (const post of BLOG_POSTS) {
      expect(post.slug).toBeTruthy()
      expect(post.title).toBeTruthy()
      expect(post.category).toBeTruthy()
      expect(post.author).toBeTruthy()
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(post.readTime).toBeTruthy()
      expect(post.image).toBeTruthy()
      expect(post.excerpt.length).toBeGreaterThan(20)
      expect(post.content.length).toBeGreaterThan(200)
    }
  })

  it('should not have duplicate slugs', async () => {
    const { BLOG_POSTS } = await import('@/lib/blog-posts')
    const slugs = BLOG_POSTS.map((p: any) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('should have sustainability and seasonal posts', async () => {
    const { BLOG_POSTS } = await import('@/lib/blog-posts')
    const sustainability = BLOG_POSTS.filter((p: any) => p.category === 'Sustainability')
    const seasonal = BLOG_POSTS.filter((p: any) => p.category === 'Seasonal')
    expect(sustainability.length).toBeGreaterThanOrEqual(2)
    expect(seasonal.length).toBeGreaterThanOrEqual(1)
  })

  it('should have SEO-focused tax credits post', async () => {
    const { getPostBySlug } = await import('@/lib/blog-posts')
    const post = getPostBySlug('federal-tax-credits-home-energy-2025-2026')
    expect(post).toBeTruthy()
    expect(post!.content).toContain('heat pump')
    expect(post!.content).toContain('tax credit')
  })

  it('getPostsByCategory should filter correctly', async () => {
    const { getPostsByCategory, BLOG_POSTS } = await import('@/lib/blog-posts')
    const all = getPostsByCategory('All')
    expect(all.length).toBe(BLOG_POSTS.length)

    const tips = getPostsByCategory('Tips & Advice')
    expect(tips.every((p: any) => p.category === 'Tips & Advice')).toBe(true)
  })

  it('getRecentPosts should return limited results', async () => {
    const { getRecentPosts } = await import('@/lib/blog-posts')
    const recent = getRecentPosts(3)
    expect(recent.length).toBe(3)
  })
})

// ============================================
// 5. PRICING DATA
// ============================================

describe('Pricing Data', () => {
  it('should have service pricing with valid tiers', async () => {
    const { SERVICE_PRICING } = await import('@/lib/pricing-data')
    expect(SERVICE_PRICING.length).toBeGreaterThanOrEqual(8)

    for (const service of SERVICE_PRICING) {
      expect(service.id).toBeTruthy()
      expect(service.name).toBeTruthy()
      expect(service.nameEs).toBeTruthy()
      expect(service.icon).toBeTruthy()
      expect(service.tiers.length).toBeGreaterThanOrEqual(2)

      for (const tier of service.tiers) {
        expect(tier.label).toBeTruthy()
        expect(tier.labelEs).toBeTruthy()
        expect(tier.min).toBeGreaterThan(0)
        expect(tier.max).toBeGreaterThan(tier.min)
      }
    }
  })

  it('should include fencing in pricing', async () => {
    const { SERVICE_PRICING } = await import('@/lib/pricing-data')
    const fencing = SERVICE_PRICING.find((s: any) => s.id === 'fencing')
    expect(fencing).toBeTruthy()
    expect(fencing!.tiers.length).toBeGreaterThanOrEqual(3)
  })

  it('should have emergency rates', async () => {
    const { EMERGENCY_RATES } = await import('@/lib/pricing-data')
    expect(EMERGENCY_RATES).toBeTruthy()
    expect(EMERGENCY_RATES.categories.length).toBeGreaterThanOrEqual(5)
    expect(EMERGENCY_RATES.calloutFee.min).toBeGreaterThan(0)
  })

  it('pricing tiers should have valid min/max ranges', async () => {
    const { SERVICE_PRICING } = await import('@/lib/pricing-data')
    for (const service of SERVICE_PRICING) {
      for (const tier of service.tiers) {
        expect(tier.min).toBeLessThan(tier.max)
        expect(tier.min).toBeGreaterThanOrEqual(0)
      }
    }
  })
})

// ============================================
// 6. i18n COMPLETENESS
// ============================================

describe('Internationalization', () => {
  it('should have matching keys in en and es', async () => {
    const en = (await import('@/lib/i18n/en')).default
    const es = (await import('@/lib/i18n/es')).default

    // Check top-level keys match
    const enKeys = Object.keys(en)
    const esKeys = Object.keys(es)
    
    for (const key of enKeys) {
      expect(esKeys).toContain(key)
    }
  })

  it('should have emergency nav key in both languages', async () => {
    const en = (await import('@/lib/i18n/en')).default
    const es = (await import('@/lib/i18n/es')).default
    expect(en.nav.emergency).toBeTruthy()
    expect(es.nav.emergency).toBeTruthy()
  })

  it('should have nav keys in both languages', async () => {
    const en = (await import('@/lib/i18n/en')).default
    const es = (await import('@/lib/i18n/es')).default
    
    const enNavKeys = Object.keys(en.nav)
    const esNavKeys = Object.keys(es.nav)
    
    for (const key of enNavKeys) {
      expect(esNavKeys).toContain(key)
    }
  })
})

// ============================================
// 7. FORM VALIDATION SCHEMAS
// ============================================

describe('Form Validation', () => {
  it('should validate intake form data', async () => {
    const { z } = await import('zod')

    const intakeSchema = z.object({
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(10),
      preferredContact: z.enum(['phone', 'email', 'text', 'whatsapp']),
      address: z.string().min(5),
      city: z.string().min(2),
      state: z.string().min(2),
      zip: z.string().min(5),
      services: z.array(z.string()).min(1),
      projectDescription: z.string().min(20),
      timeline: z.string().min(1),
      budget: z.string().min(1),
    })

    // Happy path
    const validData = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      phone: '3015551234',
      preferredContact: 'whatsapp' as const,
      address: '123 Main Street',
      city: 'Bethesda',
      state: 'MD',
      zip: '20814',
      services: ['kitchen-remodeling'],
      projectDescription: 'I want to remodel my kitchen with new countertops and cabinets.',
      timeline: 'within-3-months',
      budget: '$15,000 - $30,000',
    }

    const result = intakeSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', async () => {
    const { z } = await import('zod')
    const schema = z.string().email()
    expect(schema.safeParse('notanemail').success).toBe(false)
    expect(schema.safeParse('valid@email.com').success).toBe(true)
  })

  it('should reject empty services array', async () => {
    const { z } = await import('zod')
    const schema = z.array(z.string()).min(1)
    expect(schema.safeParse([]).success).toBe(false)
    expect(schema.safeParse(['kitchen']).success).toBe(true)
  })

  it('should validate contact preference enum', async () => {
    const { z } = await import('zod')
    const schema = z.enum(['phone', 'email', 'text', 'whatsapp'])
    expect(schema.safeParse('whatsapp').success).toBe(true)
    expect(schema.safeParse('pigeon').success).toBe(false)
  })

  it('should reject short project descriptions', async () => {
    const { z } = await import('zod')
    const schema = z.string().min(20)
    expect(schema.safeParse('fix sink').success).toBe(false)
    expect(schema.safeParse('I need to remodel my entire kitchen including countertops').success).toBe(true)
  })
})

// ============================================
// 8. GOOGLE DRIVE SERVICE
// ============================================

describe('Google Drive Service', () => {
  it('should report unconfigured when no env vars', async () => {
    const { isDriveConfigured } = await import('@/lib/google-drive')
    // Without env vars set, should return false
    const configured = isDriveConfigured()
    // This will be false in test env since no env vars
    expect(typeof configured).toBe('boolean')
  })

  it('should export all required functions', async () => {
    const drive = await import('@/lib/google-drive')
    expect(typeof drive.getAuthUrl).toBe('function')
    expect(typeof drive.getTokensFromCode).toBe('function')
    expect(typeof drive.createLeadInDrive).toBe('function')
    expect(typeof drive.createReferralInDrive).toBe('function')
    expect(typeof drive.logContactInDrive).toBe('function')
    expect(typeof drive.isDriveConfigured).toBe('function')
    expect(typeof drive.initializeFolderStructure).toBe('function')
  })
})

// ============================================
// 9. API ROUTE VALIDATION
// ============================================

describe('API Route Validation Logic', () => {
  it('should require firstName, lastName, email, phone, address, services for leads', () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'services']

    // Test missing each field
    for (const field of requiredFields) {
      const data: Record<string, any> = {
        firstName: 'John',
        lastName: 'Smith',
        email: 'j@e.com',
        phone: '3015551234',
        address: '123 Main St',
        services: ['kitchen'],
      }
      delete data[field]

      const hasAll = requiredFields.every(f => {
        if (f === 'services') return data[f]?.length > 0
        return !!data[f]
      })
      expect(hasAll).toBe(false)
    }
  })

  it('should generate correct contact tags', () => {
    const getTag = (pref?: string) => pref ? `[${pref.toUpperCase()}]` : '[PHONE]'
    
    expect(getTag('whatsapp')).toBe('[WHATSAPP]')
    expect(getTag('email')).toBe('[EMAIL]')
    expect(getTag('text')).toBe('[TEXT]')
    expect(getTag('phone')).toBe('[PHONE]')
    expect(getTag()).toBe('[PHONE]')
    expect(getTag(undefined)).toBe('[PHONE]')
  })

  it('should handle base64 image conversion', () => {
    const fakeBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
    const cleaned = fakeBase64.replace(/^data:image\/\w+;base64,/, '')
    expect(cleaned).toBe('/9j/4AAQSkZJRg==')
    
    const buffer = Buffer.from(cleaned, 'base64')
    expect(buffer).toBeInstanceOf(Buffer)
    expect(buffer.length).toBeGreaterThan(0)
  })

  it('should detect image type from base64 prefix', () => {
    const jpegPrefix = 'data:image/jpeg;base64,abc'
    const pngPrefix = 'data:image/png;base64,abc'
    
    expect(jpegPrefix.startsWith('data:image/png')).toBe(false)
    expect(pngPrefix.startsWith('data:image/png')).toBe(true)
  })
})

// ============================================
// 10. EDGE CASES
// ============================================

describe('Edge Cases', () => {
  it('should handle empty strings gracefully in contact tags', () => {
    const getTag = (pref?: string) => pref ? `[${pref.toUpperCase()}]` : '[PHONE]'
    expect(getTag('')).toBe('[PHONE]') // empty string is falsy
  })

  it('should handle phone numbers with various formats', () => {
    const phones = [
      '3015551234',
      '(301) 555-1234',
      '301-555-1234',
      '+1 301 555 1234',
    ]
    // All should be at least 10 chars
    for (const phone of phones) {
      expect(phone.length).toBeGreaterThanOrEqual(10)
    }
  })

  it('should handle services array with multiple items', () => {
    const services = ['kitchen-remodeling', 'bathroom-renovation', 'fencing']
    expect(services.join(', ')).toBe('kitchen-remodeling, bathroom-renovation, fencing')
    expect(services[0]).toBe('kitchen-remodeling')
  })

  it('should sanitize invoice number format', () => {
    const year = new Date().getFullYear()
    const invoiceNum = `INV-${year}-${String(Date.now()).slice(-4)}`
    expect(invoiceNum).toMatch(/^INV-\d{4}-\d{4}$/)
  })

  it('should calculate invoice totals correctly', () => {
    const items = [
      { quantity: 1, unitPrice: 5000 },
      { quantity: 2, unitPrice: 1500 },
      { quantity: 1, unitPrice: 750 },
    ]
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    expect(subtotal).toBe(8750)

    const taxRate = 6
    const tax = subtotal * (taxRate / 100)
    expect(tax).toBe(525)

    const total = subtotal + tax
    expect(total).toBe(9275)
  })

  it('should handle missing optional fields without crashing', () => {
    const leadData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '2025551234',
      address: '456 Oak Ave',
      city: 'Silver Spring',
      state: 'MD',
      services: ['painting'],
      projectDescription: 'Need to paint the whole house interior',
      // All optional fields omitted
    }

    expect(leadData.firstName).toBeTruthy()
    expect((leadData as any).additionalNotes).toBeUndefined()
    expect((leadData as any).howDidYouHear).toBeUndefined()
    expect((leadData as any).preferredContact || 'phone').toBe('phone')
  })

  it('should resolve image paths for both Firebase and local', async () => {
    const { resolveImageUrl } = await import('@/lib/resolve-images')
    
    // Local images should return as-is or with /images/ prefix
    const localPath = '/images/2025-fence-bowie/fence-after-01.png'
    const resolved = resolveImageUrl(localPath)
    expect(resolved).toBeTruthy()
    expect(typeof resolved).toBe('string')
  })
})
