'use client'

import { useState, useEffect } from 'react'
import {
  Plus, Trash2, Send, Download, Eye, Loader2, CheckCircle,
  Briefcase, User, Calendar, FileText, Pencil, AlertTriangle, Mail
} from 'lucide-react'
import { SignaturePad } from '../_components/SignaturePad'
import { saveDocument, getDocument, type DocumentRecord, getSavedSignatureUrl, nextDocumentNumber, confirmDocumentNumber, getFieldNote, updateFieldNote } from '@/lib/firebase-auth'

import { adminFetch } from '@/lib/admin-api'
import { ConfirmDialog, SentNotice, SendChecks, useUnsavedWarning } from '../_components/DocumentGuards'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '../_components/Toast'
import { PdfDialog, type ReadyPdf } from '../_components/PdfDialog'

interface ScopeItem { id: string; description: string }

interface ContractData {
  number: string; date: string; clientName: string; clientEmail: string; clientPhone: string
  clientAddress: string; propertyAddress: string; projectName: string; projectTitle: string
  scopeItems: ScopeItem[]; scopeNote: string; totalAmount: number
  paymentStructure: string; contractTerms: string; notes: string
  signatureData: string | null; isCorrection: boolean
}

const DEFAULT_TERMS = `Any alteration or deviation from written agreement involving extra work will be executed only upon written agreement and will be charged over the above estimate accordingly.

All work guaranteed for one (1) year from completion date. Warranty covers workmanship defects only, not normal wear and tear.

Client agrees to provide reasonable access to the property during scheduled work hours. Any delays caused by client will extend the project timeline accordingly.

CRGS, Inc. carries full liability insurance and workers' compensation coverage. MHIC License #05-132359.`

// Payment splits Carlos can pick from. Each part is a share of the total and when it is due.
const PAYMENT_PRESETS: { label: string; parts: [number, string][] }[] = [
  { label: '3 equal payments', parts: [[1 / 3, 'when client authorizes work agreement'], [1 / 3, 'due at project midpoint'], [1 / 3, 'upon completion and customer satisfaction']] },
  { label: '50% / 50%', parts: [[0.5, 'when client authorizes work agreement'], [0.5, 'upon completion and customer satisfaction']] },
  { label: '30% / 40% / 30%', parts: [[0.3, 'when client authorizes work agreement'], [0.4, 'due at project midpoint'], [0.3, 'upon completion and customer satisfaction']] },
  { label: '10% deposit, rest at the end', parts: [[0.1, 'deposit when client authorizes work agreement'], [0.9, 'upon completion and customer satisfaction']] },
]
const usd = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
/** Writes the payment lines; the last payment absorbs the rounding so they add up to the total exactly */
function paymentText(total: number, parts: [number, string][]): string {
  let left = Math.round(total * 100)
  return parts.map(([share, when], i) => {
    const cents = i === parts.length - 1 ? left : Math.round(total * share * 100)
    left -= cents
    return `${usd(cents / 100)} USD ${when}.`
  }).join('\n')
}

const INITIAL: ContractData = {
  number: '', // unique number is assigned when the page opens and checked again on save
  date: new Date().toISOString().split('T')[0],
  clientName: '', clientEmail: '', clientPhone: '', clientAddress: '', propertyAddress: '',
  projectName: '', projectTitle: '',
  scopeItems: [{ id: '1', description: '' }],
  scopeNote: 'All the above will be plastered, sanded, primed and painted two coats. Existing color will be matched.',
  totalAmount: 0,
  paymentStructure: '',
  contractTerms: DEFAULT_TERMS,
  notes: 'All dumping fees, materials and labor are included in this price.',
  signatureData: null, isCorrection: false,
}

export default function ContractsPage() {
  const [ct, setCt] = useState<ContractData>(INITIAL)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const toast = useToast()
  const [pdf, setPdf] = useState<ReadyPdf | null>(null)
  // a contract the client already signed cannot be changed or sent again
  const [signedBy, setSignedBy] = useState<{ name?: string; signedAt?: string } | null>(null)
  const [estimateId, setEstimateId] = useState<string | null>(null)
  const router = useRouter()
  const [savedSigUrl, setSavedSigUrl] = useState<string | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const [wasSent, setWasSent] = useState(false) // already emailed to the client
  const [confirmCorrection, setConfirmCorrection] = useState(false)
  const markSaved = useUnsavedWarning(ct)

  useEffect(() => {
    getSavedSignatureUrl().then(url => { if (url) setSavedSigUrl(url) })
  }, [])

  // Reopen a saved draft: /admin/...?id=<document id>
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id')
    const fromEstimate = new URLSearchParams(window.location.search).get('fromEstimate')
    if (!id && fromEstimate) {
      // Contract started from a field estimate: client and job are filled in
      getFieldNote(fromEstimate).then(async note => {
        if (!note) { alert('That field estimate was not found.'); return }
        const prices = (note.estimatedCost || '').match(/\d[\d,]*(\.\d+)?/g) || []
        const number = await nextDocumentNumber('contract').catch(() => '')
        setEstimateId(fromEstimate)
        markSaved()
        setCt(prev => ({
          ...prev, number: prev.number || number,
          clientName: note.clientName || '', clientEmail: note.clientEmail || '', clientPhone: note.clientPhone || '',
          clientAddress: note.address || '', propertyAddress: note.address || '',
          projectName: note.projectName || '', projectTitle: note.projectName || '',
          totalAmount: prices.length === 1 ? Math.round(Number(prices[0].replace(/,/g, '')) * 100) / 100 : prev.totalAmount,
        }))
      }).catch(err => alert(`Could not open the field estimate.\n\n${err instanceof Error ? err.message : String(err)}`))
      return
    }
    if (!id) {
      // New document: take the next free number
      nextDocumentNumber('contract').then(n => { markSaved(); setCt(prev => (prev.number ? prev : { ...prev, number: n })) }).catch(() => {})
      return
    }
    getDocument(id).then(d => {
      if (!d) return
      setSavedId(id)
      const alreadySent = !!d.status && d.status !== 'draft'
      if (d.status === 'signed') setSignedBy(d.clientSignature || {})
      if (d.estimateId) setEstimateId(d.estimateId)
      setWasSent(alreadySent)
      markSaved()
      setCt(prev => ({
        ...prev,
        ...(d.formData || {
          number: (d.number || prev.number).replace(/-CORRECTED$/, ''),
          date: d.date || prev.date, clientName: d.clientName || '', clientEmail: d.clientEmail || '',
          clientPhone: d.clientPhone || '', clientAddress: d.clientAddress || '',
          projectName: d.projectName || '', notes: d.notes ?? prev.notes,
          // older drafts saved before formData existed: restore what was stored
          ...('items' in prev && d.items?.length ? { items: d.items } : {}),
          ...('dueDate' in prev && d.dueDate ? { dueDate: d.dueDate } : {}),
          ...('taxRate' in prev && d.taxRate != null ? { taxRate: d.taxRate } : {}),
        }),
        signatureData: d.signatureData ?? null,
        ...(alreadySent ? { isCorrection: true } : {}),
      }))
    }).catch(err => alert(`Could not open this document.\n\n${err instanceof Error ? err.message : String(err)}`))
  }, [])

  // Auto-generate payment structure when total changes
  useEffect(() => {
    // first time a total is entered: start with 3 equal payments (Carlos can change it)
    if (ct.totalAmount > 0 && !ct.paymentStructure) {
      setCt(prev => ({ ...prev, paymentStructure: paymentText(ct.totalAmount, PAYMENT_PRESETS[0].parts) }))
    }
  }, [ct.totalAmount])

  const updateField = (field: keyof ContractData, value: any) => setCt(prev => ({ ...prev, [field]: value }))
  // dollar amounts written in the payment structure, to catch a total that changed afterwards
  const paymentSum = Math.round((ct.paymentStructure.match(/\$\s?\d[\d,]*(\.\d+)?/g) || []).reduce((sum, m) => sum + Number(m.replace(/[$,\s]/g, '')), 0) * 100) / 100
  const paymentMismatch = ct.totalAmount > 0 && paymentSum > 0 && Math.abs(paymentSum - ct.totalAmount) > 0.01 ? paymentSum : 0
  const addScope = () => setCt(prev => ({ ...prev, scopeItems: [...prev.scopeItems, { id: String(Date.now()), description: '' }] }))
  const removeScope = (id: string) => { if (ct.scopeItems.length > 1) setCt(prev => ({ ...prev, scopeItems: prev.scopeItems.filter(i => i.id !== id) })) }
  const updateScope = (id: string, value: string) => setCt(prev => ({ ...prev, scopeItems: prev.scopeItems.map(i => i.id === id ? { ...i, description: value } : i) }))

  const handleSave = async (status: DocumentRecord['status'] = 'draft') => {
    setSaving(true)
    try {
      const num = await confirmDocumentNumber('contract', ct.number, savedId)
      if (num !== ct.number) setCt(prev => ({ ...prev, number: num }))
      const docData: DocumentRecord = {
        ...(savedId ? { id: savedId } : {}), type: 'contract',
        number: ct.isCorrection ? `${num}-CORRECTED` : num,
        clientName: ct.clientName, clientEmail: ct.clientEmail, clientPhone: ct.clientPhone,
        clientAddress: ct.clientAddress, propertyAddress: ct.propertyAddress,
        projectName: ct.projectName, date: ct.date,
        items: ct.scopeItems.map(s => ({ id: s.id, description: s.description, quantity: 1, unitPrice: 0 })),
        freeformDescription: ct.scopeNote,
        paymentStructure: ct.paymentStructure, contractTerms: ct.contractTerms,
        notes: ct.notes, subtotal: ct.totalAmount, tax: 0, taxRate: 0, total: ct.totalAmount,
        signatureData: ct.signatureData, status,
        ...(estimateId ? { estimateId } : {}),
        formData: { ...ct, number: num, signatureData: null },
      }
      const id = await saveDocument(docData)
      if (estimateId && !savedId) await updateFieldNote(estimateId, { contractId: id }).catch(() => {})
      setSavedId(id)
      markSaved()
      if (status === 'draft') toast(`Draft ${num} saved. Find it under Drafts.`)
      if (status !== 'draft') { setWasSent(true); setCt(prev => ({ ...prev, isCorrection: true })) }
    } catch (err) {
      console.error('Save failed:', err)
      alert(`This could not be saved. Please tell Ron.\n\n${err instanceof Error ? err.message : String(err)}`)
      setSaving(false)
      throw err
    }
    setSaving(false)
  }

  // Everything the PDF needs, built from the form
  const pdfData = () => ({
    number: ct.isCorrection ? `${ct.number}-CORRECTED` : ct.number,
    date: ct.date, clientName: ct.clientName, clientPhone: ct.clientPhone,
    clientEmail: ct.clientEmail, clientAddress: ct.clientAddress,
    propertyAddress: ct.propertyAddress,
    projectName: ct.projectTitle || ct.projectName,
    items: ct.scopeItems.map(s => ({ description: s.description })),
    freeformDescription: ct.scopeNote ? `Note: ${ct.scopeNote}` : '',
    paymentStructure: `${ct.paymentStructure}\n\nSum estimated to complete job: $${ct.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`,
    contractTerms: ct.contractTerms,
    notes: ct.notes,
    signatureData: ct.signatureData,
    ...(signedBy ? { clientSignature: signedBy } : {}),
  })

  const handleGeneratePdf = async () => {
    setGenerating(true)
    try {
      const data = pdfData()
      const res = await adminFetch('/api/admin/generate-pdf', { type: 'contract', data })
      const blob = await res.blob()
      if (blob.type !== 'application/pdf' || blob.size < 500) throw new Error('The server did not return a PDF.')
      // shown in a window with Open / Download buttons: a new tab opened from code is blocked by Safari
      setPdf({ blob, filename: `contract-${String(data.number || 'draft').replace(/[^\w.-]/g, '_')}.pdf` })
    } catch (err) {
      console.error('PDF failed:', err)
      alert(`The PDF could not be created. Please tell Ron.\n\n${err instanceof Error ? err.message : String(err)}`)
    }
    setGenerating(false)
  }

  const prepareEmail = async () => {
    // make sure the number is unique before it goes into an email
    let num = ct.number
    try {
      num = await confirmDocumentNumber('contract', ct.number, savedId)
      if (num !== ct.number) setCt(prev => ({ ...prev, number: num }))
    } catch (err) { alert(err instanceof Error ? err.message : String(err)); return }
    setEmailSubject(`${ct.isCorrection ? 'Corrected ' : ''}Contract ${num} — ${ct.projectName || 'CR Home Pros'}`)
    setEmailBody(`Hi ${ct.clientName.split(' ')[0] || 'there'},\n\nPlease find attached the contract for ${ct.projectName || 'your project'} at ${ct.propertyAddress || 'your property'}.\n\nTotal estimated cost: $${ct.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\nPlease review it and sign it online with the button in this email. You can also ask any question there before you sign.\n\nBest regards,\nCarlos Hernandez\nCR Home Pros\n(571) 237-7164`)
    if (ct.isCorrection) setEmailBody(b => b.replace('\n\n', '\n\nThis is a corrected version. It replaces the one we sent you before.\n\n'))
    setShowEmailModal(true)
  }

  const handleSend = async () => {
    setSending(true)
    try {
      // Email goes out from the website with the PDF attached; Carlos gets a copy
      await adminFetch('/api/admin/send-document', {
        type: 'contract', data: pdfData(), to: ct.clientEmail.trim(), subject: emailSubject, message: emailBody,
      })
      await handleSave('sent')
      setSent(true); setShowEmailModal(false)
      // say what happened, then show it in the Sent list
      toast(`Contract ${ct.number} sent to ${ct.clientEmail.trim()}. They can sign it on their page.`)
      router.push('/admin/contracts/sent')
    } catch (err) {
      console.error('Send failed:', err)
      alert(`The email was not sent.\n\n${err instanceof Error ? err.message : String(err)}`)
    }
    setSending(false)
  }

  const fmt = (n: number) => `$${(Math.round(n * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const ic = "w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
  const dic = ic + " [color-scheme:dark]"
  const lc = "text-sm font-medium text-slate-300 mb-1.5 block"

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3"><Briefcase className="w-6 h-6 text-blue-400" /> {ct.isCorrection ? 'Corrected Contract' : 'Create Contract'}</h1>
          <p className="text-slate-300 text-sm mt-1">Professional scope of work and agreement</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/admin/contracts/sent" className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 flex items-center gap-2"><FileText className="w-4 h-4" /> Sent</Link>
          <label title={wasSent ? 'Already sent: anything you send now is a correction' : undefined} className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-600/20 text-amber-300 text-sm ${wasSent ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
            <input type="checkbox" checked={ct.isCorrection || wasSent} disabled={wasSent} onChange={e => updateField('isCorrection', e.target.checked)} className="rounded" />
            <AlertTriangle className="w-3.5 h-3.5" /> Correction
          </label>
        </div>
      </div>

      {signedBy ? (
        <div className="mb-6 rounded-xl border border-green-400/50 bg-green-500/15 p-4 text-sm text-green-50">
          <p className="font-semibold text-white">In contract: signed by {signedBy.name || 'the client'}{signedBy.signedAt ? ` on ${new Date(signedBy.signedAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}` : ''}.</p>
          <p className="mt-1">A signed contract cannot be changed or sent again. You can still open the PDF, which shows both signatures. If the job changes, make a new contract.</p>
        </div>
      ) : wasSent && <SentNotice what="contract" />}

      <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl mb-6 w-fit">
        <button onClick={() => setTab('edit')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'edit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}><Pencil className="w-3.5 h-3.5 inline mr-1.5" />Edit</button>
        <button onClick={() => setTab('preview')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}><Eye className="w-3.5 h-3.5 inline mr-1.5" />Preview</button>
      </div>

      {tab === 'edit' ? (
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-400" /> Contract Details</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className={lc}>Contract #</label><input value={ct.number} placeholder="Assigned automatically" onChange={e => updateField('number', e.target.value)} className={ic} /></div>
              <div><label className={lc}>Date</label><input type="date" value={ct.date} onChange={e => updateField('date', e.target.value)} className={dic} /></div>
              <div><label className={lc}>Total Amount</label><input type="number" value={ct.totalAmount || ''} onChange={e => updateField('totalAmount', Number(e.target.value))} className={ic} step="0.01" placeholder="17097.00" /></div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><User className="w-4 h-4 text-blue-400" /> Client & Property</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={lc}>Client Name</label><input value={ct.clientName} onChange={e => updateField('clientName', e.target.value)} placeholder="Ishaan Tharoor" className={ic} /></div>
              <div><label className={lc}>Email</label><input type="email" value={ct.clientEmail} onChange={e => updateField('clientEmail', e.target.value)} className={ic} /></div>
              <div><label className={lc}>Phone</label><input value={ct.clientPhone} onChange={e => updateField('clientPhone', e.target.value)} className={ic} /></div>
              <div><label className={lc}>Project Name</label><input value={ct.projectName} onChange={e => updateField('projectName', e.target.value)} placeholder="Basement Renovation" className={ic} /></div>
              <div><label className={lc}>Property Address</label><textarea value={ct.propertyAddress} onChange={e => updateField('propertyAddress', e.target.value)} placeholder={"4611 43rd Street NW\nWashington DC 20016"} rows={2} className={ic} /></div>
              <div><label className={lc}>Scope Title (on PDF)</label><input value={ct.projectTitle} onChange={e => updateField('projectTitle', e.target.value)} placeholder="FLOORING, FRAMING, DRYWALL AND PAINTING" className={ic} /></div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-400" /> Scope of Work</h2>
            <div className="space-y-3">
              {ct.scopeItems.map((item, idx) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <span className="text-slate-300 text-sm mt-3 w-6 text-right flex-shrink-0">{idx + 1}.</span>
                  <textarea value={item.description} onChange={e => updateScope(item.id, e.target.value)} placeholder="Protect all furniture with plastic and floors with drop cloth..." rows={2} className={ic + ' flex-1'} />
                  <button onClick={() => removeScope(item.id)} className="mt-3 text-red-400 hover:text-red-300 p-1" disabled={ct.scopeItems.length === 1}><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <button onClick={addScope} className="mt-4 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-600/10"><Plus className="w-4 h-4" /> Add Scope Item</button>
            <div className="mt-4"><label className={lc}>Scope Note</label><textarea value={ct.scopeNote} onChange={e => updateField('scopeNote', e.target.value)} rows={2} className={ic} /></div>
          </div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4">Payment Structure</h2>
            <p className="text-sm text-slate-100 mb-3">Pick a split to fill it in from the total, then change the wording any way you like. Nothing here is fixed.</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {PAYMENT_PRESETS.map(preset => (
                <button key={preset.label} type="button" disabled={!ct.totalAmount} onClick={() => updateField('paymentStructure', paymentText(ct.totalAmount, preset.parts))}
                  className="text-sm px-3 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50">{preset.label}</button>
              ))}
              <button type="button" onClick={() => updateField('paymentStructure', '')} className="text-sm px-3 py-2 rounded-lg bg-slate-800 border border-white/15 text-white hover:bg-slate-700">Clear and write my own</button>
            </div>
            <textarea value={ct.paymentStructure} onChange={e => updateField('paymentStructure', e.target.value)} rows={5} placeholder="Example: $5,000.00 USD when client authorizes work agreement..." className={ic} />
            {!ct.totalAmount && <p className="text-sm text-slate-100 mt-2">Enter the contract total first to use the buttons.</p>}
            {paymentMismatch && (
              <p className="mt-2 rounded-lg border border-amber-400/50 bg-amber-500/15 px-3 py-2 text-sm text-amber-50">The payments written here add up to <strong className="text-white">{fmt(paymentMismatch)}</strong>, but the contract total is <strong className="text-white">{fmt(ct.totalAmount)}</strong>. Check the amounts or press a split button again.</p>
            )}
          </div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4">Terms & Conditions</h2>
            <textarea value={ct.contractTerms} onChange={e => updateField('contractTerms', e.target.value)} rows={6} className={ic} />
          </div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6"><label className={lc}>Additional Notes</label><textarea value={ct.notes} onChange={e => updateField('notes', e.target.value)} rows={2} className={ic} /></div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <SignaturePad onSignatureChange={sig => updateField('signatureData', sig)} savedSignatureUrl={savedSigUrl} onDefaultSaved={url => { setSavedSigUrl(url); toast('Default signature saved') }} label="Carlos Hernandez — President, CRGS Inc." />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {!wasSent && <button onClick={() => handleSave('draft')} disabled={saving} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 text-sm">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />} Save Draft</button>}
            <button onClick={() => setTab('preview')} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600/20 text-blue-400 font-medium hover:bg-blue-600/30 text-sm"><Eye className="w-4 h-4" /> Preview</button>
            <button onClick={handleGeneratePdf} disabled={generating} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 text-sm">{generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Generate PDF</button>
            {!signedBy && <button onClick={() => (wasSent ? setConfirmCorrection(true) : prepareEmail())} disabled={!ct.clientEmail} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 text-sm disabled:opacity-40">{sent ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />} {sent ? 'Sent!' : wasSent ? 'Send Correction' : 'Send to Client'}</button>}
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 max-w-[800px] mx-auto text-slate-900">
            <div className="flex items-start justify-between border-b-4 border-blue-900 pb-6 mb-8">
              <div><h2 className="text-3xl font-bold text-blue-900">C&R</h2><p className="text-sm text-slate-600">General Services Inc.</p><p className="text-xs text-amber-600 mt-1">Licensed | Insured | Bonded</p></div>
              <div className="text-right"><h1 className="text-xl font-bold text-amber-600">{ct.isCorrection ? 'CORRECTED CONTRACT' : 'CONTRACT'}</h1><p className="text-sm text-slate-500 mt-1">#{ct.number} • {ct.date}</p></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-8 mb-6">
              <div><p className="text-xs font-bold text-blue-900 uppercase mb-2">Client</p><p className="font-semibold">{ct.clientName || '—'}</p>{ct.clientPhone && <p className="text-sm text-slate-600">{ct.clientPhone}</p>}</div>
              <div><p className="text-xs font-bold text-blue-900 uppercase mb-2">Property</p><p className="text-sm whitespace-pre-line">{ct.propertyAddress || '—'}</p></div>
            </div>
            <p className="text-sm text-slate-600 mb-4">C&R General Services Inc. is pleased to submit the following scope of work for:</p>
            {ct.projectTitle && <h3 className="font-bold text-blue-900 text-center text-lg underline mb-6">{ct.projectTitle}</h3>}
            <div className="space-y-3 mb-6">
              {ct.scopeItems.map((item, idx) => (
                <div key={item.id} className="text-sm"><span className="font-semibold text-blue-900 mr-2">{idx + 1}.</span>{item.description || '—'}</div>
              ))}
            </div>
            {ct.scopeNote && <p className="text-sm italic text-slate-600 mb-6 bg-slate-50 rounded-lg p-3">Note: {ct.scopeNote}</p>}
            {ct.paymentStructure && (
              <div className="bg-slate-50 rounded-xl p-5 mb-6">
                <h4 className="font-bold text-blue-900 uppercase text-xs mb-3">Payment Structure</h4>
                <p className="text-sm whitespace-pre-line">{ct.paymentStructure}</p>
                <div className="mt-3 pt-3 border-t"><p className="font-bold text-lg text-blue-900">Sum estimated to complete job: {fmt(ct.totalAmount)}</p></div>
              </div>
            )}
            {ct.notes && <p className="text-sm text-slate-600 mb-4">{ct.notes}</p>}
            <div className="grid sm:grid-cols-2 gap-8 border-t pt-8 mb-8">
              <div><p className="text-sm font-semibold mb-4">Provided and Guaranteed by:</p><div className="h-16 border-b border-slate-300 mb-1">{ct.signatureData && <img src={ct.signatureData} alt="Sig" className="h-full object-contain" />}</div><p className="text-sm font-semibold">Carlos Hernandez</p><p className="text-xs text-slate-500">President, CRGS, Inc.</p></div>
              <div><p className="text-sm font-semibold mb-4">Accepted and Agreed:</p><div className="h-16 border-b border-slate-300 mb-1" /><p className="text-sm font-semibold">{ct.clientName || '________________'}</p><p className="text-xs text-slate-500">Owner of Above House • Date: ________</p></div>
            </div>
            {ct.contractTerms && (
              <div className="border-t pt-6"><h4 className="font-bold text-blue-900 uppercase text-xs mb-3">Terms & Conditions</h4><p className="text-xs text-slate-500 whitespace-pre-line leading-relaxed">{ct.contractTerms}</p></div>
            )}
            <div className="mt-8 text-center border-t pt-6">
              <p className="text-xs font-bold text-blue-900">C&R GENERAL SERVICES INC.</p>
              <p className="text-xs text-amber-600 italic">We Are In This Business For You</p>
              <p className="text-xs text-slate-400">(571) 237-7164 | crhomepros@gmail.com</p>
            </div>
          </div>
          <div className="flex justify-center gap-3 mt-6">
            <button onClick={() => setTab('edit')} className="px-4 py-2.5 rounded-xl bg-slate-700 text-white text-sm hover:bg-slate-600">← Back to Edit</button>
            <button onClick={handleGeneratePdf} disabled={generating} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center gap-2">{generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Download PDF</button>
          </div>
        </div>
      )}

      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Mail className="w-5 h-5 text-blue-400" /> Send Contract</h3>
            <div className="space-y-4">
              <div><label className={lc}>To</label><input value={ct.clientEmail} readOnly className={ic + ' opacity-60'} /></div>
              <div><label className={lc}>Subject</label><input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className={ic} /></div>
              <div><label className={lc}>Message</label><textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={8} className={ic} /></div>
              <SendChecks items={[!ct.signatureData && 'There is no signature on this contract.', ct.isCorrection && 'This goes out marked as a CORRECTION.']} />
              <p className="text-xs text-slate-200">Sends the email from CR Home Pros with the PDF attached. You get a copy, and replies come to crhomepros@gmail.com.</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEmailModal(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm">Cancel</button>
              <button onClick={handleSend} disabled={sending} className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 text-sm flex items-center justify-center gap-2">{sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {sending ? 'Sending…' : 'Send Email'}</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={confirmCorrection}
        title="This contract was already sent"
        confirmLabel="Yes, write the correction email"
        onCancel={() => setConfirmCorrection(false)}
        onConfirm={() => { setConfirmCorrection(false); prepareEmail() }}
      >
        <p>{ct.clientName || 'The client'} already received this contract by email.</p>
        <p>If you continue, the client gets a <strong>second email</strong> with a new PDF marked as a correction. It cannot be taken back once it is sent.</p>
        <p>Only continue if something in the first one was wrong.</p>
      </ConfirmDialog>
      <PdfDialog pdf={pdf} onClose={() => setPdf(null)} />
    </div>
  )
}
