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
  {
    id: 'summer-kitchen-15',
    emoji: '☀️',
    textEn: 'Summer Special: 15% off kitchen renovations — Book before June!',
    textEs: 'Especial de Verano: 15% en renovaciones de cocina — Reserve antes de junio!',
    ctaEn: 'Book Now',
    ctaEs: 'Reserve Ahora',
    gradient: 'linear-gradient(135deg, #92400E, #B45309, #D97706)',
    accentColor: '#D97706',
    service: 'Kitchen Remodeling',
    discountPercent: 15,
    promoCode: 'SUMMER15',
    tier: 'big',
    active: true,
    season: 'summer',
  },
  {
    id: 'spring-basement-free',
    emoji: '🌧️',
    textEn: 'Spring rains are here — Is your basement protected? FREE assessment',
    textEs: 'Lluvias de primavera — Su sotano esta protegido? Evaluacion GRATIS',
    ctaEn: 'Free Assessment',
    ctaEs: 'Evaluacion Gratis',
    gradient: 'linear-gradient(135deg, #065F46, #047857, #059669)',
    accentColor: '#059669',
    service: 'Basement Finishing',
    discountPercent: 15,
    promoCode: 'SPRINGBASEMENT',
    tier: 'big',
    active: true,
    season: 'spring',
  },
  {
    id: 'presale-reno-75',
    emoji: '🏠',
    textEn: 'Selling your home? Renovations that boost value up to 75% — Free consult',
    textEs: 'Vendiendo su casa? Renovaciones que aumentan el valor hasta 75% — Consulta gratis',
    ctaEn: 'Learn More',
    ctaEs: 'Ver Como',
    gradient: 'linear-gradient(135deg, #7C2D12, #9A3412, #C2410C)',
    accentColor: '#C2410C',
    service: 'Complete Renovations',
    discountPercent: 15,
    promoCode: 'PRESALE',
    tier: 'big',
    active: true,
    season: 'summer',
  },
  {
    id: 'roof-inspect-free',
    emoji: '⚡',
    textEn: 'FREE roof inspection before summer storms — Protect your home now',
    textEs: 'Inspeccion de techo GRATIS antes de tormentas — Proteja su hogar',
    ctaEn: 'Schedule Now',
    ctaEs: 'Agendar Ahora',
    gradient: 'linear-gradient(135deg, #7F1D1D, #991B1B, #DC2626)',
    accentColor: '#DC2626',
    service: 'Roofing',
    discountPercent: 15,
    promoCode: 'ROOFINSPECT',
    tier: 'big',
    active: true,
    season: 'spring',
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
