import type { Metadata } from 'next'

// A form page, not search content: keep it out of the index.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
