'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Plus, Trash2, Send, Download, FileText,
  DollarSign, User, Calendar, Loader2, CheckCircle, Pencil
} from 'lucide-react'

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientAddress: string
  projectName: string
  items: LineItem[]
  notes: string
  taxRate: number
  signatureData: string | null
}

const INITIAL_INVOICE: InvoiceData = {
  invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  clientAddress: '',
  projectName: '',
  items: [{ id: '1', description: '', quantity: 1, unitPrice: 0 }],
  notes: 'Payment due within 30 days of invoice date.\nThank you for choosing CR Home Pros!',
  taxRate: 6,
  signatureData: null,
}

export default function InvoicesPage() {
  const [invoice, setInvoice] = useState<InvoiceData>(INITIAL_INVOICE)
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const tax = subtotal * (invoice.taxRate / 100)
  const total = subtotal + tax

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: String(Date.now()), description: '', quantity: 1, unitPrice: 0 }]
    }))
  }

  const removeItem = (id: string) => {
    if (invoice.items.length === 1) return
    setInvoice(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }))
  }

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === id ? { ...i, [field]: value } : i)
    }))
  }

  // Signature pad handlers
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#1e3a5f'
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const endDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      setInvoice(prev => ({ ...prev, signatureData: canvas.toDataURL() }))
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setInvoice(prev => ({ ...prev, signatureData: null }))
  }

  const handleDownload = () => {
    // Use browser print-to-PDF on the preview
    setShowPreview(true)
    setTimeout(() => {
      const style = document.createElement('style')
      style.id = 'print-invoice'
      style.textContent = `
        @media print {
          body > *:not(.invoice-preview-container) { display: none !important; }
          header, nav, footer { display: none !important; }
          .invoice-preview-container { margin: 0; padding: 0; box-shadow: none; }
        }
      `
      document.head.appendChild(style)
      window.print()
      setTimeout(() => style.remove(), 1000)
    }, 300)
  }

  const handleSend = async () => {
    if (!invoice.clientEmail || !invoice.clientName) {
      alert('Client name and email are required.')
      return
    }
    setIsSending(true)
    try {
      const response = await fetch('/api/invoice/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...invoice,
          subtotal,
          tax,
          total,
        }),
      })
      if (!response.ok) throw new Error('Send failed')
      setIsSending(false)
      setSent(true)
    } catch (err) {
      console.error('Invoice send error:', err)
      setIsSending(false)
      // Fallback: open mailto with basic info
      const subject = encodeURIComponent(`Invoice ${invoice.invoiceNumber} from CR Home Pros`)
      const body = encodeURIComponent(
        `Invoice: ${invoice.invoiceNumber}\nTotal: $${total.toFixed(2)}\nProject: ${invoice.projectName}\n\nPlease see attached invoice or contact us at (301) 602-2553.`
      )
      window.open(`mailto:${invoice.clientEmail}?subject=${subject}&body=${body}`)
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-dark-900 mb-2">Invoice Sent!</h2>
          <p className="text-dark-500 mb-6">
            Invoice {invoice.invoiceNumber} sent to {invoice.clientEmail}
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setSent(false); setInvoice(INITIAL_INVOICE) }} className="px-4 py-2 bg-primary-800 text-white rounded-lg font-medium">
              Create Another
            </button>
            <Link href="/admin" className="px-4 py-2 bg-dark-100 text-dark-700 rounded-lg font-medium">
              Back to Admin
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Header */}
      <header className="bg-white border-b border-dark-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 hover:bg-dark-50 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-dark-500" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-dark-900">Create Invoice</h1>
              <p className="text-sm text-dark-500">{invoice.invoiceNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 border border-dark-200 rounded-lg text-sm font-medium hover:bg-dark-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 border border-dark-200 rounded-lg text-sm font-medium hover:bg-dark-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="flex items-center gap-2 px-4 py-2 bg-primary-800 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isSending ? 'Sending...' : 'Send Invoice'}
            </button>
          </div>
        </div>
      </header>

      {showPreview ? (
        /* Invoice Preview - Print-Ready */
        <div className="invoice-preview-container max-w-3xl mx-auto my-8 bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-900 to-primary-800 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold">INVOICE</h2>
                <p className="text-white/70 mt-1">{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">CR Home Pros</p>
                <p className="text-white/70 text-sm">Licensed & Insured • MHIC #05-132359</p>
                <p className="text-white/70 text-sm">crhomepros@gmail.com</p>
                <p className="text-white/70 text-sm">(301) 602-2553</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Bill To</p>
                <p className="font-bold text-dark-900 mt-1">{invoice.clientName || '—'}</p>
                <p className="text-dark-500 text-sm">{invoice.clientAddress || ''}</p>
                <p className="text-dark-500 text-sm">{invoice.clientEmail}</p>
                <p className="text-dark-500 text-sm">{invoice.clientPhone}</p>
              </div>
              <div className="text-right">
                <div className="space-y-1">
                  <p className="text-sm"><span className="text-dark-400">Date:</span> <span className="font-medium">{invoice.date}</span></p>
                  <p className="text-sm"><span className="text-dark-400">Due:</span> <span className="font-medium">{invoice.dueDate}</span></p>
                  <p className="text-sm"><span className="text-dark-400">Project:</span> <span className="font-medium">{invoice.projectName || '—'}</span></p>
                </div>
              </div>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="border-b-2 border-dark-200">
                  <th className="text-left py-3 text-xs font-semibold text-dark-400 uppercase">Description</th>
                  <th className="text-center py-3 text-xs font-semibold text-dark-400 uppercase w-20">Qty</th>
                  <th className="text-right py-3 text-xs font-semibold text-dark-400 uppercase w-28">Rate</th>
                  <th className="text-right py-3 text-xs font-semibold text-dark-400 uppercase w-28">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map(item => (
                  <tr key={item.id} className="border-b border-dark-100">
                    <td className="py-3 text-sm">{item.description || '—'}</td>
                    <td className="py-3 text-sm text-center">{item.quantity}</td>
                    <td className="py-3 text-sm text-right">${item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 text-sm text-right font-medium">${(item.quantity * item.unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-500">Subtotal</span>
                  <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-500">Tax ({invoice.taxRate}%)</span>
                  <span>${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-dark-200">
                  <span>Total</span>
                  <span className="text-primary-800">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-8 p-4 bg-dark-50 rounded-lg">
                <p className="text-xs font-semibold text-dark-400 uppercase mb-1">Notes</p>
                <p className="text-sm text-dark-600 whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}

            {invoice.signatureData && (
              <div className="mt-8 border-t border-dark-200 pt-4">
                <p className="text-xs text-dark-400 mb-2">Authorized Signature</p>
                <img src={invoice.signatureData} alt="Signature" className="h-16" />
                <p className="text-sm font-medium mt-1">Carlos Hernandez — CR Home Pros</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Invoice Editor */
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6">
          {/* Client Info */}
          <div className="bg-white rounded-xl border border-dark-100 p-6">
            <h3 className="font-bold text-dark-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              Client Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-1">Client Name *</label>
                <input
                  type="text"
                  value={invoice.clientName}
                  onChange={e => setInvoice(prev => ({ ...prev, clientName: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-1">Email *</label>
                <input
                  type="email"
                  value={invoice.clientEmail}
                  onChange={e => setInvoice(prev => ({ ...prev, clientEmail: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="client@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-1">Phone</label>
                <input
                  type="tel"
                  value={invoice.clientPhone}
                  onChange={e => setInvoice(prev => ({ ...prev, clientPhone: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="(301) 555-1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-1">Address</label>
                <input
                  type="text"
                  value={invoice.clientAddress}
                  onChange={e => setInvoice(prev => ({ ...prev, clientAddress: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="123 Main St, Bethesda, MD"
                />
              </div>
            </div>
          </div>

          {/* Project & Dates */}
          <div className="bg-white rounded-xl border border-dark-100 p-6">
            <h3 className="font-bold text-dark-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              Invoice Details
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-1">Invoice #</label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={e => setInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-1">Invoice Date</label>
                <input
                  type="date"
                  value={invoice.date}
                  onChange={e => setInvoice(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-1">Due Date</label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={e => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-dark-600 mb-1">Project Name</label>
              <input
                type="text"
                value={invoice.projectName}
                onChange={e => setInvoice(prev => ({ ...prev, projectName: e.target.value }))}
                className="w-full px-3 py-2.5 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Kitchen Remodel — Silver Spring"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-xl border border-dark-100 p-6">
            <h3 className="font-bold text-dark-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary-600" />
              Line Items
            </h3>
            <div className="space-y-3">
              {invoice.items.map((item, idx) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.description}
                      onChange={e => updateItem(item.id, 'description', e.target.value)}
                      className="w-full px-3 py-2.5 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="Service description..."
                    />
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm text-center"
                      placeholder="Qty"
                    />
                  </div>
                  <div className="w-28">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice || ''}
                      onChange={e => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm text-right"
                      placeholder="$0.00"
                    />
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2.5 text-dark-400 hover:text-red-500 transition-colors"
                    disabled={invoice.items.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addItem} className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700">
              <Plus className="w-4 h-4" /> Add Line Item
            </button>

            <div className="mt-6 pt-4 border-t border-dark-100 space-y-2 text-right">
              <div className="flex justify-end gap-8 text-sm">
                <span className="text-dark-500">Subtotal:</span>
                <span className="font-medium w-28">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-end items-center gap-4 text-sm">
                <span className="text-dark-500">Tax:</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={invoice.taxRate}
                  onChange={e => setInvoice(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
                  className="w-16 px-2 py-1 border border-dark-200 rounded text-center text-sm"
                />
                <span className="text-dark-500">%</span>
                <span className="font-medium w-28">${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-end gap-8 text-lg font-bold pt-2 border-t border-dark-200">
                <span>Total:</span>
                <span className="text-primary-800 w-28">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="bg-white rounded-xl border border-dark-100 p-6">
            <h3 className="font-bold text-dark-900 mb-4 flex items-center gap-2">
              <Pencil className="w-5 h-5 text-primary-600" />
              Electronic Signature
            </h3>
            <div className="border-2 border-dashed border-dark-200 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                width={600}
                height={150}
                className="w-full h-[100px] sm:h-[150px] cursor-crosshair touch-none bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={endDrawing}
              />
            </div>
            <button onClick={clearSignature} className="mt-2 text-sm text-red-500 hover:text-red-600 font-medium">
              Clear Signature
            </button>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-dark-100 p-6">
            <label className="block text-sm font-medium text-dark-600 mb-1">Notes / Payment Terms</label>
            <textarea
              value={invoice.notes}
              onChange={e => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2.5 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  )
}
