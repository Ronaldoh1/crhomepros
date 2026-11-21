import type { Metadata } from 'next'
import { seoAlternates } from '@/lib/seo'

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return seoAlternates('blog', params.locale)
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
