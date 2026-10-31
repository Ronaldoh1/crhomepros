import { getDb } from '@/lib/firebase'
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'

// ============================================
// Banner Configuration Types
// ============================================

export interface BannerConfig {
  id: string
  emoji: string
  textEn: string
  textEs: string
  ctaEn: string
  ctaEs: string
  gradient: string
  accentColor: string
  service: string
  discountPercent: number
  promoCode: string
  tier: 'big' | 'small' | 'bundle'
  active: boolean
  season: string
}

// ============================================
// Discount Tier System
// ============================================

export const DISCOUNT_TIERS: Record<string, number> = {
  big: 15,
  small: 5,
  bundle: 0,
}

export const SERVICE_TIERS: Record<string, 'big' | 'small'> = {
  'kitchen-remodeling': 'big',
  'Kitchen Remodeling': 'big',
  'bathroom-renovation': 'big',
  'Bathroom Renovation': 'big',
  'basement-finishing': 'big',
  'Basement Finishing': 'big',
  'roofing': 'big',
  'Roofing': 'big',
  'complete-renovations': 'big',
  'Complete Renovations': 'big',
  'deck-outdoor': 'big',
  'Decks & Outdoor Living': 'big',
  'concrete-driveways': 'big',
  'Concrete & Driveways': 'big',
  'power-washing': 'small',
  'Power Washing': 'small',
  'painting': 'small',
  'Interior & Exterior Painting': 'small',
  'flooring': 'small',
  'Flooring & Tiling': 'small',
  'fencing': 'small',
  'Fencing': 'small',
  'gutters-downspouts': 'small',
  'Gutters & Downspouts': 'small',
  'insurance-claims': 'small',
  'Insurance Claims': 'small',
}

// ============================================
// Default Banner Collection
// ============================================

export const DEFAULT_BANNERS: BannerConfig[] = [
  // Pre-winter season (Nov–Feb). Discounts and offers to be confirmed by Carlos.
  {
    id: 'winter-roof-gutter',
    emoji: '🍂',
    textEn: 'Leaves are down — FREE roof & gutter check before the first freeze',
    textEs: 'Ya cayeron las hojas — Revisión GRATIS de techo y canaletas antes de la primera helada',
    ctaEn: 'Schedule Now',
    ctaEs: 'Agendar Ahora',
    gradient: 'linear-gradient(135deg, #78350F, #92400E, #B45309)',
    accentColor: '#B45309',
    service: 'Roofing',
    discountPercent: 15,
    promoCode: 'WINTERROOF',
    tier: 'big',
    active: true,
    season: 'winter',
  },
  {
    id: 'winter-indoor-15',
    emoji: '❄️',
    textEn: 'Winter Special: 15% off indoor remodels — kitchens, baths & basements',
    textEs: 'Especial de Invierno: 15% en remodelaciones interiores — cocinas, baños y sótanos',
    ctaEn: 'Book Now',
    ctaEs: 'Reserve Ahora',
    gradient: 'linear-gradient(135deg, #0C4A6E, #075985, #0284C7)',
    accentColor: '#0284C7',
    service: 'Kitchen Remodeling',
    discountPercent: 15,
    promoCode: 'WINTER15',
    tier: 'big',
    active: true,
    season: 'winter',
  },
  {
    id: 'winter-basement-freeze',
    emoji: '🧊',
    textEn: 'Freeze and thaw is hard on basements — FREE moisture & crack check',
    textEs: 'Las heladas dañan los sótanos — Revisión GRATIS de humedad y grietas',
    ctaEn: 'Free Check',
    ctaEs: 'Revisión Gratis',
    gradient: 'linear-gradient(135deg, #1E293B, #334155, #475569)',
    accentColor: '#64748B',
    service: 'Basement Finishing',
    discountPercent: 15,
    promoCode: 'WINTERBASEMENT',
    tier: 'big',
    active: true,
    season: 'winter',
  },
  {
    id: 'winter-drafts',
    emoji: '🪟',
    textEn: 'Drafty doors and windows? Seal them before winter — lower heating bills',
    textEs: '¿Corrientes de aire en puertas y ventanas? Séllelas antes del invierno',
    ctaEn: 'Get a Quote',
    ctaEs: 'Pedir Cotización',
    gradient: 'linear-gradient(135deg, #134E4A, #115E59, #0F766E)',
    accentColor: '#0F766E',
    service: '',
    discountPercent: 0,
    promoCode: 'WINTERDRAFTS',
    tier: 'small',
    active: true,
    season: 'winter',
  },
  {
    id: 'winter-driveway-cracks',
    emoji: '🚗',
    textEn: 'Seal driveway cracks before ice makes them worse — Free estimate',
    textEs: 'Selle las grietas de su entrada antes de que el hielo las empeore — Estimado gratis',
    ctaEn: 'Get a Quote',
    ctaEs: 'Pedir Cotización',
    gradient: 'linear-gradient(135deg, #3F3F46, #52525B, #71717A)',
    accentColor: '#71717A',
    service: 'Concrete & Driveways',
    discountPercent: 0,
    promoCode: 'WINTERCONCRETE',
    tier: 'small',
    active: true,
    season: 'winter',
  },
  {
    id: 'referral-program',
    emoji: '🎉',
    textEn: 'Refer a friend and earn $100-$250 — No limit on referrals',
    textEs: 'Refiera a un amigo y gane $100-$250 — Sin limite de referidos',
    ctaEn: 'See Program',
    ctaEs: 'Ver Programa',
    gradient: 'linear-gradient(135deg, #5B21B6, #7C3AED, #8B5CF6)',
    accentColor: '#8B5CF6',
    service: '',
    discountPercent: 0,
    promoCode: 'REFERRAL',
    tier: 'bundle',
    active: true,
    season: 'always',
  },
  {
    id: 'bundle-savings',
    emoji: '💰',
    textEn: 'Need 2+ services? Bundle and save — Custom pricing available',
    textEs: 'Necesita 2+ servicios? Combine y ahorre — Precios especiales',
    ctaEn: 'Get Quote',
    ctaEs: 'Pedir Cotizacion',
    gradient: 'linear-gradient(135deg, #065F46, #047857, #10B981)',
    accentColor: '#10B981',
    service: '',
    discountPercent: 0,
    promoCode: 'BUNDLE',
    tier: 'bundle',
    active: true,
    season: 'always',
  },
]

// ============================================
// Helper Functions
// ============================================

export function isBundleLead(services: string[]): boolean {
  return services.length >= 2
}

export function getServiceDiscount(serviceId: string): number {
  const tier = SERVICE_TIERS[serviceId]
  if (!tier) return 0
  return DISCOUNT_TIERS[tier] || 0
}

export function getServiceTier(serviceId: string): 'big' | 'small' | null {
  return SERVICE_TIERS[serviceId] || null
}

export function getBannerById(id: string): BannerConfig | undefined {
  return DEFAULT_BANNERS.find(b => b.id === id)
}

export function getActiveBanners(banners?: BannerConfig[]): BannerConfig[] {
  return (banners || DEFAULT_BANNERS).filter(b => b.active)
}

// ============================================
// Firebase CRUD
// ============================================

export async function fetchBanners(): Promise<BannerConfig[]> {
  try {
    const db = getDb()
    if (!db) return DEFAULT_BANNERS.filter(b => b.active)
    const snap = await getDocs(collection(db, 'banners'))
    if (snap.empty) return DEFAULT_BANNERS.filter(b => b.active)
    const banners: BannerConfig[] = []
    snap.forEach(d => {
      const data = d.data() as BannerConfig
      banners.push({ ...data, id: d.id })
    })
    return banners.filter(b => b.active)
  } catch {
    return DEFAULT_BANNERS.filter(b => b.active)
  }
}

export async function saveBanner(banner: BannerConfig): Promise<boolean> {
  try {
    const db = getDb()
    if (!db) return false
    await setDoc(doc(db, 'banners', banner.id), { ...banner, updatedAt: serverTimestamp() })
    return true
  } catch { return false }
}

export async function deleteBanner(id: string): Promise<boolean> {
  try {
    const db = getDb()
    if (!db) return false
    await deleteDoc(doc(db, 'banners', id))
    return true
  } catch { return false }
}

export async function toggleBanner(id: string, active: boolean): Promise<boolean> {
  try {
    const db = getDb()
    if (!db) return false
    await setDoc(doc(db, 'banners', id), { active, updatedAt: serverTimestamp() }, { merge: true })
    return true
  } catch { return false }
}

// ============================================
// Bundle Email Formatting
// ============================================

export function formatBundleEmailSubject(services: string[], name: string): string {
  if (services.length >= 3) {
    return '🔥🔥🔥 CUSTOM PROJECT — ' + services.length + ' Services — ' + name
  }
  if (services.length >= 2) {
    return '🔥 BUNDLE LEAD — ' + services.join(' + ') + ' — ' + name
  }
  return 'New Lead — ' + services[0] + ' — ' + name
}

export function formatBundleEmailHeader(services: string[], promoCode: string, discountPercent?: number): string {
  if (services.length >= 2) {
    const lines = [
      '⚠️ BUNDLED REQUEST — Needs custom pricing',
      '⚠️ Services: ' + services.join(' + '),
      '⚠️ Promo: ' + (promoCode || 'none'),
      '⚠️ Customer expects bundle discount — call to discuss',
      '',
    ]
    return lines.join('\n')
  }
  if (promoCode) {
    return '📋 Promo code: ' + promoCode + '\n\n'
  }
  return ''
}
