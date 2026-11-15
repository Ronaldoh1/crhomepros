'use client'

import Link from 'next/link'
import {
  Receipt, Briefcase, Users, Star, ArrowRight, Camera, Bell, MessageSquare, FileSignature, Images,
  CheckCircle, Loader2, Megaphone, Settings, ClipboardList,
} from 'lucide-react'
import { useToast } from './_components/Toast'
import { useNotifications, noticeIcon } from './_components/Notifications'

const quickActions = [
  { label: 'New estimate', href: '/admin/estimates/new', icon: Camera, desc: 'Photos and notes at a job visit', color: 'from-slate-600 to-slate-700' },
  { label: 'Create contract', href: '/admin/contracts', icon: Briefcase, desc: 'Tax and payments, signed online', color: 'from-green-600 to-green-700' },
  { label: 'Invoices to approve', href: '/admin/invoices/drafts', icon: Receipt, desc: 'Made when a contract is signed', color: 'from-blue-600 to-blue-700' },
  { label: 'Leads and referrals', href: '/admin/leads', icon: Users, desc: 'People who asked for an estimate', color: 'from-cyan-600 to-cyan-700' },
  { label: 'Client messages', href: '/admin/messages', icon: MessageSquare, desc: 'Notes and questions from clients', color: 'from-indigo-600 to-indigo-700' },
  { label: 'Past projects', href: '/admin/past-projects', icon: Images, desc: 'Before and after photos of your jobs', color: 'from-amber-600 to-amber-700' },
  { label: 'Reviews', href: '/admin/reviews', icon: Star, desc: 'Approve reviews for the website', color: 'from-yellow-600 to-yellow-700' },
  { label: 'Promo banners', href: '/admin/banners', icon: Megaphone, desc: 'Offers shown on the website', color: 'from-rose-600 to-rose-700' },
  { label: 'Site settings', href: '/admin/settings', icon: Settings, desc: 'Banner, contact details, payments', color: 'from-orange-600 to-orange-700' },
]

const ms = (t: any) => (t?.toDate ? t.toDate().getTime() : t ? new Date(t).getTime() : 0)
const ago = (t?: number) => {
  if (!t) return ''
  const m = Math.round((Date.now() - t) / 60000)
  return m < 60 ? `${Math.max(m, 1)} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`
}
const today = () => new Date().toISOString().split('T')[0]

export default function AdminDashboard() {
  const toast = useToast()
  const { notices, stats, loading, markAllRead } = useNotifications()

  const ago = (t?: number) => {
    if (!t) return ''
    const m = Math.round((Date.now() - t) / 60000)
    return m < 60 ? `${Math.max(m, 1)} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`
  }

  const clearAll = async () => {
    if (!notices.some(n => n.messageId)) return
    await markAllRead()
    toast('Notifications marked as read')
  }

  const stat = (label: string, value: number, href: string, Icon: any, tone: string) => (
    <Link href={href} className="bg-slate-800/60 border border-white/25 rounded-xl p-4 hover:border-white/30">
      <div className={`w-9 h-9 rounded-lg ${tone} flex items-center justify-center mb-2`}><Icon className="w-5 h-5" /></div>
      <p className="text-2xl font-bold text-white">{loading ? '…' : value}</p>
      <p className="text-sm text-white">{label}</p>
    </Link>
  )

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Welcome back, Carlos</h1>
        <p className="text-white mt-1">What needs your attention, and shortcuts to everything else.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stat('New leads', stats.leads, '/admin/leads', Users, 'bg-cyan-800 text-white')}
        {stat('Open estimates', stats.estimates, '/admin/estimates', ClipboardList, 'bg-blue-800 text-white')}
        {stat('Waiting for signature', stats.toSign, '/admin/contracts/sent', FileSignature, 'bg-amber-800 text-white')}
        {stat('In contract', stats.inContract, '/admin/contracts/sent', CheckCircle, 'bg-green-800 text-white')}
      </div>

      {/* Notifications */}
      <div className="bg-slate-800/60 border border-white/25 rounded-2xl p-4 sm:p-5 mb-8">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="font-semibold text-white text-lg flex items-center gap-2"><Bell className="w-5 h-5 text-amber-300" /> Notifications {notices.length > 0 && <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold">{notices.length}</span>}</h2>
          {notices.some(n => n.messageId) && <button onClick={clearAll} className="text-sm px-3 py-1.5 rounded-lg bg-slate-700 text-white hover:bg-slate-600">Mark as read</button>}
        </div>
        {loading ? <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-blue-300" /></div>
          : notices.length === 0 ? <p className="text-white flex items-center gap-2 py-2"><CheckCircle className="w-5 h-5 text-green-300" /> You are all caught up.</p>
          : (
            <div className="space-y-2">
              {notices.map(n => { const Icon = noticeIcon(n.icon); return (
                <div key={n.key} className="flex items-start gap-3 rounded-xl bg-slate-900/60 border border-white/25 p-3">
                  <div className={`w-9 h-9 rounded-lg ${n.tone} flex items-center justify-center flex-shrink-0`}><Icon className="w-5 h-5" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{n.title}</p>
                    {n.detail && <p className="text-sm text-white line-clamp-2">{n.detail}</p>}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Link href={n.href} className="px-3 py-1.5 rounded-lg bg-white text-slate-950 text-sm font-bold">{n.open || 'Open'}</Link>
                      {n.second && <Link href={n.second.href} className="px-3 py-1.5 rounded-lg bg-slate-700 text-white text-sm font-semibold">{n.second.label}</Link>}
                      <span className="text-xs text-white ml-auto">{ago(n.when)}</span>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )}
      </div>

      <h2 className="font-semibold text-white mb-3 text-lg">Shortcuts</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickActions.map(a => (
          <Link key={a.label} href={a.href} className="group flex items-center gap-4 p-4 bg-slate-800/60 border border-white/25 rounded-xl hover:border-white/30">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white flex-shrink-0`}><a.icon className="w-5 h-5" /></div>
            <div className="flex-1 min-w-0"><p className="font-semibold text-white text-sm">{a.label}</p><p className="text-xs text-white">{a.desc}</p></div>
            <ArrowRight className="w-4 h-4 text-white flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
