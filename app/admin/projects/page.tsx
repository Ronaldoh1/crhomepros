'use client'

import { useState, useRef } from 'react'
import { Briefcase, User, Phone, MapPin, FileText, Camera, Upload, DollarSign, CheckCircle, Plus, X, Download, Trash2 } from 'lucide-react'
import { SERVICE_PRICING } from '@/lib/pricing-data'

interface ProjectImage {
  file: File
  preview: string
  phase: 'before' | 'after'
}

export default function AdminProjectsPage() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    serviceType: '',
    serviceTier: '',
    description: '',
    notes: '',
    startDate: '',
    estimatedCompletion: '',
  })
  const [images, setImages] = useState<ProjectImage[]>([])
  const [phase, setPhase] = useState<'before' | 'after'>('before')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedService = SERVICE_PRICING.find((s) => s.id === formData.serviceType)
  const selectedTier = selectedService?.tiers[parseInt(formData.serviceTier)] || null

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newImages: ProjectImage[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      phase,
    }))
    setImages((prev) => [...prev, ...newImages])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (index: number) => {
    setImages((prev) => {
      const img = prev[index]
      URL.revokeObjectURL(img.preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleGenerate = async () => {
    setIsGenerating(true)

    // Upload before/after images to Firebase
    const beforeImages = images.filter((img) => img.phase === 'before')
    const afterImages = images.filter((img) => img.phase === 'after')

    const uploadedUrls: { before: string[]; after: string[] } = { before: [], after: [] }

    for (const img of [...beforeImages, ...afterImages]) {
      const fd = new FormData()
      fd.append('file', img.file)
      fd.append('category', `clients/${formData.clientName.toLowerCase().replace(/\s+/g, '-')}/${img.phase}`)

      try {
        const res = await fetch('/api/images', { method: 'POST', body: fd })
        if (res.ok) {
          const data = await res.json()
          if (data.uploaded?.[0]?.url) {
            uploadedUrls[img.phase].push(data.uploaded[0].url)
          }
        }
      } catch (err) {
        console.error('Upload error:', err)
      }
    }

    // Generate DOCX via API
    try {
      const res = await fetch('/api/projects/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimateMin: selectedTier?.min,
          estimateMax: selectedTier?.max,
          serviceName: selectedService?.name,
          tierLabel: selectedTier?.label,
          beforeImageUrls: uploadedUrls.before,
          afterImageUrls: uploadedUrls.after,
        }),
      })

      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Project-${formData.clientName.replace(/\s+/g, '-')}.docx`
        a.click()
        URL.revokeObjectURL(url)
        setGenerated(true)
      }
    } catch (err) {
      console.error('Generate error:', err)
    }

    setIsGenerating(false)
  }

  const beforeCount = images.filter((img) => img.phase === 'before').length
  const afterCount = images.filter((img) => img.phase === 'after').length

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Project</h1>
            <p className="text-gray-500 text-sm">Create a project folder with client info, estimates, and photos</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Client Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-5">
              <User className="w-5 h-5 text-primary-500" />
              Client Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => update('clientName', e.target.value)}
                  placeholder="John Smith"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => update('clientPhone', e.target.value)}
                    placeholder="(301) 555-0123"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => update('clientEmail', e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.clientAddress}
                    onChange={(e) => update('clientAddress', e.target.value)}
                    placeholder="123 Main St, Silver Spring, MD"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Service & Estimate */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-5">
              <DollarSign className="w-5 h-5 text-primary-500" />
              Service & Estimate
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => {
                    update('serviceType', e.target.value)
                    update('serviceTier', '')
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a service...</option>
                  {SERVICE_PRICING.map((svc) => (
                    <option key={svc.id} value={svc.id}>
                      {svc.icon} {svc.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scope / Tier</label>
                <select
                  value={formData.serviceTier}
                  onChange={(e) => update('serviceTier', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={!selectedService}
                >
                  <option value="">Select scope...</option>
                  {selectedService?.tiers.map((tier, i) => (
                    <option key={i} value={i}>
                      {tier.label} — ${tier.min.toLocaleString()} – ${tier.max.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Estimate Display */}
            {selectedTier && (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-primary-700">Estimated Range</div>
                  <div className="text-sm text-primary-600">{selectedService?.name} — {selectedTier.label}</div>
                </div>
                <div className="text-2xl font-bold text-primary-800">
                  ${selectedTier.min.toLocaleString()} – ${selectedTier.max.toLocaleString()}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => update('startDate', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Est. Completion</label>
                <input
                  type="date"
                  value={formData.estimatedCompletion}
                  onChange={(e) => update('estimatedCompletion', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-5">
              <FileText className="w-5 h-5 text-primary-500" />
              Project Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Describe the work to be done..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Any notes for the team..."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-5">
              <Camera className="w-5 h-5 text-primary-500" />
              Project Photos
            </h2>

            {/* Phase Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setPhase('before')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  phase === 'before'
                    ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                📷 Before ({beforeCount})
              </button>
              <button
                onClick={() => setPhase('after')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  phase === 'after'
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                ✅ After ({afterCount})
              </button>
            </div>

            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">
                Click to upload <span className={phase === 'before' ? 'text-orange-600' : 'text-green-600'}>{phase}</span> photos
              </p>
              <p className="text-gray-400 text-sm mt-1">JPG, PNG — multiple files at once</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Image Grid */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden aspect-square">
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs font-bold text-white ${
                      img.phase === 'before' ? 'bg-orange-500' : 'bg-green-500'
                    }`}>
                      {img.phase === 'before' ? 'B' : 'A'}
                    </div>
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="flex gap-4">
            <button
              onClick={handleGenerate}
              disabled={!formData.clientName || !formData.serviceType || isGenerating}
              className={`flex-1 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
                !formData.clientName || !formData.serviceType
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isGenerating
                  ? 'bg-primary-400 text-white cursor-wait'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : generated ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Generated! Click to regenerate
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Generate Project File & Upload Photos
                </>
              )}
            </button>
          </div>

          {generated && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 text-sm">
              Project file downloaded and photos uploaded to Firebase Storage.
              Photos are organized under <code className="bg-green-100 px-1.5 py-0.5 rounded text-xs">clients/{formData.clientName.toLowerCase().replace(/\s+/g, '-')}/</code>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
