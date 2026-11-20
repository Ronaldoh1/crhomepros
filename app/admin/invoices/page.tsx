'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Receipt, Loader2, Send, Download, CheckCircle, FileSignature, AlertTriangle, Briefcase, Circle, Printer, Store } from 'lucide-react'
import { getDocument, saveDocument, getDocumentsByType, getSavedSignatureUrl, type DocumentRecord } from '@/lib/firebase-auth'
import { adminFetch } from '@/lib/admin-api'
import { balanceDue, buildPayments, paidSoFar, nextPayment, usd, type Payment } from '@/lib/payment-plan'
import { SignaturePad } from '../_components/SignaturePad'
import { ConfirmDialog } from '../_components/DocumentGuards'
import { PdfDialog, type ReadyPdf } from '../_components/PdfDialog'
import { TextToClientButton } from '../_components/TextToClientButton'
import { SendSummary } from '../_components/SendSummary'
import { useToast } from '../_components/Toast'

const today = () => new Date().toISOString().split('T')[0]
const day = (d?: string) => (d ? new Date(d + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '')
const sameTicks = (a: Payment[], b: Payment[]) => a.length === b.length && a.every((p, i) => !!p.received === !!b[i].received)

/**
 * An invoice always belongs to a signed contract. It is created by the system
 * when the contract is signed and takes its amounts from the contract:
 *   1. Carlos approves it and sends it (first payment due)
 *   2. Each time a payment comes in he ticks "Payment received" and sends the
 *      updated invoice, which shows what was paid and what is left
 *   3. Unticking a payment sends a corrected invoice with his note
 */
export default function InvoicePage() {
  const toast = useToast()
  const router = useRouter()
  const [doc, setDoc] = useState<DocumentRecord | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [sentPayments, setSentPayments] = useState<Payment[]>([]) // as the client last saw them
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [signature, setSignature] = useState<string | null>(null)
  const [savedSigUrl, setSavedSigUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [waiting, setWaiting] = useState<DocumentRecord[]>([]) // signed contracts with no invoice yet
  const [busy, setBusy] = useState('')
  const [pdf, setPdf] = useState<ReadyPdf | null>(null)
  const [summary, setSummary] = useState(false)
  const [sending, setSending] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [correctionNote, setCorrectionNote] = useState('')
  const [toUntick, setToUntick] = useState<number | null>(null)

  useEffect(() => { getSavedSignatureUrl().then(url => { if (url) setSavedSigUrl(url) }) }, [])
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id')
    if (!id) {
      // No invoice chosen: show what can be invoiced
      getDocumentsByType('contract').then(cs => setWaiting(cs.filter(c => c.status === 'signed' && !c.invoiceId))).catch(() => {}).finally(() => setLoading(false))
      return
    }
    getDocument(id).then(d => {
      if (!d || d.type !== 'invoice') { setError('That invoice was not found.'); return }
      // invoices from before payments existed: one payment for the full amount
      const pays = d.payments?.length ? d.payments : [{ label: 'Payment in full', amount: d.total || 0, received: d.status === 'paid' }]
      setDoc(d); setPayments(pays); setSentPayments(d.status === 'draft' ? pays.map(p => ({ ...p, received: false })) : pays)
      setDueDate(d.dueDate || ''); setNotes(d.notes || ''); setSignature(d.signatureData || null)
    }).catch(e => setError(e instanceof Error ? e.message : String(e))).finally(() => setLoading(false))
  }, [])

  const isDraft = doc?.status === 'draft'
  const isVoid = doc?.status === 'void'
  const isWalkin = !!doc?.walkin
  const total = doc?.total || 0
  const paid = paidSoFar(payments)
  const balance = balanceDue(total, payments)
  const changed = !sameTicks(payments, sentPayments)
  const unticked = payments.some((p, i) => !p.received && sentPayments[i]?.received) // a payment the client was told was received
  const newlyPaid = payments.filter((p, i) => p.received && !sentPayments[i]?.received)
  const next = nextPayment(payments)

  const pdfData = () => ({
    number: doc!.number, date: doc!.date, dueDate, clientName: doc!.clientName, clientEmail: doc!.clientEmail,
    clientPhone: doc!.clientPhone, clientAddress: doc!.clientAddress, projectName: doc!.projectName,
    items: doc!.items, taxRate: doc!.taxRate || 0, notes: [unticked && correctionNote.trim() ? `Correction: ${correctionNote.trim()}` : '', notes].filter(Boolean).join('\n\n'),
    signatureData: signature, payments, contractNumber: doc!.contractNumber || '', isCorrection: unticked,
    ...(isVoid ? { stamp: 'VOID' } : {}),
  })

  const tick = (i: number) => {
    if (payments[i].received) { setToUntick(i); return }
    // payments are received in order
    if (payments.slice(0, i).some(p => !p.received)) { toast(`Mark ${payments[i - 1].label.split(':')[0]} as received first.`, 'error'); return }
    setPayments(prev => prev.map((p, j) => (j === i ? { ...p, received: true, receivedAt: today() } : p)))
  }
  const untick = (i: number) => {
    setToUntick(null)
    // a later payment cannot stay received if an earlier one is not
    setPayments(prev => prev.map((p, j) => (j >= i ? { ...p, received: false, receivedAt: '' } : p)))
  }

  const openPdf = async () => {
    setBusy('pdf')
    try {
      const res = await adminFetch('/api/admin/generate-pdf', { type: 'invoice', data: pdfData() })
      const blob = await res.blob()
      if (blob.type !== 'application/pdf' || blob.size < 500) throw new Error('The server did not return a PDF.')
      setPdf({ blob, filename: `invoice-${String(doc!.number).replace(/[^\w.-]/g, '_')}.pdf` })
    } catch (e) { toast(e instanceof Error ? e.message : 'The PDF could not be created.', 'error') }
    setBusy('')
  }

  const openSummary = () => {
    if (!doc) return
    if (unticked && !correctionNote.trim()) { toast('Write a short note for the client explaining the correction.', 'error'); return }
    const first = (doc.clientName || '').split(' ')[0] || 'there'
    const sign = '\n\nBest regards,\nCarlos Hernandez\nCR Home Pros\n(571) 237-7164'
    if (isDraft) {
      setSubject(`Invoice ${doc.number}: ${doc.projectName || 'CR Home Pros'}`)
      setMessage(`Hi ${first},\n\nThank you for signing the contract for ${doc.projectName || 'your project'}. Your invoice ${doc.number} is attached.\n\nInvoice total: ${usd(total)}${next ? `\nDue now, to start the job: ${usd(next.amount)}` : ''}\n\nThe invoice shows every payment in the contract. We will send you an updated copy each time a payment is received.${sign}`)
    } else if (unticked) {
      setSubject(`Corrected invoice ${doc.number}`)
      setMessage(`Hi ${first},\n\nThis is a corrected version of invoice ${doc.number}. It replaces the one we sent before.\n\n${correctionNote.trim()}\n\nBalance due: ${usd(balance)}${sign}`)
    } else {
      const got = newlyPaid.map(p => `${usd(p.amount)} (${p.label.split(',')[0]})`).join(' and ')
      setSubject(balance <= 0 ? `Paid in full: invoice ${doc.number}` : `Payment received: invoice ${doc.number}`)
      setMessage(`Hi ${first},\n\n${got ? `We received your payment of ${got}. Thank you!` : `Here is your updated invoice ${doc.number}.`}\n\nYour updated invoice is attached.\n\nPaid so far: ${usd(paid)}\n${balance <= 0 ? 'Balance due: $0.00. This invoice is paid in full.' : `Balance due: ${usd(balance)}${next ? `\nNext payment: ${usd(next.amount)} (${next.label.split(',')[0]})` : ''}`}${sign}`)
    }
    setSummary(true)
  }

  const send = async () => {
    if (!doc) return
    setSending(true)
    try {
      await adminFetch('/api/admin/send-document', { type: 'invoice', data: pdfData(), to: doc.clientEmail.trim(), subject, message })
      const status: DocumentRecord['status'] = balance <= 0 ? 'paid' : 'sent'
      const updated: DocumentRecord = {
        ...doc, status, payments, dueDate, notes, signatureData: signature,
        ...(unticked ? { correctionNote: correctionNote.trim(), correctedAt: today() } : {}),
      } as DocumentRecord
      await saveDocument(updated)
      setSummary(false)
      toast(`${unticked ? 'Corrected invoice' : isDraft ? 'Invoice' : 'Updated invoice'} sent to client: ${doc.clientName || doc.clientEmail}`)
      router.push('/admin/invoices/sent')
    } catch (e) { toast(e instanceof Error ? e.message : 'The invoice was not sent.', 'error') }
    setSending(false)
  }

  // Walk-in invoice: no email. Save the status and payments, then open the PDF to print.
  const recordWalkin = async () => {
    if (!doc) return
    setSending(true)
    try {
      const status: DocumentRecord['status'] = balance <= 0 ? 'paid' : 'sent'
      const updated: DocumentRecord = {
        ...doc, status, payments, dueDate, notes, signatureData: signature,
      } as DocumentRecord
      await saveDocument(updated)
      setSentPayments(payments)
      setDoc(updated)
      await openPdf()
      toast(isDraft ? `Invoice ${doc.number} approved. Print it and hand it over.` : balance <= 0 ? `Invoice ${doc.number} marked paid in full.` : `Payment recorded on invoice ${doc.number}. Print the updated copy.`)
    } catch (e) { toast(e instanceof Error ? e.message : 'The invoice was not saved.', 'error') }
    setSending(false)
  }

  const createFor = async (c: DocumentRecord) => {
    setBusy(c.id!)
    try {
      const res = await adminFetch('/api/admin/create-invoice', { contractId: c.id })
      const data = await res.json()
      toast(`Invoice ${data.invoiceNumber} created from contract ${c.number}`)
      window.location.href = `/admin/invoices?id=${data.invoiceId}`
    } catch (e) { toast(e instanceof Error ? e.message : 'The invoice was not created.', 'error') }
    setBusy('')
  }

  const card = 'bg-slate-800/50 border border-white/25 rounded-2xl p-4 sm:p-6'
  const ic = 'w-full bg-slate-800 border border-white/30 rounded-xl px-4 py-3 text-white text-base placeholder-slate-300 outline-none focus:border-blue-400'

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-blue-300" /></div>
  if (error) return <div className="p-6 max-w-2xl mx-auto"><div className="rounded-xl border border-red-300 bg-red-800 p-4 text-white">{error}</div></div>

  // ── No invoice open: explain where invoices come from ──
  if (!doc) return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white flex items-center gap-3 mb-2"><Receipt className="w-6 h-6 text-orange-300" /> Invoices</h1>
      <div className={card}>
        <p className="text-white text-lg font-semibold">Invoices come from signed contracts.</p>
        <p className="text-white mt-1">When a client signs a contract, its invoice is created for you automatically with the contract's total, tax and payments. Find it under <strong>Invoices to approve</strong>.</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link href="/admin/invoices/drafts" className="px-4 py-2.5 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700">Invoices to approve</Link>
          <Link href="/admin/invoices/sent" className="px-4 py-2.5 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-600">Sent invoices</Link>
          <Link href="/admin/contracts/sent" className="px-4 py-2.5 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-600">Contracts</Link>
        </div>
      </div>
      {waiting.length > 0 && (
        <div className={card + ' mt-4'}>
          <p className="text-white font-semibold mb-3">Signed contracts without an invoice</p>
          <div className="space-y-2">
            {waiting.map(c => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-900 border border-white/25 p-3">
                <div className="text-white"><p className="font-semibold">{c.clientName}</p><p className="text-sm">{c.number} · {usd(c.total)}</p></div>
                <button onClick={() => createFor(c)} disabled={busy === c.id} className="px-4 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 flex items-center gap-2">{busy === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />} Create invoice</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // ── The invoice ──
  const stateChip = isVoid ? ['bg-red-700', 'Void'] : isDraft ? ['bg-orange-600', 'Waiting for your approval'] : balance <= 0 ? ['bg-green-700', 'Paid in full'] : ['bg-blue-700', `Sent · ${payments.filter(p => p.received).length} of ${payments.length} payments received`]
  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto pb-32">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3"><Receipt className="w-6 h-6 text-orange-300" /> Invoice {doc.number}{isWalkin && <span className="px-2.5 py-1 rounded-full bg-teal-700 text-white text-xs font-semibold flex items-center gap-1"><Store className="w-3.5 h-3.5" /> Walk-in</span>}</h1>
          <p className="text-white mt-1">{doc.clientName} · {doc.projectName}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-white text-sm font-bold ${stateChip[0]}`}>{stateChip[1]}</span>
      </div>

      {isVoid && (
        <div className="mb-5 rounded-xl border border-red-300 bg-red-800 p-4 text-white">
          <p className="font-bold">This invoice is void because contract {doc.contractNumber} was cancelled.</p>
          <p className="mt-1 text-sm">Nothing more is due on it and it cannot be sent or changed. {paid > 0 ? `${usd(paid)} was marked as received before the cancellation. Any refund is between you and the client.` : 'No payment was marked as received.'}</p>
        </div>
      )}
      {isDraft && (
        <div className={`mb-5 rounded-xl border p-4 text-white ${isWalkin ? 'border-teal-300 bg-teal-800' : 'border-orange-300 bg-orange-800'}`}>
          <p className="font-bold flex items-center gap-2">{isWalkin ? <Store className="w-5 h-5" /> : <FileSignature className="w-5 h-5" />} The contract is signed. This invoice is ready for you to approve.</p>
          <p className="mt-1 text-sm">{isWalkin ? <>Walk-in: check the amounts, then press <strong>Approve &amp; print</strong>. The invoice is printed to hand over — nothing is emailed. Record each payment here as it comes in.</> : <>Check the amounts, then press <strong>Approve and send</strong>. Nothing reaches the client until you do.</>}</p>
        </div>
      )}

      <div className="space-y-5">
        <div className={card}>
          <div className="grid sm:grid-cols-2 gap-4 text-white">
            <div><p className="text-xs font-bold uppercase tracking-wide text-orange-300">Bill to</p><p className="font-semibold text-lg">{doc.clientName}</p><p className="break-all">{doc.clientEmail}</p><p>{doc.clientPhone}</p><p>{doc.clientAddress}</p></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-orange-300">From contract</p>
              {doc.contractId ? <Link href={`/admin/contracts?id=${doc.contractId}`} className="inline-flex items-center gap-2 font-semibold underline"><Briefcase className="w-4 h-4" /> {doc.contractNumber || 'Open contract'}</Link> : <p>Made before invoices were tied to contracts</p>}
              <p className="mt-2 text-sm">Invoice date: {day(doc.date)}</p>
            </div>
          </div>
        </div>

        <div className={card}>
          <h2 className="text-lg font-semibold text-white mb-3">Amounts, from the contract</h2>
          <div className="rounded-xl border border-white/25 overflow-hidden text-white">
            {(doc.items || []).map((it, i) => (
              <div key={i} className={`flex items-start justify-between gap-4 px-4 py-3 ${i ? 'border-t border-white/20' : ''}`}><span>{it.description}</span><span className="font-semibold">{usd(it.quantity * it.unitPrice)}</span></div>
            ))}
            <div className="flex justify-between gap-4 px-4 py-2.5 border-t border-white/20"><span>Contract price</span><span className="font-semibold">{usd(doc.subtotal)}</span></div>
            <div className={`flex justify-between gap-4 px-4 py-2.5 border-t border-white/20 ${(doc.taxRate || 0) > 0 ? 'bg-amber-800 font-semibold' : ''}`}><span>Sales tax ({(doc.taxRate || 0).toFixed(2)}%)</span><span className="font-semibold">{usd(doc.tax)}</span></div>
            <div className="flex justify-between gap-4 px-4 py-3 border-t border-white/20 bg-slate-900 text-lg"><span className="font-bold">Invoice total, taxes included</span><span className="font-extrabold">{usd(total)}</span></div>
          </div>
          <p className="text-sm text-white mt-2">These come from the signed contract and cannot be changed here.</p>
        </div>

        <div className={card}>
          <h2 className="text-lg font-semibold text-white">Payments</h2>
          <p className="text-sm text-white mb-3">{isDraft ? `After you ${isWalkin ? 'print' : 'send'} the invoice, come back here each time the client pays.` : isWalkin ? 'When a payment comes in, tick it and print the updated invoice.' : 'When a payment comes in, tick it and send the updated invoice.'}</p>
          <div className="space-y-2">
            {payments.map((p, i) => {
              const wasSent = !!sentPayments[i]?.received
              return (
                <button key={i} type="button" role="checkbox" aria-checked={!!p.received} disabled={isDraft || isVoid} onClick={() => tick(i)}
                  className={`w-full text-left rounded-xl border-2 p-4 flex items-center gap-4 transition-colors disabled:cursor-not-allowed ${p.received ? 'bg-green-700 border-white' : 'bg-slate-800 border-white/30 hover:border-white'}`}>
                  {p.received ? <CheckCircle className="w-8 h-8 text-white flex-shrink-0" /> : <Circle className="w-8 h-8 text-white flex-shrink-0" />}
                  <span className="flex-1 min-w-0 text-white">
                    <span className="block font-semibold">{p.label}</span>
                    <span className="block text-sm">{p.received ? `Payment received${p.receivedAt ? ` on ${day(p.receivedAt)}` : ''}${wasSent ? '' : ' · not sent to the client yet'}` : wasSent ? 'Unticked · the client was told this was received' : isDraft ? 'Due after the invoice is sent' : 'Not received yet. Tap when the client pays.'}</span>
                  </span>
                  <span className="text-white text-lg font-extrabold flex-shrink-0">{usd(p.amount)}</span>
                </button>
              )
            })}
          </div>
          <div className="mt-4 rounded-xl border-2 border-white/40 overflow-hidden text-white">
            <div className="flex justify-between gap-4 px-4 py-2.5"><span>Invoice total</span><span className="font-semibold">{usd(total)}</span></div>
            <div className="flex justify-between gap-4 px-4 py-2.5 border-t border-white/20"><span>Payments received</span><span className="font-semibold">- {usd(paid)}</span></div>
            <div className={`flex justify-between gap-4 px-4 py-3 text-lg ${balance <= 0 ? 'bg-green-700' : 'bg-orange-600'}`}><span className="font-bold">{balance <= 0 ? 'Paid in full' : 'Balance due'}</span><span className="font-extrabold">{usd(balance)}</span></div>
          </div>

          {unticked && (
            <div className="mt-4 rounded-xl border border-amber-300 bg-amber-800 p-4 text-white">
              <p className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> This will go out as a corrected invoice</p>
              <p className="text-sm mt-1">The client was told this payment was received. Write a short note explaining the correction. It is printed on the invoice and in the email.</p>
              <textarea value={correctionNote} onChange={e => setCorrectionNote(e.target.value)} rows={2} placeholder="Example: Payment 2 was marked as received by mistake. It is still due." className={ic + ' mt-2'} />
            </div>
          )}
        </div>

        <div className={card}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium text-white mb-1.5 block">Due date for the next payment (optional)</label><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={ic} /></div>
            <div><label className="text-sm font-medium text-white mb-1.5 block">Note on the invoice (optional)</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className={ic} /></div>
          </div>
        </div>

        <div className={card}>
          <SignaturePad onSignatureChange={setSignature} savedSignatureUrl={savedSigUrl || (signature && signature.startsWith('https://') ? signature : null)} onDefaultSaved={url => { setSavedSigUrl(url); toast('Default signature saved') }} label="Your signature (Carlos Hernandez)" compact />
        </div>
      </div>

      {/* Actions */}
      <div className="fixed bottom-0 inset-x-0 lg:left-64 z-30 bg-slate-950/95 backdrop-blur border-t border-white/25 p-3">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button onClick={openPdf} disabled={busy === 'pdf'} className="px-4 py-3.5 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-600 flex items-center gap-2">{busy === 'pdf' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />} <span className="hidden sm:inline">Open</span> PDF</button>
          {isVoid ? (
            <span className="flex-1 px-4 py-3.5 rounded-xl bg-red-800 text-white text-base font-bold text-center">Void: cannot be sent</span>
          ) : isWalkin ? (
            <button onClick={recordWalkin} disabled={sending || (!isDraft && !changed)} className="flex-1 px-4 py-3.5 rounded-xl bg-teal-600 text-white text-base font-bold hover:bg-teal-700 flex items-center justify-center gap-2 disabled:opacity-50">{sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Printer className="w-5 h-5" />} {isDraft ? 'Approve & print' : changed ? 'Record payment & print' : 'Print invoice'}</button>
          ) : isDraft ? (
            <button onClick={openSummary} className="flex-1 px-4 py-3.5 rounded-xl bg-green-600 text-white text-base font-bold hover:bg-green-700 flex items-center justify-center gap-2"><Send className="w-5 h-5" /> Approve and send</button>
          ) : changed ? (
            <button onClick={openSummary} className={`flex-1 px-4 py-3.5 rounded-xl text-white text-base font-bold flex items-center justify-center gap-2 ${unticked ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'}`}><Send className="w-5 h-5" /> {unticked ? 'Send corrected invoice' : 'Send updated invoice'}</button>
          ) : (
            <button onClick={openSummary} className="flex-1 px-4 py-3.5 rounded-xl bg-slate-700 text-white text-base font-semibold hover:bg-slate-600 flex items-center justify-center gap-2"><Send className="w-5 h-5" /> Send again</button>
          )}
          {!isVoid && !isWalkin && <TextToClientButton email={doc.clientEmail} phone={doc.clientPhone} name={doc.clientName} docType="invoice" docNumber={doc.number} className="px-4 py-3.5 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 flex items-center gap-2" />}
        </div>
      </div>

      <SendSummary
        open={summary} kind={unticked ? 'Corrected Invoice' : isDraft ? 'Invoice' : 'Updated Invoice'} number={doc.number}
        clientName={doc.clientName} clientEmail={doc.clientEmail} project={doc.projectName}
        rows={[
          { label: `Invoice total (tax ${(doc.taxRate || 0).toFixed(2)}%: ${usd(doc.tax)})`, value: usd(total) },
          ...payments.map(p => ({ label: p.label.split(',')[0], value: `${usd(p.amount)}\n${p.received ? 'Received' : 'Due'}`, highlight: !!p.received })),
          { label: 'Payments received', value: `- ${usd(paid)}` },
        ]}
        totalLabel={balance <= 0 ? 'Paid in full' : 'Balance due'} total={usd(balance)}
        note="The updated PDF is attached to the email. You get a copy, and replies come to crhomepros@gmail.com."
        checks={[!signature && 'There is no signature on this invoice.', total <= 0 && 'The invoice total is $0.00.', unticked && 'This goes out marked as a CORRECTED invoice, with your note.', !isDraft && !changed && 'Nothing changed since the last time you sent it.']}
        subject={subject} onSubject={setSubject} message={message} onMessage={setMessage}
        sending={sending} sendLabel={unticked ? 'Send correction' : isDraft ? 'Send invoice' : 'Send update'}
        onEdit={() => setSummary(false)} onSend={send}
      />

      <ConfirmDialog open={toUntick !== null} title="Untick this payment?" confirmLabel="Yes, it was not received" cancelLabel="Leave it ticked"
        onCancel={() => setToUntick(null)} onConfirm={() => toUntick !== null && untick(toUntick)}>
        <p>Only do this if <strong>{toUntick !== null ? payments[toUntick]?.label.split(',')[0] : ''}</strong> was marked as received by mistake.</p>
        {toUntick !== null && sentPayments[toUntick]?.received
          ? <p>The client was already told it was received. You will be asked for a short note, and the invoice goes out again marked as <strong>corrected</strong>.</p>
          : <p>The client has not been told yet, so nothing needs to be corrected.</p>}
        {toUntick !== null && payments.slice(toUntick + 1).some(p => p.received) && <p>Later payments will be unticked too, because payments are received in order.</p>}
      </ConfirmDialog>
      <PdfDialog pdf={pdf} onClose={() => setPdf(null)} />
    </div>
  )
}
