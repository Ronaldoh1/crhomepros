'use client'

import Link from 'next/link'
import { useLocale } from './provider'
import type { Locale } from './config'

// Hook to get locale-prefixed path
export function useLocalePath() {
  const { locale } = useLocale()
  return (path: string) => {
    if (locale === 'en') return path // English uses clean URLs via rewrite
    return `/${locale}${path}`
  }
}

// Component for locale-aware links
export function LocaleLink({
  href,
  children,
  ...props
}: { href: string } & Omit<React.ComponentProps<typeof Link>, 'href'>) {
  const localePath = useLocalePath()
  return (
    <Link href={localePath(href)} {...props}>
      {children}
    </Link>
  )
}

// Language switcher component
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale } = useLocale()

  // Get current path without locale prefix
  const getToggleHref = () => {
    if (typeof window === 'undefined') return locale === 'en' ? '/es' : '/'
    const path = window.location.pathname
    const cleanPath = path.replace(/^\/(en|es)/, '') || '/'
    return locale === 'en' ? `/es${cleanPath}` : cleanPath
  }

  return (
    <a
      href={locale === 'en' ? '/es' : '/'}
      className={className}
    >
      {locale === 'en' ? '🌐 Español' : '🌐 English'}
    </a>
  )
}
