import { MetadataRoute } from 'next'
import { SERVICES } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://crhomepros.com'
  const locales = ['', '/es']

  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/projects',
    '/reviews',
    '/contact',
    '/get-started',
    '/estimate',
    '/referrals',
    '/financing',
    '/estimate-cost',
    '/pricing',
    '/blog',
  ]

  // Generate entries for both locales
  const staticPages = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${baseUrl}${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  )

  // Service pages for both locales
  const servicePages = locales.flatMap((locale) =>
    SERVICES.map((service) => ({
      url: `${baseUrl}${locale}/services/${service.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  return [...staticPages, ...servicePages]
}
