'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users, Briefcase, Star, FileText, ClipboardList, DollarSign,
  Phone, ArrowRight, AlertCircle, Receipt, FileSignature, FilePlus,
  Settings, ImageIcon, Megaphone, HelpCircle, X, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react'

const stats = [
  { label: 'Active Leads', value: '—', change: 'View leads', icon: Users, color: 'text-blue-400 bg-blue-500/20' },
  { label: 'Active Projects', value: '—', change: 'View projects', icon: Briefcase, color: 'text-green-400 bg-green-500/20' },
  { label: 'Pending Reviews', value: '—', change: 'Check reviews', icon: Star, color: 'text-yellow-400 bg-yellow-500/20' },
  { label: 'Documents', value: '—', change: 'View all', icon: FileSignature, color: 'text-purple-400 bg-purple-500/20' },
]

const quickActions = [
  { label: 'Create Invoice', href: '/admin/invoices', icon: Receipt, desc: 'Generate & send invoices', color: 'from-blue-600 to-blue-700', help: 'Create professional invoices with line items, tax, and payment terms. Your signature auto-saves after drawing it once.' },
  { label: 'Create Change Order', href: '/admin/change-orders', icon: ClipboardList, desc: 'Document additional work', color: 'from-purple-600 to-purple-700', help: 'When a project scope changes, create a change order to document the extra work and get client approval.' },
  { label: 'Create Contract', href: '/admin/contracts', icon: Briefcase, desc: 'Scope of work agreements', color: 'from-green-600 to-green-700', help: 'Create contracts with detailed scope of work, payment schedules, and terms. Send to clients for signature.' },
  { label: 'Signed Documents', href: '/admin/documents', icon: FileSignature, desc: 'Upload & view signed docs', color: 'from-amber-600 to-amber-700', help: 'Upload signed contracts, permits, and other documents. Everything is stored securely in the cloud.' },
  { label: 'Manage Leads', href: '/admin/leads', icon: Users, desc: 'View & respond to leads', color: 'from-cyan-600 to-cyan-700', help: 'Every contact form, get-started form, and referral submission shows up here. Follow up quickly to win more jobs!' },
  { label: 'Manage Reviews', href: '/admin/reviews', icon: Star, desc: 'Approve & manage reviews', color: 'from-yellow-600 to-yellow-700', help: 'New reviews need your approval before appearing on the website. Approve the good ones, remove the rest.' },
  { label: 'Field Notes', href: '/admin/field-notes', icon: FilePlus, desc: 'On-site project notes', color: 'from-slate-600 to-slate-700', help: 'Take notes on-site with measurements, materials needed, and photos. Everything saves to the cloud — no more lost paper notes.' },
  { label: 'Manage Images', href: '/admin/images', icon: ImageIcon, desc: 'Upload project photos', color: 'from-pink-600 to-pink-700', help: 'Upload before/after photos of your projects. Great images help win new customers!' },
  { label: 'Site Settings', href: '/admin/settings', icon: Settings, desc: 'Edit banner, contact, payments', color: 'from-orange-600 to-orange-700', help: 'Control what appears on your website: the announcement banner, contact info, payment methods, service areas, and more. No coding needed!' }
  { label: 'Promo Banners', href: '/admin/banners', icon: Megaphone, desc: 'Create & manage promos', color: 'from-rose-600 to-rose-700', help: 'Create rotating banners with discounts, seasonal promos, and bundle deals. Each banner links to the contact form with the service pre-selected.' },
]

const sentLinks = [
  { label: 'Sent Invoices', href: '/admin/invoices/sent', icon: Receipt },
  { label: 'Sent Change Orders', href: '/admin/change-orders/sent', icon: ClipboardList },
  { label: 'Sent Contracts', href: '/admin/contracts/sent', icon: Briefcase },
]

export default function AdminDashboard() {
  const [showTutorial, setShowTutorial] = useState(false)
  const [expandedHelp, setExpandedHelp] = useState<string | null>(null)

  // Show tutorial on first visit
  useState(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('admin_tutorial_seen')) {
      setShowTutorial(true)
    }
  })

  // Tutorial Overlay
  if (showTutorial) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-slate-800 rounded-2xl border border-white/10 max-w-xl w-full p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to Your Dashboard!</h1>
            <p className="text-slate-400">This is your business command center. Everything you need to run CR Home Pros is right here.</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <Receipt className="w-5 h-5 text-blue-400" />
              <div>
                <p className="font-medium text-white text-sm">Documents</p>
                <p className="text-xs text-slate-400">Create invoices, contracts, and change orders</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <Users className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="font-medium text-white text-sm">Leads & Reviews</p>
                <p className="text-xs text-slate-400">Every form submission lands here. Approve reviews for your website.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <Settings className="w-5 h-5 text-orange-400" />
              <div>
                <p className="font-medium text-white text-sm">Site Settings</p>
                <p className="text-xs text-slate-400">Edit your website banner, contact info, payment methods — no coding!</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 rounded-xl p-4 mb-6 border border-blue-500/20">
            <p className="text-sm text-blue-300">
              <strong>💡 Pro Tip:</strong> Look for the <HelpCircle className="w-4 h-4 inline text-blue-400" /> icon next to each section — tap it to learn what it does.
            </p>
          </div>

          <button
            onClick={() => {
              setShowTutorial(false)
              localStorage.setItem('admin_tutorial_seen', 'true')
            }}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-colors"
          >
            Let&apos;s Go!
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, Carlos!</h1>
          <p className="text-slate-400 mt-1">Here&apos;s your admin dashboard. Create documents, manage leads, and track your business.</p>
        </div>
        <button onClick={() => setShowTutorial(true)} className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors" title="Show tutorial">
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-slate-800/50 border border-white/5 rounded-xl p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-semibold text-white mb-4 text-lg">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <div key={action.label} className="bg-slate-800/50 border border-white/5 rounded-xl hover:border-white/15 transition-all">
              <Link
                href={action.href}
                className="group flex items-center gap-4 p-4"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{action.label}</p>
                  <p className="text-xs text-slate-400">{action.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors flex-shrink-0" />
              </Link>
              {/* Help toggle */}
              <button
                onClick={() => setExpandedHelp(expandedHelp === action.label ? null : action.label)}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-500 hover:text-blue-400 border-t border-white/5 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{expandedHelp === action.label ? 'Hide' : 'Show me'}</span>
                {expandedHelp === action.label ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
              </button>
              {expandedHelp === action.label && (
                <div className="px-4 pb-3 text-xs text-blue-300/80 bg-blue-500/5 border-t border-blue-500/10">
                  {action.help}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sent Documents */}
      <div className="mb-8">
        <h2 className="font-semibold text-white mb-4 text-lg">View Sent Documents</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {sentLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:border-white/15 transition-all text-slate-300 hover:text-white"
            >
              <link.icon className="w-5 h-5 text-slate-500" />
              <span className="font-medium text-sm">{link.label}</span>
              <ArrowRight className="w-4 h-4 ml-auto text-slate-600" />
            </Link>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-300">Getting Started</h3>
            <p className="text-blue-400/80 text-sm mt-1">
              Create your first invoice, change order, or contract using the quick actions above. 
              Your signature will be saved after drawing it once — it&apos;ll auto-load on all future documents.
              Head to <Link href="/admin/settings" className="underline text-blue-300 hover:text-white">Site Settings</Link> to customize your website banner, contact info, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
