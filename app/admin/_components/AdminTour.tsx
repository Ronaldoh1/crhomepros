'use client'

import { useEffect, useState } from 'react'
import { Receipt, FileText, Send, AlertTriangle, LayoutDashboard, X } from 'lucide-react'

const COUNT_KEY = 'crhp_admin_tour_count'
const SESSION_KEY = 'crhp_admin_tour_seen_this_visit'
const MAX_SHOWS = 3
export const TOUR_EVENT = 'crhp-show-tour'

const STEPS = [
  {
    icon: LayoutDashboard,
    title: 'Welcome to your admin portal',
    body: 'This is where you make invoices, change orders and contracts, send them to clients, and see the people who asked for an estimate. The menu is on the left (on a phone, tap the three lines at the top).',
  },
  {
    icon: Receipt,
    title: 'Making a document',
    body: 'Pick "Generate Invoice", "Generate Change Order" or "Generate Contract". Fill in the client, the work and the prices. "Preview" shows how it will look, and "Generate PDF" opens the PDF so you can check it or print it.',
  },
  {
    icon: FileText,
    title: 'Drafts and Sent',
    body: '"Save Draft" keeps your work without sending anything. Find it later under "Drafts" and continue. Once you send a document, it moves to "Sent".',
  },
  {
    icon: Send,
    title: 'Sending to a client',
    body: '"Send to Client" emails the client right away with the PDF attached. You get a copy at crhomepros@gmail.com, and when the client replies, the reply comes to that inbox. Check the email address and the total before you press Send. An email cannot be taken back.',
  },
  {
    icon: AlertTriangle,
    title: 'Fixing something already sent',
    body: 'Open it from "Sent", make the change, and press "Send Correction". The client gets a new email marked as a correction that replaces the first one. The portal warns you before it sends, and before you delete anything or leave a page with unsaved changes.',
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
      <div className="bg-slate-900 border border-blue-400/40 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">Step {step + 1} of {STEPS.length}</p>
          <button onClick={() => setOpen(false)} aria-label="Close walkthrough" className="text-slate-200 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-600/30 flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-blue-200" /></div>
        <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
        <p className="text-base text-slate-100 leading-relaxed">{s.body}</p>

        <div className="flex gap-1.5 mt-5" aria-hidden="true">
          {STEPS.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-blue-400' : 'bg-slate-700'}`} />)}
        </div>

        <div className="flex gap-3 mt-5">
          {step > 0
            ? <button onClick={() => setStep(step - 1)} className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700 text-white hover:bg-slate-600 text-sm font-medium">Back</button>
            : <button onClick={() => setOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700 text-white hover:bg-slate-600 text-sm font-medium">Skip</button>}
          <button onClick={() => (last ? setOpen(false) : setStep(step + 1))} className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium">{last ? 'Got it' : 'Next'}</button>
        </div>

        <p className="mt-4 text-sm text-amber-100">
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
