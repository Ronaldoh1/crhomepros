'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'

/** Warning pop-up with a Cancel and a Continue button. */
export function ConfirmDialog({
  open, title, children, confirmLabel = 'Continue', cancelLabel = 'Cancel', danger = false, busy = false, onConfirm, onCancel,
}: {
  open: boolean; title: string; children: React.ReactNode; confirmLabel?: string; cancelLabel?: string
  danger?: boolean; busy?: boolean; onConfirm: () => void; onCancel: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" role="alertdialog" aria-modal="true" aria-label={title}>
      <div className="bg-slate-900 border border-amber-400/40 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-300" />
          </div>
          <h3 className="text-lg font-bold text-white pt-1.5">{title}</h3>
        </div>
        <div className="text-sm text-slate-100 leading-relaxed space-y-2">{children}</div>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} autoFocus className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700 text-white hover:bg-slate-600 text-sm font-medium">{cancelLabel}</button>
          <button onClick={onConfirm} disabled={busy} className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium text-sm disabled:opacity-50 ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

/** Banner shown at the top of a document that has already been sent. */
export function SentNotice({ what }: { what: string }) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-500/10 p-4">
      <AlertTriangle className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-amber-50">
        <p className="font-semibold text-white">This {what} was already sent to the client.</p>
        <p className="mt-1">You can look at it and download the PDF. If you change something and send it again, it goes out marked as a <strong>correction</strong>, so the client knows it replaces the first one.</p>
      </div>
    </div>
  )
}

/** Things worth a second look before an email goes out. */
export function SendChecks({ items }: { items: Array<string | false | null | undefined> }) {
  const list = items.filter(Boolean) as string[]
  if (!list.length) return null
  return (
    <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-3">
      <p className="text-sm font-semibold text-white flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-300" /> Check before you send</p>
      <ul className="mt-1.5 list-disc pl-5 text-sm text-amber-50 space-y-0.5">
        {list.map(t => <li key={t}>{t}</li>)}
      </ul>
    </div>
  )
}

/**
 * Warns before leaving the page (closing the tab, or clicking a menu link)
 * while the form has changes that were not saved.
 * Call the returned function right after loading or saving.
 */
export function useUnsavedWarning(value: Record<string, any>) {
  const key = JSON.stringify({ ...value, signatureData: undefined })
  const clean = useRef(key)
  const pending = useRef(false)
  if (pending.current) { clean.current = key; pending.current = false }
  const dirty = key !== clean.current
  const dirtyRef = useRef(dirty)
  dirtyRef.current = dirty

  useEffect(() => {
    const onUnload = (e: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return
      e.preventDefault()
      e.returnValue = ''
    }
    const onClick = (e: MouseEvent) => {
      if (!dirtyRef.current) return
      const a = (e.target as HTMLElement | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      if (a.href.startsWith('blob:') || a.href.startsWith('mailto:') || a.href.startsWith('tel:')) return
      if (!window.confirm('You have changes that are not saved.\n\nLeave this page and lose them?')) {
        e.preventDefault()
        e.stopPropagation()
      } else {
        dirtyRef.current = false
        clean.current = key
      }
    }
    window.addEventListener('beforeunload', onUnload)
    document.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener('beforeunload', onUnload)
      document.removeEventListener('click', onClick, true)
    }
  }, [key])

  return () => { pending.current = true }
}
