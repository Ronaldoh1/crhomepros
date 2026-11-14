'use client'

import { useEffect, useRef, useState } from 'react'
import { Images, Loader2, Camera, ImagePlus, Plus, X, CheckCircle, Trash2, Lock, Eye, Save } from 'lucide-react'
import {
  getPastProjects, updatePastProject, createPastProject, deletePastProject, uploadProjectPhoto, deleteFieldPhoto,
  type PastProject,
} from '@/lib/firebase-auth'
import { shrinkPhoto } from '@/lib/shrink-photo'
import { useToast } from '../_components/Toast'
import { ConfirmDialog } from '../_components/DocumentGuards'

/**
 * Past projects. One is started automatically when a client signs a contract:
 * the "before" photos come from the field estimate. Carlos adds the "after"
 * photos. Everything here is private; "ready for the website" is only a mark
 * for the public gallery that comes later, and that gallery will never show
 * the client's name, address, email or price.
 */
export default function PastProjectsPage() {
  const toast = useToast()
  const [projects, setProjects] = useState<PastProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')
  const [toDelete, setToDelete] = useState<PastProject | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const camRef = useRef<HTMLInputElement>(null)
  const target = useRef<{ id: string; phase: 'before' | 'after' } | null>(null)

  const load = async () => {
    try { setProjects(await getPastProjects()) } catch (e) { setError(e instanceof Error ? e.message : String(e)) }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const patch = async (p: PastProject, change: Partial<PastProject>, message?: string) => {
    setProjects(prev => prev.map(x => (x.id === p.id ? { ...x, ...change } : x)))
    try { await updatePastProject(p.id!, change); if (message) toast(message) } catch (e) { toast(e instanceof Error ? e.message : 'Not saved', 'error'); load() }
  }

  const pick = (id: string, phase: 'before' | 'after', camera: boolean) => { target.current = { id, phase }; (camera ? camRef : fileRef).current?.click() }
  const addFiles = async (files: FileList | null) => {
    const tgt = target.current
    if (!files?.length || !tgt) return
    const p = projects.find(x => x.id === tgt.id)
    if (!p) return
    setBusy(`${tgt.id}-${tgt.phase}`)
    try {
      const urls: string[] = []; const paths: string[] = []
      for (const f of Array.from(files)) { const up = await uploadProjectPhoto(tgt.id, await shrinkPhoto(f)); urls.push(up.url); paths.push(up.path) }
      const change = tgt.phase === 'after'
        ? { afterPhotos: [...(p.afterPhotos || []), ...urls], afterPaths: [...(p.afterPaths || []), ...paths] }
        : { beforePhotos: [...(p.beforePhotos || []), ...urls], beforePaths: [...(p.beforePaths || []), ...paths] }
      await patch(p, change, `${urls.length} ${tgt.phase} photo${urls.length === 1 ? '' : 's'} added to ${p.title}`)
    } catch (e) { toast(e instanceof Error ? e.message : 'The photos were not added.', 'error') }
    setBusy('')
  }
  const removePhoto = async (p: PastProject, phase: 'before' | 'after', i: number) => {
    const photos = [...((phase === 'after' ? p.afterPhotos : p.beforePhotos) || [])]
    const paths = [...((phase === 'after' ? p.afterPaths : p.beforePaths) || [])]
    const path = paths[i]
    photos.splice(i, 1); paths.splice(i, 1)
    await patch(p, phase === 'after' ? { afterPhotos: photos, afterPaths: paths } : { beforePhotos: photos, beforePaths: paths }, 'Photo removed')
    // "before" photos that came from the estimate still belong to the estimate: only delete our own uploads
    if (path && path.startsWith('admin/past-projects/')) deleteFieldPhoto(path)
  }

  const addManual = async () => {
    try {
      const id = await createPastProject({ clientName: '', title: 'New project', workDone: '', beforePhotos: [], afterPhotos: [], status: 'in-progress', published: false, startedAt: new Date().toISOString().slice(0, 10) })
      toast('Project added'); await load()
      setTimeout(() => document.getElementById(`p-${id}`)?.scrollIntoView({ behavior: 'smooth' }), 200)
    } catch (e) { toast(e instanceof Error ? e.message : 'Not added', 'error') }
  }

  const ic = 'w-full bg-slate-800 border border-white/15 rounded-xl px-4 py-3 text-white text-base placeholder-slate-400 outline-none focus:border-blue-500'
  const lc = 'text-sm font-medium text-slate-100 mb-1.5 block'

  const grid = (p: PastProject, phase: 'before' | 'after') => {
    const photos = (phase === 'after' ? p.afterPhotos : p.beforePhotos) || []
    const working = busy === `${p.id}-${phase}`
    return (
      <div>
        <p className="font-semibold text-white mb-2">{phase === 'before' ? 'Before' : 'After'} <span className="text-slate-100 font-normal">({photos.length})</span>{phase === 'before' && p.estimateId && <span className="text-sm text-slate-100 font-normal"> · from the field estimate</span>}</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {photos.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
              <button onClick={() => removePhoto(p, phase, i)} aria-label="Remove photo" className="absolute top-1 right-1 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
          ))}
          <button onClick={() => pick(p.id!, phase, true)} disabled={working} className="aspect-square rounded-lg border-2 border-dashed border-white/30 text-white flex flex-col items-center justify-center gap-1 text-xs hover:bg-white/5">{working ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />} Take</button>
          <button onClick={() => pick(p.id!, phase, false)} disabled={working} className="aspect-square rounded-lg border-2 border-dashed border-white/30 text-white flex flex-col items-center justify-center gap-1 text-xs hover:bg-white/5"><ImagePlus className="w-5 h-5" /> Choose</button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => { addFiles(e.target.files); e.target.value = '' }} />
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { addFiles(e.target.files); e.target.value = '' }} />

      <div className="flex items-center justify-between gap-4 mb-2">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3"><Images className="w-6 h-6 text-amber-300" /> Past Projects</h1>
        <button onClick={addManual} className="flex-shrink-0 px-4 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 flex items-center gap-2"><Plus className="w-5 h-5" /> Add</button>
      </div>
      <p className="text-slate-100 text-sm mb-4">A project starts by itself when a client signs a contract. The photos from your field estimate become the "before" photos. Add the "after" photos when the job is done.</p>
      <div className="rounded-xl border border-blue-400/40 bg-blue-500/10 p-4 mb-6 text-sm text-blue-50 flex gap-3"><Lock className="w-5 h-5 text-blue-200 flex-shrink-0" /><p><strong className="text-white">Everything here is private.</strong> Marking a project "ready for the website" does not publish anything yet. When the public gallery is turned on, it will show only the title, the city, what was done and the photos. Never the client's name, address, email or price.</p></div>

      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
        : error ? <div className="rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-red-50">Projects could not be loaded. {error}</div>
        : projects.length === 0 ? <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-10 text-center text-slate-100">No projects yet. The first one appears when a client signs a contract, or press Add.</div>
        : (
          <div className="space-y-5">
            {projects.map(p => {
              const done = p.status === 'completed'
              const canPublish = done && (p.afterPhotos || []).length > 0
              return (
                <div key={p.id} id={`p-${p.id}`} className="bg-slate-800/50 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4 scroll-mt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 text-sm text-slate-100">
                      <p className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Private: {p.clientName || 'no client'}{p.contractNumber ? ` · ${p.contractNumber}` : ''}</p>
                      {p.address && <p>{p.address}</p>}
                    </div>
                    <span className={`flex-shrink-0 px-3 py-1 rounded-full border text-sm font-semibold ${done ? 'bg-green-500/25 text-green-100 border-green-400/40' : 'bg-amber-500/25 text-amber-100 border-amber-400/40'}`}>{done ? 'Completed' : 'In progress'}</span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2"><label className={lc}>Project title (public)</label><input defaultValue={p.title} onBlur={e => e.target.value !== p.title && patch(p, { title: e.target.value }, 'Title saved')} className={ic} /></div>
                    <div><label className={lc}>City (public)</label><input defaultValue={p.publicCity || ''} placeholder="Silver Spring, MD" onBlur={e => e.target.value !== (p.publicCity || '') && patch(p, { publicCity: e.target.value }, 'City saved')} className={ic} /></div>
                  </div>
                  <div><label className={lc}>What was done (public)</label><textarea defaultValue={p.workDone} rows={4} onBlur={e => e.target.value !== p.workDone && patch(p, { workDone: e.target.value }, 'Description saved')} className={ic} /><p className="text-xs text-slate-100 mt-1 flex items-center gap-1"><Save className="w-3.5 h-3.5" /> Saved when you leave the box. Do not write the client's name or address here.</p></div>
                  {grid(p, 'before')}
                  {grid(p, 'after')}
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10">
                    <button onClick={() => patch(p, done ? { status: 'in-progress', published: false } : { status: 'completed', completedAt: new Date().toISOString().slice(0, 10) }, done ? `${p.title} is back in progress` : `${p.title} marked completed`)} className={`text-sm px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 ${done ? 'bg-slate-700 text-white' : 'bg-green-600 text-white hover:bg-green-700'}`}><CheckCircle className="w-4 h-4" /> {done ? 'Completed (undo)' : 'Mark completed'}</button>
                    <label className={`text-sm px-3 py-2 rounded-lg flex items-center gap-2 ${canPublish ? 'bg-slate-700 text-white cursor-pointer' : 'bg-slate-800 text-slate-200 cursor-not-allowed'}`} title={canPublish ? '' : 'Mark it completed and add after photos first'}>
                      <input type="checkbox" disabled={!canPublish} checked={!!p.published && canPublish} onChange={e => patch(p, { published: e.target.checked }, e.target.checked ? `${p.title} is marked ready for the website` : `${p.title} is no longer marked for the website`)} className="w-4 h-4" /> Ready for the website
                    </label>
                    <button onClick={() => setPreview(preview === p.id ? null : p.id!)} className="text-sm px-3 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 flex items-center gap-1.5"><Eye className="w-4 h-4" /> {preview === p.id ? 'Hide' : 'Show'} public view</button>
                    <button onClick={() => setToDelete(p)} className="text-sm px-3 py-2 rounded-lg bg-red-600/20 text-red-200 hover:bg-red-600/30 flex items-center gap-1.5 ml-auto"><Trash2 className="w-4 h-4" /> Delete</button>
                  </div>
                  {preview === p.id && (
                    <div className="rounded-xl bg-white text-slate-900 p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-1">What visitors would see</p>
                      <h3 className="text-xl font-bold">{p.title}</h3>
                      {p.publicCity && <p className="text-slate-800">{p.publicCity}</p>}
                      <p className="mt-2 whitespace-pre-line">{p.workDone}</p>
                      <p className="mt-2 text-sm text-slate-800">{(p.beforePhotos || []).length} before · {(p.afterPhotos || []).length} after photos</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

      <ConfirmDialog open={!!toDelete} danger title={`Delete the project "${toDelete?.title || ''}"?`} confirmLabel="Yes, delete it" cancelLabel="Keep it"
        onCancel={() => setToDelete(null)}
        onConfirm={async () => { const p = toDelete!; setToDelete(null); try { await deletePastProject(p.id!); setProjects(prev => prev.filter(x => x.id !== p.id)); toast('Project deleted') } catch (e) { toast(e instanceof Error ? e.message : 'Not deleted', 'error') } }}>
        <p>The project and its "after" photos list are removed. The contract and the field estimate are not touched.</p>
      </ConfirmDialog>
    </div>
  )
}
