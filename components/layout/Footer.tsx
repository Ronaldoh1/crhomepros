'use client'

import { LOGO } from '@/lib/site-images'
import Link from 'next/link'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
} from 'lucide-react'
import { COMPANY, HOURS, SERVICES, SOCIAL, SERVICE_AREAS } from '@/lib/constants'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { useTranslation, useLocale } from '@/lib/i18n/provider'
import { useSiteSettings } from '@/lib/site-settings-provider'

// TikTok icon (not in Lucide)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
)

// Map service IDs to dictionary keys
const serviceIdToKey: Record<string, string> = {
  'kitchen-remodeling': 'kitchen',
  'bathroom-renovation': 'bathroom',
  'basement-finishing': 'basement',
  'roofing': 'roofing',
  'concrete-driveways': 'concrete',
  'flooring': 'flooring',
  'painting': 'painting',
  'deck-outdoor': 'deck',
  'fencing': 'fencing',
  'complete-renovations': 'completeRenovations',
  'insurance-claims': 'insuranceClaims',
}

// Spanish display labels for payment methods coming from site settings
const PAYMENT_LABELS_ES: Record<string, string> = {
  'Cash': 'Efectivo',
  'Check': 'Cheque',
  'Zelle': 'Zelle',
  'Credit Card': 'Tarjeta de Crédito',
  'Credit Cards': 'Tarjetas de Crédito',
  'Debit Card': 'Tarjeta de Débito',
  'Debit Cards': 'Tarjetas de Débito',
  'Credit & Debit Cards': 'Tarjetas de Crédito y Débito',
  'Venmo': 'Venmo',
  'Cash App': 'Cash App',
  'Klarna': 'Klarna',
  'Financing Available': 'Financiamiento Disponible',
  'Financing': 'Financiamiento',
  'Insurance Claims': 'Reclamaciones de Seguro',
}

// Spanish day abbreviations for the hours note coming from site settings
const DAY_LABELS_ES: Record<string, string> = {
  Mon: 'Lun',
  Tue: 'Mar',
  Wed: 'Mié',
  Thu: 'Jue',
  Fri: 'Vie',
  Sat: 'Sáb',
  Sun: 'Dom',
}

function localizeHoursNote(note: string, locale: string): string {
  if (locale !== 'es') return note
  if (note.trim() === 'By Appointment') return 'Con Cita Previa'
  return note.replace(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/g, (d) => DAY_LABELS_ES[d] || d)
}

// Nav link definitions with dictionary key mapping
const NAV_ITEMS: { key: string; href: string; badge?: string }[] = [
  { key: 'home', href: '/' },
  { key: 'services', href: '/services' },
  { key: 'projects', href: '/projects' },
  { key: 'green', href: '/green' },
  { key: 'pricing', href: '/pricing' },
  { key: 'blog', href: '/blog' },
  { key: 'reviews', href: '/reviews' },
  { key: 'referrals', href: '/referrals' },
  { key: 'contact', href: '/contact' },
]

export function Footer() {
  const t = useTranslation()
  const { locale } = useLocale()
  const ss = useSiteSettings()
  const lp = (path: string) => `/${locale}${path}`
  const currentYear = new Date().getFullYear()

  const quickServices = SERVICES.slice(0, 6)

  // Use Firebase settings with fallback to constants
  const phone = ss.contact.phone || COMPANY.phoneFormatted
  const email = ss.contact.email || COMPANY.email
  const whatsappUrl = ss.contact.whatsappUrl
  const city = ss.contact.city || COMPANY.address.city
  const state = ss.contact.state || COMPANY.address.state
  const hours = ss.contact.hours || HOURS.weekday
  const hoursNote = ss.contact.hoursNote || 'Mon – Sat'
  const fbUrl = ss.social.facebook || SOCIAL.facebook
  const igUrl = ss.social.instagram || SOCIAL.instagram
  const ttUrl = ss.social.tiktok || SOCIAL.tiktok
  const serviceAreas = ss.serviceAreas.length > 0 ? ss.serviceAreas : SERVICE_AREAS
  const paymentMethods = ss.paymentMethods.length > 0 ? ss.paymentMethods : ['Credit Cards', 'Zelle', 'Venmo', 'Check']

  return (
    <footer className="bg-dark-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO.wordmark} alt="CR Home Pros" width={444} height={234} className="h-16 w-auto" />
            </div>
            <p className="text-dark-200 text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href={fbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={ttUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">{t.footer.quickLinks}</h4>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={lp(item.href)}
                    className="text-dark-200 hover:text-white hover:pl-1 transition-all duration-200"
                  >
                    {(t.nav as Record<string, string>)[item.key] || item.key}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={lp('/get-started')}
                  className="text-gold-400 hover:text-gold-300 font-medium hover:pl-1 transition-all duration-200"
                >
                  {t.nav.getEstimate}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">{t.services.title}</h4>
            <ul className="space-y-3">
              {quickServices.map((service) => {
                const dictKey = serviceIdToKey[service.id]
                const translated = dictKey ? (t.services as any)[dictKey] : null
                return (
                  <li key={service.id}>
                    <Link
                      href={lp(`/services/${service.id}`)}
                      className="text-dark-200 hover:text-white hover:pl-1 transition-all duration-200"
                    >
                      {translated?.name || service.name}
                    </Link>
                  </li>
                )
              })}
              <li>
                <Link
                  href={lp('/services')}
                  className="text-gold-400 hover:text-gold-300 font-medium hover:pl-1 transition-all duration-200"
                >
                  {t.services.viewAll} →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">{t.footer.contactUs}</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                  className="flex items-start gap-3 text-dark-200 hover:text-white transition-colors group"
                >
                  <Phone className="w-5 h-5 mt-0.5 text-gold-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-white">{phone}</p>
                    <p className="text-sm">{t.footer.emergencyOnCall}</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-dark-200 hover:text-white transition-colors group"
                >
                  <WhatsAppIcon className="w-5 h-5 mt-0.5 text-[#25D366] group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-white">WhatsApp</p>
                    <p className="text-sm">{t.footer.tapToMessage}</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-3 text-dark-200 hover:text-white transition-colors group"
                >
                  <Mail className="w-5 h-5 mt-0.5 text-gold-500 group-hover:scale-110 transition-transform" />
                  <span>{email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-dark-200">
                  <MapPin className="w-5 h-5 mt-0.5 text-gold-500" />
                  <div>
                    <p>{t.contact.info.serving}</p>
                    <p className="text-sm">{city}, {state}</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-dark-200">
                  <Clock className="w-5 h-5 mt-0.5 text-gold-500" />
                  <div>
                    <p>{hours}</p>
                    <p className="text-sm">{localizeHoursNote(hoursNote, locale)}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-white/10 bg-white/5">
        <div className="container-custom py-8">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            <div className="text-center">
              <p className="text-2xl font-bold text-gold-400">{t.stats.years}</p>
              <p className="text-sm text-dark-200">{t.footer.yearsServingDMV}</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gold-400">{t.stats.projects}</p>
              <p className="text-sm text-dark-200">{t.stats.projectsLabel}</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gold-400">{COMPANY.license}</p>
              <p className="text-sm text-dark-200">{t.common.licensedInsured}</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gold-400">{t.stats.satisfaction}</p>
              <p className="text-sm text-dark-200">{t.stats.satisfactionLabel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Areas Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <p className="text-center text-sm text-dark-200">
            <span className="text-white font-semibold">{t.common.servingAreas}: </span>
            {serviceAreas.slice(0, 8).join(' • ')}
            <span className="text-gold-400 font-medium"> {t.common.surroundingAreas}</span>
          </p>
        </div>
      </div>

      {/* Payment & Sustainability */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-dark-200">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="font-semibold text-white">{t.footer.weAccept}:</span>
              {paymentMethods.map((method, idx) => (
                <span key={method}>
                  {idx > 0 && <span className="text-dark-300 mr-3">•</span>}
                  <span className={idx === paymentMethods.length - 1 ? "text-gold-400 font-medium" : ""}>
                    {locale === 'es' ? PAYMENT_LABELS_ES[method.trim()] || method : method}
                  </span>
                </span>
              ))}
            </div>
            <Link href={lp('/green')} className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
              <span>🌿</span>
              {t.footer.ecoFriendly}
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-dark-950">
        <div className="container-custom py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-dark-200">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <p>© {currentYear} {COMPANY.legalName}</p>
              <span className="hidden md:inline text-dark-300">•</span>
              <p className="font-medium">{COMPANY.license}</p>
            </div>
            <div className="flex items-center gap-6">
              <Link href={lp('/privacy')} className="hover:text-white transition-colors">
                {t.common.privacyPolicy}
              </Link>
              <Link href={lp('/terms')} className="hover:text-white transition-colors">
                {t.common.termsOfService}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
