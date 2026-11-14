'use client'

import { useEffect, useState } from 'react'
import { Users, Loader2, Phone, MessageSquare, Mail, MapPin, UserPlus, CheckCircle, HelpCircle } from 'lucide-react'
import { getLeads, getContacts, getReferrals, updateLeadStatus, getAllDocuments, type LeadRecord } from '@/lib/firebase-auth'
import { emailKey, phoneKey } from '@/lib/client-keys'
import { useToast } from '../_components/Toast'

type Row = LeadRecord & { kind: 'lead' | 'contact'; referredBy?: { name?: string; email?: string; phone?: string; check?: string; clientName?: string } }
const LEAD_STATUS = ['new', 'contacted', 'quoted', 'won', 'lost']
const REF_STATUS = ['pending', 'contacted', 'won', 'lost']
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const ms = (t: any) => (t?.toDate ? t.toDate().getTime() : t ? new Date(t).getTime() : 0)
const day = (t: any) => (ms(t) ? new Date(ms(t)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '')

/** Real estimate requests, contact messages and referrals from the website */
export default function LeadsPage() {
  const toast = useToast()
  const [tab, setTab] = useState<'leads' | 'referrals'>('leads')
  const [rows, setRows] = useState<Row[]>([])
  const [referrals, setReferrals] = useState<any[]>([])
  const [clients, setClients] = useState<{ emails: Map<string, string>; phones: Map<string, string> }>({ emails: new Map(), phones: new Map() })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showClosed, setShowClosed] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const [leads, contacts, refs, docs] = await Promise.all([getLeads(), getContacts(), getReferrals(), getAllDocuments().catch(() => [])])
        setRows([...leads.map(l => ({ ...l, kind: 'lead' as const })), ...contacts.map(c => ({ ...c, kind: 'contact' as const }))].sort((a, b) => ms(b.createdAt) - ms(a.createdAt)))
        setReferrals(refs)
        // who has been a client: 'in-contract' beats 'client'
        const emails = new Map<string, string>(); const phones = new Map<string, string>()
        docs.forEach(d => {
          const level = d.type === 'contract' && d.status === 'signed' ? 'in-contract' : 'client'
          const ek = emailKey(d.clientEmail); const pk = phoneKey(d.clientPhone)
          if (ek && emails.get(ek) !== 'in-contract') emails.set(ek, level)
          if (pk && phones.get(pk) !== 'in-contract') phones.set(pk, level)
        })
        setClients({ emails, phones })
      } catch (e) { setError(e instanceof Error ? e.message : String(e)) }
      setLoading(false)
    })()
  }, [])

  const clientLevel = (email?: string, phone?: string) => {
    const a = clients.emails.get(emailKey(email)); const b = clients.phones.get(phoneKey(phone))
    return a === 'in-contract' || b === 'in-contract' ? 'in-contract' : a || b || 'none'
  }
  const ClientBadge = ({ email, phone }: { email?: string; phone?: string }) => {
    const level = clientLevel(email, phone)
    return level === 'in-contract' ? <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-500/25 text-green-100 text-sm"><CheckCircle className="w-3.5 h-3.5" /> Past client: signed a contract with you</span>
      : level === 'client' ? <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/25 text-blue-100 text-sm"><CheckCircle className="w-3.5 h-3.5" /> In your records: has an invoice or contract</span>
      : <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-600/60 text-white text-sm"><HelpCircle className="w-3.5 h-3.5" /> Not found in your clients</span>
  }

  const setStatus = async (r: Row, status: string) => {
    setRows(prev => prev.map(x => (x.id === r.id ? { ...x, status } : x)))
    try { await updateLeadStatus(r.id!, status, r.kind === 'lead' ? 'leads' : 'contacts'); toast(`${name(r)}: marked ${label(status)}`) } catch (e) { toast(e instanceof Error ? e.message : 'Not saved', 'error') }
  }
  const setRefStatus = async (r: any, status: string) => {
    setReferrals(prev => prev.map(x => (x.id === r.id ? { ...x, status } : x)))
    try { await updateLeadStatus(r.id, status, 'referrals'); toast(`Referral for ${r.referralName}: marked ${label(status)}`) } catch (e) { toast(e instanceof Error ? e.message : 'Not saved', 'error') }
  }
  const name = (r: Row) => [r.firstName, r.lastName].filter(Boolean).join(' ') || r.name || r.email

  const card = 'bg-slate-800/50 border border-white/10 rounded-2xl p-4 sm:p-5'
  const btn = 'text-sm px-3 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 flex items-center gap-1.5'
  const contactButtons = (phone?: string, email?: string) => (
    <div className="flex flex-wrap gap-2 mt-3">
      {phone && <a href={`tel:${phone}`} className={btn}><Phone className="w-4 h-4" /> Call {phone}</a>}
      {phone && <a href={`sms:${phone}`} className={btn}><MessageSquare className="w-4 h-4" /> Text</a>}
      {email && <a href={`mailto:${email}`} className={btn}><Mail className="w-4 h-4" /> {email}</a>}
    </div>
  )
  const select = (value: string, options: string[], onChange: (s: string) => void) => (
    <select value={value} onChange={e => onChange(e.target.value)} className="flex-shrink-0 bg-slate-800 border border-white/20 rounded-lg px-3 py-2 text-white text-sm font-medium">
      {options.map(o => <option key={o} value={o}>{label(o)}</option>)}
    </select>
  )

  const closed = (s?: string) => s === 'won' || s === 'lost'
  const shownRows = rows.filter(r => showClosed || !closed(r.status))
  const shownRefs = referrals.filter(r => showClosed || !closed(r.status))
  const newRefs = referrals.filter(r => (r.status || 'pending') === 'pending').length
  const newLeads = rows.filter(r => (r.status || 'new') === 'new').length

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white flex items-center gap-3"><Users className="w-6 h-6 text-cyan-300" /> Leads and Referrals</h1>
      <p className="text-slate-100 text-sm mt-1 mb-5">Everyone who asked for an estimate or wrote from the website, and every referral.</p>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button onClick={() => setTab('leads')} className={`px-4 py-2 rounded-full text-sm font-medium border ${tab === 'leads' ? 'bg-white text-slate-900 border-white' : 'bg-slate-800 text-white border-white/15'}`}>Requests {newLeads > 0 && <span className="ml-1 px-1.5 rounded-full bg-red-600 text-white text-xs">{newLeads}</span>}</button>
        <button onClick={() => setTab('referrals')} className={`px-4 py-2 rounded-full text-sm font-medium border ${tab === 'referrals' ? 'bg-white text-slate-900 border-white' : 'bg-slate-800 text-white border-white/15'}`}>Referrals {newRefs > 0 && <span className="ml-1 px-1.5 rounded-full bg-red-600 text-white text-xs">{newRefs}</span>}</button>
        <label className="ml-auto text-sm text-slate-100 flex items-center gap-2"><input type="checkbox" checked={showClosed} onChange={e => setShowClosed(e.target.checked)} className="w-4 h-4" /> Show won and lost</label>
      </div>

      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
        : error ? <div className="rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-red-50">Leads could not be loaded. {error}</div>
        : tab === 'leads' ? (
          shownRows.length === 0 ? <div className={card + ' text-center text-slate-100 py-10'}>No open requests.</div> : (
            <div className="space-y-3">
              {shownRows.map(r => (
                <div key={`${r.kind}-${r.id}`} className={card}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-lg">{name(r)}</h3>
                      <p className="text-sm text-slate-100">{r.kind === 'lead' ? 'Estimate request' : 'Contact message'} · {day(r.createdAt)}</p>
                    </div>
                    {select(r.status || 'new', LEAD_STATUS, s => setStatus(r, s))}
                  </div>
                  {(r.services?.length || r.service) && <p className="mt-2 text-white font-medium">{(r.services || [r.service]).filter(Boolean).join(', ')}</p>}
                  {(r.projectDescription || r.message) && <p className="mt-1 text-slate-100 text-sm whitespace-pre-line">{r.projectDescription || r.message}</p>}
                  {(r.timeline || r.budget) && <p className="mt-1 text-sm text-slate-100">{[r.timeline && `When: ${r.timeline}`, r.budget && `Budget: ${r.budget}`].filter(Boolean).join(' · ')}</p>}
                  {r.address && <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-100"><MapPin className="w-4 h-4 text-blue-300" />{[r.address, r.city, r.state, r.zip].filter(Boolean).join(', ')}</p>}
                  {r.referredBy?.name || r.referredBy?.email || r.referredBy?.phone ? (
                    <div className="mt-3 rounded-xl border border-purple-400/50 bg-purple-500/15 p-3">
                      <p className="text-sm font-semibold text-white flex items-center gap-2"><UserPlus className="w-4 h-4 text-purple-200" /> Referred by {r.referredBy.name || r.referredBy.email || r.referredBy.phone}</p>
                      <p className="text-sm text-purple-50">{[r.referredBy.phone, r.referredBy.email].filter(Boolean).join(' · ')}</p>
                      <div className="mt-1.5"><ClientBadge email={r.referredBy.email} phone={r.referredBy.phone} /></div>
                    </div>
                  ) : null}
                  {contactButtons(r.phone, r.email)}
                </div>
              ))}
            </div>
          )
        ) : (
          shownRefs.length === 0 ? <div className={card + ' text-center text-slate-100 py-10'}>No open referrals.</div> : (
            <div className="space-y-3">
              {shownRefs.map(r => (
                <div key={r.id} className={card}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-lg">{r.referralName}</h3>
                      <p className="text-sm text-slate-100">Referral · {day(r.createdAt)}{r.source === 'client-page' ? ' · sent from a client page' : r.source === 'estimate-form' ? ' · said so on the estimate form' : ''}</p>
                    </div>
                    {select(r.status || 'pending', REF_STATUS, s => setRefStatus(r, s))}
                  </div>
                  {(r.projectType || r.projectDetails) && <p className="mt-2 text-slate-100 text-sm whitespace-pre-line">{[r.projectType, r.projectDetails].filter(Boolean).join(': ')}</p>}
                  {contactButtons(r.referralPhone, r.referralEmail)}
                  <div className="mt-3 rounded-xl border border-purple-400/50 bg-purple-500/15 p-3">
                    <p className="text-sm font-semibold text-white flex items-center gap-2"><UserPlus className="w-4 h-4 text-purple-200" /> Referred by {r.referrerName || r.referrerEmail || r.referrerPhone}</p>
                    <p className="text-sm text-purple-50">{[r.referrerPhone, r.referrerEmail].filter(Boolean).join(' · ')}</p>
                    <div className="mt-1.5"><ClientBadge email={r.referrerEmail} phone={r.referrerPhone} /></div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
    </div>
  )
}
