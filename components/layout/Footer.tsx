'use client'

import { resolveImageUrl } from '@/lib/resolve-images'
import Link from 'next/link'
import Image from 'next/image'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
} from 'lucide-react'
import { COMPANY, HOURS, SERVICES, SOCIAL, SERVICE_AREAS } from '@/lib/constants'
import { formatPhoneLink, formatWhatsAppLink } from '@/lib/utils'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { useTranslation, useLocale } from '@/lib/i18n/provider'

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
  const lp = (path: string) => `/${locale}${path}`
  const currentYear = new Date().getFullYear()

  const quickServices = SERVICES.slice(0, 6)

  return (
    <footer className="bg-dark-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Image
                src={resolveImageUrl("/images/logo.png")}
                alt="CR Home Pros"
                width={220}
                height={70}
                className="h-20 w-auto object-contain"
                quality={100}
                unoptimized
              />
            </div>
            <p className="text-dark-300 text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL.tiktok}
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
                    className="text-dark-300 hover:text-white hover:pl-1 transition-all duration-200"
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
                      className="text-dark-300 hover:text-white hover:pl-1 transition-all duration-200"
                    >
                      {translated?.name || service.name}
                    </Link>
                  </li>
                )
              })}
              <li>
                <Link
                  href={lp('/services')}
                  className="text-primary-400 hover:text-primary-300 font-medium hover:pl-1 transition-all duration-200"
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
                  href={formatPhoneLink(COMPANY.phone)}
                  className="flex items-start gap-3 text-dark-300 hover:text-white transition-colors group"
                >
                  <Phone className="w-5 h-5 mt-0.5 text-gold-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-white">{COMPANY.phoneFormatted}</p>
                    <p className="text-sm">{t.footer.emergencyOnCall}</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={formatWhatsAppLink(COMPANY.phone, t.common.whatsappGreeting)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-dark-300 hover:text-white transition-colors group"
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
                  href={`mailto:${COMPANY.email}`}
                  className="flex items-start gap-3 text-dark-300 hover:text-white transition-colors group"
                >
                  <Mail className="w-5 h-5 mt-0.5 text-gold-500 group-hover:scale-110 transition-transform" />
                  <span>{COMPANY.email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-dark-300">
                  <MapPin className="w-5 h-5 mt-0.5 text-gold-500" />
                  <div>
                    <p>{t.contact.info.serving}</p>
                    <p className="text-sm">{COMPANY.address.city}, {COMPANY.address.state}</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-dark-300">
                  <Clock className="w-5 h-5 mt-0.5 text-gold-500" />
                  <div>
                    <p>{HOURS.weekday}</p>
                    <p className="text-sm">{t.footer.monSat}</p>
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
              <p className="text-sm text-dark-300">{t.footer.yearsServingDMV}</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gold-400">{t.stats.projects}</p>
              <p className="text-sm text-dark-300">{t.stats.projectsLabel}</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gold-400">{COMPANY.license}</p>
              <p className="text-sm text-dark-300">{t.common.licensedInsured}</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gold-400">{t.stats.satisfaction}</p>
              <p className="text-sm text-dark-300">{t.stats.satisfactionLabel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Areas Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <p className="text-center text-sm text-dark-300">
            <span className="text-white font-semibold">{t.common.servingAreas}: </span>
            {SERVICE_AREAS.slice(0, 8).join(' • ')}
            <span className="text-gold-400 font-medium"> {t.common.surroundingAreas}</span>
          </p>
        </div>
      </div>

      {/* Payment & Sustainability */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-dark-300">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="font-semibold text-white">{t.footer.weAccept}:</span>
              <span>{t.payment.methods.creditCards}</span>
              <span className="text-dark-500">•</span>
              <span>{t.payment.methods.zelle}</span>
              <span className="text-dark-500">•</span>
              <span>{t.payment.methods.venmo}</span>
              <span className="text-dark-500">•</span>
              <span>{t.payment.methods.check}</span>
              <span className="text-dark-500">•</span>
              <span>{t.payment.methods.klarna}</span>
              <span className="text-dark-500">•</span>
              <span className="text-gold-400 font-medium">{t.payment.methods.insurance}</span>
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-dark-300">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <p>© {currentYear} {COMPANY.legalName}</p>
              <span className="hidden md:inline text-dark-500">•</span>
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
