'use client'

import { useEffect, useState } from 'react'
import { FileText, Download, ExternalLink, Share2, X } from 'lucide-react'

export interface ReadyPdf { blob: Blob; filename: string }

/**
 * Shown when a PDF is ready. The PDF is opened by a real tap on a real link,
 * which every browser allows. (Opening a new tab from code after the PDF was
 * built is blocked by Safari and by pop-up blockers, which looked like
 * "Generate PDF does nothing".)
 */
export function PdfDialog({ pdf, onClose }: { pdf: ReadyPdf | null; onClose: () => void }) {
  const [url, setUrl] = useState('')
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    if (!pdf) { setUrl(''); return }
    const u = URL.createObjectURL(pdf.blob)
    setUrl(u)
    try {
      const file = new File([pdf.blob], pdf.filename, { type: 'application/pdf' })
      setCanShare(!!navigator.canShare?.({ files: [file] }))
    } catch { setCanShare(false) }
    return () => URL.revokeObjectURL(u)
  }, [pdf])

  if (!pdf || !url) return null
  const share = async () => {
    try { await navigator.share({ files: [new File([pdf.blob], pdf.filename, { type: 'application/pdf' })], title: pdf.filename }) } catch { /* closed the share sheet */ }
  }
  const btn = 'flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-base'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="PDF ready">
      <div className="bg-slate-900 border border-white/30 rounded-2xl p-5 sm:p-6 w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-green-800 flex items-center justify-center flex-shrink-0"><FileText className="w-5 h-5 text-white" /></div>
            <div className="min-w-0"><h3 className="text-lg font-bold text-white">Your PDF is ready</h3><p className="text-sm text-white truncate">{pdf.filename}</p></div>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-white p-1"><X className="w-6 h-6" /></button>
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          <a href={url} target="_blank" rel="noopener noreferrer" className={btn + ' bg-blue-600 text-white hover:bg-blue-700'}><ExternalLink className="w-5 h-5" /> Open PDF</a>
          <a href={url} download={pdf.filename} className={btn + ' bg-slate-700 text-white hover:bg-slate-600'}><Download className="w-5 h-5" /> Download</a>
          {canShare
            ? <button onClick={share} className={btn + ' bg-slate-700 text-white hover:bg-slate-600'}><Share2 className="w-5 h-5" /> Share or save</button>
            : <button onClick={onClose} className={btn + ' bg-slate-700 text-white hover:bg-slate-600'}>Close</button>}
        </div>
        {/* Preview on larger screens; phones show only the first page inside a frame, so they use the buttons */}
        <iframe src={url} title="PDF preview" className="hidden sm:block mt-4 w-full flex-1 min-h-[50vh] rounded-xl bg-white" />
      </div>
    </div>
  )
}
