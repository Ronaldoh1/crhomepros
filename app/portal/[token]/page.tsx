'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  FileSignature, ClipboardList, Receipt, Users, CheckCircle, Loader2, Download, Send, Phone, ChevronDown, AlertTriangle, ListChecks, MessageSquare,
} from 'lucide-react'
import { SignaturePad } from '@/app/admin/_components/SignaturePad'

// ── Words (English / Spanish) ────────────────
const EN = {
  hello: 'Hello', intro: 'This is your private page with CR Home Pros. Everything we have sent you is here.',
  todo: 'To do', todoNone: 'Nothing to do right now. We will email you when something new is ready.',
  todoSign: 'Review and sign contract', todoEstimate: 'Look at your estimate',
  contracts: 'Contracts', estimates: 'Estimates', invoices: 'Invoices', refer: 'Refer a friend',
  toSign: 'Waiting for your signature', inContract: 'In contract', review: 'Review the contract', hide: 'Hide the contract',
  scope: 'Scope of work', payment: 'Payment', total: 'Total', terms: 'Terms and conditions', notes: 'Notes', jobAddress: 'Job address',
  pdf: 'Open the PDF', questions: 'Questions about this contract', ask: 'Ask a question', askPh: 'Write your question here',
  noteTitle: 'Notes about this estimate', noteBtn: 'Send a note', notePh: 'Write a note for Carlos here', sendBtn: 'Send',
  you: 'You', carlos: 'Carlos', sent: 'Sent. Carlos will see it.',
  signTitle: 'Sign this contract', fullName: 'Your full legal name', signature: 'Your signature',
  agree: 'I have read this contract and I agree to it. I agree to sign it electronically, and I understand my electronic signature has the same effect as signing on paper.',
  signBtn: 'Sign contract', signing: 'Signing…', signedBy: 'Signed by', on: 'on', signedOk: 'Thank you. Your contract is signed, and a copy is on its way to your email.',
  needName: 'Type your full name.', needSig: 'Add your signature.', needAgree: 'Tick the box to agree.',
  estOpen: 'Estimate', estAccepted: 'Accepted', estInvoiced: 'Invoiced', estDeclined: 'Declined', price: 'Estimated price', next: 'Next steps', photos: 'Photos from our visit',
  none: 'Nothing here yet.', due: 'Due', paid: 'Paid', unpaid: 'Sent',
  referIntro: 'Know someone who needs work done? Send us their details and Carlos will reach out. We will tell them you sent us.',
  friendName: 'Their name', friendPhone: 'Their phone', friendEmail: 'Their email', friendWhat: 'What do they need? (optional)',
  referBtn: 'Send referral', referOk: 'Thank you! Carlos will contact them.', referred: 'You referred',
  questions2: 'Questions? Call or text', invalid: 'This link is not valid', loading: 'Loading your page…',
  draw: 'Draw', type: 'Type', begin: 'Click and begin to sign', clear: 'Clear', typePlaceholder: 'Type your full name',
  hintDraw: 'Sign with your finger or mouse.', hintType: 'Your name is turned into a signature.', change: 'Change',
}
const ES: typeof EN = {
  hello: 'Hola', intro: 'Esta es su página privada con CR Home Pros. Aquí está todo lo que le hemos enviado.',
  todo: 'Pendientes', todoNone: 'No hay nada pendiente. Le enviaremos un correo cuando haya algo nuevo.',
  todoSign: 'Revise y firme el contrato', todoEstimate: 'Vea su presupuesto',
  contracts: 'Contratos', estimates: 'Presupuestos', invoices: 'Facturas', refer: 'Recomiende a un amigo',
  toSign: 'Esperando su firma', inContract: 'En contrato', review: 'Revisar el contrato', hide: 'Ocultar el contrato',
  scope: 'Alcance del trabajo', payment: 'Pago', total: 'Total', terms: 'Términos y condiciones', notes: 'Notas', jobAddress: 'Dirección del trabajo',
  pdf: 'Abrir el PDF', questions: 'Preguntas sobre este contrato', ask: 'Hacer una pregunta', askPh: 'Escriba su pregunta aquí',
  noteTitle: 'Notas sobre este presupuesto', noteBtn: 'Enviar una nota', notePh: 'Escriba aquí una nota para Carlos', sendBtn: 'Enviar',
  you: 'Usted', carlos: 'Carlos', sent: 'Enviado. Carlos lo verá.',
  signTitle: 'Firme este contrato', fullName: 'Su nombre legal completo', signature: 'Su firma',
  agree: 'He leído este contrato y estoy de acuerdo. Acepto firmarlo electrónicamente y entiendo que mi firma electrónica tiene el mismo efecto que una firma en papel.',
  signBtn: 'Firmar contrato', signing: 'Firmando…', signedBy: 'Firmado por', on: 'el', signedOk: 'Gracias. Su contrato está firmado y le llegará una copia por correo.',
  needName: 'Escriba su nombre completo.', needSig: 'Agregue su firma.', needAgree: 'Marque la casilla para aceptar.',
  estOpen: 'Presupuesto', estAccepted: 'Aceptado', estInvoiced: 'Facturado', estDeclined: 'Rechazado', price: 'Precio estimado', next: 'Próximos pasos', photos: 'Fotos de nuestra visita',
  none: 'Todavía no hay nada aquí.', due: 'Vence', paid: 'Pagada', unpaid: 'Enviada',
  referIntro: '¿Conoce a alguien que necesite un trabajo? Envíenos sus datos y Carlos se comunicará. Le diremos que usted nos recomendó.',
  friendName: 'Su nombre', friendPhone: 'Su teléfono', friendEmail: 'Su correo', friendWhat: '¿Qué necesita? (opcional)',
  referBtn: 'Enviar recomendación', referOk: '¡Gracias! Carlos se comunicará con esa persona.', referred: 'Usted recomendó a',
  questions2: '¿Preguntas? Llame o escriba al', invalid: 'Este enlace no es válido', loading: 'Cargando su página…',
  draw: 'Dibujar', type: 'Escribir', begin: 'Haga clic y comience a firmar', clear: 'Borrar', typePlaceholder: 'Escriba su nombre completo',
  hintDraw: 'Firme con el dedo o el ratón.', hintType: 'Su nombre se convierte en una firma.', change: 'Cambiar',
}

interface Msg { id: string; from: string; docType: string; docId: string; text: string; at: string | null }
interface Data {
  client: { name: string; email: string }
  contracts: any[]; estimates: any[]; invoices: any[]; messages: Msg[]; referrals: { name: string; at: string | null }[]
}
const money = (n: number) => `$${(Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function ClientPage({ params }: { params: { token: string } }) {
  const api = `/api/portal/${params.token}`
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState('')
  const [es, setEs] = useState(false)
  const t = es ? ES : EN
  const day = (s?: string | null) => (s ? new Date(s.length === 10 ? s + 'T12:00:00' : s).toLocaleDateString(es ? 'es-US' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '')
  const dayTime = (s?: string | null) => (s ? new Date(s).toLocaleString(es ? 'es-US' : 'en-US', { dateStyle: 'long', timeStyle: 'short' }) : '')

  const load = useCallback(async () => {
    try {
      const res = await fetch(api, { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      setData(json)
    } catch (e: any) { setError(e.message || 'Error') }
  }, [api])
  useEffect(() => {
    try { setEs((localStorage.getItem('crhp_portal_lang') || navigator.language).startsWith('es')) } catch { /* default English */ }
    load()
  }, [load])
  const setLang = (v: boolean) => { setEs(v); try { localStorage.setItem('crhp_portal_lang', v ? 'es' : 'en') } catch { /* ignore */ } }

  const post = async (body: Record<string, unknown>) => {
    const res = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json.error || 'Error')
    return json
  }

  if (error) return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-slate-300 p-8 max-w-md text-center">
        <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
        <h1 className="text-xl font-bold text-slate-900">{t.invalid}</h1>
        <p className="text-slate-800 mt-2">{error}</p>
        <a href="tel:+15712377164" className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0b1b33] text-white font-semibold"><Phone className="w-4 h-4" /> (571) 237-7164</a>
      </div>
    </main>
  )
  if (!data) return <main className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-900"><Loader2 className="w-6 h-6 animate-spin mr-3" /> {t.loading}</main>

  const first = (data.client.name || '').split(' ')[0]
  const toSign = data.contracts.filter(c => c.status === 'to-sign')
  const openEst = data.estimates.filter(e => e.status === 'open')
  const card = 'bg-white rounded-2xl border border-slate-300 shadow-sm p-5 sm:p-6'
  const h2 = 'text-xl font-bold text-[#0b1b33] flex items-center gap-2.5 mb-4'

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-[#0b1b33] border-b-4 border-[#fd9b14]">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/logo-wordmark.png" alt="CR Home Pros" className="h-14 w-auto" />
          <div className="flex rounded-lg overflow-hidden border border-white/40 text-sm font-semibold">
            <button onClick={() => setLang(false)} className={`px-3 py-1.5 ${!es ? 'bg-white text-[#0b1b33]' : 'text-white'}`}>English</button>
            <button onClick={() => setLang(true)} className={`px-3 py-1.5 ${es ? 'bg-white text-[#0b1b33]' : 'text-white'}`}>Español</button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b1b33]">{t.hello}{first ? `, ${first}` : ''}</h1>
          <p className="text-slate-800 mt-1">{t.intro}</p>
        </div>

        {/* To do */}
        <section className={card + ' border-l-4 border-l-[#fd9b14]'}>
          <h2 className={h2}><ListChecks className="w-5 h-5 text-[#c2410c]" /> {t.todo}</h2>
          {toSign.length + openEst.length === 0 ? <p className="text-slate-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-700" /> {t.todoNone}</p> : (
            <ul className="space-y-2">
              {toSign.map(c => <li key={c.id}><a href={`#c-${c.id}`} className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-300 px-4 py-3 font-semibold text-slate-900"><FileSignature className="w-5 h-5 text-[#c2410c]" /> {t.todoSign} {c.number}</a></li>)}
              {openEst.map(e => <li key={e.id}><a href={`#e-${e.id}`} className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-300 px-4 py-3 font-semibold text-slate-900"><ClipboardList className="w-5 h-5 text-blue-800" /> {t.todoEstimate}{e.projectName ? `: ${e.projectName}` : ''}</a></li>)}
            </ul>
          )}
        </section>

        {/* Contracts */}
        <section>
          <h2 className={h2}><FileSignature className="w-5 h-5 text-[#c2410c]" /> {t.contracts}</h2>
          {data.contracts.length === 0 ? <p className={card + ' text-slate-800'}>{t.none}</p> : (
            <div className="space-y-4">{data.contracts.map(c => <Contract key={c.id} c={c} t={t} es={es} token={params.token} post={post} reload={load} messages={data.messages.filter(m => m.docType === 'contract' && m.docId === c.id)} defaultName={data.client.name} day={day} dayTime={dayTime} cardCls={card} />)}</div>
          )}
        </section>

        {/* Estimates */}
        <section>
          <h2 className={h2}><ClipboardList className="w-5 h-5 text-[#c2410c]" /> {t.estimates}</h2>
          {data.estimates.length === 0 ? <p className={card + ' text-slate-800'}>{t.none}</p> : (
            <div className="space-y-4">{data.estimates.map(e => (
              <div key={e.id} id={`e-${e.id}`} className={card + ' scroll-mt-4'}>
                <div className="flex items-start justify-between gap-3">
                  <div><h3 className="text-lg font-bold text-slate-900">{e.projectName || t.estOpen}</h3><p className="text-sm text-slate-800">{day(e.date)}{e.address ? ` · ${e.address}` : ''}</p></div>
                  <Chip tone={e.status === 'declined' ? 'slate' : e.status === 'open' ? 'blue' : 'green'}>{e.status === 'accepted' ? t.estAccepted : e.status === 'invoiced' ? t.estInvoiced : e.status === 'declined' ? t.estDeclined : t.estOpen}</Chip>
                </div>
                {e.estimatedCost && <p className="mt-4"><span className="block text-xs font-bold uppercase tracking-wide text-[#b45309]">{t.price}</span><span className="text-2xl font-bold text-[#0b1b33]">{e.estimatedCost}</span></p>}
                {e.nextSteps && <p className="mt-3"><span className="block text-xs font-bold uppercase tracking-wide text-[#b45309]">{t.next}</span><span className="whitespace-pre-line text-slate-900">{e.nextSteps}</span></p>}
                {e.photos.length > 0 && (
                  <div className="mt-4"><span className="block text-xs font-bold uppercase tracking-wide text-[#b45309] mb-2">{t.photos}</span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">{e.photos.map((p: string, i: number) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <a key={i} href={p} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-lg overflow-hidden bg-slate-200"><img src={p} alt="" loading="lazy" className="w-full h-full object-cover" /></a>
                    ))}</div>
                  </div>
                )}
                <Thread t={t} title={t.noteTitle} button={t.noteBtn} placeholder={t.notePh} messages={data.messages.filter(m => m.docType === 'estimate' && m.docId === e.id)} dayTime={dayTime}
                  onSend={async text => { await post({ action: 'message', docType: 'estimate', docId: e.id, text }); await load() }} />
              </div>
            ))}</div>
          )}
        </section>

        {/* Invoices */}
        {data.invoices.length > 0 && (
          <section>
            <h2 className={h2}><Receipt className="w-5 h-5 text-[#c2410c]" /> {t.invoices}</h2>
            <div className={card + ' divide-y divide-slate-200 !p-0'}>
              {data.invoices.map(i => (
                <div key={i.id} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-6">
                  <div><p className="font-bold text-slate-900">{i.number}</p><p className="text-sm text-slate-800">{i.projectName}{i.dueDate ? ` · ${t.due} ${day(i.dueDate)}` : ''}</p></div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-[#0b1b33]">{money(i.total)}</span>
                    <Chip tone={i.status === 'paid' ? 'green' : 'blue'}>{i.status === 'paid' ? t.paid : t.unpaid}</Chip>
                    <a href={`${api}/pdf?doc=${i.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-200 text-slate-900 text-sm font-semibold hover:bg-slate-300"><Download className="w-4 h-4" /> PDF</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <Referral t={t} post={post} reload={load} sent={data.referrals} cardCls={card} h2={h2} />

        <p className="text-center text-slate-800 pb-8">{t.questions2} <a href="tel:+15712377164" className="font-bold text-[#0b1b33] underline">(571) 237-7164</a></p>
      </div>
    </main>
  )
}

function Chip({ tone, children }: { tone: 'amber' | 'green' | 'blue' | 'slate'; children: React.ReactNode }) {
  const cls = { amber: 'bg-amber-100 text-amber-900 border-amber-400', green: 'bg-green-100 text-green-900 border-green-500', blue: 'bg-blue-100 text-blue-900 border-blue-400', slate: 'bg-slate-200 text-slate-900 border-slate-400' }[tone]
  return <span className={`flex-shrink-0 px-3 py-1 rounded-full border text-sm font-bold ${cls}`}>{children}</span>
}

function Thread({ t, title, button, placeholder, messages, onSend, dayTime }: {
  t: typeof EN; title: string; button: string; placeholder: string; messages: Msg[]; onSend: (text: string) => Promise<void>; dayTime: (s?: string | null) => string
}) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const send = async () => {
    if (!text.trim()) return
    setBusy(true); setNote('')
    try { await onSend(text.trim()); setText(''); setNote(t.sent) } catch (e: any) { setNote(e.message) }
    setBusy(false)
  }
  return (
    <div className="mt-5 pt-4 border-t border-slate-200">
      <p className="font-bold text-slate-900 flex items-center gap-2 mb-2"><MessageSquare className="w-4 h-4 text-[#c2410c]" /> {title}</p>
      {messages.length > 0 && (
        <div className="space-y-2 mb-3">{messages.map(m => (
          <div key={m.id} className={`rounded-xl px-4 py-2.5 ${m.from === 'carlos' ? 'bg-[#0b1b33] text-white mr-8' : 'bg-slate-200 text-slate-900 ml-8'}`}>
            <p className="text-xs font-bold opacity-90">{m.from === 'carlos' ? t.carlos : t.you} · {dayTime(m.at)}</p>
            <p className="whitespace-pre-line">{m.text}</p>
          </div>
        ))}</div>
      )}
      <textarea value={text} onChange={e => setText(e.target.value)} rows={2} maxLength={2000} placeholder={placeholder}
        className="w-full rounded-xl border border-slate-400 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-500 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
      <div className="flex items-center gap-3 mt-2">
        <button onClick={send} disabled={busy || !text.trim()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b1b33] text-white font-semibold disabled:opacity-50">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {button}</button>
        {note && <span className="text-sm font-medium text-slate-900">{note}</span>}
      </div>
    </div>
  )
}

function Contract({ c, t, token, post, reload, messages, defaultName, day, dayTime, cardCls }: {
  c: any; t: typeof EN; es: boolean; token: string; post: (b: Record<string, unknown>) => Promise<any>; reload: () => Promise<void>
  messages: Msg[]; defaultName: string; day: (s?: string | null) => string; dayTime: (s?: string | null) => string; cardCls: string
}) {
  const signed = c.status === 'signed'
  const [open, setOpen] = useState(!signed)
  const [name, setName] = useState(defaultName || '')
  const [sig, setSig] = useState<string | null>(null)
  const [agree, setAgree] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)
  const label = 'block text-xs font-bold uppercase tracking-wide text-[#b45309] mb-1'

  const sign = async () => {
    setErr('')
    if (name.trim().length < 2) return setErr(t.needName)
    if (!sig) return setErr(t.needSig)
    if (!agree) return setErr(t.needAgree)
    setBusy(true)
    try { await post({ action: 'sign', docId: c.id, name: name.trim(), signature: sig, agree: true }); setDone(true); await reload() } catch (e: any) { setErr(e.message) }
    setBusy(false)
  }

  return (
    <div id={`c-${c.id}`} className={cardCls + ' scroll-mt-4'}>
      <div className="flex items-start justify-between gap-3">
        <div><h3 className="text-lg font-bold text-slate-900">{c.projectName || c.number}</h3><p className="text-sm text-slate-800">{c.number} · {day(c.date)}</p></div>
        <Chip tone={signed ? 'green' : 'amber'}>{signed ? t.inContract : t.toSign}</Chip>
      </div>
      <p className="mt-3 text-2xl font-bold text-[#0b1b33]">{money(c.total)}</p>
      {signed && <p className="mt-2 text-slate-900 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-700" /> {t.signedBy} {c.signedName} {t.on} {dayTime(c.signedAt)}</p>}
      {done && <p className="mt-3 rounded-xl bg-green-100 border border-green-500 text-green-900 px-4 py-3 font-semibold">{t.signedOk}</p>}

      <div className="flex flex-wrap gap-2 mt-4">
        <button onClick={() => setOpen(!open)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300"><ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} /> {open ? t.hide : t.review}</button>
        <a href={`/api/portal/${token}/pdf?doc=${c.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300"><Download className="w-4 h-4" /> {t.pdf}</a>
      </div>

      {open && (
        <div className="mt-4 rounded-xl border border-slate-300 bg-slate-50 p-4 sm:p-5 space-y-4 text-slate-900">
          {c.propertyAddress && <div><span className={label}>{t.jobAddress}</span>{c.propertyAddress}</div>}
          {c.scope.length > 0 && <div><span className={label}>{t.scope}</span><ol className="list-decimal pl-5 space-y-1">{c.scope.map((s: string, i: number) => <li key={i}>{s}</li>)}</ol>{c.scopeNote && <p className="mt-2 whitespace-pre-line">{c.scopeNote}</p>}</div>}
          <div><span className={label}>{t.payment}</span><p className="whitespace-pre-line">{c.paymentStructure}</p><p className="mt-1 font-bold">{t.total}: {money(c.total)}</p></div>
          {c.terms && <div><span className={label}>{t.terms}</span><p className="whitespace-pre-line text-sm leading-relaxed">{c.terms}</p></div>}
          {c.notes && <div><span className={label}>{t.notes}</span><p className="whitespace-pre-line">{c.notes}</p></div>}
        </div>
      )}

      <Thread t={t} title={t.questions} button={t.ask} placeholder={t.askPh} messages={messages} dayTime={dayTime}
        onSend={async text => { await post({ action: 'message', docType: 'contract', docId: c.id, text }); await reload() }} />

      {!signed && (
        <div className="mt-5 pt-5 border-t-2 border-[#fd9b14]">
          <h4 className="text-lg font-bold text-[#0b1b33] mb-3">{t.signTitle}</h4>
          <label className="block text-sm font-semibold text-slate-900 mb-1.5">{t.fullName}</label>
          <input value={name} onChange={e => setName(e.target.value)} autoComplete="name" className="w-full rounded-xl border border-slate-400 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 mb-4" />
          <SignaturePad mode="client" label={t.signature} onSignatureChange={setSig} text={{ draw: t.draw, type: t.type, begin: t.begin, clear: t.clear, typePlaceholder: t.typePlaceholder, hintDraw: t.hintDraw, hintType: t.hintType, change: t.change }} />
          <label className="flex items-start gap-3 mt-4 cursor-pointer">
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-1 w-5 h-5 flex-shrink-0 accent-[#0b1b33]" />
            <span className="text-sm text-slate-900 leading-relaxed">{t.agree}</span>
          </label>
          {err && <p className="mt-3 rounded-lg bg-red-100 border border-red-400 text-red-900 px-3 py-2 text-sm font-semibold">{err}</p>}
          <button onClick={sign} disabled={busy} className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-green-700 text-white text-base font-bold hover:bg-green-800 disabled:opacity-70">{busy ? <><Loader2 className="w-5 h-5 animate-spin" /> {t.signing}</> : <><FileSignature className="w-5 h-5" /> {t.signBtn}</>}</button>
        </div>
      )}
    </div>
  )
}

function Referral({ t, post, reload, sent, cardCls, h2 }: { t: typeof EN; post: (b: Record<string, unknown>) => Promise<any>; reload: () => Promise<void>; sent: { name: string; at: string | null }[]; cardCls: string; h2: string }) {
  const [f, setF] = useState({ name: '', phone: '', email: '', details: '' })
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const ic = 'w-full rounded-xl border border-slate-400 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-500 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
  const send = async () => {
    setBusy(true); setNote('')
    try { await post({ action: 'referral', ...f }); setF({ name: '', phone: '', email: '', details: '' }); setNote(t.referOk); await reload() } catch (e: any) { setNote(e.message) }
    setBusy(false)
  }
  return (
    <section>
      <h2 className={h2}><Users className="w-5 h-5 text-[#c2410c]" /> {t.refer}</h2>
      <div className={cardCls}>
        <p className="text-slate-900 mb-4">{t.referIntro}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder={t.friendName} className={ic + ' sm:col-span-2'} />
          <input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} type="tel" placeholder={t.friendPhone} className={ic} />
          <input value={f.email} onChange={e => setF({ ...f, email: e.target.value })} type="email" placeholder={t.friendEmail} className={ic} />
          <textarea value={f.details} onChange={e => setF({ ...f, details: e.target.value })} rows={2} placeholder={t.friendWhat} className={ic + ' sm:col-span-2'} />
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <button onClick={send} disabled={busy || !f.name.trim()} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0b1b33] text-white font-semibold disabled:opacity-50">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {t.referBtn}</button>
          {note && <span className="text-sm font-semibold text-slate-900">{note}</span>}
        </div>
        {sent.length > 0 && <ul className="mt-4 pt-4 border-t border-slate-200 space-y-1 text-slate-900">{sent.map((r, i) => <li key={i} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-700" /> {t.referred} {r.name}</li>)}</ul>}
      </div>
    </section>
  )
}
