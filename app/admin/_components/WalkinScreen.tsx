'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Store, Loader2, Plus, Printer, Download, Save, Trash2, ArrowLeft, Receipt, Briefcase, ClipboardList,
  Circle, CheckCircle, FileText,
} from 'lucide-react'
import {
  getDocumentsByType, getDocument, saveDocument, deleteDocument, nextDocumentNumber, confirmDocumentNumber,
  type DocumentRecord,
} from '@/lib/firebase-auth'
import { adminFetch } from '@/lib/admin-api'
import { buildPayments, taxOn, usd, type Payment, type PaymentPlan, PAYMENT_PLANS } from '@/lib/payment-plan'
import { SignaturePad } from './SignaturePad'
import { PercentInput, MoneyInput } from './SendSummary'
import { PdfDialog, type ReadyPdf } from './PdfDialog'
import { ConfirmDialog } from './DocumentGuards'
import { useToast } from './Toast'
import { getSavedSignatureUrl } from '@/lib/firebase-auth'

type DocType = 'estimate' | 'contract' | 'invoice'
// Walk-in estimates are stored as the 'invoice' family? No — estimates are their own thing.
// For walk-in we store estimate/contract/invoice all in admin_documents with walkin:true.
// 'estimate' maps to type 'invoice' would be wrong; we use the real doc types and a walkinKind.
const PDF_TYPE: Record<DocType, 'invoice' | 'contract'> = { estimate: 'invoice', contract: 'contract', invoice: 'invoice' }

const META: Record<DocType, { label: string; icon: any; color: string; prefix: string }> = {
  estimate: { label: 'Estimate', icon: ClipboardList, color: 'sky', prefix: 'WEST' },
  contract: { label: 'Contract', icon: Briefcase, color: 'violet', prefix: 'WCTR' },
  invoice: { label: 'Invoice', icon: Receipt, color: 'orange', prefix: 'WINV' },
}

const today = () => new Date().toISOString().split('T')[0]
const blankItem = () => ({ id: Math.random().toString(36).slice(2), description: '', quantity: 1, unitPrice: 0 })

/**
 * Walk-in (in-person) documents: recorded by hand for clients who do not use
 * the online flow. They are never emailed. Carlos previews, prints and hands
 * them over, and records payment himself. Kept separate from digital documents.
 */
export function WalkinScreen({ docType, view = 'all', startWithNew = false }: { docType: DocType; view?: 'all' | 'new'; startWithNew?: boolean }) {
  const meta = META[docType]
  const router = useRouter()
  const toast = useToast()
  const [list, setList] = useState<DocumentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<DocumentRecord | 'new' | null>(null)
  const [toDelete, setToDelete] = useState<DocumentRecord | null>(null)

  const load = async () => {
    try { setList(await getDocumentsByType(PDF_TYPE[docType], 'walkin')) } catch (e) { console.error(e) }
    setLoading(false)
  }
  useEffect(() => {
    load()
    if (startWithNew) setEditing('new')
    const id = new URLSearchParams(window.location.search).get('id')
    if (id) getDocument(id).then(d => { if (d?.walkin) setEditing(d) })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (editing) return <WalkinEditor docType={docType} record={editing === 'new' ? null : editing} onClose={() => { setEditing(null); load() }} />

  // Walk-in estimates and invoices share the 'invoice' PDF family, so this list
  // is narrowed to the exact kind the page is for.
  const rows = list.filter(d => (d.walkinKind || (d.payments?.length ? 'invoice' : 'estimate')) === docType)

  const Icon = meta.icon
  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-2">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3"><Store className="w-6 h-6 text-teal-300" /> Walk-in {meta.label}s</h1>
        <button onClick={() => setEditing('new')} className="flex-shrink-0 px-4 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 flex items-center gap-2"><Plus className="w-5 h-5" /> New</button>
      </div>
      <p className="text-white text-sm mb-5">In-person {meta.label.toLowerCase()}s you record by hand and print. These are never emailed and are kept separate from your online documents.</p>

      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-300" /></div>
        : rows.length === 0 ? (
          <div className="bg-slate-800/50 border border-white/25 rounded-2xl p-10 text-center">
            <Icon className="w-12 h-12 text-white/70 mx-auto mb-3" />
            <p className="text-white text-lg">No walk-in {meta.label.toLowerCase()}s yet</p>
            <p className="text-white text-sm mt-1 mb-5">Record one for a client who is paying or signing in person.</p>
            <button onClick={() => setEditing('new')} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"><Plus className="w-5 h-5" /> New walk-in {meta.label.toLowerCase()}</button>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map(d => (
              <div key={d.id} className="bg-slate-800/50 border border-white/25 rounded-2xl p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white text-lg truncate">{d.clientName || 'No name'}</h3>
                    <p className="text-sm text-white">{d.number} · {d.projectName}</p>
                  </div>
                  <span className="flex-shrink-0 px-3 py-1 rounded-full bg-teal-700 text-white text-sm font-bold">{usd(d.total)}</span>
                </div>
                {d.walkinNote && <p className="text-white text-sm mt-2">{d.walkinNote}</p>}
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/25">
                  <button onClick={() => setEditing(d)} className="text-sm px-3 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 flex items-center gap-1.5"><FileText className="w-4 h-4" /> Open / print</button>
                  <button onClick={() => setToDelete(d)} className="text-sm px-3 py-2 rounded-lg bg-red-600/40 text-white hover:bg-red-600/60 flex items-center gap-1.5 ml-auto"><Trash2 className="w-4 h-4" /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

      <ConfirmDialog open={!!toDelete} danger title={`Delete this walk-in ${meta.label.toLowerCase()}?`} confirmLabel="Yes, delete it" cancelLabel="Keep it"
        onCancel={() => setToDelete(null)}
        onConfirm={async () => { const d = toDelete!; setToDelete(null); try { await deleteDocument(d.id!); setList(prev => prev.filter(x => x.id !== d.id)); toast('Deleted') } catch (e) { toast(e instanceof Error ? e.message : 'Not deleted', 'error') } }}>
        <p>This removes your record of it. If you printed and handed it over, the client still has their paper copy.</p>
      </ConfirmDialog>
    </div>
  )
}

function WalkinEditor({ docType, record, onClose }: { docType: DocType; record: DocumentRecord | null; onClose: () => void }) {
  const meta = META[docType]
  const toast = useToast()
  const isContract = docType === 'contract'
  const isInvoice = docType === 'invoice'

  const [number, setNumber] = useState(record?.number || '')
  const [clientName, setClientName] = useState(record?.clientName || '')
  const [clientPhone, setClientPhone] = useState(record?.clientPhone || '')
  const [clientAddress, setClientAddress] = useState(record?.clientAddress || '')
  const [projectName, setProjectName] = useState(record?.projectName || '')
  const [date, setDate] = useState(record?.date || today())
  const [items, setItems] = useState(record?.items?.length ? record.items : [blankItem()])
  const [taxRate, setTaxRate] = useState(record?.taxRate || 0)
  const [walkinNote, setWalkinNote] = useState(record?.walkinNote || '')
  const [notes, setNotes] = useState(record?.notes || '')
  const [contractTerms, setContractTerms] = useState(record?.contractTerms || '')
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>(record?.paymentPlan || 'thirds')
  const [payments, setPayments] = useState<Payment[]>(record?.payments || [])
  const [signature, setSignature] = useState<string | null>(record?.signatureData || null)
  const [savedSigUrl, setSavedSigUrl] = useState<string | null>(null)
  const [savedId, setSavedId] = useState(record?.id || '')
  const [busy, setBusy] = useState('')
  const [pdf, setPdf] = useState<ReadyPdf | null>(null)

  useEffect(() => { getSavedSignatureUrl().then(url => { if (url) setSavedSigUrl(url) }) }, [])
  useEffect(() => {
    if (!record) nextDocumentNumber(PDF_TYPE[docType]).then(n => setNumber(prev => prev || `${meta.prefix}-${n.replace(/^[A-Z]+-/, '')}`)).catch(() => {})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const subtotal = Math.round(items.reduce((s, i) => s + (i.quantity || 0) * (i.unitPrice || 0), 0) * 100) / 100
  const tax = taxOn(subtotal, taxRate)
  const total = Math.round((subtotal + tax) * 100) / 100
  const planPayments = buildPayments(total, paymentPlan)

  const pdfData = () => {
    const base: any = {
      number, date, clientName, clientPhone, clientAddress, projectName,
      items, taxRate, notes, signatureData: signature,
    }
    if (isContract) {
      base.propertyAddress = clientAddress
      base.items = items.map(i => ({ description: i.description }))
      base.paymentStructure = [
        `Contract price: ${usd(subtotal)} USD`,
        taxRate > 0 ? `Sales tax (${taxRate.toFixed(2)}%): ${usd(tax)} USD` : 'Sales tax: none',
        `Total, taxes included: ${usd(total)} USD`,
        '',
        `Payments (${PAYMENT_PLANS[paymentPlan].name}):`,
        planPayments.map(p => `${usd(p.amount)} USD. ${p.label}.`).join('\n'),
      ].join('\n')
      base.contractTerms = contractTerms
    } else if (isInvoice) {
      base.payments = payments.length ? payments : undefined
    }
    return base
  }

  const save = async (): Promise<string | null> => {
    if (!clientName.trim()) { toast('Add the client name first.', 'error'); return null }
    setBusy('save')
    try {
      const num = await confirmDocumentNumber(PDF_TYPE[docType], number, savedId || null).catch(() => number)
      const rec: DocumentRecord = {
        ...(savedId ? { id: savedId } : {}),
        type: PDF_TYPE[docType], number: num || number,
        clientName, clientEmail: '', clientPhone, clientAddress,
        projectName: projectName || `Walk-in ${meta.label.toLowerCase()}`,
        date, items, subtotal, tax, taxRate, total,
        notes, signatureData: signature, status: 'draft',
        walkin: true, walkinKind: docType, walkinNote,
        ...(isContract ? { paymentPlan, payments: planPayments, contractTerms } : {}),
        ...(isInvoice ? { payments: payments.length ? payments : planPayments, paymentPlan } : {}),
      } as DocumentRecord
      const id = await saveDocument(rec)
      setSavedId(id); setNumber(num || number)
      toast(`Walk-in ${meta.label.toLowerCase()} ${num || number} saved`)
      return id
    } catch (e) { toast(e instanceof Error ? e.message : 'Not saved', 'error'); return null }
    finally { setBusy('') }
  }

  const makePdf = async () => {
    setBusy('pdf')
    try {
      await save()
      const res = await adminFetch('/api/admin/generate-pdf', { type: PDF_TYPE[docType], data: pdfData() })
      const blob = await res.blob()
      if (blob.type !== 'application/pdf' || blob.size < 500) throw new Error('The server did not return a PDF.')
      setPdf({ blob, filename: `walkin-${docType}-${String(number).replace(/[^\w.-]/g, '_')}.pdf` })
    } catch (e) { toast(e instanceof Error ? e.message : 'The PDF could not be created.', 'error') }
    setBusy('')
  }

  const ic = 'w-full bg-slate-800 border border-white/30 rounded-xl px-4 py-3 text-white text-base placeholder-slate-300 outline-none focus:border-blue-400'
  const lc = 'text-sm font-medium text-white mb-1.5 block'
  const card = 'bg-slate-800/50 border border-white/25 rounded-2xl p-4 sm:p-6'

  const setItem = (id: string, field: string, value: any) => setItems(prev => prev.map(i => (i.id === id ? { ...i, [field]: value } : i)))

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto pb-28">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onClose} aria-label="Back" className="p-2 -ml-2 text-white hover:bg-white/10 rounded-lg"><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-xl font-bold text-white">{record ? 'Edit' : 'New'} walk-in {meta.label.toLowerCase()}</h1>
      </div>

      <div className="rounded-xl border border-teal-400 bg-teal-800 p-3 mb-5 text-sm text-white">This is an in-person {meta.label.toLowerCase()}. It will not be emailed. Save it, then preview and print it to hand to the client.</div>

      <div className="space-y-5">
        <div className={card}>
          <h2 className="text-lg font-semibold text-white mb-4">Client and job</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={lc}>Client name *</label><input value={clientName} onChange={e => setClientName(e.target.value)} className={ic} autoComplete="off" /></div>
            <div><label className={lc}>Phone</label><input value={clientPhone} onChange={e => setClientPhone(e.target.value)} className={ic} type="tel" /></div>
            <div className="sm:col-span-2"><label className={lc}>Address</label><input value={clientAddress} onChange={e => setClientAddress(e.target.value)} className={ic} /></div>
            <div><label className={lc}>Project</label><input value={projectName} onChange={e => setProjectName(e.target.value)} className={ic} placeholder="Example: Back deck" /></div>
            <div><label className={lc}>Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className={ic} /></div>
            <div className="sm:col-span-2"><label className={lc}>{meta.label} number</label><input value={number} onChange={e => setNumber(e.target.value)} className={ic} /></div>
          </div>
        </div>

        <div className={card}>
          <h2 className="text-lg font-semibold text-white mb-4">{isContract ? 'Scope of work' : 'Line items'}</h2>
          <div className="space-y-3">
            {items.map(it => (
              <div key={it.id} className="grid grid-cols-12 gap-2 items-start">
                <input value={it.description} onChange={e => setItem(it.id, 'description', e.target.value)} placeholder="Description" className={ic + ' col-span-12 sm:col-span-6'} />
                {!isContract && <>
                  <input type="number" value={it.quantity || ''} onChange={e => setItem(it.id, 'quantity', Number(e.target.value))} placeholder="Qty" className={ic + ' col-span-3 sm:col-span-2'} />
                  <div className="col-span-7 sm:col-span-3"><MoneyInput value={it.unitPrice} onChange={n => setItem(it.id, 'unitPrice', n)} className={ic} ariaLabel="Unit price" /></div>
                </>}
                <button onClick={() => setItems(prev => prev.length > 1 ? prev.filter(x => x.id !== it.id) : prev)} className="col-span-2 sm:col-span-1 text-white bg-red-600/40 hover:bg-red-600/60 rounded-xl py-3 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <button onClick={() => setItems(prev => [...prev, blankItem()])} className="mt-3 text-sm px-3 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add line</button>
        </div>

        {!isContract && (
          <div className={card}>
            <h2 className="text-lg font-semibold text-white mb-4">Totals and tax</h2>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="text-white">Subtotal</span><span className="text-white font-semibold text-lg">{usd(subtotal)}</span>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 mt-2">
              <label className="text-white">Sales tax</label>
              <PercentInput value={taxRate} onChange={setTaxRate} className="w-24 bg-slate-800 border-2 border-white/40 rounded-lg px-3 py-2 text-white text-base text-right font-semibold outline-none focus:border-blue-400" />
              <span className="text-white text-lg font-semibold">%</span>
            </div>
            <div className={`mt-3 rounded-xl border-2 p-3 ${taxRate > 0 ? 'border-amber-300 bg-amber-800' : 'border-white/30 bg-slate-800'}`}>
              <div className="flex justify-between text-white"><span>Tax ({taxRate.toFixed(2)}%)</span><span className="font-bold">{usd(tax)}</span></div>
              <div className="flex justify-between text-white mt-1 pt-1 border-t border-white/30 text-lg"><span className="font-bold">Total</span><span className="font-extrabold">{usd(total)}</span></div>
            </div>
          </div>
        )}

        {isContract && (
          <div className={card}>
            <h2 className="text-lg font-semibold text-white mb-1">Price, tax and payments</h2>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <label className="text-white">Contract price</label>
              <MoneyInput value={items[0]?.unitPrice || 0} onChange={n => setItem(items[0].id, 'unitPrice', n)} className={ic + ' !w-40'} ariaLabel="Contract price" />
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <label className="text-white">Sales tax</label>
              <PercentInput value={taxRate} onChange={setTaxRate} className="w-24 bg-slate-800 border-2 border-white/40 rounded-lg px-3 py-2 text-white text-base text-right font-semibold outline-none focus:border-blue-400" />
              <span className="text-white text-lg font-semibold">%</span>
            </div>
            <div className={`mt-3 rounded-xl border-2 p-3 ${taxRate > 0 ? 'border-amber-300 bg-amber-800' : 'border-white/30 bg-slate-800'}`}>
              <div className="flex justify-between text-white"><span>Contract price</span><span className="font-bold">{usd(subtotal)}</span></div>
              <div className="flex justify-between text-white mt-1"><span>Sales tax ({taxRate.toFixed(2)}%)</span><span className="font-bold">{usd(tax)}</span></div>
              <div className="flex justify-between text-white mt-2 pt-2 border-t border-white/40 text-lg"><span className="font-bold">Total, taxes included</span><span className="font-extrabold">{usd(total)}</span></div>
            </div>
            <p className="font-semibold text-white mt-5 mb-2">Payment plan</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {(Object.keys(PAYMENT_PLANS) as PaymentPlan[]).map(plan => {
                const on = paymentPlan === plan
                return (
                  <button key={plan} type="button" onClick={() => setPaymentPlan(plan)} className={`text-left rounded-xl border-2 p-4 ${on ? 'bg-blue-600 border-white ring-2 ring-blue-300' : 'bg-slate-800 border-white/30'}`}>
                    <div className="flex items-center justify-between mb-2"><span className="text-white font-bold">{PAYMENT_PLANS[plan].name}</span>{on && <CheckCircle className="w-5 h-5 text-white" />}</div>
                    {buildPayments(total, plan).map((p, i) => <div key={i} className="flex justify-between text-white text-sm"><span>{p.label.split(',')[0]}</span><span className="font-bold">{usd(p.amount)}</span></div>)}
                  </button>
                )
              })}
            </div>
            <div className="mt-4"><label className={lc}>Terms and conditions</label><textarea value={contractTerms} onChange={e => setContractTerms(e.target.value)} rows={3} className={ic} /></div>
          </div>
        )}

        <div className={card}>
          <label className={lc}>Note to yourself (not printed)</label>
          <textarea value={walkinNote} onChange={e => setWalkinNote(e.target.value)} rows={2} placeholder="Example: paid cash in full; signed paper on file." className={ic} />
          <label className={lc + ' mt-4'}>Note on the document (printed)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className={ic} />
        </div>

        <div className={card}>
          <SignaturePad onSignatureChange={setSignature} savedSignatureUrl={savedSigUrl} onDefaultSaved={url => { setSavedSigUrl(url); toast('Default signature saved') }} label="Your signature (Carlos Hernandez)" compact />
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 lg:left-64 z-30 bg-slate-950/95 backdrop-blur border-t border-white/25 p-3">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button onClick={save} disabled={!!busy} className="px-4 py-3.5 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-600 flex items-center gap-2">{busy === 'save' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save</button>
          <button onClick={makePdf} disabled={!!busy} className="flex-1 px-4 py-3.5 rounded-xl bg-green-600 text-white text-base font-bold hover:bg-green-700 flex items-center justify-center gap-2">{busy === 'pdf' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Printer className="w-5 h-5" />} Preview &amp; print</button>
        </div>
      </div>

      <PdfDialog pdf={pdf} onClose={() => setPdf(null)} />
    </div>
  )
}
