import type { Metadata } from 'next'
import '@/styles/globals.css'
import { META, COMPANY } from '@/lib/constants'

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
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
