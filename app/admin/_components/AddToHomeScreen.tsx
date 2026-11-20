'use client'

// A one-time hint on the admin login page (iOS Safari only) telling Carlos how
// to pin the portal to his Home Screen. The admin manifest itself is served from
// the admin layout's metadata (server-side), so the pinned icon opens into
// /admin full-screen — this component only shows the how-to.

import { useEffect, useState } from 'react'
import { Share, X, Plus } from 'lucide-react'

const DISMISS_KEY = 'crhp_a2hs_dismissed'

export function AddToHomeScreen() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent || ''
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    // Safari only: Chrome/Firefox/Edge on iOS carry CriOS/FxiOS/EdgiOS in the UA
    const isSafari = isIOS && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)
    // Already installed / running from the Home Screen icon: nothing to prompt
    const standalone = ('standalone' in navigator && (navigator as any).standalone) || window.matchMedia('(display-mode: standalone)').matches
    let dismissed = false
    try { dismissed = localStorage.getItem(DISMISS_KEY) === '1' } catch { /* ignore */ }
    if (isIOS && isSafari && !standalone && !dismissed) setShow(true)
  }, [])

  const dismiss = () => {
    setShow(false)
    try { localStorage.setItem(DISMISS_KEY, '1') } catch { /* ignore */ }
  }

  if (!show) return null

  return (
    <div className="mt-6 rounded-2xl border border-blue-300/40 bg-blue-900/40 p-4 text-left">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-semibold text-white flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add this to your Home Screen
          </p>
          <p className="text-sm text-blue-100 mt-1">Open the portal with one tap, full-screen, without typing the web address each time.</p>
          <ol className="mt-3 space-y-1.5 text-sm text-white list-decimal pl-5">
            <li>Tap the <strong>Share</strong> button <Share className="inline w-3.5 h-3.5 align-text-bottom" /> at the bottom of Safari.</li>
            <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
            <li>Tap <strong>Add</strong>. The <strong>CR Admin</strong> icon appears on your Home Screen.</li>
          </ol>
          <p className="text-xs text-blue-200/80 mt-3">Do this once from Safari. After that, just tap the icon — it stays signed in.</p>
        </div>
        <button onClick={dismiss} aria-label="Dismiss" className="flex-shrink-0 p-1.5 rounded-lg text-blue-100 hover:bg-white/10"><X className="w-5 h-5" /></button>
      </div>
    </div>
  )
}
