'use client'

// A one-time hint on the client's portal page (iOS Safari only) telling them how
// to pin this page to their Home Screen, so they can reach their documents with
// one tap. Bilingual, light theme to match the portal. Shows nothing on other
// browsers or once installed/dismissed.

import { useEffect, useState } from 'react'
import { Share, X, Plus } from 'lucide-react'

const DISMISS_KEY = 'crhp_portal_a2hs_dismissed'

const T = {
  en: {
    title: 'Add this page to your Home Screen',
    sub: 'Open your documents with one tap, without the link.',
    s1a: 'Tap the', s1b: 'Share button', s1c: 'at the bottom of Safari.',
    s2a: 'Scroll down and tap', s2b: 'Add to Home Screen.',
    s3a: 'Tap', s3b: 'Add.', s3c: 'The CR Home Pros icon appears on your Home Screen.',
    foot: 'Do this once from Safari.',
  },
  es: {
    title: 'Agregue esta página a su pantalla de inicio',
    sub: 'Abra sus documentos con un solo toque, sin el enlace.',
    s1a: 'Toque el', s1b: 'botón Compartir', s1c: 'en la parte inferior de Safari.',
    s2a: 'Desplácese hacia abajo y toque', s2b: 'Agregar a inicio.',
    s3a: 'Toque', s3b: 'Agregar.', s3c: 'El icono de CR Home Pros aparecerá en su pantalla de inicio.',
    foot: 'Hágalo una vez desde Safari.',
  },
}

export function PortalAddToHomeScreen({ es }: { es: boolean }) {
  const [show, setShow] = useState(false)
  const t = es ? T.es : T.en

  useEffect(() => {
    const ua = navigator.userAgent || ''
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const isSafari = isIOS && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)
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
    <div className="rounded-2xl border-2 border-[#fd9b14] bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-bold text-[#0b1b33] flex items-center gap-2"><Plus className="w-4 h-4" /> {t.title}</p>
          <p className="text-sm text-slate-700 mt-1">{t.sub}</p>
          <ol className="mt-3 space-y-1.5 text-sm text-slate-900 list-decimal pl-5">
            <li>{t.s1a} <strong>{t.s1b}</strong> <Share className="inline w-3.5 h-3.5 align-text-bottom" /> {t.s1c}</li>
            <li>{t.s2a} <strong>{t.s2b}</strong></li>
            <li>{t.s3a} <strong>{t.s3b}</strong> {t.s3c}</li>
          </ol>
          <p className="text-xs text-slate-500 mt-3">{t.foot}</p>
        </div>
        <button onClick={dismiss} aria-label="Dismiss" className="flex-shrink-0 p-1.5 rounded-lg text-slate-500 hover:bg-black/5"><X className="w-5 h-5" /></button>
      </div>
    </div>
  )
}
