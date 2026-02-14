'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Target, 
  Filter, 
  RefreshCw, 
  MapPin, 
  Clock, 
  DollarSign,
  ExternalLink,
  Send,
  Star,
  StarOff,
  CheckCircle,
  XCircle,
  ChevronDown,
  Search,
  Zap,
  ArrowLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock lead data - this would come from scraping API
const mockLeads = [
  {
    id: 1,
    title: 'Looking for kitchen remodel contractor',
    description: 'Need full kitchen renovation including cabinets, countertops, backsplash, and new appliances. Budget around $30-40k. Looking to start in February.',
    source: 'craigslist',
    sourceUrl: 'https://washingtondc.craigslist.org/...',
    location: 'Bethesda, MD',
    distance: '8 miles',
    postedAt: '2 hours ago',
    budgetRange: '$30k - $40k',
    category: 'Kitchen',
    status: 'new',
    hot: true,
    contactMethod: 'email',
  },
  {
    id: 2,
    title: 'Bathroom renovation needed ASAP',
    description: 'Master bathroom needs complete overhaul. Shower leak causing water damage. Need someone who can start within 2 weeks. Please provide references.',
    source: 'craigslist',
    sourceUrl: 'https://washingtondc.craigslist.org/...',
    location: 'Silver Spring, MD',
    distance: '5 miles',
    postedAt: '3 hours ago',
    budgetRange: '$15k - $25k',
    category: 'Bathroom',
    status: 'new',
    hot: true,
    contactMethod: 'phone',
  },
  {
    id: 3,
    title: 'Deck repair or replacement',
    description: 'Existing deck is about 15 years old with some rotted boards. Need assessment on whether to repair or fully replace. Approximately 400 sq ft.',
    source: 'nextdoor',
    sourceUrl: 'https://nextdoor.com/...',
    location: 'Arlington, VA',
    distance: '12 miles',
    postedAt: '5 hours ago',
    budgetRange: '$5k - $15k',
    category: 'Deck',
    status: 'new',
    hot: false,
    contactMethod: 'message',
  },
  {
    id: 4,
    title: 'Basement finishing project',
    description: 'Unfinished basement, approximately 800 sq ft. Want to add a bedroom, bathroom, and living area. Need full permits and inspections.',
    source: 'website',
    sourceUrl: '/admin/leads',
    location: 'Rockville, MD',
    distance: '10 miles',
    postedAt: '6 hours ago',
    budgetRange: '$40k - $60k',
    category: 'Basement',
    status: 'new',
    hot: true,
    contactMethod: 'email',
  },
  {
    id: 5,
    title: 'Interior painting - whole house',
    description: '4 bedroom colonial, approximately 2800 sq ft. All rooms need painting including trim and ceilings. We will provide paint colors.',
    source: 'craigslist',
    sourceUrl: 'https://washingtondc.craigslist.org/...',
    location: 'Potomac, MD',
    distance: '15 miles',
    postedAt: '8 hours ago',
    budgetRange: '$5k - $8k',
    category: 'Painting',
    status: 'new',
    hot: false,
    contactMethod: 'email',
  },
  {
    id: 6,
    title: 'Roof replacement needed',
    description: 'Shingle roof on single family home, approximately 2000 sq ft. Multiple leaks after last storm. Insurance claim filed. Need estimate ASAP.',
    source: 'nextdoor',
    sourceUrl: 'https://nextdoor.com/...',
    location: 'College Park, MD',
    distance: '7 miles',
    postedAt: '1 day ago',
    budgetRange: '$10k - $18k',
    category: 'Roofing',
    status: 'contacted',
    hot: true,
    contactMethod: 'phone',
  },
]

const sources = [
  { id: 'all', name: 'All Sources', count: 15 },
  { id: 'website', name: 'CR Home Pros Website', count: 4 },
  { id: 'craigslist', name: 'Craigslist', count: 8 },
  { id: 'nextdoor', name: 'NextDoor', count: 3 },
]

const categories = ['All', 'Kitchen', 'Bathroom', 'Basement', 'Deck', 'Roofing', 'Painting', 'Flooring']

const statusOptions = [
  { id: 'new', label: 'New', color: 'bg-blue-100 text-blue-700' },
  { id: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'quoted', label: 'Quoted', color: 'bg-purple-100 text-purple-700' },
  { id: 'won', label: 'Won', color: 'bg-green-100 text-green-700' },
  { id: 'lost', label: 'Lost', color: 'bg-red-100 text-red-700' },
]

export default function LeadHunterPage() {
  const [selectedSource, setSelectedSource] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [leads, setLeads] = useState(mockLeads)
  const [selectedLead, setSelectedLead] = useState<typeof mockLeads[0] | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredLeads = leads.filter((lead) => {
    if (selectedSource !== 'all' && lead.source !== selectedSource) return false
    if (selectedCategory !== 'All' && lead.category !== selectedCategory) return false
    if (searchQuery && !lead.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 2000))
    setIsRefreshing(false)
  }

  const handleStatusChange = (leadId: number, newStatus: string) => {
    setLeads(leads.map((l) => l.id === leadId ? { ...l, status: newStatus } : l))
  }

  const getSourceLogo = (source: string) => {
    const logos: Record<string, string> = {
      website: '🌐',
      craigslist: '📋',
      nextdoor: '🏘️',
    }
    return logos[source] || '📄'
  }

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Header */}
      <header className="bg-white border-b border-dark-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 hover:bg-dark-50 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-display font-bold text-dark-900 flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary-600" />
                  Lead Hunter
                </h1>
                <p className="text-sm text-dark-500">Find and respond to job opportunities</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn-primary"
            >
              <RefreshCw className={cn('w-5 h-5', isRefreshing && 'animate-spin')} />
              {isRefreshing ? 'Scanning...' : 'Refresh Leads'}
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-50 rounded-lg border border-dark-100 focus:border-primary-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={cn('w-4 h-4 transition-transform', showFilters && 'rotate-180')} />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-dark-50 rounded-xl">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-dark-700 mb-2 block">Source</label>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((source) => (
                      <button
                        key={source.id}
                        onClick={() => setSelectedSource(source.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                          selectedSource === source.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-dark-600 hover:bg-dark-100'
                        )}
                      >
                        {source.name} ({source.count})
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-700 mb-2 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                          selectedCategory === cat
                            ? 'bg-gold-500 text-dark-900'
                            : 'bg-white text-dark-600 hover:bg-dark-100'
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lead List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-dark-500">
                <span className="font-semibold text-dark-900">{filteredLeads.length}</span> leads found
              </p>
              <div className="flex items-center gap-2 text-sm text-dark-500">
                <Zap className="w-4 h-4 text-gold-500" />
                Last updated: 2 mins ago
              </div>
            </div>

            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={cn(
                  'bg-white rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md',
                  selectedLead?.id === lead.id
                    ? 'border-primary-500 shadow-md'
                    : 'border-dark-100'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getSourceLogo(lead.source)}</span>
                    <div>
                      <h3 className="font-semibold text-dark-900 flex items-center gap-2">
                        {lead.title}
                        {lead.hot && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full animate-pulse">
                            🔥 HOT
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-dark-500">{lead.source.replace('_', ' ')} • {lead.postedAt}</p>
                    </div>
                  </div>
                  <span className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    statusOptions.find((s) => s.id === lead.status)?.color
                  )}>
                    {statusOptions.find((s) => s.id === lead.status)?.label}
                  </span>
                </div>

                <p className="text-dark-600 text-sm mb-4 line-clamp-2">{lead.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-dark-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {lead.location} ({lead.distance})
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {lead.budgetRange}
                  </span>
                  <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs font-medium">
                    {lead.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Lead Detail Panel */}
          <div className="lg:col-span-1">
            {selectedLead ? (
              <div className="bg-white rounded-xl border border-dark-100 p-6 sticky top-32">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{getSourceLogo(selectedLead.source)}</span>
                  <a
                    href={selectedLead.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm"
                  >
                    View Original
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <h2 className="text-xl font-display font-bold text-dark-900 mb-2">
                  {selectedLead.title}
                </h2>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="flex items-center gap-1 text-sm text-dark-500">
                    <MapPin className="w-4 h-4" />
                    {selectedLead.location}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-dark-500">
                    <Clock className="w-4 h-4" />
                    {selectedLead.postedAt}
                  </span>
                </div>

                <div className="bg-dark-50 rounded-lg p-4 mb-6">
                  <p className="text-dark-700 text-sm leading-relaxed">
                    {selectedLead.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-600 mb-1">Budget Range</p>
                    <p className="font-bold text-green-700">{selectedLead.budgetRange}</p>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-3">
                    <p className="text-xs text-primary-600 mb-1">Category</p>
                    <p className="font-bold text-primary-700">{selectedLead.category}</p>
                  </div>
                </div>

                {/* Status Update */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-dark-700 mb-2 block">Update Status</label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status.id}
                        onClick={() => handleStatusChange(selectedLead.id, status.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                          selectedLead.status === status.id
                            ? status.color
                            : 'bg-dark-100 text-dark-500 hover:bg-dark-200'
                        )}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button className="btn-gold w-full">
                    <Send className="w-5 h-5" />
                    Send Quote / Respond
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="btn-outline btn-sm">
                      <Star className="w-4 h-4" />
                      Save
                    </button>
                    <button className="btn-outline btn-sm text-red-600 border-red-200 hover:bg-red-50">
                      <XCircle className="w-4 h-4" />
                      Dismiss
                    </button>
                  </div>
                </div>

                {/* Quick Response Templates */}
                <div className="mt-6 pt-6 border-t border-dark-100">
                  <p className="text-sm font-medium text-dark-700 mb-3">Quick Response Templates</p>
                  <div className="space-y-2">
                    <button className="w-full text-left p-3 bg-dark-50 rounded-lg text-sm text-dark-600 hover:bg-dark-100 transition-colors">
                      📧 Standard Introduction
                    </button>
                    <button className="w-full text-left p-3 bg-dark-50 rounded-lg text-sm text-dark-600 hover:bg-dark-100 transition-colors">
                      📞 Request Phone Call
                    </button>
                    <button className="w-full text-left p-3 bg-dark-50 rounded-lg text-sm text-dark-600 hover:bg-dark-100 transition-colors">
                      📅 Schedule Site Visit
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dark-100 p-8 text-center">
                <Target className="w-12 h-12 text-dark-300 mx-auto mb-4" />
                <h3 className="font-semibold text-dark-900 mb-2">Select a Lead</h3>
                <p className="text-dark-500 text-sm">
                  Click on a lead to see details and respond
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
