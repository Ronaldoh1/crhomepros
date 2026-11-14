'use client'

import { useState, useEffect } from 'react'
import { getDocumentsByType, deleteDocument, updateFieldNote, type DocumentRecord } from '@/lib/firebase-auth'
import { FileText, Trash2, Download, Eye, Send, Loader2, CheckCircle, Clock, DollarSign, Upload } from 'lucide-react'
import Link from 'next/link'
import { ConfirmDialog } from './DocumentGuards'
import { useToast } from './Toast'

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-amber-500/20 text-amber-300',
  sent: 'bg-blue-500/20 text-blue-400',
  signed: 'bg-green-500/20 text-green-400',
  paid: 'bg-emerald-500/20 text-emerald-400',
}

const STATUS_ICONS: Record<string, typeof Clock> = {
  draft: Clock,
  sent: Send,
  signed: CheckCircle,
  paid: DollarSign,
}

interface DocumentListProps {
  type: DocumentRecord['type']
  title: string
  createHref: string
  createLabel: string
  /** 'drafts' = saved but not sent; 'sent' = sent, signed or paid */
  view?: 'drafts' | 'sent'
  /** Link to the other list (shown as a tab) */
  otherHref?: string
}

export function DocumentList({ type, title, createHref, createLabel, view = 'sent', otherHref }: DocumentListProps) {
  const [allDocs, setDocs] = useState<DocumentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toDelete, setToDelete] = useState<DocumentRecord | null>(null)
  const toast = useToast()
  const isDraft = (d: DocumentRecord) => (d.status || 'draft') === 'draft'
  const docs = allDocs.filter(d => (view === 'drafts' ? isDraft(d) : !isDraft(d)))
  const draftCount = allDocs.filter(isDraft).length
  const sentCount = allDocs.length - draftCount

  useEffect(() => {
    loadDocs()
  }, [])

  const loadDocs = async () => {
    try {
      const data = await getDocumentsByType(type)
      setDocs(data)
    } catch (err) {
      console.error('Failed to load documents:', err)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    setToDelete(null)
    setDeleting(id)
    try {
      const linked = allDocs.find(d => d.id === id)?.estimateId
      await deleteDocument(id)
      // free the field estimate so a new invoice can be made from it
      if (linked) await updateFieldNote(linked, { invoiceId: null, invoiceNumber: null, status: 'accepted', statusChangedAt: new Date().toISOString().split('T')[0] }).catch(() => {})
      setDocs(prev => prev.filter(d => d.id !== id))
      toast('Deleted')
    } catch (err) {
      console.error('Failed to delete:', err)
      alert(`This could not be deleted. Please tell Ron.\n\n${err instanceof Error ? err.message : String(err)}`)
    }
    setDeleting(null)
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '—'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-slate-300 text-sm mt-1">{docs.length} document{docs.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href={createHref}
          className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all flex items-center gap-2 text-sm"
        >
          <FileText className="w-4 h-4" />
          {createLabel}
        </Link>
      </div>

      {otherHref && (
        <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl mb-6 w-fit">
          {([['drafts', `Drafts (${draftCount})`], ['sent', `Sent (${sentCount})`]] as const).map(([v, label]) =>
            v === view ? (
              <span key={v} className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white">{label}</span>
            ) : (
              <Link key={v} href={otherHref} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white">{label}</Link>
            )
          )}
        </div>
      )}

      {docs.length === 0 ? (
        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-12 text-center">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 text-lg mb-2">{view === 'drafts' ? `No draft ${type.replace('-', ' ')}s` : `No sent ${type.replace('-', ' ')}s yet`}</p>
          <p className="text-slate-300 text-sm mb-6">{view === 'drafts' ? 'Drafts you save appear here until you send them.' : `A ${type.replace('-', ' ')} moves here once you send it.`}</p>
          <Link
            href={createHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            {createLabel}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => {
            const StatusIcon = STATUS_ICONS[doc.status] || Clock
            return (
              <div
                key={doc.id}
                className="bg-slate-800/50 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="font-semibold text-white truncate">{doc.number}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[doc.status] || STATUS_STYLES.draft}`}>
                        <StatusIcon className="w-3 h-3" />
                        {doc.type === 'contract' && doc.status === 'signed' ? 'In contract' : doc.type === 'contract' && doc.status === 'sent' ? 'Waiting for signature' : doc.status}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">{doc.clientName}</p>
                    <p className="text-slate-400 text-xs mt-1">
                      {doc.projectName} • {formatDate(doc.createdAt)}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-white">{formatCurrency(doc.total)}</p>
                    {doc.signedFileUrl && (
                      <a
                        href={doc.signedFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-400 flex items-center gap-1 mt-1 justify-end"
                      >
                        <CheckCircle className="w-3 h-3" /> Signed
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                  {doc.signedFileUrl && (
                    <a
                      href={doc.signedFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 flex items-center gap-1.5"
                    >
                      <Download className="w-3 h-3" /> Download Signed
                    </a>
                  )}
                  {doc.id && (
                    <Link
                      href={`${createHref}?id=${doc.id}`}
                      className="text-xs px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 flex items-center gap-1.5"
                    >
                      <Eye className="w-3 h-3" /> {view === 'drafts' ? 'Continue editing' : 'Open / correct'}
                    </Link>
                  )}
                  <button
                    onClick={() => doc.id && setToDelete(doc)}
                    disabled={deleting === doc.id}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 flex items-center gap-1.5 ml-auto"
                  >
                    {deleting === doc.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <ConfirmDialog
        open={!!toDelete}
        danger
        title={`Delete ${toDelete?.number || 'this document'}?`}
        confirmLabel="Yes, delete it"
        cancelLabel="Keep it"
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete?.id && handleDelete(toDelete.id)}
      >
        {toDelete && (toDelete.status || 'draft') === 'draft' ? (
          <p>This draft for {toDelete.clientName || 'this client'} will be gone for good. It was never sent.</p>
        ) : (
          <>
            <p>This was already sent to {toDelete?.clientName || 'the client'}. Deleting it removes <strong>your record</strong> of it from the portal. The client still has their copy.</p>
            <p>This cannot be undone.</p>
            {toDelete?.estimateId && <p>The field estimate it came from goes back to "Accepted", so you can make a new invoice from it.</p>}
          </>
        )}
      </ConfirmDialog>
    </div>
  )
}
