'use client'

import { useEffect, useState } from 'react'
import { Receipt, FileText, Send, AlertTriangle, LayoutDashboard, Camera, X } from 'lucide-react'

const COUNT_KEY = 'crhp_admin_tour_count'
const SESSION_KEY = 'crhp_admin_tour_seen_this_visit'
const MAX_SHOWS = 3
export const TOUR_EVENT = 'crhp-show-tour'

const STEPS = [
  {
    icon: LayoutDashboard,
    title: 'Welcome to your admin portal',
    body: 'The dashboard shows what needs your attention: new requests, client notes and questions, signed contracts, referrals and follow-ups. The menu is on the left (on a phone, tap the three lines at the top).',
  },
  {
    icon: Camera,
    title: 'Estimates at the job site',
    body: 'On your phone, open "Field Estimates" and press New. Take photos, then write the measurements, materials and your price. "Send to client" emails the client a private link where they see the price and photos and can write you a note.',
  },
  {
    icon: FileText,
    title: 'Contracts signed online',
    body: 'From an estimate press "Create contract". When you send it, the client gets a link to review it, ask questions and sign on their phone or computer. Once signed it shows "In contract" and a past project is started for you.',
  },
  {
    icon: Receipt,
    title: 'Invoices',
    body: '"Create invoice" on an estimate fills in the client and price. Sending emails the PDF right away and takes you to the Sent list, with a green message confirming it went out. Drafts wait under "Drafts".',
  },
  {
    icon: Send,
    title: 'Messages and referrals',
    body: 'Client notes and questions arrive under "Client Messages". Answer there and the client gets an email. Clients can also refer friends from their page: referrals show under "Leads and Referrals" with a note on whether the person who referred is a past client.',
  },
  {
    icon: AlertTriangle,
    title: 'Fixing and warnings',
    body: 'To fix a sent invoice, open it from "Sent" and press "Send Correction". A signed contract cannot be changed. The portal warns you before it sends a correction, deletes anything, or leaves a page with unsaved changes.',
  },
]

/**
 * Short walkthrough shown the first three visits to the admin portal.
 * Counted per browser, once per visit. Can be reopened from the menu.
 */
export function AdminTour() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [showNumber, setShowNumber] = useState(0) // 1..3 when shown automatically, 0 when opened from the menu

  useEffect(() => {
    try {
      const count = Number(localStorage.getItem(COUNT_KEY) || 0)
      if (count < MAX_SHOWS && !sessionStorage.getItem(SESSION_KEY)) {
        sessionStorage.setItem(SESSION_KEY, '1')
        localStorage.setItem(COUNT_KEY, String(count + 1))
        setShowNumber(count + 1)
        setOpen(true)
      }
    } catch { /* storage blocked: skip the automatic walkthrough */ }
    const reopen = () => { setShowNumber(0); setStep(0); setOpen(true) }
    window.addEventListener(TOUR_EVENT, reopen)
    return () => window.removeEventListener(TOUR_EVENT, reopen)
  }, [])

  if (!open) return null
  const s = STEPS[step]
  const Icon = s.icon
  const last = step === STEPS.length - 1
  const left = MAX_SHOWS - showNumber

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Admin portal walkthrough">
      <div className="bg-slate-900 border border-blue-300 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-white">Step {step + 1} of {STEPS.length}</p>
          <button onClick={() => setOpen(false)} aria-label="Close walkthrough" className="text-white hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-800 flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-white" /></div>
        <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
        <p className="text-base text-white leading-relaxed">{s.body}</p>

        <div className="flex gap-1.5 mt-5" aria-hidden="true">
          {STEPS.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-blue-400' : 'bg-slate-700'}`} />)}
        </div>

        <div className="flex gap-3 mt-5">
          {step > 0
            ? <button onClick={() => setStep(step - 1)} className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700 text-white hover:bg-slate-600 text-sm font-medium">Back</button>
            : <button onClick={() => setOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700 text-white hover:bg-slate-600 text-sm font-medium">Skip</button>}
          <button onClick={() => (last ? setOpen(false) : setStep(step + 1))} className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium">{last ? 'Got it' : 'Next'}</button>
        </div>

        <p className="mt-4 text-sm text-white">
          {showNumber === 0
            ? 'You opened this from the menu. You can open it again any time.'
            : left > 0
              ? `This walkthrough shows the first ${MAX_SHOWS} times you open the portal. This is time ${showNumber} of ${MAX_SHOWS}. After the third time it will not show again by itself.`
              : `This is the third and last time this walkthrough shows by itself. After today, open it any time from "Show walkthrough" in the menu.`}
        </p>
      </div>
    </div>
  )
}
