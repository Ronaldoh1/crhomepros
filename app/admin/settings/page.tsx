'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Save, Loader2, CheckCircle, Eye, EyeOff,
  Megaphone, Phone, Building2, Share2, CreditCard, MapPin,
  HelpCircle, X, ChevronRight, Sparkles, Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getSiteSettings, saveSiteSettings,
  type SiteSettings, DEFAULT_SETTINGS,
  type BannerSettings, type ContactSettings,
  type BrandingSettings, type SocialSettings,
} from '@/lib/site-settings'

type Section = 'banner' | 'contact' | 'branding' | 'social' | 'payments' | 'areas'

const SECTIONS: { id: Section; label: string; icon: any; desc: string; tip: string }[] = [
  { id: 'banner', label: 'Announcement Banner', icon: Megaphone, desc: 'Top-of-page promotions', tip: 'Use this to promote seasonal specials, discounts, or important updates. Keep it short — under 80 characters works best. Toggle it off when you don\'t have an active promotion.' },
  { id: 'contact', label: 'Contact Info', icon: Phone, desc: 'Phone, email, hours', tip: 'This info appears in the footer, contact page, and is used across the site. Make sure the phone number is correct — it\'s the #1 way customers reach you.' },
  { id: 'branding', label: 'Business Info', icon: Building2, desc: 'Name, license, stats', tip: 'These numbers show up across the site as trust badges. Update your project count as you complete more jobs. The MHIC number builds trust with Maryland customers.' },
  { id: 'social', label: 'Social Media', icon: Share2, desc: 'Facebook, Instagram, TikTok', tip: 'Link your social profiles so customers can find you everywhere. Active social profiles boost your credibility and help with local SEO.' },
  { id: 'payments', label: 'Payment Methods', icon: CreditCard, desc: 'Accepted payment types', tip: 'List all payment methods you accept. Showing financing options can help close bigger jobs. Add or remove methods anytime.' },
  { id: 'areas', label: 'Service Areas', icon: MapPin, desc: 'Cities & regions served', tip: 'These appear in the footer and help with local SEO. List every city/area where you take jobs — the more specific, the better for search rankings.' },
]

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState<Section | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)
  const [newPayment, setNewPayment] = useState('')
  const [newArea, setNewArea] = useState('')

  useEffect(() => {
    (async () => {
      setLoading(true)
      const s = await getSiteSettings()
      setSettings(s)
      setLoading(false)
      if (!localStorage.getItem('cms_tutorial_seen')) setShowTutorial(true)
    })()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const ok = await saveSiteSettings(settings)
    setSaving(false)
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    else alert('Failed to save. Please try again.')
  }

  const updateBanner = (key: keyof BannerSettings, val: any) =>
    setSettings(s => ({ ...s, banner: { ...s.banner, [key]: val } }))
  const updateContact = (key: keyof ContactSettings, val: any) =>
    setSettings(s => ({ ...s, contact: { ...s.contact, [key]: val } }))
  const updateBranding = (key: keyof BrandingSettings, val: any) =>
    setSettings(s => ({ ...s, branding: { ...s.branding, [key]: val } }))
  const updateSocial = (key: keyof SocialSettings, val: any) =>
    setSettings(s => ({ ...s, social: { ...s.social, [key]: val } }))

  const addPayment = () => { if (!newPayment.trim()) return; setSettings(s => ({ ...s, paymentMethods: [...s.paymentMethods, newPayment.trim()] })); setNewPayment('') }
  const removePayment = (idx: number) => setSettings(s => ({ ...s, paymentMethods: s.paymentMethods.filter((_, i) => i !== idx) }))
  const addArea = () => { if (!newArea.trim()) return; setSettings(s => ({ ...s, serviceAreas: [...s.serviceAreas, newArea.trim()] })); setNewArea('') }
  const removeArea = (idx: number) => setSettings(s => ({ ...s, serviceAreas: s.serviceAreas.filter((_, i) => i !== idx) }))

  const ic = "w-full px-4 py-3 bg-white border border-dark-200 rounded-xl text-dark-900 placeholder:text-dark-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"

  if (showTutorial) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"><Sparkles className="w-8 h-8 text-primary-600" /></div>
            <h1 className="text-2xl font-display font-bold text-dark-900 mb-2">Welcome to Site Settings!</h1>
            <p className="text-dark-500">This is your control center. Here you can edit everything that appears on your website — no coding needed.</p>
          </div>
          <div className="space-y-3 mb-8">
            {SECTIONS.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-50">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0"><s.icon className="w-5 h-5 text-primary-600" /></div>
                <div><p className="font-semibold text-dark-900 text-sm">{s.label}</p><p className="text-xs text-dark-500">{s.desc}</p></div>
              </div>
            ))}
          </div>
          <button onClick={() => { setShowTutorial(false); localStorage.setItem('cms_tutorial_seen', 'true') }} className="w-full py-3 bg-primary-800 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">Got it — Let&apos;s go!</button>
        </div>
      </div>
    )
  }

  if (loading) return <div className="min-h-screen bg-dark-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>

  if (activeSection) {
    const sec = SECTIONS.find(s => s.id === activeSection)!
    return (
      <div className="min-h-screen bg-dark-50">
        <header className="bg-white border-b border-dark-100 sticky top-0 z-40">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <button onClick={() => setActiveSection(null)} className="p-2"><ArrowLeft className="w-6 h-6" /></button>
            <h1 className="font-display font-bold">{sec.label}</h1>
            <button onClick={handleSave} disabled={saving} className="text-primary-600 font-medium flex items-center gap-1">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : saved ? <CheckCircle className="w-5 h-5 text-green-600" /> : 'Save'}
            </button>
          </div>
        </header>
        <div className="max-w-2xl mx-auto p-4 space-y-6">
          <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
            <div className="flex items-start gap-3"><HelpCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" /><p className="text-sm text-primary-800">{sec.tip}</p></div>
          </div>

          {activeSection === 'banner' && (
            <div className="bg-white rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-dark-900">Banner Enabled</label>
                <button onClick={() => updateBanner('enabled', !settings.banner.enabled)} className={cn("w-14 h-8 rounded-full transition-colors relative", settings.banner.enabled ? "bg-green-500" : "bg-dark-300")}>
                  <div className={cn("w-6 h-6 bg-white rounded-full absolute top-1 transition-transform shadow", settings.banner.enabled ? "translate-x-7" : "translate-x-1")} />
                </button>
              </div>
              <div><label className="block text-sm font-medium text-dark-700 mb-1">Banner Text ({settings.banner.text.length}/100)</label><input type="text" maxLength={100} value={settings.banner.text} onChange={e => updateBanner('text', e.target.value)} className={ic} /></div>
              <div><label className="block text-sm font-medium text-dark-700 mb-1">Button Text ({settings.banner.linkText.length}/30)</label><input type="text" maxLength={30} value={settings.banner.linkText} onChange={e => updateBanner('linkText', e.target.value)} className={ic} /></div>
              <div><label className="block text-sm font-medium text-dark-700 mb-1">Button Link</label><input type="text" value={settings.banner.linkUrl} onChange={e => updateBanner('linkUrl', e.target.value)} className={ic} /></div>
              {settings.banner.enabled && (<div className="mt-4"><p className="text-xs font-medium text-dark-500 uppercase mb-2">Preview</p><div className="bg-primary-900 text-white text-center py-3 px-4 rounded-xl"><span className="text-sm">{settings.banner.text}</span>{settings.banner.linkText && <span className="ml-3 inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium">{settings.banner.linkText}</span>}</div></div>)}
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="bg-white rounded-xl p-6 space-y-5">
              <div><label className="block text-sm font-medium text-dark-700 mb-1">Phone Number</label><input type="tel" value={settings.contact.phone} onChange={e => updateContact('phone', e.target.value)} className={ic} /></div>
              <div><label className="block text-sm font-medium text-dark-700 mb-1">Email</label><input type="email" value={settings.contact.email} onChange={e => updateContact('email', e.target.value)} className={ic} /></div>
              <div><label className="block text-sm font-medium text-dark-700 mb-1">WhatsApp Link</label><input type="url" value={settings.contact.whatsappUrl} onChange={e => updateContact('whatsappUrl', e.target.value)} className={ic} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-dark-700 mb-1">City</label><input type="text" value={settings.contact.city} onChange={e => updateContact('city', e.target.value)} className={ic} /></div>
                <div><label className="block text-sm font-medium text-dark-700 mb-1">State</label><input type="text" value={settings.contact.state} onChange={e => updateContact('state', e.target.value)} className={ic} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-dark-700 mb-1">Business Hours</label><input type="text" value={settings.contact.hours} onChange={e => updateContact('hours', e.target.value)} className={ic} /></div>
                <div><label className="block text-sm font-medium text-dark-700 mb-1">Hours Note</label><input type="text" value={settings.contact.hoursNote} onChange={e => updateContact('hoursNote', e.target.value)} className={ic} /></div>
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium text-dark-700">24/7 Emergency Available</label>
                <button onClick={() => updateContact('emergencyAvailable', !settings.contact.emergencyAvailable)} className={cn("w-14 h-8 rounded-full transition-colors relative", settings.contact.emergencyAvailable ? "bg-green-500" : "bg-dark-300")}>
                  <div className={cn("w-6 h-6 bg-white rounded-full absolute top-1 transition-transform shadow", settings.contact.emergencyAvailable ? "translate-x-7" : "translate-x-1")} />
                </button>
              </div>
            </div>
          )}

          {activeSection === 'branding' && (
            <div className="bg-white rounded-xl p-6 space-y-5">
              <div><label className="block text-sm font-medium text-dark-700 mb-1">Company Name</label><input type="text" value={settings.branding.companyName} onChange={e => updateBranding('companyName', e.target.value)} className={ic} /></div>
              <div><label className="block text-sm font-medium text-dark-700 mb-1">Tagline</label><input type="text" value={settings.branding.tagline} onChange={e => updateBranding('tagline', e.target.value)} className={ic} /></div>
              <div><label className="block text-sm font-medium text-dark-700 mb-1">MHIC License Number</label><input type="text" value={settings.branding.mhicNumber} onChange={e => updateBranding('mhicNumber', e.target.value)} className={ic} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-dark-700 mb-1">Years Experience</label><input type="text" value={settings.branding.yearsExperience} onChange={e => updateBranding('yearsExperience', e.target.value)} className={ic} /></div>
                <div><label className="block text-sm font-medium text-dark-700 mb-1">Projects Completed</label><input type="text" value={settings.branding.projectsCompleted} onChange={e => updateBranding('projectsCompleted', e.target.value)} className={ic} /></div>
              </div>
            </div>
          )}

          {activeSection === 'social' && (
            <div className="bg-white rounded-xl p-6 space-y-5">
              {(['facebook', 'instagram', 'tiktok', 'yelp', 'google'] as const).map(p => (
                <div key={p}><label className="block text-sm font-medium text-dark-700 mb-1 capitalize">{p === 'google' ? 'Google Business' : p}</label><input type="url" value={settings.social[p]} onChange={e => updateSocial(p, e.target.value)} className={ic} placeholder={`https://${p}.com/...`} /></div>
              ))}
            </div>
          )}

          {activeSection === 'payments' && (
            <div className="bg-white rounded-xl p-6 space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {settings.paymentMethods.map((m, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-800 rounded-lg text-sm font-medium">{m}<button onClick={() => removePayment(i)} className="text-primary-400 hover:text-red-500"><X className="w-3.5 h-3.5" /></button></span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newPayment} onChange={e => setNewPayment(e.target.value)} onKeyDown={e => e.key === 'Enter' && addPayment()} className={ic} placeholder="Add payment method..." />
                <button onClick={addPayment} className="px-4 py-2 bg-primary-800 text-white rounded-xl text-sm font-medium hover:bg-primary-700 flex-shrink-0">Add</button>
              </div>
            </div>
          )}

          {activeSection === 'areas' && (
            <div className="bg-white rounded-xl p-6 space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {settings.serviceAreas.map((a, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-800 rounded-lg text-sm font-medium">{a}<button onClick={() => removeArea(i)} className="text-green-400 hover:text-red-500"><X className="w-3.5 h-3.5" /></button></span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newArea} onChange={e => setNewArea(e.target.value)} onKeyDown={e => e.key === 'Enter' && addArea()} className={ic} placeholder="Add city or area..." />
                <button onClick={addArea} className="px-4 py-2 bg-primary-800 text-white rounded-xl text-sm font-medium hover:bg-primary-700 flex-shrink-0">Add</button>
              </div>
            </div>
          )}

          <button onClick={handleSave} disabled={saving} className="w-full py-3 bg-primary-800 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : saved ? <><CheckCircle className="w-5 h-5" /> Saved!</> : <><Save className="w-5 h-5" /> Save Changes</>}
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
            <div><h1 className="text-xl font-display font-bold">Site Settings</h1><p className="text-sm text-dark-500">Edit your website content</p></div>
          </div>
          <button onClick={() => setShowTutorial(true)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"><HelpCircle className="w-5 h-5" /></button>
        </div>
      </header>
      <div className="max-w-2xl mx-auto p-4 space-y-3">
        {saved && <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-green-700 text-sm"><CheckCircle className="w-4 h-4" /> All changes saved!</div>}
        {SECTIONS.map(sec => (
          <button key={sec.id} onClick={() => setActiveSection(sec.id)} className="w-full bg-white rounded-xl border border-dark-100 p-4 flex items-center gap-4 hover:border-primary-200 hover:shadow-sm transition-all text-left">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0"><sec.icon className="w-6 h-6 text-primary-600" /></div>
            <div className="flex-1 min-w-0"><h3 className="font-semibold text-dark-900">{sec.label}</h3><p className="text-sm text-dark-500">{sec.desc}</p></div>
            <ChevronRight className="w-5 h-5 text-dark-400 flex-shrink-0" />
          </button>
        ))}
        <div className="mt-6 bg-white rounded-xl border border-dark-100 p-4">
          <h3 className="font-semibold text-dark-900 mb-3 flex items-center gap-2"><Eye className="w-4 h-4" /> Quick Status</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2"><span className={cn("w-2 h-2 rounded-full", settings.banner.enabled ? "bg-green-500" : "bg-dark-300")} />Banner: {settings.banner.enabled ? 'On' : 'Off'}</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" />Phone: {settings.contact.phone}</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" />{settings.paymentMethods.length} payment methods</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500" />{settings.serviceAreas.length} service areas</div>
          </div>
        </div>
      </div>
    </div>
  )
}
