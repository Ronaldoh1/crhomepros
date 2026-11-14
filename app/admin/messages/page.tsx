'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, Loader2, Send, FileSignature, UserPlus, CheckCircle } from 'lucide-react'
import { getClientMessages, markMessagesRead, type ClientMessage } from '@/lib/firebase-auth'
import { adminFetch } from '@/lib/admin-api'
import { useToast } from '../_components/Toast'

const when = (t: any) => {
  const d = t?.toDate ? t.toDate() : t ? new Date(t) : null
  return d ? d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''
}
const ms = (t: any) => (t?.toDate ? t.toDate().getTime() : 0)

/** Notes and questions from the client pages, grouped by client and document */
export default function ClientMessagesPage() {
  const toast = useToast()
  const [all, setAll] = useState<ClientMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reply, setReply] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState('')

  const load = async () => {
    try { setAll(await getClientMessages()) } catch (e) { setError(e instanceof Error ? e.message : String(e)) }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  // one thread per client + document
  const threads = new Map<string, ClientMessage[]>()
  all.forEach(m => {
    const key = `${m.clientEmailKey}|${m.docType || ''}|${m.docId || m.kind}`
    threads.set(key, [...(threads.get(key) || []), m])
  })
  const list = Array.from(threads.entries()).map(([key, msgs]) => ({ key, msgs: msgs.sort((a, b) => ms(a.createdAt) - ms(b.createdAt)) }))
    .sort((a, b) => ms(b.msgs[b.msgs.length - 1].createdAt) - ms(a.msgs[a.msgs.length - 1].createdAt))

  const markRead = async (msgs: ClientMessage[]) => {
    const ids = msgs.filter(m => !m.read).map(m => m.id!)
    if (!ids.length) return
    await markMessagesRead(ids).catch(() => {})
    setAll(prev => prev.map(m => (ids.includes(m.id!) ? { ...m, read: true } : m)))
  }

  const send = async (key: string, msgs: ClientMessage[]) => {
    const text = (reply[key] || '').trim()
    if (!text) return
    const first = msgs[0]
    setBusy(key)
    try {
      await adminFetch('/api/admin/client-message', { clientEmail: first.clientEmail, clientName: first.clientName, docType: first.docType, docId: first.docId, docLabel: first.docLabel, text })
      await markRead(msgs)
      setReply(prev => ({ ...prev, [key]: '' }))
      toast(`Answer sent to ${first.clientName || first.clientEmail}`)
      await load()
    } catch (e) { toast(e instanceof Error ? e.message : 'The answer was not sent.', 'error') }
    setBusy('')
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white flex items-center gap-3"><MessageSquare className="w-6 h-6 text-blue-300" /> Client Messages</h1>
      <p className="text-white text-sm mt-1 mb-6">Notes on estimates and questions about contracts that clients send from their page. Your answer shows on their page and they get an email.</p>

      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-300" /></div>
        : error ? <div className="rounded-xl border border-red-300 bg-red-800 p-4 text-white">Messages could not be loaded. {error}</div>
        : list.length === 0 ? <div className="bg-slate-800/50 border border-white/25 rounded-2xl p-10 text-center text-white">No messages yet. They appear here when a client writes from their page.</div>
        : (
          <div className="space-y-4">
            {list.map(({ key, msgs }) => {
              const first = msgs[0]
              const unread = msgs.some(m => !m.read && m.from !== 'carlos')
              const system = msgs.every(m => m.from === 'system')
              return (
                <div key={key} className={`bg-slate-800/50 border rounded-2xl p-4 sm:p-5 ${unread ? 'border-amber-300' : 'border-white/25'}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white">{first.clientName || first.clientEmail}</h3>
                      <p className="text-sm text-white">{first.docLabel || (first.kind === 'referral' ? 'Referral' : '')} · {first.clientEmail}</p>
                    </div>
                    {unread ? <button onClick={() => markRead(msgs)} className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg bg-amber-600 text-white font-semibold">New · mark read</button>
                      : <span className="flex-shrink-0 text-xs text-white flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-300" /> Read</span>}
                  </div>
                  <div className="space-y-2">
                    {msgs.map(m => (
                      <div key={m.id} className={`rounded-xl px-4 py-2.5 ${m.from === 'carlos' ? 'bg-blue-600 text-white ml-8' : m.from === 'system' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-white mr-8 border border-white/25'}`}>
                        <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                          {m.kind === 'signed' && <FileSignature className="w-3.5 h-3.5" />}{m.kind === 'referral' && <UserPlus className="w-3.5 h-3.5" />}
                          {m.from === 'carlos' ? 'You' : m.from === 'system' ? 'Automatic' : m.clientName || 'Client'} · {when(m.createdAt)}
                        </p>
                        <p className="whitespace-pre-line">{m.text}</p>
                      </div>
                    ))}
                  </div>
                  {!system && (
                    <div className="mt-3 flex gap-2">
                      <textarea value={reply[key] || ''} onChange={e => setReply(prev => ({ ...prev, [key]: e.target.value }))} rows={2} placeholder="Write your answer"
                        className="flex-1 bg-slate-800 border border-white/30 rounded-xl px-4 py-3 text-white text-base placeholder-slate-300 outline-none focus:border-blue-500" />
                      <button onClick={() => send(key, msgs)} disabled={busy === key || !(reply[key] || '').trim()} className="self-end px-4 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">{busy === key ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
    </div>
  )
}
