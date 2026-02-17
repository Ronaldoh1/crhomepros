'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { GA_ID, gtag, trackPhoneClick, trackWhatsAppClick } from '@/lib/analytics'

export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      gtag('config', GA_ID, {
        page_path: pathname,
      })
    }
  }, [pathname, searchParams])

  // Auto-track phone and WhatsApp link clicks via event delegation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href') || ''

      // Phone clicks
      if (href.startsWith('tel:')) {
        const section = target.closest('header') ? 'navbar'
          : target.closest('footer') ? 'footer'
          : target.closest('[class*="floating"]') ? 'floating'
          : 'page'
        trackPhoneClick(section)
      }

      // WhatsApp clicks
      if (href.includes('wa.me') || href.includes('whatsapp')) {
        const section = target.closest('header') ? 'navbar'
          : target.closest('footer') ? 'footer'
          : 'page'
        trackWhatsAppClick(section)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
