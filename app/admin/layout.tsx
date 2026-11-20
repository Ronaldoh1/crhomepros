import type { Metadata, Viewport } from 'next'
import AdminLayoutClient from './AdminLayoutClient'

// Server layout for the admin area. It renders the admin PWA tags into <head>
// on every /admin page (server-side, before iOS reads them), so pinning the
// portal to the iPhone Home Screen gives an icon that opens straight into
// /admin, full-screen, under the name "CR Admin". No client-side manifest swap.
export const metadata: Metadata = {
  title: 'CR Admin',
  manifest: '/admin-app.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'CR Admin',
    statusBarStyle: 'black-translucent',
  },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
