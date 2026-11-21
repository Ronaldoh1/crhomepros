import type { Metadata } from 'next'
import { META } from './constants'

// Per-page canonical + hreflang. Without this, every page inherits the root
// layout's canonical (the homepage), which tells Google each page is a duplicate
// of the home page and suppresses it from search. Call it from a page's
// generateMetadata with the path (no locale prefix, no leading slash for a
// sub-path; '' for a section index) and the current locale.
//
//   export function generateMetadata({ params }) {
//     return { title: 'Roofing', ...seoAlternates('services/roofing', params.locale) }
//   }
//
// English lives at the bare path; Spanish at /es/<path>. Each page points its
// canonical at itself and lists both language versions as alternates.
export function seoAlternates(path: string, locale?: string): Pick<Metadata, 'alternates'> {
  const clean = path.replace(/^\/+|\/+$/g, '')
  const sub = clean ? `/${clean}` : ''
  const en = `${META.url}${sub}`
  const es = `${META.url}/es${sub}`
  const self = locale === 'es' ? es : en
  return {
    alternates: {
      canonical: self,
      languages: { 'en-US': en, 'es-ES': es, 'x-default': en },
    },
  }
}
