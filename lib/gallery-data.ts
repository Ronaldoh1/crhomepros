// All project images organized by category
// Images stored locally in /public/images/

const BASE_01 = '/images/2024-01'
const BASE_06 = '/images/2024-06'
const BASE_2025_05 = '/images/2025-05'
const BASE_FENCE_BOWIE = '/images/2025-fence-bowie'
const BASE_BASEMENT_GREENBELT = '/images/2025-basement-greenbelt'

export interface GalleryProject {
  id: string
  title: string
  category: string
  description?: string
  images: string[]
  beforeImages?: string[]
  featured?: boolean
  completedDate?: string
}

export const GALLERY_PROJECTS: GalleryProject[] = [
  // ===== KITCHEN PROJECTS =====
  {
    id: 'kitchen-full-renovation',
    title: 'Full Kitchen Renovation',
    category: 'Kitchen',
    description: 'Complete kitchen transformation in Silver Spring — New custom cabinets, quartz countertops, stainless steel appliances, and modern lighting.',
    featured: true,
    images: [
      `${BASE_01}/img_3700-1024x746.JPEG`,
      `${BASE_01}/img_3701-1-1024x748.JPEG`,
      `${BASE_01}/img_3702-780x1024.JPEG`,
    ],
  },
  {
    id: 'kitchen-renovation-2',
    title: 'Kitchen Renovation',
    category: 'Kitchen',
    description: 'Modern kitchen update in Hyattsville — Updated cabinets, new backsplash, and improved functionality.',
    images: [
      `${BASE_01}/img_1607-1024x614.JPEG`,
      `${BASE_01}/img_1608-1024x614.JPEG`,
      `${BASE_01}/img_1609-1024x614.JPEG`,
      `${BASE_01}/img_1611-1024x614.JPEG`,
    ],
  },
  {
    id: 'kitchen-tiling',
    description: 'Custom tile work and flooring installation — Gorgeous backsplash and durable, stylish flooring.',
    title: 'Kitchen Tiling Renovation',
    category: 'Kitchen',
    images: [
      `${BASE_01}/img_2016-768x1024.JPEG`,
      `${BASE_01}/img_2017-768x1024.JPEG`,
      `${BASE_01}/img_2018-768x1024.JPEG`,
      `${BASE_01}/img_2020-768x1024.JPEG`,
      `${BASE_01}/img_2021-768x1024.JPEG`,
      `${BASE_01}/img_2022-768x1024.JPEG`,
      `${BASE_01}/img_2023-1024x768.JPEG`,
    ],
  },
  {
    id: 'kitchen-pg-county',
    title: 'Kitchen Remodel — Prince George\'s County',
    category: 'Kitchen',
    description: 'Full kitchen renovation in PG County, MD — Dark espresso shaker cabinets with brushed nickel hardware, calacatta quartz countertops, subway tile backsplash, wood-look porcelain tile flooring, and stainless steel appliances. Part of a whole-home remodel including roof replacement, all handled through insurance.',
    featured: true,
    images: [
      `${BASE_2025_05}/kitchen-pg-county-01.png`,
    ],
  },

  // ===== BATHROOM PROJECTS =====
  {
    id: 'bathroom-1',
    description: 'Spa-like bathroom renovation in College Park — Walk-in shower, new vanity, elegant tile work, and modern fixtures.',
    title: 'Modern Bathroom Remodel',
    category: 'Bathroom',
    featured: true,
    images: [
      `${BASE_06}/img_3497-1-768x1024.JPEG`,
      `${BASE_06}/img_3464-1-768x1024.JPEG`,
      `${BASE_06}/img_2733-1-1024x768.JPEG`,
      `${BASE_06}/img_2732-1-768x1024.JPEG`,
      `${BASE_06}/img_2728-1-1024x768.JPEG`,
      `${BASE_06}/img_2719-1-768x1024.JPEG`,
    ],
  },
  {
    id: 'bathroom-2',
    description: 'Full bathroom transformation — New tub/shower combo, custom vanity, premium tile work, and updated plumbing.',
    title: 'Complete Bathroom Renovation',
    category: 'Bathroom',
    images: [
      `${BASE_01}/img_0416-768x1024.JPEG`,
      `${BASE_01}/img_0423-768x1024.JPEG`,
      `${BASE_01}/img_0491-768x1024.JPEG`,
      `${BASE_01}/img_0496-1024x768.JPEG`,
      `${BASE_01}/img_0497-768x1024.JPEG`,
      `${BASE_01}/img_0498-768x1024.JPEG`,
      `${BASE_01}/img_0500-768x1024.JPEG`,
      `${BASE_01}/img_0501-1024x768.JPEG`,
    ],
  },
  {
    id: 'bathroom-walk-in-shower',
    title: 'Walk-In Shower Remodel — Marble Tile',
    category: 'Bathroom',
    description: 'Custom walk-in shower build with calacatta marble-look porcelain tile, gray glass accent stripe, pebble mosaic shower floor, corner marble shelf, chrome handheld showerhead with slide bar, grab bar for accessibility, and precision tile work throughout. Clean, modern, spa-quality finish.',
    featured: true,
    images: [
      `${BASE_2025_05}/bathroom-tile-02.png`,
      `${BASE_2025_05}/bathroom-tile-03.png`,
      `${BASE_2025_05}/bathroom-tile-01.png`,
    ],
  },

  // ===== COMPLETE RENOVATION PROJECTS =====
  {
    id: 'renovation-1',
    description: 'Full home renovation in Takoma Park — Kitchen, bathrooms, flooring, paint, lighting, and structural improvements throughout.',
    title: 'Whole Home Transformation',
    category: 'Complete Renovation',
    featured: true,
    images: [
      `${BASE_01}/img_1551-1024x768.JPEG`,
      `${BASE_01}/img_1550-1024x768.JPEG`,
      `${BASE_01}/img_1548-1024x768.JPEG`,
      `${BASE_01}/img_1548-2-1024x768.JPEG`,
      `${BASE_01}/img_1546-1024x768.JPEG`,
      `${BASE_01}/img_1545-768x1024.JPEG`,
      `${BASE_01}/img_1537-768x1024.JPEG`,
      `${BASE_01}/img_1532-768x1024.JPEG`,
      `${BASE_01}/img_1531-1024x768.JPEG`,
      `${BASE_01}/img_1530-1024x768.JPEG`,
      `${BASE_01}/img_1509-1024x768.JPEG`,
      `${BASE_01}/img_1508-768x1024.JPEG`,
      `${BASE_01}/img_1507-1024x768.JPEG`,
      `${BASE_01}/img_1506-768x1024.JPEG`,
      `${BASE_01}/img_1423-1024x768.JPEG`,
    ],
  },
  {
    id: 'renovation-2',
    description: 'Complete property makeover — Multiple rooms renovated, new finishes, updated systems, and modernized living spaces.',
    title: 'Full Property Renovation',
    category: 'Complete Renovation',
    images: [
      `${BASE_01}/img_0580-1024x768.JPEG`,
      `${BASE_01}/img_0591-1024x768.JPEG`,
      `${BASE_01}/img_0596-1024x768.JPEG`,
      `${BASE_01}/img_0597-1024x768.JPEG`,
      `${BASE_01}/img_0623-1024x768.JPEG`,
      `${BASE_01}/img_0624-1024x768.JPEG`,
      `${BASE_01}/img_0709-1024x768.JPEG`,
      `${BASE_01}/img_0710-1024x768.JPEG`,
      `${BASE_01}/img_0712-1024x768.JPEG`,
    ],
  },

  // ===== CONCRETE & DRIVEWAY PROJECTS =====
  {
    id: 'driveway-projects',
    description: 'Professional concrete driveway installation — Durable, properly graded, and finished to perfection.',
    title: 'Driveway Installation',
    category: 'Concrete',
    featured: true,
    images: [
      `${BASE_06}/img_3167-1-765x1024.JPEG`,
      `${BASE_06}/img_3276-1-1024x765.JPEG`,
      `${BASE_01}/img_1338-768x1024.JPEG`,
      `${BASE_01}/img_1337-768x1024.JPEG`,
      `${BASE_01}/img_1335-768x1024.JPEG`,
    ],
  },
  {
    id: 'concrete-walls',
    description: 'Structural retaining wall construction — Engineered for stability and built to last.',
    title: 'Concrete Retaining Walls',
    category: 'Concrete',
    images: [
      `${BASE_01}/img_0050-768x1024.JPEG`,
      `${BASE_01}/img_0046-768x1024.JPEG`,
      `${BASE_01}/img_0028-768x1024.JPEG`,
    ],
  },

  // ===== FLAT ROOFING PROJECTS =====
  {
    id: 'roof-replacement-clarksburg',
    title: 'Full Roof Replacement — Clarksburg, MD',
    category: 'Roofing',
    description: 'Complete tear-off and roof replacement on a two-story colonial in Clarksburg, MD — Stripped old shingles down to bare decking, inspected and repaired sheathing, installed synthetic underlayment with ice & water shield at valleys and eaves, then finished with premium architectural shingles and new ridge vents. Clean, professional install completed March 2022.',
    featured: true,
    images: [
      `${BASE_2025_05}/roof-md-05-house.png`,
      `${BASE_2025_05}/roof-md-01-decking.png`,
      `${BASE_2025_05}/roof-md-02-underlayment.png`,
      `${BASE_2025_05}/roof-md-03-shingles.png`,
      `${BASE_2025_05}/roof-md-04-finished.png`,
    ],
  },
  {
    id: 'flat-roof-install',
    description: 'Professional flat roof replacement — rubber roofing for superior waterproofing and longevity.',
    title: 'Flat Roof Installation',
    category: 'Roofing',
    images: [
      `${BASE_01}/img_0806.JPEG`,
      `${BASE_01}/img_0867-576x1024.PNG`,
      `${BASE_01}/img_0815-576x1024.PNG`,
      `${BASE_01}/img_0862-1024x768.JPEG`,
    ],
  },
  {
    id: 'roof-replacement-pg-county',
    title: 'Full Shingle Roof Replacement — Insurance Claim',
    category: 'Roofing',
    description: 'Complete roof tear-off and replacement on a two-story single-family home in Prince George\'s County, MD. Old shingles stripped to decking, underlayment inspected and replaced, new architectural shingles installed with ridge vents, flashing, and drip edge. Handled as an insurance claim after storm damage.',
    featured: true,
    images: [
      `${BASE_2025_05}/roofing-md-01.png`,
      `${BASE_2025_05}/roofing-md-02.png`,
    ],
  },
  {
    id: 'roof-replacement-clarksburg-colonial',
    title: 'Complete Roof Replacement',
    category: 'Roofing',
    description: 'Full shingle roof tear-off and replacement in Clarksburg, MD — Stripped old shingles down to bare deck, inspected and repaired sheathing, installed synthetic underlayment with ice and water shield at valleys and edges, then laid new architectural shingles with proper ridge ventilation. Clean finished roofline on a two-story colonial. Completed March 2022.',
    featured: true,
    images: [
      `${BASE_2025_05}/roof-md-05-house.png`,
      `${BASE_2025_05}/roof-md-01-tearoff.png`,
      `${BASE_2025_05}/roof-md-02-underlayment.png`,
      `${BASE_2025_05}/roof-md-03-shingles.png`,
      `${BASE_2025_05}/roof-md-04-finished.png`,
    ],
  },

  // ===== DECK PROJECTS =====
  {
    id: 'deck-1',
    description: 'Beautiful custom deck construction — Quality materials, expert craftsmanship, perfect for outdoor entertaining.',
    title: 'Custom Deck Build',
    category: 'Deck',
    featured: true,
    images: [
      `${BASE_06}/img_2379-1024x768.JPEG`,
      `${BASE_06}/img_2380-768x1024.JPEG`,
      `${BASE_06}/img_2386-1024x768.JPEG`,
      `${BASE_06}/img_2387-768x1024.JPEG`,
    ],
  },
  {
    id: 'deck-2',
    description: 'Deck restoration and professional staining — Revitalized outdoor space with weather-resistant finish.',
    title: 'Deck Renovation & Staining',
    category: 'Deck',
    images: [
      `${BASE_01}/img_0941-768x1024.JPEG`,
      `${BASE_01}/img_0942-768x1024.JPEG`,
      `${BASE_01}/img_0947-768x1024.JPEG`,
      `${BASE_01}/img_0948-768x1024.JPEG`,
      `${BASE_01}/img_0949-768x1024.JPEG`,
      `${BASE_01}/img_0950-768x1024.JPEG`,
      `${BASE_01}/img_1095-768x1024.JPEG`,
    ],
  },
  {
    id: 'deck-composite-bowie',
    title: 'Composite Deck Build — Insurance Claim',
    category: 'Deck',
    description: 'Full composite deck replacement in Bowie, MD — Handled through homeowner\'s insurance claim. Installed premium gray composite decking with white vinyl posts, black aluminum balusters, and custom-built stairs. Fascia wrapped in protective flashing for long-term durability. Covered under insurance after storm damage to the original structure.',
    featured: true,
    images: [
      `${BASE_2025_05}/deck-pg-county-01.png`,
      `${BASE_2025_05}/deck-pg-county-02.png`,
      `${BASE_2025_05}/deck-pg-county-03.png`,
    ],
  },
  {
    id: 'deck-staining-va',
    title: 'Elevated Deck Staining — Virginia',
    category: 'Deck',
    description: 'Complete deck restoration and staining in Northern Virginia — Elevated second-story deck stripped, sanded, and finished with a rich hunter green solid stain. Stairs, railings, balusters, and support posts all coated for uniform weather protection. Brick patio underneath preserved. Before and after transformation.',
    featured: true,
    beforeImages: [
      `${BASE_2025_05}/deck-va-before-01.png`,
    ],
    images: [
      `${BASE_2025_05}/deck-va-after-01.png`,
    ],
  },

  // ===== PAINTING PROJECTS =====
  {
    id: 'exterior-painting-dc',
    title: 'Exterior Painting — Historic Rowhouse',
    category: 'Painting',
    description: 'Full exterior repaint of a four-story historic rowhouse in Washington, D.C. — Thorough power washing, scraping, priming, and two coats of premium exterior paint. Trim, cornices, window frames, and entryway detailed by hand to preserve the building\'s classic architectural character.',
    completedDate: 'May 2025',
    featured: true,
    images: [
      `${BASE_2025_05}/exterior-painting-dc-01.png`,
    ],
  },
  {
    id: 'basement-painting-md',
    title: 'Basement Finish & Paint',
    category: 'Painting',
    description: 'Complete basement renovation and painting in Laurel, MD — Took a raw, unfinished space with exposed joists and concrete floors and transformed it into a fully finished living area. Drywall installed throughout, recessed lighting added, tile flooring laid, and walls finished in a clean blue-gray palette with a bold accent wall. Includes a dedicated laundry nook with fresh trim and built-in storage.',
    completedDate: 'October 2024',
    featured: true,
    beforeImages: [
      `${BASE_2025_05}/basement-md-before-01.png`,
      `${BASE_2025_05}/basement-md-before-02.png`,
      `${BASE_2025_05}/basement-md-during-01.png`,
    ],
    images: [
      `${BASE_2025_05}/basement-md-after-01.png`,
      `${BASE_2025_05}/basement-md-after-02.png`,
      `${BASE_2025_05}/basement-md-after-03.png`,
      `${BASE_2025_05}/basement-md-after-04.png`,
    ],
  },
  {
    id: 'renovation-painting-va',
    title: 'Interior Renovation & Paint — Virginia',
    category: 'Complete Renovation',
    description: 'Full interior renovation in Northern Virginia — New luxury vinyl plank flooring throughout, fresh drywall, recessed lighting, and a custom lavender paint finish. Open-concept living space transformed with new electrical, trim work, and a clean modern palette. Space prepped for move-in ready condition.',
    featured: true,
    images: [
      `${BASE_2025_05}/renovation-va-01.png`,
      `${BASE_2025_05}/renovation-va-02.png`,
    ],
  },

  // ===== FENCING PROJECTS =====
  {
    id: 'fence-vinyl-bowie',
    title: 'Vinyl Privacy Fence Installation',
    category: 'Fencing',
    description: 'Complete fence replacement in Bowie, MD — Removed deteriorating wooden privacy fence and installed new white vinyl privacy fencing with decorative lattice top accents and matching gate. Clean, maintenance-free solution that transformed the backyard.',
    featured: true,
    completedDate: 'January 2025',
    beforeImages: [
      `${BASE_FENCE_BOWIE}/fence-before-01.png`,
    ],
    images: [
      `${BASE_FENCE_BOWIE}/fence-after-01.png`,
      `${BASE_FENCE_BOWIE}/fence-after-02.png`,
      `${BASE_FENCE_BOWIE}/fence-after-03.png`,
      `${BASE_FENCE_BOWIE}/fence-after-04.png`,
    ],
  },

  // ===== BASEMENT PROJECTS =====
  {
    id: 'basement-remodel-greenbelt',
    title: 'Basement Remodel — Flooring & Painting',
    category: 'Basement',
    description: 'Full basement remodel in Greenbelt, MD — Installed beautiful wood-look porcelain tile flooring throughout, fresh lavender accent walls, recessed LED lighting, and clean white ceiling and trim. Transformed a dated basement into a bright, modern living space.',
    featured: true,
    completedDate: 'January 2025',
    beforeImages: [
      `${BASE_BASEMENT_GREENBELT}/basement-before-01.png`,
    ],
    images: [
      `${BASE_BASEMENT_GREENBELT}/basement-after-01.png`,
      `${BASE_BASEMENT_GREENBELT}/basement-after-02.png`,
    ],
  },
]

export const GALLERY_CATEGORIES = [
  'All',
  'Kitchen',
  'Bathroom',
  'Basement',
  'Complete Renovation',
  'Fencing',
  'Concrete',
  'Roofing',
  'Deck',
  'Painting',
] as const

export type GalleryCategory = typeof GALLERY_CATEGORIES[number]

// Helper function to get all images for a category
export function getImagesByCategory(category: GalleryCategory): GalleryProject[] {
  if (category === 'All') return GALLERY_PROJECTS
  return GALLERY_PROJECTS.filter(p => p.category === category)
}

// Helper function to get featured projects
export function getFeaturedProjects(): GalleryProject[] {
  return GALLERY_PROJECTS.filter(p => p.featured)
}

// Get total image count
export function getTotalImageCount(): number {
  return GALLERY_PROJECTS.reduce((acc, p) => acc + p.images.length, 0)
}
