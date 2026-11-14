'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Receipt, Briefcase, Users, Star, ArrowRight, Camera, Bell, MessageSquare, FileSignature, UserPlus, Images, CalendarClock,
  CheckCircle, Loader2, Megaphone, Settings, ClipboardList,
} from 'lucide-react'
import {
  getClientMessages, markMessagesRead, getLeads, getReferrals, getFieldNotes, getAllDocuments, getPastProjects,
  type ClientMessage,
} from '@/lib/firebase-auth'
import { useToast } from './_components/Toast'

interface Notice { key: string; icon: any; tone: string; title: string; detail?: string; href: string; when?: number; messageId?: string }

const quickActions = [
  { label: 'New field estimate', href: '/admin/field-notes', icon: Camera, desc: 'Photos and notes at a job visit', color: 'from-slate-600 to-slate-700' },
  { label: 'Create contract', href: '/admin/contracts', icon: Briefcase, desc: 'Send it for the client to sign online', color: 'from-green-600 to-green-700' },
  { label: 'Create invoice', href: '/admin/invoices', icon: Receipt, desc: 'Email it with the PDF attached', color: 'from-blue-600 to-blue-700' },
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
  const [loading, setLoading] = useState(true)
  const [notices, setNotices] = useState<Notice[]>([])
  const [stats, setStats] = useState({ leads: 0, estimates: 0, toSign: 0, inContract: 0 })

  const load = async () => {
    const safe = async <T,>(p: Promise<T[]>): Promise<T[]> => { try { return await p } catch (e) { console.error(e); return [] } }
    const [messages, leads, referrals, notes, docs, projects] = await Promise.all([
      safe(getClientMessages(100)), safe(getLeads()), safe(getReferrals()), safe(getFieldNotes()), safe(getAllDocuments()), safe(getPastProjects()),
    ])
    const list: Notice[] = []

    messages.filter((m: ClientMessage) => !m.read && m.from !== 'carlos').forEach(m => {
      const who = m.clientName || m.clientEmail
      if (m.kind === 'signed') list.push({ key: m.id!, messageId: m.id, icon: FileSignature, tone: 'bg-green-500/25 text-green-200', title: `${who} signed ${m.docLabel || 'a contract'}`, detail: 'You are now in contract. A past project was started.', href: '/admin/contracts/sent', when: ms(m.createdAt) })
      else if (m.kind === 'referral') list.push({ key: m.id!, messageId: m.id, icon: UserPlus, tone: 'bg-purple-500/25 text-purple-200', title: `${who} sent a referral`, detail: m.text, href: '/admin/leads', when: ms(m.createdAt) })
      else list.push({ key: m.id!, messageId: m.id, icon: MessageSquare, tone: 'bg-blue-500/25 text-blue-200', title: `${who} ${m.kind === 'question' ? 'asked about' : 'sent a note on'} ${m.docLabel || 'a document'}`, detail: m.text, href: '/admin/messages', when: ms(m.createdAt) })
    })

    const newLeads = leads.filter(l => (l.status || 'new') === 'new')
    newLeads.slice(0, 5).forEach(l => list.push({ key: `lead-${l.id}`, icon: Users, tone: 'bg-cyan-500/25 text-cyan-200', title: `New estimate request: ${[l.firstName, l.lastName].filter(Boolean).join(' ') || l.name || l.email}`, detail: (l as any).referredBy?.name ? `Referred by ${(l as any).referredBy.name}` : (l.services || []).join(', '), href: '/admin/leads', when: ms((l as any).createdAt) }))

    referrals.filter((r: any) => (r.status || 'pending') === 'pending' && r.source !== 'client-page' && r.source !== 'estimate-form' && Date.now() - ms(r.createdAt) < 30 * 86400000)
      .slice(0, 5).forEach((r: any) => list.push({ key: `ref-${r.id}`, icon: UserPlus, tone: 'bg-purple-500/25 text-purple-200', title: `Referral: ${r.referrerName} referred ${r.referralName}`, detail: r.referralPhone || r.referralEmail, href: '/admin/leads', when: ms(r.createdAt) }))

    const open = ['new', 'quoted', 'accepted', 'reopened']
    notes.filter(n => n.followUpDate && n.followUpDate <= today() && open.includes(n.status as string))
      .forEach(n => list.push({ key: `fu-${n.id}`, icon: CalendarClock, tone: 'bg-red-500/25 text-red-200', title: `Follow up with ${n.clientName}`, detail: n.projectName, href: '/admin/field-notes' }))

    // After photos: asked for once an invoice has gone out to that client
    const invoiced = new Set(docs.filter(d => d.type === 'invoice' && d.status !== 'draft').map(d => (d as any).clientEmailKey).filter(Boolean))
    projects.filter(p => !(p.afterPhotos || []).length && p.clientEmailKey && invoiced.has(p.clientEmailKey))
      .forEach(p => list.push({ key: `after-${p.id}`, icon: Images, tone: 'bg-amber-500/25 text-amber-200', title: `Add the "after" photos for ${p.title}`, detail: `You invoiced ${p.clientName}. Finished photos complete the project.`, href: '/admin/past-projects' }))

    list.sort((a, b) => (b.when || Date.now()) - (a.when || Date.now()))
    setNotices(list)
    setStats({
      leads: newLeads.length,
      estimates: notes.filter(n => open.includes((n.status as string) in { new: 1, quoted: 1, accepted: 1, reopened: 1 } ? (n.status as string) : 'new') && n.status !== 'invoiced' && n.status !== 'declined' && n.status !== 'discarded').length,
      toSign: docs.filter(d => d.type === 'contract' && d.status === 'sent').length,
      inContract: docs.filter(d => d.type === 'contract' && d.status === 'signed').length,
    })
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const clearAll = async () => {
    const ids = notices.map(n => n.messageId).filter(Boolean) as string[]
    if (!ids.length) return
    await markMessagesRead(ids).catch(() => {})
    toast('Notifications marked as read')
    load()
  }

  const stat = (label: string, value: number, href: string, Icon: any, tone: string) => (
    <Link href={href} className="bg-slate-800/60 border border-white/10 rounded-xl p-4 hover:border-white/30">
      <div className={`w-9 h-9 rounded-lg ${tone} flex items-center justify-center mb-2`}><Icon className="w-5 h-5" /></div>
      <p className="text-2xl font-bold text-white">{loading ? '…' : value}</p>
      <p className="text-sm text-slate-100">{label}</p>
    </Link>
  )

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Welcome back, Carlos</h1>
        <p className="text-slate-100 mt-1">What needs your attention, and shortcuts to everything else.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stat('New leads', stats.leads, '/admin/leads', Users, 'bg-cyan-500/25 text-cyan-200')}
        {stat('Open estimates', stats.estimates, '/admin/field-notes', ClipboardList, 'bg-blue-500/25 text-blue-200')}
        {stat('Waiting for signature', stats.toSign, '/admin/contracts/sent', FileSignature, 'bg-amber-500/25 text-amber-200')}
        {stat('In contract', stats.inContract, '/admin/contracts/sent', CheckCircle, 'bg-green-500/25 text-green-200')}
      </div>

      {/* Notifications */}
      <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-4 sm:p-5 mb-8">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="font-semibold text-white text-lg flex items-center gap-2"><Bell className="w-5 h-5 text-amber-300" /> Notifications {notices.length > 0 && <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold">{notices.length}</span>}</h2>
          {notices.some(n => n.messageId) && <button onClick={clearAll} className="text-sm px-3 py-1.5 rounded-lg bg-slate-700 text-white hover:bg-slate-600">Mark as read</button>}
        </div>
        {loading ? <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-blue-400" /></div>
          : notices.length === 0 ? <p className="text-slate-100 flex items-center gap-2 py-2"><CheckCircle className="w-5 h-5 text-green-400" /> You are all caught up.</p>
          : (
            <div className="space-y-2">
              {notices.map(n => (
                <Link key={n.key} href={n.href} className="flex items-start gap-3 rounded-xl bg-slate-900/60 border border-white/10 p-3 hover:border-white/30">
                  <div className={`w-9 h-9 rounded-lg ${n.tone} flex items-center justify-center flex-shrink-0`}><n.icon className="w-5 h-5" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{n.title}</p>
                    {n.detail && <p className="text-sm text-slate-100 line-clamp-2">{n.detail}</p>}
                  </div>
                  <span className="text-xs text-slate-200 flex-shrink-0 mt-1">{ago(n.when)}</span>
                </Link>
              ))}
            </div>
          )}
      </div>

      <h2 className="font-semibold text-white mb-3 text-lg">Shortcuts</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickActions.map(a => (
          <Link key={a.label} href={a.href} className="group flex items-center gap-4 p-4 bg-slate-800/60 border border-white/10 rounded-xl hover:border-white/30">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white flex-shrink-0`}><a.icon className="w-5 h-5" /></div>
            <div className="flex-1 min-w-0"><p className="font-semibold text-white text-sm">{a.label}</p><p className="text-xs text-slate-100">{a.desc}</p></div>
            <ArrowRight className="w-4 h-4 text-slate-200 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
