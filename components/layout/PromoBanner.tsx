'use client'

import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from '@/lib/i18n/provider'
import { DEFAULT_BANNERS, fetchBanners, type BannerConfig } from '@/lib/banners'

export default function PromoBanner() {
  const { locale } = useLocale()
  const isEs = locale === 'es'
  const [banners, setBanners] = useState<BannerConfig[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const [fade, setFade] = useState(true)
  const [loaded, setLoaded] = useState(false)

  // Load banners
  useEffect(() => {
    // Check session dismiss
    if (typeof window !== 'undefined' && sessionStorage.getItem('banner_dismissed') === 'true') {
      setDismissed(true)
      return
    }
    // Use defaults immediately, then try Firebase in background
    const active = DEFAULT_BANNERS.filter(x => x.active)
    setBanners(active)
    if (active.length > 0) {
      setCurrentIndex(Math.floor(Math.random() * active.length))
    }
    setLoaded(true)
    // Try Firebase override in background (non-blocking)
    fetchBanners().then(b => {
      if (b.length > 0) setBanners(b)
    }).catch(() => {})
      .catch(() => {
        const active = DEFAULT_BANNERS.filter(x => x.active)
        setBanners(active)
        if (active.length > 0) {
          setCurrentIndex(Math.floor(Math.random() * active.length))
        }
        setLoaded(true)
      })
  }, [])

  // Auto-rotate every 10 seconds
  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % banners.length)
        setFade(true)
      }, 300)
    }, 10000)
    return () => clearInterval(interval)
  }, [banners.length])

  const handleDismiss = useCallback(() => {
    setDismissed(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('banner_dismissed', 'true')
    }
  }, [])

  // Don't render until loaded, if dismissed, or no banners
  if (!loaded || dismissed || banners.length === 0) return null

  const banner = banners[currentIndex % banners.length]
  if (!banner) return null

  const text = isEs ? banner.textEs : banner.textEn
  const cta = isEs ? banner.ctaEs : banner.ctaEn

  // Referral banner links to /referrals, others to /get-started with banner param
  const href = banner.id === 'referral-program'
    ? '/' + locale + '/referrals'
    : '/' + locale + '/get-started?banner=' + banner.id

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] overflow-hidden"
      style={{ background: banner.gradient }}
    >
      <div
        className="flex items-center justify-center gap-3 px-4 py-2.5 transition-opacity duration-300"
        style={{ opacity: fade ? 1 : 0 }}
      >
        <Link
          href={href}
          className="flex items-center gap-2 text-white text-sm font-medium hover:opacity-90 transition-opacity text-center flex-1 justify-center"
        >
          <span className="hidden sm:inline">{banner.emoji}</span>
          <span className="line-clamp-1">{text}</span>
          <span className="hidden sm:inline-flex items-center gap-1 px-3 py-0.5 bg-white/20 rounded-full text-xs font-bold whitespace-nowrap ml-2">
            {cta} →
          </span>
        </Link>

        {/* Dot indicators */}
        {banners.length > 1 && (
          <div className="hidden md:flex items-center gap-1 ml-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => { setFade(false); setTimeout(() => { setCurrentIndex(i); setFade(true) }, 150) }}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === currentIndex % banners.length ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                  transform: i === currentIndex % banners.length ? 'scale(1.3)' : 'scale(1)',
                }}
                aria-label={'Banner ' + (i + 1)}
              />
            ))}
          </div>
        )}

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="p-1 text-white/60 hover:text-white transition-colors flex-shrink-0 ml-1"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Backward compat — layout imports this as wrapper
export function BannerProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export const useBannerHeight = () => ({ bannerHeight: 40 })
