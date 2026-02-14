import { i18n, isValidLocale } from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/config'
import { LocaleProvider } from '@/lib/i18n/provider'
import { Navbar, Footer, FloatingContact } from '@/components/layout'
import { BannerProvider } from '@/components/layout/PromoBanner'

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const locale: Locale = isValidLocale(params.locale) ? params.locale : 'en'

  return (
    <LocaleProvider locale={locale}>
      <BannerProvider>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingContact />
      </BannerProvider>
    </LocaleProvider>
  )
}
