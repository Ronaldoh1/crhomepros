'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone } from 'lucide-react'
import { COMPANY } from '@/lib/constants'
import { formatPhoneLink } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/provider'
import { useLocalePath } from '@/lib/i18n/link'

// Fixed bottom bar on phones: Call + Request an Estimate.
// Hidden on the estimate form itself so it never covers form fields.
export function MobileActionBar() {
  const r = useTranslation().redesign
  const lp = useLocalePath()
  const pathname = usePathname()

  const onForm = /\/(get-started|estimate|contact)(\/|$)/.test(pathname)
  if (onForm) return null

  return (
    <>
      {/* Spacer so page content never sits under the bar */}
      <div className="h-[68px] lg:hidden" aria-hidden="true" />
      <div
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[2fr_3fr] border-t border-white/10 bg-dark-900 lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <a
          href={formatPhoneLink(COMPANY.phone)}
          className="flex h-[68px] items-center justify-center gap-2 text-base font-semibold text-white active:bg-white/10"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          {r.call}
        </a>
        <Link
          href={lp('/get-started')}
          className="flex h-[68px] items-center justify-center bg-gold-500 text-base font-semibold text-dark-900 active:bg-gold-400"
        >
          {r.cta}
        </Link>
      </div>
    </>
  )
}
