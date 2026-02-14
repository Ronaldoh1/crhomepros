'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, FolderOpen, Check, AlertCircle, Loader2, ImagePlus, Trash2, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadedFile {
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'done' | 'error'
  url?: string
  error?: string
}

const PROJECT_CATEGORIES = [
  'Kitchen',
  'Bathroom',
  'Roofing',
  'Deck',
  'Painting',
  'Concrete',
  'Complete Renovation',
  'Insurance Claim',
  'General',
] as const

export default function AdminImagesPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [category, setCategory] = useState<string>('General')
  const [projectName, setProjectName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState<{ success: number; errors: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  // Generate storage folder path from category + project name
  const getFolder = () => {
    const slug = projectName
      ? projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      : 'uploads'
    const catSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return `projects/${catSlug}/${slug}`
  }

  // Handle file selection
  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const imageFiles = Array.from(newFiles).filter(f =>
      f.type.startsWith('image/')
    )
    const mapped: UploadedFile[] = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
    }))
    setFiles(prev => [...prev, ...mapped])
    setResults(null)
  }, [])

  // Drag & drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropRef.current) dropRef.current.classList.add('ring-2', 'ring-gold-500', 'bg-gold-500/5')
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropRef.current) dropRef.current.classList.remove('ring-2', 'ring-gold-500', 'bg-gold-500/5')
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropRef.current) dropRef.current.classList.remove('ring-2', 'ring-gold-500', 'bg-gold-500/5')
    if (e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files)
    }
  }, [addFiles])

  // Remove a file
  const removeFile = (index: number) => {
    setFiles(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  // Clear all
  const clearAll = () => {
    files.forEach(f => URL.revokeObjectURL(f.preview))
    setFiles([])
    setResults(null)
  }

  // Upload all files
  const uploadAll = async () => {
    if (!files.length) return
    setUploading(true)
    setResults(null)

    let success = 0
    let errors = 0
    const folder = getFolder()

    // Upload in batches of 3 to avoid overwhelming the API
    const batchSize = 3
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize)
      
      const promises = batch.map(async (fileObj, batchIndex) => {
        const globalIndex = i + batchIndex
        
        // Update status to uploading
        setFiles(prev => {
          const updated = [...prev]
          updated[globalIndex] = { ...updated[globalIndex], status: 'uploading' }
          return updated
        })

        try {
          const formData = new FormData()
          formData.append('files', fileObj.file)
          formData.append('folder', folder)

          const res = await fetch('/api/images', {
            method: 'POST',
            body: formData,
          })

          if (!res.ok) {
            const data = await res.json()
            throw new Error(data.error || 'Upload failed')
          }

          const data = await res.json()
          const url = data.uploaded?.[0]?.url || ''

          setFiles(prev => {
            const updated = [...prev]
            updated[globalIndex] = { ...updated[globalIndex], status: 'done', url }
            return updated
          })
          success++
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Upload failed'
          setFiles(prev => {
            const updated = [...prev]
            updated[globalIndex] = { ...updated[globalIndex], status: 'error', error: message }
            return updated
          })
          errors++
        }
      })

      await Promise.all(promises)
    }

    setResults({ success, errors })
    setUploading(false)
  }

  const pendingCount = files.filter(f => f.status === 'pending').length
  const doneCount = files.filter(f => f.status === 'done').length
  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0)

  return (
    <div className="min-h-screen bg-dark-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-gold-500">📸</span> Image Manager
          </h1>
          <p className="text-dark-400 mt-2">
            Drag & drop project photos to upload them all to Firebase Storage at once.
          </p>
        </div>

        {/* Project Info */}
        <div className="bg-dark-800 rounded-2xl p-6 mb-6 border border-dark-700">
          <h2 className="text-lg font-semibold mb-4">Project Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                {PROJECT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-dark-400 mb-1">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Kitchen Remodel — PG County"
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder:text-dark-500 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
            </div>
          </div>
          <p className="text-xs text-dark-500 mt-3">
            <FolderOpen className="w-3 h-3 inline mr-1" />
            Storage path: <code className="text-gold-500">{getFolder()}/</code>
          </p>
        </div>

        {/* Drop Zone */}
        <div
          ref={dropRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-dark-600 rounded-2xl p-12 text-center cursor-pointer transition-all hover:border-gold-500/50 hover:bg-dark-800/50 mb-6"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
          <ImagePlus className="w-16 h-16 mx-auto text-dark-500 mb-4" />
          <p className="text-lg font-medium text-dark-300">
            Drop photos here or click to browse
          </p>
          <p className="text-sm text-dark-500 mt-2">
            Supports JPG, PNG, WebP • Select as many as you want
          </p>
        </div>

        {/* File Preview Grid */}
        {files.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">
                  {files.length} photo{files.length !== 1 ? 's' : ''} selected
                </h2>
                <span className="text-sm text-dark-400">
                  ({(totalSize / 1024 / 1024).toFixed(1)} MB)
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-sm rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" /> Clear All
                </button>
                <button
                  onClick={uploadAll}
                  disabled={uploading || pendingCount === 0}
                  className={cn(
                    'px-6 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2',
                    uploading || pendingCount === 0
                      ? 'bg-dark-700 text-dark-500 cursor-not-allowed'
                      : 'bg-gold-500 text-dark-900 hover:bg-gold-400'
                  )}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload {pendingCount} Photo{pendingCount !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results banner */}
            {results && (
              <div className={cn(
                'mb-4 p-4 rounded-xl flex items-center gap-3',
                results.errors > 0 
                  ? 'bg-red-900/20 border border-red-500/30 text-red-300'
                  : 'bg-green-900/20 border border-green-500/30 text-green-300'
              )}>
                {results.errors > 0 ? (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <Check className="w-5 h-5 flex-shrink-0" />
                )}
                <span>
                  {results.success} uploaded successfully
                  {results.errors > 0 && `, ${results.errors} failed`}
                </span>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {files.map((fileObj, i) => (
                <div
                  key={i}
                  className={cn(
                    'relative group rounded-xl overflow-hidden border-2 transition-all',
                    fileObj.status === 'done' && 'border-green-500/50',
                    fileObj.status === 'error' && 'border-red-500/50',
                    fileObj.status === 'uploading' && 'border-gold-500/50',
                    fileObj.status === 'pending' && 'border-dark-600',
                  )}
                >
                  {/* Thumbnail */}
                  <div className="aspect-square relative">
                    <Image
                      src={fileObj.preview}
                      alt={fileObj.file.name}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Status overlay */}
                    {fileObj.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                      </div>
                    )}
                    {fileObj.status === 'done' && (
                      <div className="absolute top-2 right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {fileObj.status === 'error' && (
                      <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-300" />
                      </div>
                    )}
                    
                    {/* Remove button */}
                    {fileObj.status === 'pending' && (
                      <button
                        onClick={() => removeFile(i)}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>

                  {/* File name */}
                  <div className="p-2 bg-dark-800">
                    <p className="text-xs text-dark-400 truncate">{fileObj.file.name}</p>
                    <p className="text-xs text-dark-500">{(fileObj.file.size / 1024).toFixed(0)} KB</p>
                  </div>
                </div>
              ))}
            </div>

            {/* URL list for done files */}
            {doneCount > 0 && (
              <div className="mt-6 bg-dark-800 rounded-xl p-4 border border-dark-700">
                <h3 className="text-sm font-semibold text-gold-500 mb-3">
                  ✅ Uploaded URLs — Copy these for gallery-data.ts:
                </h3>
                <div className="space-y-1 font-mono text-xs max-h-48 overflow-y-auto">
                  {files
                    .filter(f => f.status === 'done' && f.url)
                    .map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <code className="text-green-400 flex-1 truncate">{f.url}</code>
                        <button
                          onClick={() => navigator.clipboard.writeText(f.url || '')}
                          className="text-dark-400 hover:text-white flex-shrink-0 px-2 py-1 rounded bg-dark-700 text-xs"
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-dark-800/50 rounded-2xl p-6 border border-dark-700">
          <h3 className="font-semibold text-gold-500 mb-3">💡 How it works</h3>
          <div className="space-y-2 text-sm text-dark-400">
            <p>1. Select a <strong className="text-dark-200">category</strong> and name the project</p>
            <p>2. <strong className="text-dark-200">Drag & drop</strong> all photos at once (or click to browse)</p>
            <p>3. Hit <strong className="text-dark-200">Upload</strong> — all photos go to Firebase Storage in one click</p>
            <p>4. Copy the generated URLs into the gallery data to add them to the site</p>
          </div>
          <div className="mt-4 p-3 bg-dark-900 rounded-lg">
            <p className="text-xs text-dark-500">
              <strong className="text-dark-300">Storage:</strong> Firebase free tier gives you 5 GB — enough for 5,000+ project photos.
              Currently using ~{(totalSize / 1024 / 1024).toFixed(1) || '0'} MB.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
