'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { CheckCircle, AlertTriangle, X } from 'lucide-react'

type ToastKind = 'success' | 'error'
interface ToastItem { id: number; text: string; kind: ToastKind }
const Ctx = createContext<(text: string, kind?: ToastKind) => void>(() => {})

/** Small confirmation message: "Invoice sent to maria@...", "Draft saved", etc. */
export const useToast = () => useContext(Ctx)

const PENDING = 'crhp_pending_toast'
/** Show a toast after a full page change (kept for one navigation) */
export function toastAfterNavigation(text: string) {
  try { sessionStorage.setItem(PENDING, text) } catch { /* ignore */ }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const show = useCallback((text: string, kind: ToastKind = 'success') => {
    const id = Date.now() + Math.random()
    setItems(prev => [...prev.slice(-2), { id, text, kind }])
    setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), kind === 'error' ? 9000 : 5500)
  }, [])

  useEffect(() => {
    try {
      const t = sessionStorage.getItem(PENDING)
      if (t) { sessionStorage.removeItem(PENDING); show(t) }
    } catch { /* ignore */ }
  }, [show])

  return (
    <Ctx.Provider value={show}>
      {children}
      <div className="fixed z-[80] top-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:w-96 space-y-2 pointer-events-none" role="status" aria-live="polite">
        {items.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-2xl text-white ${t.kind === 'error' ? 'bg-red-700 border-red-300' : 'bg-green-700 border-green-300'}`}>
            {t.kind === 'error' ? <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            <p className="text-sm font-medium flex-1">{t.text}</p>
            <button onClick={() => setItems(prev => prev.filter(x => x.id !== t.id))} aria-label="Close"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
