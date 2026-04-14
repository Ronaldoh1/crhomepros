'use client'

import { useState, useEffect } from 'react'
import {
  Plus, Trash2, Send, Download, Eye, Loader2,
  CheckCircle, DollarSign, User, Calendar, FileText, Pencil,
  AlertTriangle, Mail
} from 'lucide-react'
import { SignaturePad } from '../_components/SignaturePad'
import { saveDocument, type DocumentRecord, getSavedSignatureUrl } from '@/lib/firebase-auth'

import Link from 'next/link'

interface LineItem { id: string; description: string; quantity: number; unitPrice: number }

interface InvoiceData {
  number: string; date: string; dueDate: string; clientName: string; clientEmail: string
  clientPhone: string; clientAddress: string; projectName: string; items: LineItem[]
  notes: string; taxRate: number; signatureData: string | null; isCorrection: boolean
}

const INITIAL: InvoiceData = {
  number: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  clientName: '', clientEmail: '', clientPhone: '', clientAddress: '', projectName: '',
  items: [{ id: '1', description: '', quantity: 1, unitPrice: 0 }],
  notes: 'Payment due within 30 days of invoice date.\nAll dumping fees, materials and labor are included.\nThank you for choosing CR Home Pros!',
  taxRate: 0, signatureData: null, isCorrection: false,
}

export default function InvoicesPage() {
  const [inv, setInv] = useState<InvoiceData>(INITIAL)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [savedSigUrl, setSavedSigUrl] = useState<string | null>(null)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')

  const subtotal = inv.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
  const tax = subtotal * (inv.taxRate / 100)
  const total = subtotal + tax

  useEffect(() => {
    getSavedSignatureUrl().then(url => { if (url) setSavedSigUrl(url) })
  }, [])

  const updateField = (field: keyof InvoiceData, value: any) => setInv(prev => ({ ...prev, [field]: value }))
  const addItem = () => setInv(prev => ({ ...prev, items: [...prev.items, { id: String(Date.now()), description: '', quantity: 1, unitPrice: 0 }] }))
  const removeItem = (id: string) => { if (inv.items.length > 1) setInv(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) })) }
  const updateItem = (id: string, field: keyof LineItem, value: any) => setInv(prev => ({ ...prev, items: prev.items.map(i => i.id === id ? { ...i, [field]: value } : i) }))

  const handleSave = async (status: DocumentRecord['status'] = 'draft') => {
    setSaving(true)
    try {
      const docData: DocumentRecord = {
        ...(savedId ? { id: savedId } : {}), type: 'invoice',
        number: inv.isCorrection ? `${inv.number}-CORRECTED` : inv.number,
        clientName: inv.clientName, clientEmail: inv.clientEmail, clientPhone: inv.clientPhone,
        clientAddress: inv.clientAddress, projectName: inv.projectName, date: inv.date, dueDate: inv.dueDate,
        items: inv.items, notes: inv.notes, subtotal, tax, taxRate: inv.taxRate, total,
        signatureData: inv.signatureData, status,
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
        body: JSON.stringify({ type: 'invoice', data: {
          number: inv.isCorrection ? `${inv.number}-CORRECTED` : inv.number,
          date: inv.date, dueDate: inv.dueDate, clientName: inv.clientName,
          clientEmail: inv.clientEmail, clientPhone: inv.clientPhone,
          clientAddress: inv.clientAddress, projectName: inv.projectName,
          items: inv.items, notes: inv.notes, taxRate: inv.taxRate,
        }})
      })
      const blob = await res.blob()
      window.open(URL.createObjectURL(blob), '_blank')
    } catch (err) { console.error('PDF failed:', err) }
    setGenerating(false)
  }

  const prepareEmail = () => {
    setEmailSubject(`Invoice ${inv.number} — ${inv.projectName || 'CR Home Pros'}`)
    setEmailBody(`Hi ${inv.clientName.split(' ')[0] || 'there'},\n\nPlease find attached Invoice ${inv.number} for ${inv.projectName || 'your project'} in the amount of $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}.\n\nPayment is due by ${new Date(inv.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.\n\nIf you have any questions, please don't hesitate to reach out.\n\nBest regards,\nCarlos Hernandez\nCR Home Pros\n(571) 237-7164`)
    setShowEmailModal(true)
  }

  const handleSend = async () => {
    setSending(true)
    try {
      await handleSave('sent')
      window.location.href = `mailto:${inv.clientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
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
            <DollarSign className="w-6 h-6 text-blue-400" />
            {inv.isCorrection ? 'Correction Invoice' : 'Create Invoice'}
          </h1>
          <p className="text-slate-300 text-sm mt-1">Generate professional invoices for your clients</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/admin/invoices/sent" className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Sent
          </Link>
          <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-600/20 text-amber-400 text-sm cursor-pointer">
            <input type="checkbox" checked={inv.isCorrection} onChange={e => updateField('isCorrection', e.target.checked)} className="rounded" />
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
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-400" /> Invoice Details</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className={lc}>Invoice #</label><input value={inv.number} onChange={e => updateField('number', e.target.value)} className={ic} /></div>
              <div><label className={lc}>Date</label><input type="date" value={inv.date} onChange={e => updateField('date', e.target.value)} className={dic} /></div>
              <div><label className={lc}>Due Date</label><input type="date" value={inv.dueDate} onChange={e => updateField('dueDate', e.target.value)} className={dic} /></div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><User className="w-4 h-4 text-blue-400" /> Client Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={lc}>Full Name</label><input value={inv.clientName} onChange={e => updateField('clientName', e.target.value)} placeholder="Monica McNutt" className={ic} /></div>
              <div><label className={lc}>Email</label><input type="email" value={inv.clientEmail} onChange={e => updateField('clientEmail', e.target.value)} placeholder="client@email.com" className={ic} /></div>
              <div><label className={lc}>Phone</label><input value={inv.clientPhone} onChange={e => updateField('clientPhone', e.target.value)} placeholder="(202) 555-0123" className={ic} /></div>
              <div><label className={lc}>Project Name</label><input value={inv.projectName} onChange={e => updateField('projectName', e.target.value)} placeholder="Kitchen Remodel" className={ic} /></div>
              <div className="sm:col-span-2"><label className={lc}>Address</label><textarea value={inv.clientAddress} onChange={e => updateField('clientAddress', e.target.value)} placeholder={"3441 Massachusetts Avenue\nSouth East Washington DC"} rows={2} className={ic} /></div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-400" /> Line Items</h2>
            <div className="space-y-3">
              {inv.items.map((item, idx) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <span className="text-slate-400 text-sm mt-3 w-6 text-right flex-shrink-0">{idx + 1}.</span>
                  <div className="flex-1 grid sm:grid-cols-[1fr_80px_120px] gap-3">
                    <input value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="Power wash garage..." className={ic} />
                    <input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))} min={1} className={ic + ' text-center'} placeholder="Qty" />
                    <input type="number" value={item.unitPrice || ''} onChange={e => updateItem(item.id, 'unitPrice', Number(e.target.value))} className={ic + ' text-right'} placeholder="$ 0.00" step="0.01" />
                  </div>
                  <button onClick={() => removeItem(item.id)} className="mt-3 text-red-400 hover:text-red-300 p-1" disabled={inv.items.length === 1}><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <button onClick={addItem} className="mt-4 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-600/10"><Plus className="w-4 h-4" /> Add Line Item</button>
            <div className="mt-6 pt-4 border-t border-white/5 space-y-2 text-right">
              <div className="text-slate-300 text-sm">Subtotal: <span className="text-white font-medium ml-2">{fmt(subtotal)}</span></div>
              <div className="flex items-center justify-end gap-2">
                <span className="text-slate-300 text-sm">Tax</span>
                <input type="number" value={inv.taxRate} onChange={e => updateField('taxRate', Number(e.target.value))} className="w-16 bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-white text-sm text-center" />
                <span className="text-slate-300 text-sm">%: <span className="text-white font-medium ml-1">{fmt(tax)}</span></span>
              </div>
              <div className="text-lg font-bold text-white pt-2 border-t border-white/10">Total: {fmt(total)}</div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6"><label className={lc}>Notes</label><textarea value={inv.notes} onChange={e => updateField('notes', e.target.value)} rows={3} className={ic} /></div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <SignaturePad onSignatureChange={sig => updateField('signatureData', sig)} savedSignatureUrl={savedSigUrl} label="Carlos Hernandez — President, CRGS Inc." />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button onClick={() => handleSave('draft')} disabled={saving} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 text-sm">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />} Save Draft</button>
            <button onClick={() => setTab('preview')} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600/20 text-blue-400 font-medium hover:bg-blue-600/30 text-sm"><Eye className="w-4 h-4" /> Preview</button>
            <button onClick={handleGeneratePdf} disabled={generating} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 text-sm">{generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Generate PDF</button>
            <button onClick={prepareEmail} disabled={!inv.clientEmail} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 text-sm disabled:opacity-40">{sent ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />} {sent ? 'Sent!' : 'Send to Client'}</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 max-w-[800px] mx-auto text-slate-900">
            <div className="flex items-start justify-between border-b-4 border-blue-900 pb-6 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-blue-900">C&R</h2>
                <p className="text-sm text-slate-600">General Services Inc.</p>
                <p className="text-xs text-amber-600 mt-1">Licensed | Insured | Bonded</p>
                <p className="text-xs text-slate-400 mt-0.5">(571) 237-7164 | crhomepros@gmail.com</p>
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-bold text-amber-600">{inv.isCorrection ? 'CORRECTED INVOICE' : 'INVOICE'}</h1>
                <p className="text-sm text-slate-500 mt-1">#{inv.number}</p>
                <p className="text-sm text-slate-500">Date: {inv.date}</p>
                <p className="text-sm text-slate-500">Due: {inv.dueDate}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-8 mb-8">
              <div><p className="text-xs font-bold text-blue-900 uppercase mb-2">Bill To</p><p className="font-semibold text-lg">{inv.clientName || '—'}</p><p className="text-sm text-slate-600 whitespace-pre-line">{inv.clientAddress}</p>{inv.clientPhone && <p className="text-sm text-slate-600 mt-1">{inv.clientPhone}</p>}</div>
              {inv.projectName && <div><p className="text-xs font-bold text-blue-900 uppercase mb-2">Project</p><p className="font-medium">{inv.projectName}</p></div>}
            </div>
            <table className="w-full mb-6"><thead><tr className="bg-blue-900 text-white text-sm"><th className="px-3 py-2.5 text-left rounded-tl-lg">#</th><th className="px-3 py-2.5 text-left">Description</th><th className="px-3 py-2.5 text-right">Qty</th><th className="px-3 py-2.5 text-right">Price</th><th className="px-3 py-2.5 text-right rounded-tr-lg">Amount</th></tr></thead>
              <tbody>{inv.items.map((item, idx) => (<tr key={item.id} className={idx % 2 === 0 ? 'bg-slate-50' : ''}><td className="px-3 py-2.5 text-sm text-slate-500">{idx + 1}</td><td className="px-3 py-2.5 text-sm">{item.description || '—'}</td><td className="px-3 py-2.5 text-sm text-right">{item.quantity}</td><td className="px-3 py-2.5 text-sm text-right">{fmt(item.unitPrice)}</td><td className="px-3 py-2.5 text-sm text-right font-medium">{fmt(item.quantity * item.unitPrice)}</td></tr>))}</tbody>
            </table>
            <div className="flex justify-end mb-8"><div className="w-64 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              {inv.taxRate > 0 && <div className="flex justify-between text-slate-600"><span>Tax ({inv.taxRate}%)</span><span>{fmt(tax)}</span></div>}
              <div className="flex justify-between text-lg font-bold text-blue-900 pt-2 border-t-2 border-blue-900"><span>TOTAL</span><span>{fmt(total)}</span></div>
            </div></div>
            {inv.notes && <div className="bg-slate-50 rounded-xl p-4 mb-8"><p className="text-xs font-bold text-blue-900 uppercase mb-2">Notes</p><p className="text-sm text-slate-600 whitespace-pre-line">{inv.notes}</p></div>}
            <div className="grid sm:grid-cols-2 gap-8 border-t pt-8">
              <div><p className="text-sm font-semibold mb-4">Provided and Guaranteed by:</p><div className="h-16 border-b border-slate-300 mb-1">{inv.signatureData && <img src={inv.signatureData} alt="Sig" className="h-full object-contain" />}</div><p className="text-sm font-semibold">Carlos Hernandez</p><p className="text-xs text-slate-500">President, CRGS, Inc.</p></div>
              <div><p className="text-sm font-semibold mb-4">Accepted and Agreed:</p><div className="h-16 border-b border-slate-300 mb-1" /><p className="text-sm font-semibold">{inv.clientName || '________________'}</p><p className="text-xs text-slate-500">Date: ________________</p></div>
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
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Mail className="w-5 h-5 text-blue-400" /> Send Invoice</h3>
            <div className="space-y-4">
              <div><label className={lc}>To</label><input value={inv.clientEmail} readOnly className={ic + ' opacity-60'} /></div>
              <div><label className={lc}>Subject</label><input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className={ic} /></div>
              <div><label className={lc}>Message</label><textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={8} className={ic} /></div>
              <p className="text-xs text-slate-500">Opens your email client. Attach the PDF after generating it.</p>
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
