import type { Metadata } from 'next'

// Private client pages: never indexed, and the private link is not passed on
export const metadata: Metadata = {
  title: 'Your page',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
