'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Bell, X, CheckCircle, FileSignature, UserPlus, MessageSquare, Receipt, Users, CalendarClock, Images, ArrowRight,
} from 'lucide-react'
import { markMessagesRead } from '@/lib/firebase-auth'
import { loadAdminNotices, type AdminNotice, type AdminStats } from '@/lib/admin-notices'

const ICONS: Record<string, any> = { CheckCircle, FileSignature, UserPlus, MessageSquare, Receipt, Users, CalendarClock, Images }
export const noticeIcon = (name: string) => ICONS[name] || Bell
const DISMISS_KEY = 'crhp_banner_dismissed_until' // newest notification time Carlos has dismissed the banner for

interface Ctx {
  notices: AdminNotice[]
  stats: AdminStats
  loading: boolean
  /** newest notification timestamp, 0 when none */
  newest: number
  refresh: () => Promise<void>
  markAllRead: () => Promise<void>
}
const NotificationsContext = createContext<Ctx | null>(null)
export const useNotifications = () => {
  const c = useContext(NotificationsContext)
  if (!c) throw new Error('useNotifications must be used inside NotificationsProvider')
  return c
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notices, setNotices] = useState<AdminNotice[]>([])
  const [stats, setStats] = useState<AdminStats>({ leads: 0, estimates: 0, toSign: 0, inContract: 0 })
  const [loading, setLoading] = useState(true)
  const newest = notices.reduce((m, n) => Math.max(m, n.when || 0), 0)

  const refresh = useCallback(async () => {
    try {
      const { notices, stats } = await loadAdminNotices()
      setNotices(notices)
      setStats(stats)
    } catch (e) { console.error('Notifications load failed:', e) }
    setLoading(false)
  }, [])

  const markAllRead = useCallback(async () => {
    const ids = notices.map(n => n.messageId).filter(Boolean) as string[]
    if (ids.length) await markMessagesRead(ids).catch(() => {})
    // dismiss the banner up to the newest thing we have, so it won't pop back for the same items
    try { localStorage.setItem(DISMISS_KEY, String(newest)) } catch { /* ignore */ }
    await refresh()
  }, [notices, newest, refresh])

  // Load once, and again whenever Carlos finishes an action (toasts fire this event)
  useEffect(() => {
    refresh()
    const onAction = () => refresh()
    window.addEventListener('crhp-admin-action', onAction)
    // also refresh when he comes back to the tab
    const onVisible = () => { if (document.visibilityState === 'visible') refresh() }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('crhp-admin-action', onAction)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [refresh])

  return (
    <NotificationsContext.Provider value={{ notices, stats, loading, newest, refresh, markAllRead }}>
      {children}
    </NotificationsContext.Provider>
  )
}

/** Call after any action (send, save, status change) so the count stays current. */
export function pingNotifications() {
  try { window.dispatchEvent(new Event('crhp-admin-action')) } catch { /* server render */ }
}

/**
 * A strip across the top of every admin page when there are notifications.
 * Carlos can open the dashboard from it or dismiss it. Once dismissed it stays
 * hidden until something NEWER arrives — not merely because items are unread.
 */
export function NotificationBanner() {
  const { notices, newest } = useNotifications()
  const [dismissedUntil, setDismissedUntil] = useState<number>(() => {
    try { return Number(localStorage.getItem(DISMISS_KEY) || 0) } catch { return 0 }
  })
  // keep in step if another tab/markAllRead changed it
  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === DISMISS_KEY) setDismissedUntil(Number(e.newValue || 0)) }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const count = notices.length
  const show = count > 0 && newest > dismissedUntil
  const seenRef = useRef(0)
  useEffect(() => { if (show) seenRef.current = newest }, [show, newest])
  if (!show) return null

  const dismiss = () => {
    setDismissedUntil(newest)
    try { localStorage.setItem(DISMISS_KEY, String(newest)) } catch { /* ignore */ }
  }
  const top = notices[0]

  return (
    <div className="sticky top-0 z-40 bg-amber-500 text-slate-950 shadow-lg">
      <div className="max-w-6xl mx-auto px-3 sm:px-5 py-2.5 flex items-center gap-3">
        <span className="relative flex-shrink-0">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">{count}</span>
        </span>
        <Link href="/admin" className="flex-1 min-w-0 group">
          <span className="font-bold">{count} notification{count === 1 ? '' : 's'}</span>
          {top && <span className="hidden sm:inline text-slate-900 font-medium"> · {top.title}</span>}
        </Link>
        <Link href="/admin" className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 text-white text-sm font-bold hover:bg-slate-800">
          View <ArrowRight className="w-4 h-4" />
        </Link>
        <button onClick={dismiss} aria-label="Dismiss" className="flex-shrink-0 p-1.5 rounded-lg hover:bg-black/10"><X className="w-5 h-5" /></button>
      </div>
    </div>
  )
}
