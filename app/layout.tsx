import type { Metadata } from 'next'
import { Suspense } from 'react'
import '@/styles/globals.css'
import { META, COMPANY } from '@/lib/constants'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'

export const metadata: Metadata = {
  title: {
    default: META.title,
    template: `%s | CR Home Pros`,
  },
  description: META.description,
  keywords: META.keywords,
  metadataBase: new URL(META.url),
  alternates: {
    canonical: META.url,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: META.url,
    title: META.title,
    description: META.description,
    siteName: 'CR Home Pros',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'CR Home Pros' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: META.title,
    description: META.description,
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

// Expanded JSON-LD schema with services, reviews, and bilingual support
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  '@id': META.url,
  name: COMPANY.name,
  alternateName: COMPANY.legalName,
  description: META.description,
  url: META.url,
  telephone: COMPANY.phoneFormatted,
  email: COMPANY.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.address.street,
    addressLocality: COMPANY.address.city,
    addressRegion: COMPANY.address.state,
    postalCode: COMPANY.address.zip,
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.9557,
    longitude: -76.9456,
  },
  areaServed: [
    { '@type': 'State', name: 'Maryland' },
    { '@type': 'State', name: 'Virginia' },
    { '@type': 'City', name: 'Washington, DC' },
  ],
  priceRange: '$$',
  image: META.url + '/images/logo.png',
  logo: META.url + '/images/logo.png',
  foundingDate: '2004',
  slogan: COMPANY.tagline,
  knowsLanguage: ['en', 'es'],
  paymentAccepted: 'Cash, Credit Card, Zelle, Venmo, Check, Klarna, Insurance Claims',
  currenciesAccepted: 'USD',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '07:00',
      closes: '19:00',
    },
  ],
  // Aggregate rating from Google reviews
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '50',
    bestRating: '5',
    worstRating: '1',
  },
  // Service catalog
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Home Improvement Services',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Remodeling',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Kitchen Remodeling', url: META.url + '/services/kitchen-remodeling' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bathroom Renovation', url: META.url + '/services/bathroom-renovation' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Basement Finishing', url: META.url + '/services/basement-finishing' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Complete Renovations', url: META.url + '/services/complete-renovations' } },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Exterior',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Roofing', url: META.url + '/services/roofing' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Concrete & Driveways', url: META.url + '/services/concrete-driveways' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Deck & Outdoor', url: META.url + '/services/deck-outdoor' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Fencing', url: META.url + '/services/fencing' } },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Specialty',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Painting', url: META.url + '/services/painting' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Flooring', url: META.url + '/services/flooring' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Insurance Claims', url: META.url + '/services/insurance-claims' } },
        ],
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#060828" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CR Home Pros" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
      </head>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
