import type { Metadata } from 'next'
import { seoAlternates } from '@/lib/seo'

// Sets this route's own canonical + hreflang. The page is a client component,
// so the canonical can't live on the page itself.
export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return seoAlternates('estimate', params.locale)
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
