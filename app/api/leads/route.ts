import { NextRequest, NextResponse } from 'next/server'

// Lead sources configuration — direct contact only, no bidding platforms
const SOURCES = {
  craigslist: {
    name: 'Craigslist',
    baseUrl: 'https://washingtondc.craigslist.org',
    searchPaths: ['/search/sss?query=contractor', '/search/sss?query=remodel', '/search/sss?query=renovation'],
    enabled: true,
  },
  nextdoor: {
    name: 'NextDoor',
    baseUrl: 'https://nextdoor.com',
    enabled: true,
  },
  website: {
    name: 'CR Home Pros Website',
    baseUrl: 'https://crhomepros.com',
    enabled: true,
  },
}

// Keywords to search for
const SEARCH_KEYWORDS = [
  'kitchen remodel',
  'bathroom renovation',
  'basement finishing',
  'deck repair',
  'deck building',
  'roofing',
  'roof replacement',
  'painting contractor',
  'home renovation',
  'general contractor',
  'tile work',
  'flooring installation',
  'drywall repair',
  'handyman',
]

// Service area ZIP codes (DMV area)
const SERVICE_AREA_ZIPS = [
  '20814', '20815', '20816', // Bethesda
  '20901', '20902', '20903', // Silver Spring
  '20850', '20851', '20852', // Rockville
  '22201', '22202', '22203', // Arlington
  '20001', '20002', '20003', // DC
  '20740', '20742', // College Park
  '20781', '20782', '20783', '20784', // Hyattsville
]

interface Lead {
  id: string
  title: string
  description: string
  source: string
  sourceUrl: string
  location: string
  postedAt: string
  budgetRange?: string
  category: string
  contactMethod: string
  raw?: any
}

// Mock scraper functions - these would be replaced with actual scrapers
async function scrapeCraigslist(): Promise<Lead[]> {
  // In production, this would use cheerio/puppeteer to scrape Craigslist
  // For now, return mock data
  return [
    {
      id: 'cl-' + Date.now(),
      title: 'Looking for kitchen remodel contractor',
      description: 'Need full kitchen renovation including cabinets, countertops, backsplash.',
      source: 'craigslist',
      sourceUrl: 'https://washingtondc.craigslist.org/nva/hss/d/kitchen-remodel/123456.html',
      location: 'Bethesda, MD',
      postedAt: new Date().toISOString(),
      category: 'Kitchen',
      contactMethod: 'email',
    },
  ]
}

async function scrapeNextDoor(): Promise<Lead[]> {
  // NextDoor has business features
  return []
}

// Main scraper orchestrator
async function fetchAllLeads(): Promise<Lead[]> {
  const allLeads: Lead[] = []

  try {
    // Run all scrapers in parallel — direct contact sources only
    const [craigslistLeads, nextdoorLeads] = await Promise.all([
      scrapeCraigslist().catch(() => []),
      scrapeNextDoor().catch(() => []),
    ])

    allLeads.push(...craigslistLeads, ...nextdoorLeads)
  } catch (error) {
    console.error('Error fetching leads:', error)
  }

  // Sort by most recent
  return allLeads.sort((a, b) => 
    new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  )
}

// Filter leads by service area
function filterByServiceArea(leads: Lead[]): Lead[] {
  // In production, would geocode and filter by distance
  return leads
}

// Categorize leads by type
function categorizeLeads(leads: Lead[]): Lead[] {
  const categoryKeywords: Record<string, string[]> = {
    Kitchen: ['kitchen', 'cabinet', 'countertop', 'backsplash'],
    Bathroom: ['bathroom', 'bath', 'shower', 'toilet', 'vanity'],
    Basement: ['basement', 'finish basement', 'unfinished'],
    Deck: ['deck', 'patio', 'outdoor'],
    Roofing: ['roof', 'shingle', 'gutter'],
    Painting: ['paint', 'painting', 'interior paint', 'exterior paint'],
    Flooring: ['floor', 'flooring', 'hardwood', 'tile', 'carpet'],
    General: ['renovation', 'remodel', 'contractor', 'handyman'],
  }

  return leads.map((lead) => {
    const text = `${lead.title} ${lead.description}`.toLowerCase()
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((kw) => text.includes(kw))) {
        return { ...lead, category }
      }
    }
    
    return { ...lead, category: 'General' }
  })
}

// Score leads by relevance/quality
function scoreLeads(leads: Lead[]): (Lead & { score: number })[] {
  return leads.map((lead) => {
    let score = 50 // Base score

    // Boost for budget mentioned
    if (lead.budgetRange) score += 20
    
    // Boost for being recent
    const hoursAgo = (Date.now() - new Date(lead.postedAt).getTime()) / (1000 * 60 * 60)
    if (hoursAgo < 6) score += 30
    else if (hoursAgo < 24) score += 15
    
    // Boost for certain high-value categories
    if (['Kitchen', 'Bathroom', 'Basement'].includes(lead.category)) score += 10

    return { ...lead, score }
  }).sort((a, b) => b.score - a.score)
}

// GET handler - fetch leads
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const source = searchParams.get('source') || 'all'
    const category = searchParams.get('category') || 'all'
    const refresh = searchParams.get('refresh') === 'true'

    let leads = await fetchAllLeads()
    
    // Filter by source
    if (source !== 'all') {
      leads = leads.filter((l) => l.source === source)
    }

    // Filter by category
    if (category !== 'all') {
      leads = leads.filter((l) => l.category === category)
    }

    // Categorize and score
    leads = categorizeLeads(leads)
    const scoredLeads = scoreLeads(leads)

    return NextResponse.json({
      success: true,
      count: scoredLeads.length,
      leads: scoredLeads,
      sources: SOURCES,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in leads API:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

// POST handler - mark lead status, save notes, etc.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { leadId, action, data } = body

    switch (action) {
      case 'update_status':
        // Update lead status in database
        return NextResponse.json({ success: true, message: 'Status updated' })
      
      case 'save_lead':
        // Save lead to favorites
        return NextResponse.json({ success: true, message: 'Lead saved' })
      
      case 'dismiss_lead':
        // Mark lead as dismissed
        return NextResponse.json({ success: true, message: 'Lead dismissed' })
      
      case 'send_response':
        // Queue response to be sent
        return NextResponse.json({ success: true, message: 'Response queued' })
      
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in leads POST:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
