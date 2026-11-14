'use client'

import { useState, useEffect, useRef } from 'react'
import { getAllDocuments, uploadSignedDocument, type DocumentRecord } from '@/lib/firebase-auth'
import { FileText, Upload, Download, CheckCircle, Loader2, Filter, FileSignature } from 'lucide-react'

export default function SignedDocumentsPage() {
  const [docs, setDocs] = useState<DocumentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'invoice' | 'change-order' | 'contract'>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null)
  const [uploadTargetType, setUploadTargetType] = useState<string>('')

  useEffect(() => { loadDocs() }, [])

  const loadDocs = async () => {
    try {
      const data = await getAllDocuments()
      setDocs(data)
    } catch (err) { console.error('Load failed:', err) }
    setLoading(false)
  }

  const triggerUpload = (id: string, type: string) => {
    setUploadTargetId(id)
    setUploadTargetType(type)
    fileInputRef.current?.click()
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !uploadTargetId) return
    setUploading(uploadTargetId)
    try {
      await uploadSignedDocument(file, uploadTargetId, uploadTargetType)
      await loadDocs()
    } catch (err) { console.error('Upload failed:', err) }
    setUploading(null)
    setUploadTargetId(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const filtered = filter === 'all' ? docs : docs.filter(d => d.type === filter)
  const signed = filtered.filter(d => d.signedFileUrl)
  const unsigned = filtered.filter(d => !d.signedFileUrl)

  const typeLabel = (t: string) => t === 'change-order' ? 'Change Order' : t.charAt(0).toUpperCase() + t.slice(1)
  const typeBadge = (t: string) => {
    const colors: Record<string, string> = { invoice: 'bg-blue-800 text-white', 'change-order': 'bg-purple-800 text-white', contract: 'bg-green-800 text-white' }
    return colors[t] || 'bg-slate-700 text-white'
  }

  const formatDate = (ts: any) => {
    if (!ts) return '—'
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-blue-300 animate-spin" /></div>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.png" className="hidden" onChange={handleUpload} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3"><FileSignature className="w-6 h-6 text-green-300" /> Signed Documents</h1>
          <p className="text-white text-sm mt-1">Upload and manage signed documents</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'invoice', 'change-order', 'contract'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white hover:text-white'}`}>
            {f === 'all' ? 'All' : typeLabel(f)}s
          </button>
        ))}
      </div>

      {/* Signed */}
      {signed.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-300" /> Signed ({signed.length})</h2>
          <div className="space-y-3">
            {signed.map(doc => (
              <div key={doc.id} className="bg-slate-800/50 border border-green-300 rounded-xl p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-white">{doc.number}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadge(doc.type)}`}>{typeLabel(doc.type)}</span>
                  </div>
                  <p className="text-white text-sm">{doc.clientName} • {fmt(doc.total)} • {formatDate(doc.createdAt)}</p>
                </div>
                <a href={doc.signedFileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-800 text-white hover:bg-green-700 text-sm font-medium">
                  <Download className="w-4 h-4" /> View Signed
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awaiting Signature */}
      {unsigned.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-amber-300" /> Awaiting Signature ({unsigned.length})</h2>
          <div className="space-y-3">
            {unsigned.map(doc => (
              <div key={doc.id} className="bg-slate-800/50 border border-white/25 rounded-xl p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-white">{doc.number}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadge(doc.type)}`}>{typeLabel(doc.type)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${doc.status === 'sent' ? 'bg-blue-800 text-white' : 'bg-slate-700 text-white'}`}>{doc.status}</span>
                  </div>
                  <p className="text-white text-sm">{doc.clientName} • {fmt(doc.total)} • {formatDate(doc.createdAt)}</p>
                </div>
                <button
                  onClick={() => doc.id && triggerUpload(doc.id, doc.type)}
                  disabled={uploading === doc.id}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-800 text-white hover:bg-amber-700 text-sm font-medium"
                >
                  {uploading === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Upload Signed
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="bg-slate-800/50 border border-white/25 rounded-2xl p-12 text-center">
          <FileSignature className="w-12 h-12 text-white mx-auto mb-4" />
          <p className="text-white text-lg">No documents yet</p>
          <p className="text-white text-sm mt-1">Create invoices, change orders, or contracts to get started.</p>
        </div>
      )}
    </div>
  )
}
