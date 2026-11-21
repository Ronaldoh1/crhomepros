'use client'

import { AuthProvider, useAuth } from './_components/AuthProvider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, FileText, FilePlus, FileSignature,
  FolderOpen, LogOut, Menu, X, ChevronDown, ChevronRight,
  Receipt, ClipboardList, Briefcase, Home, Loader2, HelpCircle, Camera, MessageSquare, Images
} from 'lucide-react'
import { AdminTour, TOUR_EVENT } from './_components/AdminTour'
import { ToastProvider } from './_components/Toast'
import { NotificationsProvider, NotificationBanner } from './_components/Notifications'

function AdminSidebar({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    estimates: true,
    invoices: true,
    contracts: true,
  })

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isActive = (href: string) => pathname === href

  // Each kind of document has its own color, so the menu reads at a glance
  const TONES = {
    sky: { head: 'bg-sky-600', rail: 'border-sky-400', dot: 'bg-sky-400' },
    violet: { head: 'bg-violet-600', rail: 'border-violet-400', dot: 'bg-violet-400' },
    orange: { head: 'bg-orange-600', rail: 'border-orange-400', dot: 'bg-orange-400' },
  } as const
  type Tone = keyof typeof TONES

  // The page you are on is a solid white row: easy to tell apart from the rest
  const navLink = (href: string, icon: React.ReactNode, label: string, tone?: Tone) => (
    <Link
      href={href}
      onClick={onClose}
      aria-current={isActive(href) ? 'page' : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive(href)
        ? 'bg-white text-slate-950 font-bold shadow'
        : 'text-white font-medium hover:bg-white/10'
        }`}
    >
      {tone ? <span className={`w-2 h-2 rounded-full flex-shrink-0 ${TONES[tone].dot}`} /> : icon}
      {label}
    </Link>
  )

  const section = (key: string, tone: Tone, step: number, icon: React.ReactNode, label: string, links: [string, string][]) => (
    <div className="pt-2">
      <button
        onClick={() => toggleSection(key)}
        aria-expanded={!!expandedSections[key]}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-white ${TONES[tone].head}`}
      >
        <span className="flex items-center gap-2.5">{step > 0 ? <span className="w-5 h-5 rounded-full bg-white text-slate-950 text-xs font-extrabold flex items-center justify-center">{step}</span> : icon} {step > 0 ? icon : null} {label}</span>
        {expandedSections[key] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {expandedSections[key] && (
        <div className={`ml-3 mt-1 pl-2 border-l-4 space-y-0.5 ${TONES[tone].rail}`}>
          {links.map(([href, text]) => <div key={href}>{navLink(href, null, text, tone)}</div>)}
        </div>
      )}
    </div>
  )

  return (
    <div className={`${mobile ? 'w-full' : 'w-64'} h-full bg-slate-900 border-r border-white/25 flex flex-col`}>
      {/* Logo / Brand */}
      <div className="px-5 py-5 border-b border-white/25">
        <div className="flex items-center justify-between">
          <Link href="/admin" onClick={onClose} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
              CR
            </div>
            <div>
              <p className="font-bold text-white text-sm">Admin Portal</p>
              <p className="text-[11px] text-white">CR Home Pros</p>
            </div>
          </Link>
          {mobile && (
            <button onClick={onClose} className="text-white hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navLink('/admin', <LayoutDashboard className="w-4 h-4" />, 'Dashboard')}

        {/* The three documents, in the order a job moves through them */}
        {section('estimates', 'sky', 1, <Camera className="w-4 h-4" />, 'Estimates', [
          ['/admin/estimates/new', 'Generate Estimate'],
          ['/admin/estimates/drafts', 'Draft Estimates'],
          ['/admin/estimates/sent', 'Sent Estimates'],
        ])}
        {section('contracts', 'violet', 2, <Briefcase className="w-4 h-4" />, 'Contracts', [
          ['/admin/contracts', 'Generate Contract'],
          ['/admin/contracts/drafts', 'Draft Contracts'],
          ['/admin/contracts/sent', 'Sent Contracts'],
        ])}
        {section('invoices', 'orange', 3, <Receipt className="w-4 h-4" />, 'Invoices', [
          ['/admin/invoices/drafts', 'Invoices to Approve'],
          ['/admin/invoices/sent', 'Sent Invoices'],
        ])}

        <div className="pt-3 border-t border-white/25 mt-3">
          {navLink('/admin/documents', <FileSignature className="w-4 h-4" />, 'Signed Documents')}
          {navLink('/admin/leads', <FileText className="w-4 h-4" />, 'Leads and Referrals')}
          {navLink('/admin/messages', <MessageSquare className="w-4 h-4" />, 'Client Messages')}
          {navLink('/admin/past-projects', <Images className="w-4 h-4" />, 'Past Projects')}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/25 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white hover:text-white hover:bg-white/5 transition-all"
        >
          <Home className="w-4 h-4" />
          Back to Site
        </Link>
        <button
          onClick={() => { onClose?.(); window.dispatchEvent(new Event(TOUR_EVENT)) }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white hover:text-white hover:bg-white/5 transition-all"
        >
          <HelpCircle className="w-4 h-4" />
          Show walkthrough
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-300 hover:text-red-300 hover:bg-red-700 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
        {user && (
          <p className="px-3 text-[11px] text-white truncate">{user.email}</p>
        )}
      </div>
    </div>
  )
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Login page doesn't need the shell, but still gets the admin manifest so the
  // Home Screen icon opens into /admin
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-300 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null // AuthProvider will redirect to login
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex">
      <AdminTour />
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0 w-64 z-30">
          <AdminSidebar />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-80 max-w-[85vw] h-full">
            <AdminSidebar mobile onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-h-[100dvh]">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-20 bg-slate-900/80 backdrop-blur-xl border-b border-white/25 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setMobileMenuOpen(true)} className="text-white hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              CR
            </div>
            <span className="font-bold text-white text-sm">Admin</span>
          </div>
          <div className="w-6" />
        </header>
        <NotificationBanner />
        <main>{children}</main>
      </div>
    </div>
  )
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider><NotificationsProvider><AdminShell>{children}</AdminShell></NotificationsProvider></ToastProvider>
    </AuthProvider>
  )
}
