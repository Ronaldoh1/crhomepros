'use client'

import Link from 'next/link'
import { Users, Briefcase, Star, FileText, ClipboardList, DollarSign, Phone, ArrowRight, AlertCircle } from 'lucide-react'

const stats = [
  { label: 'Active Leads', value: '12', change: '+3 this week', icon: Users, color: 'text-blue-600 bg-blue-100' },
  { label: 'Active Projects', value: '4', change: '2 starting soon', icon: Briefcase, color: 'text-green-600 bg-green-100' },
  { label: 'Pending Reviews', value: '3', change: 'Needs response', icon: Star, color: 'text-yellow-600 bg-yellow-100' },
  { label: 'This Month Revenue', value: '$48,500', change: '+12% vs last month', icon: DollarSign, color: 'text-primary-600 bg-primary-100' },
]

const recentLeads = [
  { id: 1, name: 'John Smith', service: 'Kitchen Remodel', date: '2 hours ago', status: 'new', phone: '(301) 555-0123' },
  { id: 2, name: 'Maria Garcia', service: 'Bathroom Renovation', date: '5 hours ago', status: 'contacted', phone: '(240) 555-0456' },
  { id: 3, name: 'Robert Johnson', service: 'Deck Installation', date: 'Yesterday', status: 'quoted', phone: '(703) 555-0789' },
  { id: 4, name: 'Sarah Williams', service: 'Basement Finishing', date: '2 days ago', status: 'new', phone: '(202) 555-0321' },
]

const activeProjects = [
  { id: 1, title: 'Kitchen Remodel - Peterson', location: 'Bethesda', progress: 75, dueDate: 'Feb 15' },
  { id: 2, title: 'Bathroom Reno - Thompson', location: 'Silver Spring', progress: 40, dueDate: 'Mar 1' },
  { id: 3, title: 'Deck Build - Martinez', location: 'Arlington', progress: 90, dueDate: 'Feb 8' },
]

const quickActions = [
  { label: 'Add New Lead', href: '/admin/leads', icon: Users },
  { label: 'Create Project', href: '/admin/projects', icon: Briefcase },
  { label: 'Create Invoice', href: '/admin/invoices', icon: DollarSign },
  { label: 'Write Blog Post', href: '/admin/blog', icon: FileText },
  { label: 'Field Notes', href: '/admin/field-notes', icon: ClipboardList },
]

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  quoted: 'bg-purple-100 text-purple-700',
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-dark-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-dark-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center text-white text-sm font-bold">CR</div>
                <span className="font-display font-bold text-dark-900">Admin</span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/admin" className="text-primary-700 font-medium">Dashboard</Link>
              <Link href="/admin/leads" className="text-dark-500 hover:text-dark-900">Leads</Link>
              <Link href="/admin/projects" className="text-dark-500 hover:text-dark-900">Projects</Link>
              <Link href="/admin/reviews" className="text-dark-500 hover:text-dark-900">Reviews</Link>
              <Link href="/admin/blog" className="text-dark-500 hover:text-dark-900">Blog</Link>
              <Link href="/admin/field-notes" className="text-dark-500 hover:text-dark-900">Field Notes</Link>
            </nav>
            <Link href="/" className="text-sm text-dark-500 hover:text-dark-900">← Back to Site</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-dark-900">Welcome back, Carlos!</h1>
          <p className="text-dark-500">Here's what's happening with your business today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 border border-dark-100">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-dark-900">{stat.value}</p>
              <p className="text-sm text-dark-500">{stat.label}</p>
              <p className="text-xs text-green-600 mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-dark-100 p-6 mb-8">
          <h2 className="font-semibold text-dark-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href} className="flex items-center gap-3 p-4 rounded-lg bg-dark-50 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                <action.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Leads */}
          <div className="bg-white rounded-xl border border-dark-100">
            <div className="flex items-center justify-between p-6 border-b border-dark-100">
              <h2 className="font-semibold text-dark-900">Recent Leads</h2>
              <Link href="/admin/leads" className="text-sm text-primary-600 hover:text-primary-800 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-dark-100">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="p-4 hover:bg-dark-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-dark-900">{lead.name}</p>
                      <p className="text-sm text-dark-500">{lead.service}</p>
                      <a href={`tel:${lead.phone}`} className="text-xs text-primary-600 flex items-center gap-1 mt-2">
                        <Phone className="w-3 h-3" /> {lead.phone}
                      </a>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[lead.status]}`}>{lead.status}</span>
                      <p className="text-xs text-dark-400 mt-1">{lead.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-white rounded-xl border border-dark-100">
            <div className="flex items-center justify-between p-6 border-b border-dark-100">
              <h2 className="font-semibold text-dark-900">Active Projects</h2>
              <Link href="/admin/projects" className="text-sm text-primary-600 hover:text-primary-800 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-dark-100">
              {activeProjects.map((project) => (
                <div key={project.id} className="p-4 hover:bg-dark-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-dark-900">{project.title}</p>
                      <p className="text-sm text-dark-500">{project.location}</p>
                    </div>
                    <span className="text-sm text-dark-500">Due: {project.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-dark-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600 rounded-full" style={{ width: `${project.progress}%` }} />
                    </div>
                    <span className="text-sm font-medium text-dark-700">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Reviews Alert */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800">3 Reviews Pending Approval</h3>
              <p className="text-yellow-700 text-sm mt-1">New reviews are waiting for your approval.</p>
            </div>
            <Link href="/admin/reviews" className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium">Review Now</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
