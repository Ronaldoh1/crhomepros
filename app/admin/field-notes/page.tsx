'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Camera, MapPin, Clock, Save, ArrowLeft, Plus, X, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SERVICES } from '@/lib/constants'

export default function FieldNotesPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    projectName: '', clientName: '', address: '', serviceType: '',
    notes: '', measurements: '', materialsNeeded: '', estimatedCost: '', nextSteps: '',
  })

  const existingNotes = [
    {
      id: '1', projectName: 'Johnson Kitchen Remodel', clientName: 'Sarah Johnson',
      address: '456 Oak St, Bethesda, MD', date: '2024-01-25', serviceType: 'kitchen',
      notes: 'Measured existing cabinets. Client wants white shaker style with quartz countertops.',
      estimatedCost: '$35,000 - $42,000', status: 'complete',
    },
    {
      id: '2', projectName: 'Martinez Deck Repair', clientName: 'Roberto Martinez',
      address: '789 Pine Ave, Silver Spring, MD', date: '2024-01-24', serviceType: 'deck',
      notes: 'Deck has significant rot on north side. Recommend full replacement.',
      estimatedCost: '$12,000 - $15,000', status: 'draft',
    },
  ]

  const handlePhotoUpload = () => {
    setPhotos([...photos, `https://images.unsplash.com/photo-${Date.now()}?w=400`])
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => { setSaveSuccess(false); setIsCreating(false) }, 2000)
  }

  if (saveSuccess) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-dark-900 mb-2">Note Saved!</h2>
          <p className="text-dark-500">Your field note has been saved.</p>
        </div>
      </div>
    )
  }

  if (isCreating) {
    return (
      <div className="min-h-screen bg-dark-50">
        <header className="bg-white border-b border-dark-100 sticky top-0 z-40">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <button onClick={() => setIsCreating(false)} className="p-2"><ArrowLeft className="w-6 h-6" /></button>
            <h1 className="font-display font-bold">New Field Note</h1>
            <button onClick={handleSave} disabled={isSaving} className="text-primary-600 font-medium">
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save'}
            </button>
          </div>
        </header>

        <div className="max-w-2xl mx-auto p-4 space-y-6">
          <div className="bg-white rounded-xl p-4 space-y-4">
            <h2 className="font-semibold text-dark-900">Project Info</h2>
            <input type="text" value={formData.projectName} onChange={(e) => setFormData({...formData, projectName: e.target.value})} placeholder="Project Name *" className="input" />
            <input type="text" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} placeholder="Client Name *" className="input" />
            <div className="relative">
              <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
              <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Address *" className="input pl-10" />
            </div>
            <select value={formData.serviceType} onChange={(e) => setFormData({...formData, serviceType: e.target.value})} className="input">
              <option value="">Select Service Type</option>
              {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-xl p-4">
            <h2 className="font-semibold text-dark-900 mb-4">Photos</h2>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((_, i) => (
                <div key={i} className="relative aspect-square bg-dark-200 rounded-lg">
                  <button onClick={() => setPhotos(photos.filter((_,idx)=>idx!==i))} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"><X className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={handlePhotoUpload} className="aspect-square border-2 border-dashed border-dark-200 rounded-lg flex flex-col items-center justify-center text-dark-400 hover:border-primary-500 hover:text-primary-500">
                <Camera className="w-8 h-8 mb-1" /><span className="text-xs">Add Photo</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 space-y-4">
            <h2 className="font-semibold text-dark-900">Notes & Details</h2>
            <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={4} placeholder="Site Notes *" className="textarea" />
            <textarea value={formData.measurements} onChange={(e) => setFormData({...formData, measurements: e.target.value})} rows={2} placeholder="Measurements" className="textarea" />
            <textarea value={formData.materialsNeeded} onChange={(e) => setFormData({...formData, materialsNeeded: e.target.value})} rows={2} placeholder="Materials Needed" className="textarea" />
          </div>

          <div className="bg-white rounded-xl p-4 space-y-4">
            <h2 className="font-semibold text-dark-900">Estimate</h2>
            <input type="text" value={formData.estimatedCost} onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})} placeholder="Estimated Cost (e.g., $15,000 - $20,000)" className="input" />
            <textarea value={formData.nextSteps} onChange={(e) => setFormData({...formData, nextSteps: e.target.value})} rows={2} placeholder="Next Steps" className="textarea" />
          </div>

          <button onClick={handleSave} disabled={isSaving} className="btn-gold w-full btn-lg">
            {isSaving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Save Field Note</>}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-50">
      <header className="bg-white border-b border-dark-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2"><ArrowLeft className="w-6 h-6" /></Link>
            <div>
              <h1 className="text-xl font-display font-bold">Field Notes</h1>
              <p className="text-sm text-dark-500">Job site documentation</p>
            </div>
          </div>
          <button onClick={() => setIsCreating(true)} className="btn-gold"><Plus className="w-5 h-5" /> New</button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {existingNotes.map((note) => (
          <div key={note.id} className="bg-white rounded-xl border border-dark-100 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-dark-900">{note.projectName}</h3>
                <p className="text-sm text-dark-500">{note.clientName}</p>
              </div>
              <span className={cn('px-2 py-1 text-xs font-medium rounded-full', note.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>
                {note.status === 'complete' ? 'Complete' : 'Draft'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-dark-500 mb-3">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{note.address}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{note.date}</span>
            </div>
            <p className="text-dark-600 text-sm mb-3">{note.notes}</p>
            {note.estimatedCost && (
              <div className="bg-green-50 rounded-lg px-3 py-2 text-sm">
                <span className="text-green-600">Estimate:</span> <span className="font-medium text-green-700">{note.estimatedCost}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
