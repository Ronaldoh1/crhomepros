'use client'

import { useState, createContext, useContext, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

// ============================================================
// PROMOTIONAL BANNER CONFIGURATION
// ============================================================
const BANNER_ENABLED = true

const BANNER_CONFIG = {
  text: 'Winter Prep Special: 15% off roof inspections',
  subtext: 'Beat inflation with locked-in pricing',
  href: '/get-started',
  linkText: 'Claim Offer',
  style: 'gold' as const,
}
// ============================================================

// Context so Navbar can read banner height
const BannerContext = createContext({ bannerHeight: 0 })
export const useBannerHeight = () => useContext(BannerContext)

const styleMap = {
  gold: 'bg-gradient-to-r from-gold-600 to-gold-500 text-dark-900',
  blue: 'bg-gradient-to-r from-primary-800 to-primary-700 text-white',
  gradient: 'bg-gradient-to-r from-primary-900 via-primary-800 to-gold-600 text-white',
}

export function BannerProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(BANNER_ENABLED)
  const [bannerHeight, setBannerHeight] = useState(BANNER_ENABLED ? 40 : 0)

  useEffect(() => {
    if (!visible) {
      setBannerHeight(0)
      return
    }
    // Responsive banner height
    const updateHeight = () => {
      setBannerHeight(window.innerWidth < 640 ? 64 : 40)
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [visible])

  return (
    <BannerContext.Provider value={{ bannerHeight }}>
      {BANNER_ENABLED && visible && (
        <div
          className={`fixed top-0 left-0 right-0 z-[60] ${styleMap[BANNER_CONFIG.style]} py-2 sm:py-2.5 px-4 text-center text-sm font-medium`}
          style={{ minHeight: bannerHeight }}
        >
          <div className="container-custom flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 pr-6">
            <span className="font-semibold text-xs sm:text-sm">{BANNER_CONFIG.text}</span>
            <span className="hidden sm:inline opacity-60">—</span>
            <span className="hidden sm:inline opacity-80">{BANNER_CONFIG.subtext}</span>
            {BANNER_CONFIG.href && (
              <Link
                href={BANNER_CONFIG.href}
                className="inline-flex items-center gap-1 px-3 py-0.5 sm:py-1 bg-dark-900 text-white rounded-full text-xs font-semibold hover:bg-dark-800 transition-colors"
              >
                {BANNER_CONFIG.linkText} →
              </Link>
            )}
          </div>
          <button
            onClick={() => setVisible(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {children}
    </BannerContext.Provider>
  )
}

// Backward compat
export function PromoBanner() { return null }
