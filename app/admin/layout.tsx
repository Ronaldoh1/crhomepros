'use client'

import { AuthProvider, useAuth } from './_components/AuthProvider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, FileText, FilePlus, FileSignature,
  FolderOpen, LogOut, Menu, X, ChevronDown, ChevronRight,
  Receipt, ClipboardList, Briefcase, Home, Loader2, HelpCircle
} from 'lucide-react'
import { AdminTour, TOUR_EVENT } from './_components/AdminTour'

function AdminSidebar({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    invoices: true,
    changeOrders: true,
    contracts: true,
  })

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isActive = (href: string) => pathname === href

  const navLink = (href: string, icon: React.ReactNode, label: string, indent = false) => (
    <Link
      href={href}
      onClick={onClose}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${indent ? 'ml-6' : ''
        } ${isActive(href)
          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/20'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
    >
      {icon}
      {label}
    </Link>
  )

  const sectionHeader = (key: string, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => toggleSection(key)}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
    >
      <span className="flex items-center gap-3">{icon} {label}</span>
      {expandedSections[key] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
    </button>
  )

  return (
    <div className={`${mobile ? 'w-full' : 'w-64 min-h-screen'} bg-slate-900 border-r border-white/5 flex flex-col`}>
      {/* Logo / Brand */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center justify-between">
          <Link href="/admin" onClick={onClose} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
              CR
            </div>
            <div>
              <p className="font-bold text-white text-sm">Admin Portal</p>
              <p className="text-[11px] text-slate-500">CRGS, Inc.</p>
            </div>
          </Link>
          {mobile && (
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navLink('/admin', <LayoutDashboard className="w-4 h-4" />, 'Dashboard')}

        <div className="pt-3">
          {sectionHeader('invoices', <Receipt className="w-4 h-4" />, 'Invoices')}
          {expandedSections.invoices && (
            <div className="space-y-0.5 mt-0.5">
              {navLink('/admin/invoices', <FilePlus className="w-4 h-4" />, 'Generate Invoice', true)}
              {navLink('/admin/invoices/drafts', <FileText className="w-4 h-4" />, 'Drafts', true)}
              {navLink('/admin/invoices/sent', <FolderOpen className="w-4 h-4" />, 'Sent Invoices', true)}
            </div>
          )}
        </div>

        <div className="pt-1">
          {sectionHeader('changeOrders', <ClipboardList className="w-4 h-4" />, 'Change Orders')}
          {expandedSections.changeOrders && (
            <div className="space-y-0.5 mt-0.5">
              {navLink('/admin/change-orders', <FilePlus className="w-4 h-4" />, 'Generate Change Order', true)}
              {navLink('/admin/change-orders/drafts', <FileText className="w-4 h-4" />, 'Drafts', true)}
              {navLink('/admin/change-orders/sent', <FolderOpen className="w-4 h-4" />, 'Sent Change Orders', true)}
            </div>
          )}
        </div>

        <div className="pt-1">
          {sectionHeader('contracts', <Briefcase className="w-4 h-4" />, 'Contracts')}
          {expandedSections.contracts && (
            <div className="space-y-0.5 mt-0.5">
              {navLink('/admin/contracts', <FilePlus className="w-4 h-4" />, 'Generate Contract', true)}
              {navLink('/admin/contracts/drafts', <FileText className="w-4 h-4" />, 'Drafts', true)}
              {navLink('/admin/contracts/sent', <FolderOpen className="w-4 h-4" />, 'Sent Contracts', true)}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-white/5 mt-3">
          {navLink('/admin/documents', <FileSignature className="w-4 h-4" />, 'Signed Documents')}
          {navLink('/admin/leads', <FileText className="w-4 h-4" />, 'Leads')}
          {navLink('/admin/projects', <Briefcase className="w-4 h-4" />, 'Projects')}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/5 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <Home className="w-4 h-4" />
          Back to Site
        </Link>
        <button
          onClick={() => { onClose?.(); window.dispatchEvent(new Event(TOUR_EVENT)) }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:text-white hover:bg-white/5 transition-all"
        >
          <HelpCircle className="w-4 h-4" />
          Show walkthrough
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
        {user && (
          <p className="px-3 text-[11px] text-slate-600 truncate">{user.email}</p>
        )}
      </div>
    </div>
  )
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Login page doesn't need the shell
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null // AuthProvider will redirect to login
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
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
      <div className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-20 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setMobileMenuOpen(true)} className="text-slate-400 hover:text-white">
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
        <main>{children}</main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  )
}
