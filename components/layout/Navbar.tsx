'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, ChevronDown, Globe, AlertTriangle } from 'lucide-react'
import { cn, formatPhoneLink, formatWhatsAppLink } from '@/lib/utils'
import { COMPANY, NAV_LINKS } from '@/lib/constants'
import { useLocale, useTranslation } from '@/lib/i18n/provider'
import { useBannerHeight } from './PromoBanner'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'

export function Navbar() {
  const { bannerHeight } = useBannerHeight()
  const [isOpen, setIsOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const pathname = usePathname()
  const { locale } = useLocale()
  const t = useTranslation()

  // Locale-aware path helper
  const lp = (path: string) => locale === 'en' ? path : `/es${path}`

  // Get language toggle URL
  const getToggleUrl = () => {
    const cleanPath = pathname.replace(/^\/(en|es)/, '') || '/'
    return locale === 'en' ? `/es${cleanPath}` : cleanPath
  }

  // Handle scroll effect with smooth progress
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress from 0 to 1 over the first 150px
      const progress = Math.min(window.scrollY / 150, 1)
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isScrolled = scrollProgress > 0.1

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Calculate logo styles based on scroll progress
  const logoOpacity = 1 - (scrollProgress * 0.3)
  const logoScale = 1 - (scrollProgress * 0.2)

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-dark-900/95 backdrop-blur-lg shadow-lg shadow-black/20 py-1.5 md:py-2'
            : 'bg-dark-900/80 backdrop-blur-sm py-2.5 md:py-4'
        )}
        style={{ top: `${bannerHeight}px` }}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between">
            {/* Logo with scroll-based shrink and fade effect */}
            <Link href={lp("/")} className="flex items-center group">
              <div 
                className={cn(
                  "relative transition-all duration-150 ease-out",
                  isScrolled ? "h-10 md:h-10" : "h-12 md:h-16 lg:h-20"
                )}
                style={{
                  opacity: logoOpacity,
                  transform: `scale(${logoScale})`,
                  transformOrigin: 'left center',
                }}
              >
                <Image
                  src="/images/logo.png"
                  alt="CR Home Pros - Complete Home Services"
                  width={300}
                  height={80}
                  className="h-full w-auto object-contain"
                  style={{ maxWidth: 'none' }}
                  priority
                  quality={100}
                  unoptimized
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={lp(link.href)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5',
                    isActive(link.href)
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  {link.label}
                  {'badge' in link && link.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gold-500 text-dark-900 rounded-full animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-2 ml-2">
              <Link
                href={lp("/contact")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-all duration-300 bg-red-600/90 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25 animate-pulse hover:animate-none whitespace-nowrap"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {t.nav.emergency}
              </Link>
              <a
                href={getToggleUrl()}
                className="text-sm font-semibold px-3 py-1.5 rounded-full bg-gold-500/20 text-gold-300 hover:bg-gold-500/30 border border-gold-500/30 transition-colors flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                {locale === 'en' ? 'ES' : 'EN'}
              </a>
              <a
                href={formatWhatsAppLink(COMPANY.phone, "Hi! I'm interested in your services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium transition-all duration-300 bg-[#25D366] text-white hover:bg-[#20bd5a] hover:shadow-lg"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a
                href={formatPhoneLink(COMPANY.phone)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 bg-white text-primary-800 hover:bg-white/90 hover:shadow-lg whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                {COMPANY.phoneFormatted}
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl transition-colors text-white hover:bg-white/10"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden transition-all duration-300',
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={cn(
            'absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl transition-transform duration-300 ease-out',
            isOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-dark-100">
              <div className="relative h-14 w-auto">
                <Image
                  src="/images/logo.png"
                  alt="CR Home Pros"
                  width={180}
                  height={56}
                  className="h-full w-auto object-contain"
                  quality={100}
                  unoptimized
                />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-dark-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-5">
              <ul className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={lp(link.href)}
                      className={cn(
                        'flex items-center justify-between px-4 py-3 rounded-xl text-lg font-medium transition-all',
                        isActive(link.href)
                          ? 'bg-primary-100 text-primary-800'
                          : 'text-dark-600 hover:bg-dark-50 hover:text-dark-900'
                      )}
                    >
                      {link.label}
                      {'badge' in link && link.badge && (
                        <span className="text-xs font-bold px-2 py-1 bg-gold-500 text-dark-900 rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Get Started CTA */}
              <div className="mt-6 pt-6 border-t border-dark-100 space-y-3">
                <Link
                  href={lp("/contact")}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-600 text-white font-bold text-lg"
                >
                  <AlertTriangle className="w-5 h-5" />
                  {t.nav.emergency}
                </Link>
                <Link
                  href={lp("/get-started")}
                  className="btn-gold w-full text-center text-lg"
                >
                  {t.nav.getEstimate}
                </Link>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-5 border-t border-dark-100 bg-dark-50 space-y-3">
              <a
                href={formatPhoneLink(COMPANY.phone)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary-800 text-white font-medium"
              >
                <Phone className="w-5 h-5" />
                {t.common.callUs} {COMPANY.phoneFormatted}
              </a>
              <a
                href={formatWhatsAppLink(COMPANY.phone, locale === 'es' ? "¡Hola! Me interesan sus servicios." : "Hi! I'm interested in your services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366] text-white font-medium"
              >
                <WhatsAppIcon className="w-5 h-5" />
                {t.nav.whatsappUs}
              </a>
              <a
                href={getToggleUrl()}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-dark-100 text-dark-700 text-sm font-medium hover:bg-dark-200 transition-colors"
              >
                <Globe className="w-4 h-4" />
                {locale === 'en' ? '🌐 Cambiar a Español' : '🌐 Switch to English'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
