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

  const COOKIE = 'NEXT_LOCALE'
  const ONE_YEAR = 60 * 60 * 24 * 365
  const remember = (res: NextResponse, locale: string) => {
    res.cookies.set(COOKIE, locale, { path: '/', maxAge: ONE_YEAR, sameSite: 'lax' })
    return res
  }

  // /es/... : Spanish. Remember it so the bare site opens in Spanish next time.
  if (pathname === '/es' || pathname.startsWith('/es/')) {
    return remember(NextResponse.next(), 'es')
  }

  // /en/... : the "English" switch. Remember English and send the visitor to
  // the clean URL (English pages have no /en prefix).
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/en/, '') || '/'
    return remember(NextResponse.redirect(url), 'en')
  }

  // No prefix: use the saved choice. Spanish visitors go back to /es/...,
  // everyone else gets English (first-time visitors default to English).
  const saved = request.cookies.get(COOKIE)?.value
  if (saved === 'es') {
    const url = request.nextUrl.clone()
    url.pathname = `/es${pathname === '/' ? '' : pathname}`
    return NextResponse.redirect(url)
  }

  const url = request.nextUrl.clone()
  url.pathname = `/en${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
}
