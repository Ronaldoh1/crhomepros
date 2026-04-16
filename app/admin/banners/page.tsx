'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Plus, Save, Trash2, Loader2, CheckCircle,
  Eye, EyeOff, Pencil, X, Megaphone, GripVertical, Copy
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DEFAULT_BANNERS, saveBanner, deleteBanner, toggleBanner,
  fetchBanners, type BannerConfig
} from '@/lib/banners'

const GRADIENT_PRESETS = [
  { name: 'Emerald', value: 'linear-gradient(135deg, #065F46, #047857, #059669)', accent: '#047857' },
  { name: 'Amber', value: 'linear-gradient(135deg, #92400E, #B45309, #D97706)', accent: '#D97706' },
  { name: 'Crimson', value: 'linear-gradient(135deg, #7F1D1D, #991B1B, #DC2626)', accent: '#DC2626' },
  { name: 'Purple', value: 'linear-gradient(135deg, #6B21A8, #7C3AED, #9333EA)', accent: '#9333EA' },
  { name: 'Burnt Orange', value: 'linear-gradient(135deg, #7C2D12, #9A3412, #C2410C)', accent: '#C2410C' },
  { name: 'Teal', value: 'linear-gradient(135deg, #065F46, #0D9488, #14B8A6)', accent: '#0D9488' },
  { name: 'Rose', value: 'linear-gradient(135deg, #9F1239, #BE123C, #E11D48)', accent: '#E11D48' },
  { name: 'Slate', value: 'linear-gradient(135deg, #334155, #475569, #64748B)', accent: '#64748B' },
]

const EMOJI_OPTIONS = ['☀️', '🌧️', '🏠', '⚡', '🎉', '📦', '🔥', '💰', '🛠️', '🌿', '❄️', '🎯']

const SERVICE_OPTIONS = [
  { id: '', label: '(No specific service)' },
  { id: 'kitchen-remodeling', label: 'Kitchen Remodeling' },
  { id: 'bathroom-renovation', label: 'Bathroom Renovation' },
  { id: 'basement-finishing', label: 'Basement Finishing' },
  { id: 'roofing', label: 'Roofing' },
  { id: 'concrete-driveways', label: 'Concrete & Driveways' },
  { id: 'flooring', label: 'Flooring & Tiling' },
  { id: 'painting', label: 'Interior & Exterior Painting' },
  { id: 'deck-outdoor', label: 'Decks & Outdoor' },
  { id: 'fencing', label: 'Fencing' },
  { id: 'complete-renovations', label: 'Complete Renovations' },
  { id: 'power-washing', label: 'Power Washing' },
  { id: 'gutters-downspouts', label: 'Gutters & Downspouts' },
  { id: 'insurance-claims', label: 'Insurance Claims' },
]

const emptyBanner: BannerConfig = {
  id: '',
  active: true,
  emoji: '☀️',
  textEn: '',
  textEs: '',
  ctaEn: 'Get Quote →',
  ctaEs: 'Cotizar →',
  gradient: GRADIENT_PRESETS[0].value,
  accentColor: GRADIENT_PRESETS[0].accent,
  service: '',
  discountPercent: 15,
  promoCode: '',
  tier: 'big',
  priority: 99,
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editing, setEditing] = useState<BannerConfig | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    setLoading(true)
    try {
      const b = await fetchBanners()
      setBanners(b.length > 0 ? b : DEFAULT_BANNERS)
    } catch {
      setBanners(DEFAULT_BANNERS)
    }
    setLoading(false)
  }

  const handleToggle = async (id: string, active: boolean) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active } : b))
    await toggleBanner(id, active)
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)

    const banner = {
      ...editing,
      id: editing.id || editing.promoCode.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
    }

    const ok = await saveBanner(banner)
    if (ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      setEditing(null)
      setIsNew(false)
      await loadBanners()
    } else {
      alert('Failed to save. Try again.')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    await deleteBanner(id)
    setDeleteConfirm(null)
    await loadBanners()
  }

  const startNew = () => {
    setEditing({ ...emptyBanner })
    setIsNew(true)
  }

  const startEdit = (banner: BannerConfig) => {
    setEditing({ ...banner })
    setIsNew(false)
  }

  const copyDeepLink = (banner: BannerConfig) => {
    const base = 'https://crhomepros.com/en/get-started'
    const params = new URLSearchParams()
    params.set('banner', banner.id)
    if (banner.service) params.set('service', banner.service)
    if (banner.promoCode) params.set('promo', banner.promoCode)
    if (banner.discountPercent) params.set('discount', String(banner.discountPercent))
    navigator.clipboard.writeText(base + '?' + params.toString())
  }

  const ic = "w-full px-4 py-3 bg-white border border-dark-200 rounded-xl text-dark-900 placeholder:text-dark-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"

  if (loading) return (
    <div className="min-h-screen bg-dark-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
    </div>
  )

  // ── Edit/Create View ──
  if (editing) {
    return (
      <div className="min-h-screen bg-dark-50">
        <header className="bg-white border-b border-dark-100 sticky top-0 z-40">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <button onClick={() => { setEditing(null); setIsNew(false) }} className="flex items-center gap-2 text-dark-600">
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <h1 className="font-display font-bold">{isNew ? 'New Banner' : 'Edit Banner'}</h1>
            <button onClick={handleSave} disabled={saving} className="text-primary-600 font-medium flex items-center gap-1">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : saved ? <CheckCircle className="w-5 h-5 text-green-600" /> : <><Save className="w-4 h-4" /> Save</>}
            </button>
          </div>
        </header>

        <div className="max-w-2xl mx-auto p-4 space-y-6">
          {/* Live Preview */}
          <div className="rounded-xl overflow-hidden shadow-lg">
            <div className="flex items-center justify-center gap-3 px-4 py-2.5 text-white text-sm font-medium" style={{ background: editing.gradient }}>
              <span>{editing.emoji}</span>
              <span className="line-clamp-1">{editing.textEn || 'Your banner text here...'}</span>
              <span className="px-3 py-0.5 bg-white/20 rounded-full text-xs font-bold">{editing.ctaEn || 'CTA'}</span>
            </div>
          </div>

          {/* Emoji */}
          <div className="bg-white rounded-xl p-5 space-y-4">
            <label className="block text-sm font-semibold text-dark-700">Emoji</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(e => (
                <button key={e} onClick={() => setEditing({ ...editing, emoji: e })}
                  className={cn("w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all",
                    editing.emoji === e ? "bg-primary-100 ring-2 ring-primary-500 scale-110" : "bg-dark-50 hover:bg-dark-100"
                  )}>{e}</button>
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="bg-white rounded-xl p-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1">Banner Text (English) *</label>
              <input type="text" value={editing.textEn} onChange={e => setEditing({ ...editing, textEn: e.target.value })} className={ic} placeholder="Summer Special: 15% off kitchen renovations" maxLength={100} />
              <p className="text-xs text-dark-400 mt-1">{editing.textEn.length}/100</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1">Banner Text (Spanish) *</label>
              <input type="text" value={editing.textEs} onChange={e => setEditing({ ...editing, textEs: e.target.value })} className={ic} placeholder="Especial de Verano: 15% en cocinas" maxLength={100} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-1">Button (EN)</label>
                <input type="text" value={editing.ctaEn} onChange={e => setEditing({ ...editing, ctaEn: e.target.value })} className={ic} placeholder="Book Now →" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-1">Button (ES)</label>
                <input type="text" value={editing.ctaEs} onChange={e => setEditing({ ...editing, ctaEs: e.target.value })} className={ic} placeholder="Agendar →" />
              </div>
            </div>
          </div>

          {/* Color */}
          <div className="bg-white rounded-xl p-5 space-y-4">
            <label className="block text-sm font-semibold text-dark-700">Banner Color</label>
            <div className="grid grid-cols-4 gap-3">
              {GRADIENT_PRESETS.map(g => (
                <button key={g.name} onClick={() => setEditing({ ...editing, gradient: g.value, accentColor: g.accent })}
                  className={cn("h-12 rounded-lg transition-all", editing.gradient === g.value ? "ring-2 ring-offset-2 ring-primary-500 scale-105" : "hover:scale-105")}
                  style={{ background: g.value }}>
                  <span className="text-white text-xs font-medium drop-shadow">{g.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Service + Promo */}
          <div className="bg-white rounded-xl p-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1">Pre-select Service</label>
              <select value={editing.service} onChange={e => setEditing({ ...editing, service: e.target.value })} className={ic}>
                {SERVICE_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <p className="text-xs text-dark-400 mt-1">When customer clicks banner, this service is pre-checked in the form</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-1">Promo Code *</label>
                <input type="text" value={editing.promoCode} onChange={e => setEditing({ ...editing, promoCode: e.target.value.toUpperCase() })} className={ic} placeholder="SUMMER15" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-1">Discount %</label>
                <input type="number" value={editing.discountPercent} onChange={e => setEditing({ ...editing, discountPercent: parseInt(e.target.value) || 0 })} className={ic} min={0} max={50} />
                <p className="text-xs text-dark-400 mt-1">15% big jobs, 5% small jobs, 0% for referrals</p>
              </div>
            </div>
          </div>

          {/* Save */}
          <button onClick={handleSave} disabled={saving || !editing.textEn || !editing.promoCode}
            className="w-full py-3 bg-primary-800 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : saved ? <><CheckCircle className="w-5 h-5" /> Saved!</> : <><Save className="w-5 h-5" /> {isNew ? 'Create Banner' : 'Save Changes'}</>}
          </button>
        </div>
      </div>
    )
  }

  // ── List View ──
  return (
    <div className="min-h-screen bg-dark-50">
      <header className="bg-white border-b border-dark-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2"><ArrowLeft className="w-6 h-6" /></Link>
            <div>
              <h1 className="text-xl font-display font-bold">Promo Banners</h1>
              <p className="text-sm text-dark-500">{banners.filter(b => b.active).length} active of {banners.length}</p>
            </div>
          </div>
          <button onClick={startNew} className="flex items-center gap-2 px-4 py-2 bg-primary-800 text-white rounded-xl text-sm font-medium hover:bg-primary-700">
            <Plus className="w-4 h-4" /> New
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-3">
        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-green-700 text-sm">
            <CheckCircle className="w-4 h-4" /> Changes saved!
          </div>
        )}

        {banners.map(banner => (
          <div key={banner.id} className="bg-white rounded-xl border border-dark-100 overflow-hidden">
            {/* Preview bar */}
            <div className="flex items-center gap-2 px-3 py-2 text-white text-xs font-medium" style={{ background: banner.gradient }}>
              <span>{banner.emoji}</span>
              <span className="flex-1 line-clamp-1">{banner.textEn}</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px]">{banner.ctaEn}</span>
            </div>

            {/* Controls */}
            <div className="p-4 flex items-center gap-4">
              {/* Toggle */}
              <button onClick={() => handleToggle(banner.id, !banner.active)}
                className={cn("w-12 h-7 rounded-full transition-colors relative flex-shrink-0",
                  banner.active ? "bg-green-500" : "bg-dark-300")}>
                <div className={cn("w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow",
                  banner.active ? "translate-x-6" : "translate-x-1")} />
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-dark-900 truncate">{banner.promoCode || banner.id}</span>
                  {banner.discountPercent > 0 && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">{banner.discountPercent}% off</span>
                  )}
                  {banner.service && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium truncate">{banner.service}</span>
                  )}
                </div>
                <p className="text-xs text-dark-500 truncate mt-0.5">{banner.textEs}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => copyDeepLink(banner)} className="p-2 text-dark-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Copy deep link">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={() => startEdit(banner)} className="p-2 text-dark-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                {deleteConfirm === banner.id ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleDelete(banner.id)} className="px-2 py-1 bg-red-600 text-white rounded text-xs font-medium">Delete</button>
                    <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 bg-dark-200 text-dark-600 rounded text-xs font-medium">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(banner.id)} className="p-2 text-dark-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Seed defaults button */}
        {banners.length === 0 && (
          <button onClick={async () => {
            for (const b of DEFAULT_BANNERS) await saveBanner(b)
            await loadBanners()
          }} className="w-full py-3 bg-primary-100 text-primary-800 rounded-xl font-medium text-sm hover:bg-primary-200 transition-colors">
            Load Default Banners
          </button>
        )}

        {/* Help */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
          <h3 className="font-semibold text-amber-800 text-sm mb-2">How Banners Work</h3>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>• Active banners rotate every 10 seconds at the top of the website</li>
            <li>• When a customer clicks a banner, the service is pre-selected in the form</li>
            <li>• If the customer selects 2+ services, Carlos gets a BUNDLE LEAD alert</li>
            <li>• Toggle banners on/off for seasonal promotions</li>
            <li>• The deep link (copy icon) can be shared on social media or texts</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
