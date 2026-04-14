'use client'

import { useState, useEffect } from 'react'
import {
  Plus, Trash2, Send, Download, Eye, Loader2, CheckCircle,
  ClipboardList, User, Calendar, FileText, Pencil, AlertTriangle, Mail
} from 'lucide-react'
import { SignaturePad } from '../_components/SignaturePad'
import { saveDocument, type DocumentRecord, getSavedSignatureUrl } from '@/lib/firebase-auth'

import Link from 'next/link'

interface LineItem { id: string; description: string; quantity: number; unitPrice: number }

interface ChangeOrderData {
  number: string; date: string; clientName: string; clientEmail: string; clientPhone: string
  clientAddress: string; propertyAddress: string; projectName: string
  existingContractDate: string; previousContractAmount: number
  depositAmount: number; depositNote: string
  items: LineItem[]; notes: string; signatureData: string | null; isCorrection: boolean
}

const INITIAL: ChangeOrderData = {
  number: `CO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
  date: new Date().toISOString().split('T')[0],
  clientName: '', clientEmail: '', clientPhone: '', clientAddress: '', propertyAddress: '',
  projectName: '', existingContractDate: '', previousContractAmount: 0,
  depositAmount: 0, depositNote: '',
  items: [{ id: '1', description: '', quantity: 1, unitPrice: 0 }],
  notes: 'All work to be performed under the same terms and conditions as specified in original contract unless otherwise stipulated.',
  signatureData: null, isCorrection: false,
}

export default function ChangeOrdersPage() {
  const [co, setCo] = useState<ChangeOrderData>(INITIAL)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [savedSigUrl, setSavedSigUrl] = useState<string | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')

  const changeTotal = co.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
  const totalAfterChange = co.previousContractAmount + changeTotal - co.depositAmount

  useEffect(() => {
    getSavedSignatureUrl().then(url => { if (url) setSavedSigUrl(url) })
  }, [])

  const updateField = (field: keyof ChangeOrderData, value: any) => setCo(prev => ({ ...prev, [field]: value }))
  const addItem = () => setCo(prev => ({ ...prev, items: [...prev.items, { id: String(Date.now()), description: '', quantity: 1, unitPrice: 0 }] }))
  const removeItem = (id: string) => { if (co.items.length > 1) setCo(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) })) }
  const updateItem = (id: string, field: keyof LineItem, value: any) => setCo(prev => ({ ...prev, items: prev.items.map(i => i.id === id ? { ...i, [field]: value } : i) }))

  const handleSave = async (status: DocumentRecord['status'] = 'draft') => {
    setSaving(true)
    try {
      const docData: DocumentRecord = {
        ...(savedId ? { id: savedId } : {}), type: 'change-order',
        number: co.isCorrection ? `${co.number}-CORRECTED` : co.number,
        clientName: co.clientName, clientEmail: co.clientEmail, clientPhone: co.clientPhone,
        clientAddress: co.clientAddress, propertyAddress: co.propertyAddress,
        projectName: co.projectName, date: co.date,
        items: co.items, notes: co.notes,
        subtotal: changeTotal, tax: 0, taxRate: 0, total: totalAfterChange,
        signatureData: co.signatureData, status,
      }
      const id = await saveDocument(docData)
      setSavedId(id)
    } catch (err) { console.error('Save failed:', err) }
    setSaving(false)
  }

  const handleGeneratePdf = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/admin/generate-pdf', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'change-order', data: {
          number: co.isCorrection ? `${co.number}-CORRECTED` : co.number,
          date: co.date, clientName: co.clientName, clientPhone: co.clientPhone,
          clientEmail: co.clientEmail, clientAddress: co.clientAddress,
          propertyAddress: co.propertyAddress, projectName: co.projectName,
          items: co.items, notes: co.notes,
          paymentStructure: `DATE OF EXISTING CONTRACT: ${co.existingContractDate}\n\nPREVIOUS CONTRACT AMOUNT: $${co.previousContractAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}\nDEPOSIT: $${co.depositAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${co.depositNote}\n\nCHANGE ORDER TOTAL: $${changeTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}\nTOTAL AFTER CHANGE ORDER: $${totalAfterChange.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        }})
      })
      const blob = await res.blob()
      window.open(URL.createObjectURL(blob), '_blank')
    } catch (err) { console.error('PDF failed:', err) }
    setGenerating(false)
  }

  const prepareEmail = () => {
    setEmailSubject(`Change Order ${co.number} — ${co.projectName || 'CR Home Pros'}`)
    setEmailBody(`Hi ${co.clientName.split(' ')[0] || 'there'},\n\nPlease find attached Change Order ${co.number} for additional work on your project.\n\nThe change order total is $${changeTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}.\n\nPlease review, sign, and return at your earliest convenience.\n\nBest regards,\nCarlos Hernandez\nCR Home Pros\n(571) 237-7164`)
    setShowEmailModal(true)
  }

  const handleSend = async () => {
    setSending(true)
    try {
      await handleSave('sent')
      window.location.href = `mailto:${co.clientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
      setSent(true); setShowEmailModal(false)
      setTimeout(() => setSent(false), 3000)
    } catch (err) { console.error('Send failed:', err) }
    setSending(false)
  }

  const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
  const ic = "w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
  const dic = ic + " [color-scheme:dark]"
  const lc = "text-sm font-medium text-slate-300 mb-1.5 block"

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ClipboardList className="w-6 h-6 text-blue-400" />
            {co.isCorrection ? 'Corrected Change Order' : 'Create Change Order'}
          </h1>
          <p className="text-slate-300 text-sm mt-1">Document additional work for existing contracts</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/admin/change-orders/sent" className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 flex items-center gap-2"><FileText className="w-4 h-4" /> Sent</Link>
          <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-600/20 text-amber-400 text-sm cursor-pointer">
            <input type="checkbox" checked={co.isCorrection} onChange={e => updateField('isCorrection', e.target.checked)} className="rounded" />
            <AlertTriangle className="w-3.5 h-3.5" /> Correction
          </label>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl mb-6 w-fit">
        <button onClick={() => setTab('edit')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'edit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}><Pencil className="w-3.5 h-3.5 inline mr-1.5" />Edit</button>
        <button onClick={() => setTab('preview')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}><Eye className="w-3.5 h-3.5 inline mr-1.5" />Preview</button>
      </div>

      {tab === 'edit' ? (
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-400" /> Change Order Details</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className={lc}>CO #</label><input value={co.number} onChange={e => updateField('number', e.target.value)} className={ic} /></div>
              <div><label className={lc}>Date</label><input type="date" value={co.date} onChange={e => updateField('date', e.target.value)} className={dic} /></div>
              <div><label className={lc}>Existing Contract Date</label><input type="date" value={co.existingContractDate} onChange={e => updateField('existingContractDate', e.target.value)} className={dic} /></div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><User className="w-4 h-4 text-blue-400" /> Client & Property</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={lc}>Client Name</label><input value={co.clientName} onChange={e => updateField('clientName', e.target.value)} placeholder="Monica McNutt" className={ic} /></div>
              <div><label className={lc}>Email</label><input type="email" value={co.clientEmail} onChange={e => updateField('clientEmail', e.target.value)} className={ic} /></div>
              <div><label className={lc}>Phone</label><input value={co.clientPhone} onChange={e => updateField('clientPhone', e.target.value)} className={ic} /></div>
              <div><label className={lc}>Project Name</label><input value={co.projectName} onChange={e => updateField('projectName', e.target.value)} className={ic} /></div>
              <div><label className={lc}>Client Address</label><textarea value={co.clientAddress} onChange={e => updateField('clientAddress', e.target.value)} rows={2} className={ic} /></div>
              <div><label className={lc}>Property Address</label><textarea value={co.propertyAddress} onChange={e => updateField('propertyAddress', e.target.value)} placeholder={"3441 Massachusetts Avenue\nSouth East Washington DC"} rows={2} className={ic} /></div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4">Original Contract</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className={lc}>Previous Contract Amount</label><input type="number" value={co.previousContractAmount || ''} onChange={e => updateField('previousContractAmount', Number(e.target.value))} className={ic} step="0.01" /></div>
              <div><label className={lc}>Deposit Amount</label><input type="number" value={co.depositAmount || ''} onChange={e => updateField('depositAmount', Number(e.target.value))} className={ic} step="0.01" /></div>
              <div><label className={lc}>Deposit Note</label><input value={co.depositNote} onChange={e => updateField('depositNote', e.target.value)} placeholder="Check 5848 Bank of America" className={ic} /></div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-400" /> Change Items</h2>
            <div className="space-y-3">
              {co.items.map((item, idx) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <span className="text-slate-300 text-sm mt-3 w-6 text-right flex-shrink-0">{idx + 1}.</span>
                  <div className="flex-1 grid sm:grid-cols-[1fr_120px] gap-3">
                    <input value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="Power wash garage brick walls and columns" className={ic} />
                    <input type="number" value={item.unitPrice || ''} onChange={e => updateItem(item.id, 'unitPrice', Number(e.target.value))} className={ic + ' text-right'} placeholder="$ 0.00" step="0.01" />
                  </div>
                  <button onClick={() => removeItem(item.id)} className="mt-3 text-red-400 hover:text-red-300 p-1" disabled={co.items.length === 1}><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <button onClick={addItem} className="mt-4 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-600/10"><Plus className="w-4 h-4" /> Add Change Item</button>

            <div className="mt-6 pt-4 border-t border-white/5 space-y-2 text-right text-sm">
              <div className="text-slate-300">Change Order Total: <span className="text-white font-medium ml-2">{fmt(changeTotal)}</span></div>
              <div className="text-slate-300">Previous Contract: <span className="text-white font-medium ml-2">{fmt(co.previousContractAmount)}</span></div>
              {co.depositAmount > 0 && <div className="text-slate-300">Deposit: <span className="text-green-400 font-medium ml-2">-{fmt(co.depositAmount)}</span></div>}
              <div className="text-lg font-bold text-white pt-2 border-t border-white/10">Total After Change Order: {fmt(totalAfterChange)}</div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6"><label className={lc}>Notes</label><textarea value={co.notes} onChange={e => updateField('notes', e.target.value)} rows={3} className={ic} /></div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <SignaturePad onSignatureChange={sig => updateField('signatureData', sig)} savedSignatureUrl={savedSigUrl} label="Carlos Hernandez — President, CRGS Inc." />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button onClick={() => handleSave('draft')} disabled={saving} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 text-sm">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />} Save Draft</button>
            <button onClick={() => setTab('preview')} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600/20 text-blue-400 font-medium hover:bg-blue-600/30 text-sm"><Eye className="w-4 h-4" /> Preview</button>
            <button onClick={handleGeneratePdf} disabled={generating} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 text-sm">{generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Generate PDF</button>
            <button onClick={prepareEmail} disabled={!co.clientEmail} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 text-sm disabled:opacity-40">{sent ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />} {sent ? 'Sent!' : 'Send to Client'}</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 max-w-[800px] mx-auto text-slate-900">
            <div className="flex items-start justify-between border-b-4 border-blue-900 pb-6 mb-8">
              <div><h2 className="text-3xl font-bold text-blue-900">C&R</h2><p className="text-sm text-slate-600">General Services Inc.</p><p className="text-xs text-amber-600 mt-1">Licensed | Insured | Bonded</p></div>
              <div className="text-right"><h1 className="text-2xl font-bold text-amber-600">{co.isCorrection ? 'CORRECTED CHANGE ORDER' : 'CHANGE ORDER'}</h1><p className="text-sm text-slate-500 mt-1">#{co.number}</p><p className="text-sm text-slate-500">{co.date}</p></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-8 mb-6">
              <div><p className="text-xs font-bold text-blue-900 uppercase mb-2">Client</p><p className="font-semibold">{co.clientName || '—'}</p></div>
              <div><p className="text-xs font-bold text-blue-900 uppercase mb-2">Property</p><p className="text-sm whitespace-pre-line">{co.propertyAddress || '—'}</p></div>
            </div>
            {co.existingContractDate && <p className="text-sm text-slate-600 mb-6">Date of Existing Contract: <strong>{co.existingContractDate}</strong></p>}
            <h3 className="font-bold text-blue-900 mb-4">We hereby agree to make the change(s) specified below:</h3>
            <div className="space-y-2 mb-6">
              {co.items.map((item, idx) => (
                <div key={item.id} className="flex justify-between items-start text-sm">
                  <span>{idx + 1}. {item.description || '—'}</span>
                  <span className="font-medium whitespace-nowrap ml-4">{fmt(item.unitPrice)}</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 rounded-xl p-5 space-y-2 text-sm mb-8">
              <div className="flex justify-between"><span>Change Order Total</span><span className="font-bold">{fmt(changeTotal)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Previous Contract Amount</span><span>{fmt(co.previousContractAmount)}</span></div>
              {co.depositAmount > 0 && <div className="flex justify-between text-slate-600"><span>Deposit {co.depositNote}</span><span>-{fmt(co.depositAmount)}</span></div>}
              <div className="flex justify-between text-lg font-bold text-blue-900 pt-2 border-t-2 border-blue-900"><span>TOTAL AFTER CHANGE ORDER</span><span>{fmt(totalAfterChange)}</span></div>
            </div>
            {co.notes && <p className="text-sm text-slate-600 mb-8 italic">{co.notes}</p>}
            <div className="grid sm:grid-cols-2 gap-8 border-t pt-8">
              <div><p className="text-sm font-semibold mb-4">Provided and Guaranteed by:</p><div className="h-16 border-b border-slate-300 mb-1">{co.signatureData && <img src={co.signatureData} alt="Sig" className="h-full object-contain" />}</div><p className="text-sm font-semibold">Carlos Hernandez</p><p className="text-xs text-slate-500">President, CRGS, Inc.</p></div>
              <div><p className="text-sm font-semibold mb-4">Accepted and Agreed:</p><div className="h-16 border-b border-slate-300 mb-1" /><p className="text-sm font-semibold">{co.clientName || '________________'}</p><p className="text-xs text-slate-500">Owner of the house • Date: ________</p></div>
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
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Mail className="w-5 h-5 text-blue-400" /> Send Change Order</h3>
            <div className="space-y-4">
              <div><label className={lc}>To</label><input value={co.clientEmail} readOnly className={ic + ' opacity-60'} /></div>
              <div><label className={lc}>Subject</label><input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className={ic} /></div>
              <div><label className={lc}>Message</label><textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={8} className={ic} /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEmailModal(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm">Cancel</button>
              <button onClick={handleSend} disabled={sending} className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 text-sm flex items-center justify-center gap-2">{sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Open Email</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
