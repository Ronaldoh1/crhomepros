'use client'

import { useEffect, useState } from 'react'
import { Send, Pencil, Loader2, Mail, ChevronDown, AlertTriangle, Paperclip } from 'lucide-react'

export interface SummaryRow { label: string; value: string; highlight?: boolean }

/**
 * The last look before something goes to a client: who it goes to, what is
 * in it, the total, and two choices: Edit (go back) or Send.
 */
export function SendSummary({
  open, kind, number, clientName, clientEmail, project, rows, totalLabel, total, checks = [], note,
  subject, onSubject, message, onMessage, sending, sendLabel, onEdit, onSend,
}: {
  open: boolean
  kind: string // "Invoice", "Contract", "Estimate"
  number?: string
  clientName: string
  clientEmail: string
  project?: string
  rows: SummaryRow[]
  totalLabel: string
  total: string
  checks?: Array<string | false | null | undefined>
  /** One line under the total, e.g. what the client can do with it */
  note?: string
  subject?: string
  onSubject?: (v: string) => void
  message?: string
  onMessage?: (v: string) => void
  sending: boolean
  sendLabel?: string
  onEdit: () => void
  onSend: () => void
}) {
  const [showEmail, setShowEmail] = useState(false)
  useEffect(() => { if (open) setShowEmail(false) }, [open])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !sending) onEdit() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, sending, onEdit])
  if (!open) return null
  const warnings = checks.filter(Boolean) as string[]
  const ic = 'w-full bg-slate-800 border border-white/30 rounded-xl px-4 py-3 text-white text-base outline-none focus:border-blue-400'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Send ${kind}`}>
      <div className="w-full max-w-lg max-h-[94vh] overflow-y-auto rounded-2xl bg-[#0b1b33] border border-[#fd9b14] shadow-2xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b-4 border-[#fd9b14] flex items-center justify-between gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/logo-wordmark.png" alt="CR Home Pros" className="h-12 w-auto" />
          <div className="text-right">
            <p className="text-[#fd9b14] text-xs font-bold tracking-[0.2em] uppercase">Ready to send</p>
            <p className="text-white text-xl font-bold leading-tight">{kind}</p>
            {number && <p className="text-white text-sm">No. {number}</p>}
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Who */}
          <div className="rounded-xl bg-white p-4">
            <p className="text-xs font-bold tracking-wide uppercase text-[#b45309]">Sending to</p>
            <p className="text-lg font-bold text-slate-900 leading-tight mt-0.5">{clientName || 'No name'}</p>
            <p className="text-slate-900 flex items-center gap-1.5 break-all"><Mail className="w-4 h-4 flex-shrink-0 text-[#0b1b33]" /> {clientEmail}</p>
            {project && <p className="text-slate-900 mt-1.5"><span className="font-semibold">Job:</span> {project}</p>}
          </div>

          {/* What */}
          <div className="rounded-xl border border-white/30 overflow-hidden">
            {rows.map((r, i) => (
              <div key={i} className={`flex items-start justify-between gap-4 px-4 py-2.5 text-white ${i ? 'border-t border-white/20' : ''} ${r.highlight ? 'bg-blue-800 font-semibold' : ''}`}>
                <span>{r.label}</span><span className="text-right font-semibold whitespace-pre-line">{r.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 px-4 py-4 bg-[#fd9b14] text-slate-950">
              <span className="font-bold uppercase tracking-wide text-sm">{totalLabel}</span>
              <span className="text-2xl font-extrabold">{total}</span>
            </div>
          </div>
          {note && <p className="text-white text-sm flex items-start gap-2"><Paperclip className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#fd9b14]" /> {note}</p>}

          {warnings.length > 0 && (
            <div className="rounded-xl border border-amber-300 bg-amber-800 p-3">
              <p className="text-sm font-bold text-white flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Check before you send</p>
              <ul className="mt-1 list-disc pl-5 text-sm text-white space-y-0.5">{warnings.map(w => <li key={w}>{w}</li>)}</ul>
            </div>
          )}

          {/* The email text, tucked away */}
          {onSubject && onMessage && (
            <div>
              <button type="button" onClick={() => setShowEmail(!showEmail)} className="text-sm text-white underline flex items-center gap-1.5"><ChevronDown className={`w-4 h-4 transition-transform ${showEmail ? 'rotate-180' : ''}`} /> {showEmail ? 'Hide the email message' : 'Read or change the email message'}</button>
              {showEmail && (
                <div className="mt-3 space-y-3">
                  <div><label className="text-sm font-medium text-white mb-1 block">Subject</label><input value={subject} onChange={e => onSubject(e.target.value)} className={ic} /></div>
                  <div><label className="text-sm font-medium text-white mb-1 block">Message</label><textarea value={message} onChange={e => onMessage(e.target.value)} rows={7} className={ic} /></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Two choices */}
        <div className="sticky bottom-0 grid grid-cols-2 gap-3 p-4 bg-[#0b1b33] border-t border-white/25">
          <button onClick={onEdit} disabled={sending} className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-slate-700 text-white text-base font-semibold hover:bg-slate-600 disabled:opacity-50"><Pencil className="w-5 h-5" /> Edit</button>
          <button onClick={onSend} disabled={sending} className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-green-600 text-white text-base font-bold hover:bg-green-700 disabled:opacity-80">{sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} {sending ? 'Sending…' : sendLabel || 'Send'}</button>
        </div>
      </div>
    </div>
  )
}

/**
 * Percent box: numbers only, no up/down arrows. Typing 6 means 6.00%,
 * 6.5 means 6.50%. Shows two decimals once you leave the box.
 */
export function PercentInput({ value, onChange, className = '' }: { value: number; onChange: (n: number) => void; className?: string }) {
  const [text, setText] = useState(value ? value.toFixed(2) : '')
  const [focused, setFocused] = useState(false)
  // follow changes from outside (a loaded draft) unless Carlos is typing
  useEffect(() => { if (!focused) setText(value ? value.toFixed(2) : '') }, [value, focused])
  return (
    <input
      type="text" inputMode="decimal" autoComplete="off" aria-label="Tax percent" placeholder="0.00"
      value={text}
      onFocus={e => { setFocused(true); e.target.select() }}
      onChange={e => {
        // digits and one decimal point, at most two decimals, never above 100
        let t = e.target.value.replace(',', '.').replace(/[^\d.]/g, '')
        const dot = t.indexOf('.')
        if (dot !== -1) t = t.slice(0, dot + 1) + t.slice(dot + 1).replace(/\./g, '').slice(0, 2)
        if (Number(t) > 100) t = '100'
        setText(t)
        onChange(Number(t) || 0)
      }}
      onBlur={() => { setFocused(false); setText(value ? value.toFixed(2) : '') }}
      className={className}
    />
  )
}

/**
 * Dollar box: numbers only, no up/down arrows. Typing 2000 means $2,000.00,
 * 2050.5 means $2,050.50. Shows commas and two decimals once you leave the box.
 */
export function MoneyInput({ value, onChange, className = '', placeholder = '0.00', ariaLabel = 'Amount in dollars' }: { value: number; onChange: (n: number) => void; className?: string; placeholder?: string; ariaLabel?: string }) {
  const pretty = (n: number) => (n ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '')
  const [text, setText] = useState(pretty(value))
  const [focused, setFocused] = useState(false)
  useEffect(() => { if (!focused) setText(pretty(value)) }, [value, focused]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white text-base font-semibold pointer-events-none">$</span>
      <input
        type="text" inputMode="decimal" autoComplete="off" aria-label={ariaLabel} placeholder={placeholder}
        value={text}
        onFocus={e => { setFocused(true); setText(value ? String(value) : ''); requestAnimationFrame(() => e.target.select()) }}
        onChange={e => {
          // digits and one decimal point, at most two decimals
          let t = e.target.value.replace(/[^\d.]/g, '')
          const dot = t.indexOf('.')
          if (dot !== -1) t = t.slice(0, dot + 1) + t.slice(dot + 1).replace(/\./g, '').slice(0, 2)
          if (Number(t) > 99999999) t = '99999999'
          setText(t)
          onChange(Math.round((Number(t) || 0) * 100) / 100)
        }}
        onBlur={() => { setFocused(false); setText(pretty(value)) }}
        className={className + ' pl-8'}
      />
    </div>
  )
}
