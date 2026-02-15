import { NextRequest, NextResponse } from 'next/server'
import { i18n } from './lib/i18n/config'

function getLocale(request: NextRequest): string {
  // Check if locale already in URL
  const { pathname } = request.nextUrl
  for (const locale of i18n.locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale
    }
  }

  // DISABLED: Auto language detection
  // Always default to English unless explicitly /es/ in URL
  // Users can manually switch using language selector
  
  return i18n.defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip for API routes, static files, images, etc.
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/manifest') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if locale prefix exists
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Redirect to locale-prefixed path
  // Default: English visitors get /en/..., Spanish get /es/...
  // But for root path, default locale doesn't redirect (keeps clean URLs)
  const locale = getLocale(request)

  // For the default locale (en), rewrite instead of redirect to keep clean URLs
  if (locale === i18n.defaultLocale) {
    const url = request.nextUrl.clone()
    url.pathname = `/en${pathname}`
    return NextResponse.rewrite(url)
  }

  // For non-default locales, redirect so the URL shows /es/...
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
}
