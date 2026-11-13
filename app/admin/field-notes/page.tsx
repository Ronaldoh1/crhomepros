'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Camera, ImagePlus, MapPin, Save, ArrowLeft, Plus, X, CheckCircle, Loader2, Trash2,
  Pencil, FolderOpen, AlertTriangle, ClipboardList, Phone, RefreshCw, Search, Receipt, MessageSquare, Navigation, CalendarClock, Lock,
} from 'lucide-react'
import { SERVICES } from '@/lib/constants'
import {
  saveFieldNote, getFieldNotes, deleteFieldNote, newFieldNoteId, uploadFieldPhoto, deleteFieldPhoto, updateFieldNote,
  type FieldNoteRecord, type EstimateStatus,
} from '@/lib/firebase-auth'
import { adminFetch } from '@/lib/admin-api'
import { ConfirmDialog, useUnsavedWarning } from '../_components/DocumentGuards'

const emptyForm = {
  projectName: '', clientName: '', clientPhone: '', clientEmail: '', address: '', serviceType: '',
  notes: '', measurements: '', materialsNeeded: '', estimatedCost: '', nextSteps: '', followUpDate: '',
}
type Form = typeof emptyForm

// ── Status of an estimate ────────────────────
const STATUS: Record<EstimateStatus, { label: string; hint: string; chip: string }> = {
  new:       { label: 'New',       hint: 'Just created at the visit',               chip: 'bg-blue-500/25 text-blue-100 border-blue-400/40' },
  quoted:    { label: 'Price given', hint: 'You told the client the price',         chip: 'bg-indigo-500/25 text-indigo-100 border-indigo-400/40' },
  accepted:  { label: 'Accepted',  hint: 'The client said yes',                     chip: 'bg-green-500/25 text-green-100 border-green-400/40' },
  invoiced:  { label: 'Invoiced',  hint: 'An invoice was made from it',             chip: 'bg-emerald-600/40 text-white border-emerald-300/50' },
  declined:  { label: 'Declined',  hint: 'The client said no, for now',             chip: 'bg-orange-500/25 text-orange-100 border-orange-400/40' },
  reopened:  { label: 'Reopened',  hint: 'The client said no, then came back',      chip: 'bg-amber-500/25 text-amber-100 border-amber-400/40' },
  discarded: { label: 'Discarded', hint: 'Closed for good',                         chip: 'bg-slate-600/60 text-white border-slate-400/40' },
}
/** What each status can change to by hand. "Invoiced" is set by creating the invoice. */
const NEXT: Record<EstimateStatus, EstimateStatus[]> = {
  new: ['quoted', 'accepted', 'declined', 'discarded'],
  quoted: ['accepted', 'declined', 'discarded'],
  accepted: ['quoted', 'declined', 'discarded'],
  reopened: ['quoted', 'accepted', 'declined', 'discarded'],
  declined: ['reopened', 'discarded'],
  invoiced: [],
  discarded: [],
}
const OPEN: EstimateStatus[] = ['new', 'quoted', 'accepted', 'reopened']
const statusOf = (n: FieldNoteRecord): EstimateStatus => (n.status in STATUS ? (n.status as EstimateStatus) : 'new')
const today = () => new Date().toISOString().split('T')[0]
const shortDay = (d?: string) => (d ? new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '')

/** A photo in the editor: already saved (url) or new from the camera (blob) */
interface Photo { key: string; preview: string; url?: string; path?: string; blob?: Blob }

/** Shrink a phone photo so it uploads fast on a weak signal (longest side 1600px, JPEG) */
async function shrinkPhoto(file: File): Promise<Blob> {
  const MAX = 1600
  let source: ImageBitmap | HTMLImageElement
  try {
    source = await createImageBitmap(file, { imageOrientation: 'from-image' } as ImageBitmapOptions)
  } catch {
    source = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('This photo could not be read.'))
      img.src = URL.createObjectURL(file)
    })
  }
  const scale = Math.min(1, MAX / Math.max(source.width, source.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(source.width * scale)
  canvas.height = Math.round(source.height * scale)
  canvas.getContext('2d')!.drawImage(source, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve, reject) =>
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('This photo could not be prepared.'))), 'image/jpeg', 0.82))
}

const formatDate = (t: any) => {
  if (!t) return ''
  const d = t.toDate ? t.toDate() : new Date(t)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function FieldEstimatesPage() {
  const [notes, setNotes] = useState<FieldNoteRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [editing, setEditing] = useState<FieldNoteRecord | 'new' | null>(null)
  const [form, setForm] = useState<Form>(emptyForm)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [removedPaths, setRemovedPaths] = useState<string[]>([])
  const [progress, setProgress] = useState('') // non-empty while saving
  const [result, setResult] = useState<{ driveUrl?: string; driveError?: string; note: FieldNoteRecord } | null>(null)
  const [retrying, setRetrying] = useState(false)
  const [toDelete, setToDelete] = useState<FieldNoteRecord | null>(null)
  const [toDiscard, setToDiscard] = useState<FieldNoteRecord | null>(null)
  const [filter, setFilter] = useState<'open' | 'all' | EstimateStatus>('open')
  const [search, setSearch] = useState('')
  const cameraRef = useRef<HTMLInputElement>(null)
  const libraryRef = useRef<HTMLInputElement>(null)
  const markSaved = useUnsavedWarning({ ...form, photoKeys: photos.map(p => p.key).join(',') }, !!editing)

  const loadNotes = async () => {
    setLoading(true); setLoadError('')
    try { setNotes(await getFieldNotes()) } catch (err) {
      console.error(err)
      setLoadError(err instanceof Error ? err.message : String(err))
    }
    setLoading(false)
  }
  useEffect(() => { loadNotes() }, [])

  const set = (field: keyof Form, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const startNew = () => { markSaved(); setForm(emptyForm); setPhotos([]); setRemovedPaths([]); setResult(null); setEditing('new') }
  const startEdit = (n: FieldNoteRecord) => {
    markSaved()
    setForm({
      projectName: n.projectName || '', clientName: n.clientName || '', clientPhone: n.clientPhone || '',
      clientEmail: n.clientEmail || '', address: n.address || '', serviceType: n.serviceType || '',
      notes: n.notes || '', measurements: n.measurements || '', materialsNeeded: n.materialsNeeded || '',
      estimatedCost: n.estimatedCost || '', nextSteps: n.nextSteps || '', followUpDate: n.followUpDate || '',
    })
    setPhotos((n.photos || []).map((url, i) => ({ key: `saved-${i}`, preview: url, url, path: n.photoPaths?.[i] })))
    setRemovedPaths([]); setResult(null); setEditing(n)
  }

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return
    for (const file of Array.from(files)) {
      try {
        const blob = await shrinkPhoto(file)
        setPhotos(prev => [...prev, { key: `new-${Date.now()}-${Math.random()}`, preview: URL.createObjectURL(blob), blob }])
      } catch (err) {
        alert(err instanceof Error ? err.message : 'This photo could not be added.')
      }
    }
  }
  const removePhoto = (p: Photo) => {
    setPhotos(prev => prev.filter(x => x.key !== p.key))
    if (p.path) setRemovedPaths(prev => [...prev, p.path!])
  }

  const syncToDrive = async (note: FieldNoteRecord): Promise<{ driveUrl?: string; driveError?: string; note: FieldNoteRecord }> => {
    try {
      const serviceName = SERVICES.find(s => s.id === note.serviceType)?.name || note.serviceType
      const res = await adminFetch('/api/admin/field-note-drive', {
        note: { ...note, serviceType: serviceName, photos: undefined, photoPaths: undefined, date: new Date().toISOString().split('T')[0] },
        photoUrls: (note.photos || []).filter(u => u.startsWith('https://')),
        driveFolderId: note.driveFolderId,
      })
      const data = await res.json()
      const updated = { ...note, driveFolderId: data.folderId, driveFolderUrl: data.folderUrl }
      await saveFieldNote(updated, false)
      return { driveUrl: data.folderUrl, note: updated }
    } catch (err) {
      return { driveError: err instanceof Error ? err.message : String(err), note }
    }
  }

  const handleSave = async () => {
    if (!form.clientName.trim()) { alert('Add the client name first.'); return }
    const isNew = editing === 'new'
    const existing = isNew ? null : (editing as FieldNoteRecord)
    try {
      const id = existing?.id || newFieldNoteId()
      // 1. photos: upload the new ones, one at a time
      const fresh = photos.filter(p => p.blob)
      const saved: Photo[] = []
      let done = 0
      for (const p of photos) {
        if (p.blob) {
          done++
          setProgress(`Uploading photo ${done} of ${fresh.length}…`)
          const up = await uploadFieldPhoto(id, p.blob)
          saved.push({ ...p, url: up.url, path: up.path, blob: undefined })
        } else saved.push(p)
      }
      setPhotos(saved) // if a later step fails, a second try does not upload again
      // 2. the estimate itself
      setProgress('Saving the estimate…')
      const note: FieldNoteRecord = {
        ...form, id,
        projectName: form.projectName.trim() || 'Field estimate',
        photos: saved.map(p => p.url!).filter(Boolean),
        photoPaths: saved.map(p => p.path || ''),
        driveFolderId: existing?.driveFolderId, driveFolderUrl: existing?.driveFolderUrl,
        // a new estimate starts as "New"; editing never changes the status
        status: existing ? statusOf(existing) : 'new',
        ...(existing ? {} : { statusChangedAt: today() }),
      }
      // Firestore rejects "undefined": drop empty optional fields
      Object.keys(note).forEach(k => (note as any)[k] === undefined && delete (note as any)[k])
      await saveFieldNote(note, isNew)
      markSaved()
      for (const path of removedPaths) await deleteFieldPhoto(path)
      setRemovedPaths([])
      // 3. the copy in Google Drive
      setProgress('Saving a copy to Google Drive…')
      const r = await syncToDrive(note)
      setResult(r); setEditing(null)
      loadNotes()
    } catch (err) {
      console.error(err)
      alert(`The estimate was not saved. Your photos and notes are still on this screen: try again when the signal is better.\n\n${err instanceof Error ? err.message : String(err)}`)
    }
    setProgress('')
  }

  const retryDrive = async (note: FieldNoteRecord) => {
    setRetrying(true)
    const r = await syncToDrive(note)
    setResult(prev => (prev ? r : prev))
    if (!result && r.driveError) alert(r.driveError)
    await loadNotes()
    setRetrying(false)
  }

  const changeStatus = async (n: FieldNoteRecord, to: EstimateStatus) => {
    setToDiscard(null)
    const patch = { status: to, statusChangedAt: today(), ...(to === 'reopened' ? { wasReopened: true } : {}) }
    try {
      await updateFieldNote(n.id!, patch)
      setNotes(prev => prev.map(x => (x.id === n.id ? { ...x, ...patch } : x)))
    } catch (err) {
      alert(`The status was not changed.\n\n${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const handleDelete = async (n: FieldNoteRecord) => {
    setToDelete(null)
    try {
      await deleteFieldNote(n.id!)
      for (const path of n.photoPaths || []) await deleteFieldPhoto(path)
      setNotes(prev => prev.filter(x => x.id !== n.id))
    } catch (err) {
      alert(`This could not be deleted. Please tell Ron.\n\n${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const ic = 'w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3.5 text-white text-base placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none'
  const lc = 'text-sm font-medium text-slate-100 mb-1.5 block'
  const card = 'bg-slate-800/50 border border-white/10 rounded-2xl p-4 sm:p-6'

  // ── After saving ──────────────────────────
  if (result) return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto">
      <div className={card + ' text-center'}>
        <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-3" />
        <h1 className="text-xl font-bold text-white">Estimate saved</h1>
        <p className="text-slate-100 mt-1">{result.note.clientName} · {result.note.photos.length} photo{result.note.photos.length === 1 ? '' : 's'}</p>
        {result.driveUrl ? (
          <>
            <p className="text-slate-100 mt-4">A copy is in your Google Drive, in <strong className="text-white">CR Home Pros → Field Estimates</strong>.</p>
            <a href={result.driveUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"><FolderOpen className="w-5 h-5" /> Open the Drive folder</a>
          </>
        ) : (
          <div className="mt-4 text-left rounded-xl border border-amber-400/40 bg-amber-500/10 p-4">
            <p className="font-semibold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-300" /> Saved here, but not in Google Drive yet</p>
            <p className="text-sm text-amber-50 mt-1">Nothing is lost: the estimate and photos are safe in the portal. {result.driveError}</p>
            <button onClick={() => retryDrive(result.note)} disabled={retrying} className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-700 disabled:opacity-60">
              {retrying ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Try Google Drive again
            </button>
          </div>
        )}
        <div className="flex gap-3 mt-6">
          <button onClick={() => setResult(null)} className="flex-1 px-4 py-3 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600">All estimates</button>
          <button onClick={startNew} className="flex-1 px-4 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700">New estimate</button>
        </div>
      </div>
    </div>
  )

  // ── Editor ────────────────────────────────
  if (editing) return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto pb-28">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => { if (progress) return; if (!markSaved.isDirty() || window.confirm('Leave without saving? The photos and notes on this screen will be lost.')) setEditing(null) }} aria-label="Back" className="p-2 -ml-2 text-white hover:bg-white/10 rounded-lg"><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-xl font-bold text-white">{editing === 'new' ? 'New field estimate' : 'Edit field estimate'}</h1>
      </div>

      <div className="space-y-5">
        <div className={card}>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Camera className="w-5 h-5 text-blue-300" /> Photos</h2>
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => { addFiles(e.target.files); e.target.value = '' }} />
          <input ref={libraryRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { addFiles(e.target.files); e.target.value = '' }} />
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => cameraRef.current?.click()} className="flex flex-col items-center justify-center gap-1.5 py-5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"><Camera className="w-7 h-7" /> Take a photo</button>
            <button onClick={() => libraryRef.current?.click()} className="flex flex-col items-center justify-center gap-1.5 py-5 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-600"><ImagePlus className="w-7 h-7" /> Choose from phone</button>
          </div>
          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {photos.map(p => (
                <div key={p.key} className="relative aspect-square rounded-lg overflow-hidden bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.preview} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removePhoto(p)} aria-label="Remove photo" className="absolute top-1 right-1 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center shadow"><X className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          )}
          <p className="text-sm text-slate-100 mt-3">{photos.length === 0 ? 'No photos yet.' : `${photos.length} photo${photos.length === 1 ? '' : 's'}. They are made smaller automatically so they upload fast.`}</p>
        </div>

        <div className={card}>
          <h2 className="text-lg font-semibold text-white mb-4">Client and job</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={lc}>Client name *</label><input value={form.clientName} onChange={e => set('clientName', e.target.value)} className={ic} autoComplete="off" /></div>
            <div><label className={lc}>Phone</label><input type="tel" inputMode="tel" value={form.clientPhone} onChange={e => set('clientPhone', e.target.value)} className={ic} /></div>
            <div><label className={lc}>Email</label><input type="email" inputMode="email" value={form.clientEmail} onChange={e => set('clientEmail', e.target.value)} className={ic} /></div>
            <div><label className={lc}>Type of work</label>
              <select value={form.serviceType} onChange={e => set('serviceType', e.target.value)} className={ic}>
                <option value="">Choose…</option>
                {SERVICES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2"><label className={lc}>Job address</label><input value={form.address} onChange={e => set('address', e.target.value)} className={ic} /></div>
            <div className="sm:col-span-2"><label className={lc}>Short name for the job</label><input value={form.projectName} onChange={e => set('projectName', e.target.value)} placeholder="Example: Back deck replacement" className={ic} /></div>
          </div>
        </div>

        <div className={card}>
          <h2 className="text-lg font-semibold text-white mb-4">What you saw</h2>
          <div className="space-y-4">
            <div><label className={lc}>Site notes</label><textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={4} className={ic} /></div>
            <div><label className={lc}>Measurements</label><textarea value={form.measurements} onChange={e => set('measurements', e.target.value)} rows={3} className={ic} /></div>
            <div><label className={lc}>Materials needed</label><textarea value={form.materialsNeeded} onChange={e => set('materialsNeeded', e.target.value)} rows={3} className={ic} /></div>
          </div>
        </div>

        <div className={card}>
          <h2 className="text-lg font-semibold text-white mb-4">Estimate</h2>
          <div className="space-y-4">
            <div><label className={lc}>Estimated cost</label><input value={form.estimatedCost} onChange={e => set('estimatedCost', e.target.value)} placeholder="Example: $15,000 to $20,000" className={ic} /></div>
            <div><label className={lc}>Next steps</label><textarea value={form.nextSteps} onChange={e => set('nextSteps', e.target.value)} rows={2} className={ic} /></div>
            <div><label className={lc}>Follow up with the client on</label><input type="date" value={form.followUpDate} onChange={e => set('followUpDate', e.target.value)} className={ic} /><p className="text-sm text-slate-100 mt-1.5">Optional. The list reminds you when this day arrives.</p></div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 lg:left-64 z-30 bg-slate-950/95 backdrop-blur border-t border-white/10 p-3">
        <div className="max-w-2xl mx-auto">
          <button onClick={handleSave} disabled={!!progress} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-green-600 text-white text-base font-semibold hover:bg-green-700 disabled:opacity-80">
            {progress ? <><Loader2 className="w-5 h-5 animate-spin" /> {progress}</> : <><Save className="w-5 h-5" /> Save estimate and photos</>}
          </button>
        </div>
      </div>
    </div>
  )

  // ── List ──────────────────────────────────
  const count = (f: 'open' | 'all' | EstimateStatus) =>
    notes.filter(n => (f === 'all' ? true : f === 'open' ? OPEN.includes(statusOf(n)) : statusOf(n) === f)).length
  const isDue = (n: FieldNoteRecord) => !!n.followUpDate && n.followUpDate <= today() && OPEN.includes(statusOf(n))
  const dueCount = notes.filter(isDue).length
  const q = search.trim().toLowerCase()
  const shown = notes
    .filter(n => (filter === 'all' ? true : filter === 'open' ? OPEN.includes(statusOf(n)) : statusOf(n) === filter))
    .filter(n => !q || [n.clientName, n.projectName, n.address, n.clientPhone, n.invoiceNumber].some(v => (v || '').toLowerCase().includes(q)))
    .sort((a, b) => Number(isDue(b)) - Number(isDue(a)))
  const filters: Array<'open' | 'all' | EstimateStatus> = ['open', 'new', 'quoted', 'accepted', 'reopened', 'invoiced', 'declined', 'discarded', 'all']

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3"><ClipboardList className="w-6 h-6 text-blue-300" /> Field Estimates</h1>
          <p className="text-slate-100 text-sm mt-1">Photos and notes from a job visit. Each one is also saved to your Google Drive.</p>
        </div>
        <button onClick={startNew} className="flex-shrink-0 px-4 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 flex items-center gap-2"><Plus className="w-5 h-5" /> New</button>
      </div>

      {!loading && !loadError && notes.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button onClick={() => setFilter('open')} className="rounded-xl bg-slate-800/70 border border-white/10 p-3 text-left"><span className="block text-2xl font-bold text-white">{count('open')}</span><span className="text-xs text-slate-100">Open</span></button>
            <button onClick={() => setFilter('open')} className={`rounded-xl border p-3 text-left ${dueCount ? 'bg-amber-500/15 border-amber-400/50' : 'bg-slate-800/70 border-white/10'}`}><span className="block text-2xl font-bold text-white">{dueCount}</span><span className="text-xs text-slate-100">Follow-ups due</span></button>
            <button onClick={() => setFilter('invoiced')} className="rounded-xl bg-slate-800/70 border border-white/10 p-3 text-left"><span className="block text-2xl font-bold text-white">{count('invoiced')}</span><span className="text-xs text-slate-100">Invoiced</span></button>
          </div>
          <div className="relative mb-3">
            <Search className="w-5 h-5 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by client, job, address or phone" className={ic + ' pl-11'} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            {filters.filter(f => f === 'open' || f === 'all' || count(f) > 0).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`flex-shrink-0 px-3.5 py-2 rounded-full text-sm font-medium border ${filter === f ? 'bg-white text-slate-900 border-white' : 'bg-slate-800 text-white border-white/15'}`}>
                {f === 'open' ? 'Open' : f === 'all' ? 'All' : STATUS[f].label} <span className={filter === f ? 'text-slate-700' : 'text-slate-200'}>{count(f)}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
      ) : loadError ? (
        <div className="rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-red-50">The estimates could not be loaded. {loadError}</div>
      ) : notes.length === 0 ? (
        <div className={card + ' text-center py-12'}>
          <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-white text-lg">No field estimates yet</p>
          <p className="text-slate-100 text-sm mt-1 mb-5">At a job visit, press New, take your photos and write what you see.</p>
          <button onClick={startNew} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"><Plus className="w-5 h-5" /> New field estimate</button>
        </div>
      ) : shown.length === 0 ? (
        <div className={card + ' text-center py-10'}>
          <p className="text-white">Nothing here.</p>
          <button onClick={() => { setFilter('all'); setSearch('') }} className="mt-3 text-blue-200 underline">Show all estimates</button>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map(n => {
            const st = statusOf(n)
            const locked = st === 'discarded'
            const canInvoice = !n.invoiceId && OPEN.includes(st)
            return (
            <div key={n.id} className={card + (locked ? ' opacity-80' : '')}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-white text-lg truncate">{n.clientName || 'No name'}</h3>
                  <p className="text-slate-100 text-sm">{n.projectName}{n.createdAt ? ` · ${formatDate(n.createdAt)}` : ''}</p>
                </div>
                <span className={`flex-shrink-0 px-3 py-1 rounded-full border text-sm font-semibold flex items-center gap-1.5 ${STATUS[st].chip}`}>{locked && <Lock className="w-3.5 h-3.5" />}{STATUS[st].label}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                {n.estimatedCost && <span className="px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-100 font-semibold">{n.estimatedCost}</span>}
                {n.wasReopened && st !== 'reopened' && <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-100">Came back after declining</span>}
                {n.followUpDate && OPEN.includes(st) && (
                  <span className={`px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${isDue(n) ? 'bg-red-600 text-white font-semibold' : 'bg-slate-700 text-white'}`}><CalendarClock className="w-3.5 h-3.5" />{isDue(n) ? `Follow up now (${shortDay(n.followUpDate)})` : `Follow up ${shortDay(n.followUpDate)}`}</span>
                )}
                {n.statusChangedAt && st !== 'new' && <span className="text-slate-100">since {shortDay(n.statusChangedAt)}</span>}
              </div>
              {n.address && <p className="flex items-center gap-1.5 text-sm text-slate-100 mt-2"><MapPin className="w-4 h-4 text-blue-300 flex-shrink-0" />{n.address}</p>}
              {(n.clientPhone || n.address) && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {n.clientPhone && <a href={`tel:${n.clientPhone}`} className="text-sm px-3 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 flex items-center gap-1.5"><Phone className="w-4 h-4" /> Call</a>}
                  {n.clientPhone && <a href={`sms:${n.clientPhone}`} className="text-sm px-3 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> Text</a>}
                  {n.address && <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(n.address)}`} target="_blank" rel="noopener noreferrer" className="text-sm px-3 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 flex items-center gap-1.5"><Navigation className="w-4 h-4" /> Directions</a>}
                </div>
              )}
              {n.notes && <p className="text-slate-100 text-sm mt-3 whitespace-pre-line line-clamp-3">{n.notes}</p>}
              {n.photos?.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {n.photos.slice(0, 4).map((p, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p} alt="" loading="lazy" className="w-full h-full object-cover" />
                      {i === 3 && n.photos.length > 4 && <span className="absolute inset-0 bg-black/60 text-white font-semibold flex items-center justify-center">+{n.photos.length - 4}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Status and invoice */}
              <div className="mt-4 pt-3 border-t border-white/10 grid sm:grid-cols-2 gap-2">
                {locked ? (
                  <p className="sm:col-span-2 text-sm text-slate-100 flex items-center gap-2"><Lock className="w-4 h-4" /> Discarded{n.statusChangedAt ? ` on ${shortDay(n.statusChangedAt)}` : ''}. It is closed for good and cannot be changed or invoiced.</p>
                ) : st === 'invoiced' ? (
                  <p className="text-sm text-slate-100 self-center">Invoice {n.invoiceNumber || ''} was made from this estimate.</p>
                ) : (
                  <label className="text-sm text-slate-100">
                    <span className="block mb-1">Change status</span>
                    <select value="" onChange={e => { const to = e.target.value as EstimateStatus; if (!to) return; to === 'discarded' ? setToDiscard(n) : changeStatus(n, to) }} className="w-full bg-slate-800 border border-white/15 rounded-lg px-3 py-2.5 text-white text-base">
                      <option value="">{STATUS[st].label} (now)</option>
                      {NEXT[st].map(to => <option key={to} value={to}>{STATUS[to].label}: {STATUS[to].hint.toLowerCase()}</option>)}
                    </select>
                  </label>
                )}
                {n.invoiceId ? (
                  <a href={`/admin/invoices?id=${n.invoiceId}`} className="self-end px-3 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 flex items-center justify-center gap-2"><Receipt className="w-4 h-4" /> Open invoice {n.invoiceNumber || ''}</a>
                ) : canInvoice ? (
                  <a href={`/admin/invoices?fromEstimate=${n.id}`} className="self-end px-3 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 flex items-center justify-center gap-2"><Receipt className="w-4 h-4" /> Create invoice</a>
                ) : st === 'declined' ? (
                  <p className="self-end text-sm text-slate-100">To invoice it, change the status to Reopened first.</p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                {n.driveFolderUrl ? (
                  <a href={n.driveFolderUrl} target="_blank" rel="noopener noreferrer" className="text-sm px-3 py-2 rounded-lg bg-blue-600/30 text-blue-100 hover:bg-blue-600/40 flex items-center gap-1.5"><FolderOpen className="w-4 h-4" /> Open in Drive</a>
                ) : !locked ? (
                  <button onClick={() => retryDrive(n)} disabled={retrying} className="text-sm px-3 py-2 rounded-lg bg-amber-600/30 text-amber-100 hover:bg-amber-600/40 flex items-center gap-1.5">{retrying ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Save to Drive</button>
                ) : null}
                {!locked && <button onClick={() => startEdit(n)} className="text-sm px-3 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 flex items-center gap-1.5"><Pencil className="w-4 h-4" /> Open / edit</button>}
                <button onClick={() => setToDelete(n)} className="text-sm px-3 py-2 rounded-lg bg-red-600/20 text-red-200 hover:bg-red-600/30 flex items-center gap-1.5 ml-auto"><Trash2 className="w-4 h-4" /> Delete</button>
              </div>
            </div>
          )})}
        </div>
      )}

      <ConfirmDialog
        open={!!toDiscard} danger
        title={`Discard the estimate for ${toDiscard?.clientName || 'this client'}?`}
        confirmLabel="Yes, discard for good" cancelLabel="Keep it open"
        onCancel={() => setToDiscard(null)} onConfirm={() => toDiscard && changeStatus(toDiscard, 'discarded')}
      >
        <p>Discarded is final. You will not be able to change its status, edit it, or create an invoice from it.</p>
        <p>If the client only said "not now", choose <strong>Declined</strong> instead: a declined estimate can be reopened when they come back.</p>
      </ConfirmDialog>

      <ConfirmDialog
        open={!!toDelete} danger
        title={`Delete the estimate for ${toDelete?.clientName || 'this client'}?`}
        confirmLabel="Yes, delete it" cancelLabel="Keep it"
        onCancel={() => setToDelete(null)} onConfirm={() => toDelete && handleDelete(toDelete)}
      >
        <p>The notes and photos will be removed from the portal for good.</p>
        {toDelete?.invoiceId && <p>Invoice {toDelete.invoiceNumber || ''} made from it is <strong>not</strong> deleted. It stays in your invoices.</p>}
        {toDelete?.driveFolderUrl && <p>The copy in Google Drive stays there until you delete it in Drive.</p>}
      </ConfirmDialog>
    </div>
  )
}
