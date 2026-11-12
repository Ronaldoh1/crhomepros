'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, ChevronDown, Plus, Minus } from 'lucide-react'
import { EmergencyModal } from '@/components/EmergencyModal'
import PromoBanner from '@/components/layout/PromoBanner'
import { cn, formatPhoneLink, formatWhatsAppLink } from '@/lib/utils'
import { COMPANY } from '@/lib/constants'
import { LOGO } from '@/lib/site-images'
import { useLocale, useTranslation } from '@/lib/i18n/provider'
import { useLocalePath } from '@/lib/i18n/link'

type NavItem = {
  key: string
  label: string
  href: string
  children?: { label: string; href: string }[]
}

// ─────────────────────────────────────────────
// Header: utility row + main row (desktop), compact bar + accordion menu (mobile).
// One filled button only: "Request an Estimate".
// ─────────────────────────────────────────────
export function Navbar() {
  const t = useTranslation()
  const r = t.redesign
  const { locale } = useLocale()
  const lp = useLocalePath()
  const pathname = usePathname()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null) // mobile accordion
  const [openDropdown, setOpenDropdown] = useState<string | null>(null) // desktop
  const [scrolled, setScrolled] = useState(false)
  const [showEmergency, setShowEmergency] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const [headerH, setHeaderH] = useState(64)

  const items: NavItem[] = [
    {
      key: 'services',
      label: r.nav.services,
      href: lp('/services'),
      children: [
        { label: r.nav.allServices, href: lp('/services') },
        { label: t.services.kitchen.name, href: lp('/services/kitchen-remodeling') },
        { label: t.services.bathroom.name, href: lp('/services/bathroom-renovation') },
        { label: t.services.basement.name, href: lp('/services/basement-finishing') },
        { label: t.services.roofing.name, href: lp('/services/roofing') },
        { label: t.services.concrete.name, href: lp('/services/concrete-driveways') },
        { label: t.services.painting.name, href: lp('/services/painting') },
        { label: t.services.deck.name, href: lp('/services/deck-outdoor') },
        { label: r.nav.green, href: lp('/green') },
        { label: r.nav.pricing, href: lp('/pricing') },
      ],
    },
    { key: 'work', label: r.nav.work, href: lp('/projects') },
    {
      key: 'about',
      label: r.nav.about,
      href: lp('/about'),
      children: [
        { label: r.nav.ourStory, href: lp('/about') },
        { label: r.nav.reviews, href: lp('/reviews') },
        { label: r.nav.blog, href: lp('/blog') },
        { label: r.nav.faq, href: `${lp('/')}#faq`.replace('//#', '/#') },
        { label: r.nav.financing, href: lp('/financing') },
        { label: r.nav.referrals, href: lp('/referrals') },
      ],
    },
    { key: 'areas', label: r.nav.areas, href: `${lp('/')}#service-areas`.replace('//#', '/#') },
    { key: 'contact', label: r.nav.contact, href: lp('/contact') },
  ]

  // Language switch keeps the visitor on the same page. /en/... is handled
  // by the middleware, which remembers English and drops the prefix.
  const barePath = (pathname || '/').replace(/^\/(en|es)(?=\/|$)/, '') || '/'
  const otherLocaleHref = locale === 'en' ? `/es${barePath === '/' ? '' : barePath}` : `/en${barePath === '/' ? '' : barePath}`

  // Publish the header's live height (banner + rows) so pages can sit right under it
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const update = () => {
      const h = el.getBoundingClientRect().height
      setHeaderH(h)
      document.documentElement.style.setProperty('--header-h', `${h}px`)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Close desktop dropdown on outside click / Escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const isActive = (href: string) => {
    const clean = href.replace(/^\/es/, '') || '/'
    const path = pathname.replace(/^\/(en|es)/, '') || '/'
    if (clean === '/' || clean.includes('#')) return false
    return path.startsWith(clean)
  }

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-shadow duration-300',
          scrolled ? 'shadow-lg shadow-black/25' : ''
        )}
      >
        <PromoBanner />

        {/* ── Utility row (desktop) ── */}
        <div className="hidden lg:block bg-dark-950 text-[13px]">
          <div className="container-custom flex h-9 items-center justify-between">
            <span className="text-white/90">{r.serving}</span>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setShowEmergency(true)}
                className="font-medium text-red-300 hover:text-red-200 transition-colors"
              >
                {r.emergency}
              </button>
              <a
                href={formatWhatsAppLink(COMPANY.phone, t.common.whatsappGreeting)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/75 hover:text-white transition-colors"
              >
                {r.whatsapp}
              </a>
              <a
                href={otherLocaleHref}
                lang={locale === 'en' ? 'es' : 'en'}
                className="text-white/75 hover:text-white transition-colors"
                aria-label={locale === 'en' ? 'Ver en español' : 'View in English'}
              >
                {r.langToggle}
              </a>
              <a
                href={formatPhoneLink(COMPANY.phone)}
                className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-gold-300 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                {COMPANY.phoneFormatted}
              </a>
            </div>
          </div>
        </div>

        {/* ── Main row ── */}
        <div className="bg-dark-900 border-b border-white/10">
          <div ref={navRef} className="container-custom flex h-16 lg:h-[72px] items-center justify-between gap-6">
            <Link href={lp('/')} className="flex shrink-0 items-center" aria-label="CR Home Pros home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO.wordmark} alt="CR Home Pros" className="h-10 lg:h-12 w-auto" width={444} height={234} />
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Main" className="hidden lg:flex items-center gap-1">
              {items.map((item) =>
                item.children ? (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.key)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      type="button"
                      aria-expanded={openDropdown === item.key}
                      aria-haspopup="true"
                      onClick={() => setOpenDropdown(openDropdown === item.key ? null : item.key)}
                      className={cn(
                        'flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium transition-colors',
                        isActive(item.href) ? 'text-gold-300' : 'text-white/90 hover:text-white'
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn('h-4 w-4 transition-transform', openDropdown === item.key && 'rotate-180')}
                        aria-hidden="true"
                      />
                    </button>
                    {/* Dropdown panel: a padded wrapper keeps hover alive across the gap */}
                    <div
                      className={cn(
                        'absolute left-0 top-full pt-2 transition-all duration-150',
                        openDropdown === item.key
                          ? 'visible opacity-100 translate-y-0'
                          : 'invisible opacity-0 -translate-y-1'
                      )}
                    >
                      <ul
                        className={cn(
                          'rounded-xl bg-white p-2 shadow-xl ring-1 ring-black/5',
                          item.children.length > 6 ? 'grid w-[440px] grid-cols-2 gap-x-2' : 'w-60'
                        )}
                      >
                        {item.children.map((child) => (
                          <li key={child.href + child.label}>
                            <Link
                              href={child.href}
                              className="block rounded-lg px-3 py-2.5 text-[15px] text-dark-700 hover:bg-dark-50 hover:text-dark-900"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={cn(
                      'rounded-md px-3 py-2 text-[15px] font-medium transition-colors',
                      isActive(item.href) ? 'text-gold-300' : 'text-white/90 hover:text-white'
                    )}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href={lp('/get-started')}
                className="hidden lg:inline-flex btn-gold !rounded-lg !px-5 !py-2.5 text-[15px] font-semibold"
              >
                {r.cta}
              </Link>

              {/* Mobile: call + menu */}
              <a
                href={formatPhoneLink(COMPANY.phone)}
                className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-white/10"
                aria-label={`${r.call} ${COMPANY.phoneFormatted}`}
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-white/10"
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? r.closeMenu : r.openMenu}
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile menu: full-screen white panel under the bar (Clark-style accordion) ── */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-x-0 bottom-0 z-[45] overflow-y-auto bg-white lg:hidden transition-opacity duration-200',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        style={{ top: headerH }}
        aria-hidden={!mobileOpen}
      >
        <nav aria-label="Mobile" className="px-5 pb-10">
          <ul>
            {items.map((item) => (
              <li key={item.key} className="border-b border-dark-100">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setExpanded(expanded === item.key ? null : item.key)}
                      aria-expanded={expanded === item.key}
                      className="flex w-full items-center justify-between py-5 text-left font-display text-lg font-semibold uppercase tracking-wide text-dark-900"
                    >
                      {item.label}
                      {expanded === item.key ? (
                        <Minus className="h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Plus className="h-6 w-6" aria-hidden="true" />
                      )}
                    </button>
                    {expanded === item.key && (
                      <ul className="pb-4">
                        {item.children.map((child) => (
                          <li key={child.href + child.label}>
                            <Link
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className="block py-2.5 pl-1 text-[17px] text-dark-600"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-5 font-display text-lg font-semibold uppercase tracking-wide text-dark-900"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-[15px]">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                setShowEmergency(true)
              }}
              className="font-medium text-red-800"
            >
              {r.emergency}
            </button>
            <a
              href={formatWhatsAppLink(COMPANY.phone, t.common.whatsappGreeting)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-600"
            >
              {r.whatsapp}
            </a>
            <a href={otherLocaleHref} className="text-dark-600">
              {locale === 'en' ? 'Español' : 'English'}
            </a>
          </div>

          <Link
            href={lp('/get-started')}
            onClick={() => setMobileOpen(false)}
            className="btn-gold mt-8 w-full !rounded-lg !py-4 text-lg font-semibold"
          >
            {r.cta}
          </Link>
          <a
            href={formatPhoneLink(COMPANY.phone)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dark-200 py-3.5 text-lg font-semibold text-dark-900"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            {COMPANY.phoneFormatted}
          </a>
        </nav>
      </div>

      <EmergencyModal isOpen={showEmergency} onClose={() => setShowEmergency(false)} />
    </>
  )
}
