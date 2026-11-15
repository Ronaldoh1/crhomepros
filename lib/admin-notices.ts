// Builds Carlos's notification list. Shared by the dashboard panel and the
// banner that shows on every admin page, so the two always agree.
import {
  getClientMessages, getLeads, getReferrals, getFieldNotes, getAllDocuments, getPastProjects,
  type ClientMessage,
} from './firebase-auth'

export interface AdminNotice {
  key: string
  kind: string
  icon: string // lucide icon name, resolved where it is drawn
  tone: string
  title: string
  detail?: string
  href: string
  open?: string
  second?: { href: string; label: string }
  when: number
  /** client_messages id, so "mark read" can clear it */
  messageId?: string
}

export interface AdminStats { leads: number; estimates: number; toSign: number; inContract: number }

const ms = (t: any) => (t?.toDate ? t.toDate().getTime() : t ? new Date(t).getTime() : 0)
const today = () => new Date().toISOString().split('T')[0]
const OPEN = ['new', 'quoted', 'accepted', 'reopened']

/** Where a client message leads: straight to the document it is about */
function docLink(m: ClientMessage) {
  if (m.docType === 'contract' && m.docId) return `/admin/contracts?id=${m.docId}`
  if (m.docType === 'estimate' && m.docId) return `/admin/estimates?open=${m.docId}`
  return '/admin/messages'
}

export async function loadAdminNotices(): Promise<{ notices: AdminNotice[]; stats: AdminStats }> {
  const safe = async <T,>(p: Promise<T[]>): Promise<T[]> => { try { return await p } catch (e) { console.error(e); return [] } }
  const [messages, leads, referrals, notes, docs, projects] = await Promise.all([
    safe(getClientMessages(100)), safe(getLeads()), safe(getReferrals()), safe(getFieldNotes()), safe(getAllDocuments()), safe(getPastProjects()),
  ])
  const list: AdminNotice[] = []

  messages.filter((m: ClientMessage) => !m.read && m.from !== 'carlos').forEach(m => {
    const who = m.clientName || m.clientEmail
    const base = { key: m.id!, messageId: m.id, when: ms(m.createdAt) }
    if (m.kind === 'signed' && m.docType === 'estimate') list.push({ ...base, kind: 'approved', icon: 'CheckCircle', tone: 'bg-green-800 text-white', title: `${who} approved and signed an estimate`, detail: m.text, href: docLink(m), open: 'Open estimate' })
    else if (m.kind === 'signed') list.push({ ...base, kind: 'signed', icon: 'FileSignature', tone: 'bg-green-800 text-white', title: `${who} signed ${m.docLabel || 'a contract'}`, detail: m.text, href: docLink(m), open: 'Open contract' })
    else if (m.kind === 'referral') list.push({ ...base, kind: 'referral', icon: 'UserPlus', tone: 'bg-purple-800 text-white', title: `${who} sent a referral`, detail: m.text, href: '/admin/leads', open: 'Open referrals' })
    else list.push({ ...base, kind: 'message', icon: 'MessageSquare', tone: 'bg-blue-800 text-white', title: `${who} ${m.kind === 'question' ? 'asked about' : 'sent a note on'} ${m.docLabel || 'a document'}`, detail: m.text, href: docLink(m), open: m.docType === 'contract' ? 'Open contract' : 'Open estimate', second: { href: '/admin/messages', label: 'Answer' } })
  })

  docs.filter(d => d.type === 'invoice' && d.status === 'draft' && !d.walkin).forEach(d => list.push({ key: `inv-${d.id}`, kind: 'invoice', icon: 'Receipt', tone: 'bg-orange-700 text-white', title: `Invoice ${d.number} is ready to approve and send`, detail: `${d.clientName}: the contract is signed.`, href: `/admin/invoices?id=${d.id}`, open: 'Open invoice', when: ms(d.createdAt) }))

  const newLeads = leads.filter(l => (l.status || 'new') === 'new')
  newLeads.slice(0, 5).forEach(l => list.push({ key: `lead-${l.id}`, kind: 'lead', icon: 'Users', tone: 'bg-cyan-800 text-white', title: `New estimate request: ${[l.firstName, l.lastName].filter(Boolean).join(' ') || l.name || l.email}`, detail: (l as any).referredBy?.name ? `Referred by ${(l as any).referredBy.name}` : (l.services || []).join(', '), href: '/admin/leads', open: 'Open leads', when: ms((l as any).createdAt) }))

  referrals.filter((r: any) => (r.status || 'pending') === 'pending' && r.source !== 'client-page' && r.source !== 'estimate-form' && Date.now() - ms(r.createdAt) < 30 * 86400000)
    .slice(0, 5).forEach((r: any) => list.push({ key: `ref-${r.id}`, kind: 'referral', icon: 'UserPlus', tone: 'bg-purple-800 text-white', title: `Referral: ${r.referrerName} referred ${r.referralName}`, detail: r.referralPhone || r.referralEmail, href: '/admin/leads', open: 'Open leads', when: ms(r.createdAt) }))

  notes.filter(n => n.followUpDate && n.followUpDate <= today() && OPEN.includes(n.status as string))
    .forEach(n => list.push({ key: `fu-${n.id}`, kind: 'followup', icon: 'CalendarClock', tone: 'bg-red-800 text-white', title: `Follow up with ${n.clientName}`, detail: n.projectName, href: `/admin/estimates?open=${n.id}`, open: 'Open estimate', when: ms(n.followUpDate ? new Date(n.followUpDate) : n.updatedAt) }))

  const invoiced = new Set(docs.filter(d => d.type === 'invoice' && d.status !== 'draft' && d.status !== 'void' && !d.walkin).map(d => (d as any).clientEmailKey).filter(Boolean))
  projects.filter(p => !(p.afterPhotos || []).length && p.clientEmailKey && invoiced.has(p.clientEmailKey))
    .forEach(p => list.push({ key: `after-${p.id}`, kind: 'after', icon: 'Images', tone: 'bg-amber-800 text-white', title: `Add the "after" photos for ${p.title}`, detail: `You invoiced ${p.clientName}. Finished photos complete the project.`, href: `/admin/past-projects#p-${p.id}`, open: 'Open project', when: ms(p.updatedAt) }))

  list.sort((a, b) => (b.when || Date.now()) - (a.when || Date.now()))

  const stats: AdminStats = {
    leads: newLeads.length,
    estimates: notes.filter(n => OPEN.includes(n.status as string)).length,
    toSign: docs.filter(d => d.type === 'contract' && d.status === 'sent' && !d.walkin).length,
    inContract: docs.filter(d => d.type === 'contract' && d.status === 'signed' && !d.walkin).length,
  }
  return { notices: list, stats }
}
