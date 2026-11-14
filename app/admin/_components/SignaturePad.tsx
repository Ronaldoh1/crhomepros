'use client'

import { useRef, useState, useEffect } from 'react'
import { Pencil, RotateCcw, CheckCircle, Loader2, Type, PenLine } from 'lucide-react'

const SCRIPT_FONT = 'Dancing Script'
// Served from this site (public/fonts), so it works without any outside service. SIL Open Font License.
const FONT_FILES = ['/fonts/dancing-script-latin-600-normal.woff2']

interface SignaturePadProps {
  onSignatureChange: (dataUrl: string | null) => void
  /** Carlos's saved default signature (admin only) */
  savedSignatureUrl?: string | null
  label?: string
  compact?: boolean
  /** 'admin' can keep a default signature; 'client' is the public signing page */
  mode?: 'admin' | 'client'
  /** Words shown in the pad (the client page passes Spanish) */
  text?: Partial<typeof TEXT>
  /** Called after a new default signature is stored (admin) */
  onDefaultSaved?: (url: string) => void
}

const TEXT = {
  draw: 'Draw', type: 'Type', begin: 'Click and begin to sign', clear: 'Clear', change: 'Change signature',
  typePlaceholder: 'Type your full name', hintDraw: 'Sign with your finger or mouse.', hintType: 'Your name is turned into a signature.',
}

/**
 * Signature box. Two ways to sign:
 *  - Draw: click "Click and begin to sign", then draw.
 *  - Type: type a name, shown in a handwriting font.
 * The first time the admin signs, it asks whether to keep it as the default.
 */
export function SignaturePad({ onSignatureChange, savedSignatureUrl, label = 'Signature', compact = false, mode = 'admin', text, onDefaultSaved }: SignaturePadProps) {
  const T = { ...TEXT, ...text }
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [tab, setTab] = useState<'draw' | 'type'>('draw')
  const [active, setActive] = useState(false) // drawing area was clicked
  const [hasInk, setHasInk] = useState(false)
  const [typed, setTyped] = useState('')
  const [useSaved, setUseSaved] = useState(!!savedSignatureUrl)
  const [askDefault, setAskDefault] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedNote, setSavedNote] = useState('')
  const answered = useRef(false) // asked once per visit
  const admin = mode === 'admin'
  const W = 600
  const h = compact ? 100 : 150

  useEffect(() => { if (savedSignatureUrl) { setUseSaved(true); onSignatureChange(savedSignatureUrl) } }, [savedSignatureUrl]) // eslint-disable-line react-hooks/exhaustive-deps

  // handwriting font for typed signatures
  useEffect(() => {
    if (Array.from(document.fonts).some(f => f.family.replace(/"/g, '') === SCRIPT_FONT)) return
    FONT_FILES.forEach(url => {
      const face = new FontFace(SCRIPT_FONT, `url(${url}) format('woff2')`, { weight: '600' })
      face.load().then(f => document.fonts.add(f)).catch(() => { /* falls back to the system cursive font */ })
    })
  }, [])

  const ctx = () => {
    const c = canvasRef.current?.getContext('2d')
    if (c) { c.strokeStyle = '#111827'; c.fillStyle = '#111827'; c.lineWidth = 3; c.lineCap = 'round'; c.lineJoin = 'round' }
    return c || null
  }
  const wipe = () => { const c = canvasRef.current; c?.getContext('2d')?.clearRect(0, 0, c.width, c.height) }

  const pos = (e: React.PointerEvent) => {
    const c = canvasRef.current!
    const r = c.getBoundingClientRect()
    return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) }
  }
  const down = (e: React.PointerEvent) => {
    if (!active) return
    e.preventDefault()
    canvasRef.current?.setPointerCapture(e.pointerId)
    drawing.current = true
    const { x, y } = pos(e); const c = ctx(); if (!c) return
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + 0.1, y + 0.1); c.stroke()
    setHasInk(true)
  }
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return
    e.preventDefault()
    const { x, y } = pos(e); const c = ctx(); if (!c) return
    c.lineTo(x, y); c.stroke()
  }
  const up = () => {
    if (!drawing.current) return
    drawing.current = false
    finish()
  }

  /** Report the signature and, the first time, offer to keep it as the default */
  const finish = () => {
    const c = canvasRef.current
    if (!c) return
    onSignatureChange(c.toDataURL('image/png'))
    if (admin && !answered.current) setAskDefault(true)
  }

  const clear = () => {
    wipe(); setHasInk(false); setActive(false); setTyped(''); setAskDefault(false); setSavedNote('')
    onSignatureChange(null)
  }

  // typed name → handwriting on the canvas
  useEffect(() => {
    if (tab !== 'type' || useSaved) return
    let cancelled = false
    const name = typed.trim()
    const render = async () => {
      try { await document.fonts.load(`600 72px "${SCRIPT_FONT}"`) } catch { /* falls back to the system cursive font */ }
      if (cancelled) return
      const c = ctx(); const canvas = canvasRef.current
      if (!c || !canvas) return
      wipe()
      if (!name) { setHasInk(false); onSignatureChange(null); return }
      let size = 96
      do { c.font = `600 ${size}px "${SCRIPT_FONT}", "Brush Script MT", cursive`; size -= 4 } while (c.measureText(name).width > canvas.width - 40 && size > 24)
      c.textBaseline = 'middle'
      c.fillText(name, 20, canvas.height / 2)
      setHasInk(true)
      onSignatureChange(canvas.toDataURL('image/png'))
    }
    const t = setTimeout(render, 150)
    return () => { cancelled = true; clearTimeout(t) }
  }, [typed, tab, useSaved]) // eslint-disable-line react-hooks/exhaustive-deps

  const saveDefault = async () => {
    answered.current = true
    const canvas = canvasRef.current
    if (!canvas) return
    setSaving(true)
    try {
      const { ref, uploadString, getDownloadURL } = await import('firebase/storage')
      const { ensureStorage } = await import('@/lib/firebase-auth')
      const s = ensureStorage()
      if (!s) throw new Error('Storage is not set up.')
      const storageRef = ref(s, 'admin/signature/carlos-default.png')
      await uploadString(storageRef, canvas.toDataURL('image/png'), 'data_url')
      const url = await getDownloadURL(storageRef)
      onSignatureChange(url)
      onDefaultSaved?.(url)
      setSavedNote('Saved as your default signature.')
    } catch (err) {
      setSavedNote(`Could not save the default signature. ${err instanceof Error ? err.message : ''}`)
    }
    setSaving(false); setAskDefault(false)
  }

  const tabBtn = (id: 'draw' | 'type', icon: React.ReactNode, name: string) => (
    <button type="button" onClick={() => { if (tab !== id) { clear(); setTab(id) } }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${tab === id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-900 hover:bg-slate-300'}`}>
      {icon} {name}
    </button>
  )

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className={`text-sm font-medium flex items-center gap-2 ${admin ? 'text-white' : 'text-slate-900'}`}><Pencil className="w-3.5 h-3.5" />{label}</label>
        {!useSaved && (
          <div className="flex items-center gap-2">
            {tabBtn('draw', <PenLine className="w-4 h-4" />, T.draw)}
            {tabBtn('type', <Type className="w-4 h-4" />, T.type)}
            {(hasInk || active) && <button type="button" onClick={clear} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200"><RotateCcw className="w-3.5 h-3.5" /> {T.clear}</button>}
          </div>
        )}
      </div>

      {useSaved && savedSignatureUrl ? (
        <div className="relative border border-slate-300 rounded-xl bg-white p-4 flex items-center justify-center" style={{ height: h }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={savedSignatureUrl} alt="Saved signature" className="max-h-full max-w-full object-contain" />
          <button type="button" onClick={() => { setUseSaved(false); answered.current = false; clear() }} className="absolute top-2 right-2 text-xs px-2.5 py-1.5 rounded-lg bg-slate-200 text-slate-900 hover:bg-slate-300">{T.change}</button>
        </div>
      ) : (
        <>
          {tab === 'type' && (
            <input value={typed} onChange={e => setTyped(e.target.value)} placeholder={T.typePlaceholder} autoComplete="name"
              onBlur={() => { if (typed.trim() && admin && !answered.current) setAskDefault(true) }}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          )}
          <div className="relative">
            <canvas ref={canvasRef} width={W} height={h * 2}
              className={`w-full border-2 rounded-xl bg-white touch-none ${active && tab === 'draw' ? 'border-blue-500 cursor-crosshair' : 'border-dashed border-slate-400'}`}
              style={{ height: h }}
              onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
            {tab === 'draw' && !active && (
              <button type="button" onClick={() => setActive(true)}
                className="absolute inset-0 w-full rounded-xl flex flex-col items-center justify-center gap-1.5 bg-white/95 text-slate-900 hover:bg-blue-50 border-2 border-dashed border-slate-400">
                <PenLine className="w-6 h-6 text-blue-700" />
                <span className="text-base font-semibold">{T.begin}</span>
              </button>
            )}
          </div>
          <p className={`text-xs text-center ${admin ? 'text-white' : 'text-slate-700'}`}>{tab === 'draw' ? T.hintDraw : T.hintType}</p>
        </>
      )}

      {admin && askDefault && hasInk && (
        <div className="rounded-xl border border-blue-300 bg-blue-800 p-3">
          <p className="text-sm font-semibold text-white">Use this as your default signature?</p>
          <p className="text-sm text-white mt-0.5">It will be added automatically to your next documents. You can change it any time.</p>
          <div className="flex gap-2 mt-2.5">
            <button type="button" onClick={saveDefault} disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center gap-1.5">{saving && <Loader2 className="w-4 h-4 animate-spin" />} Yes, save as default</button>
            <button type="button" onClick={() => { answered.current = true; setAskDefault(false) }} className="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm font-medium hover:bg-slate-600">No, just this document</button>
          </div>
        </div>
      )}
      {savedNote && <p className="text-sm text-white flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> {savedNote}</p>}
    </div>
  )
}
