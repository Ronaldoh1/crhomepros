// ============================================
// Site images: the ONE place to swap photos
// ============================================
// Every homepage/header image is read from here.
// Today these are TEMPORARY placeholder photos (stock / AI renders)
// so the redesign can be reviewed. When Carlos's real photos arrive:
//   1. Upload them (Firebase Storage or /public/images/...)
//   2. Replace `src` (and `alt`) below
//   3. Set `placeholder: false`
// Nothing else in the code needs to change.

export type SiteImage = {
  src: string
  alt: string
  /** true = temporary stock image, must be replaced with a real job photo */
  placeholder: boolean
}

const local = (file: string) => `/images/placeholder/${file}`
const unsplash = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=75&auto=format&fit=crop`

export const LOGO = {
  // Horizontal crop of the CR Home Pros logo, for dark backgrounds
  wordmark: '/images/brand/logo-wordmark.png',
}

const real = (file: string) => `/images/${file}`

export const HERO_IMAGE: SiteImage = {
  src: real('recent-projects/addition-leesburg-va/after-family-room-wide.jpg'),
  alt: 'Finished family room in a house extension in Leesburg, VA, with plank tile floor and new windows',
  placeholder: false,
}

/** Keyed by SERVICES[].id in lib/constants.ts */
export const SERVICE_IMAGES: Record<string, SiteImage> = {
  'kitchen-remodeling': {
    src: unsplash('photo-1556909114-f6e7ad7d3136'),
    alt: 'Modern remodeled kitchen',
    placeholder: true,
  },
  'bathroom-renovation': {
    src: unsplash('photo-1552321554-5fefe8c9ef14'),
    alt: 'Renovated bathroom with tile shower',
    placeholder: true,
  },
  'basement-finishing': {
    src: real('recent-projects/basement-finish-porcelain/after-staircase-wide.jpg'),
    alt: 'Finished basement with porcelain tile floor and white staircase',
    placeholder: false,
  },
  roofing: { src: local('home-exterior.png'), alt: 'House exterior with new roof', placeholder: true },
  'concrete-driveways': { src: local('concrete-work.png'), alt: 'Crew pouring a concrete driveway', placeholder: true },
  painting: { src: local('painting.png'), alt: 'Interior room prepared for painting', placeholder: true },
  'deck-outdoor': {
    src: real('recent-projects/deck-alexandria-va/after-deck-stairs-railing-wide.jpg'),
    alt: 'Finished deck in Alexandria, VA with white railings and black balusters',
    placeholder: false,
  },
}

export type ProjectCard = {
  slug: string
  title: string
  titleEs: string
  category: string
  categoryEs: string
  location: string
  summary: string
  summaryEs: string
  image: SiteImage
}

/** Featured projects on the homepage. Replace with real jobs + photos. */
export const FEATURED_PROJECTS: ProjectCard[] = [
  {
    slug: 'addition-leesburg-va',
    title: 'House Extension',
    titleEs: 'Ampliación de Casa',
    category: 'Additions',
    categoryEs: 'Ampliaciones',
    location: 'Leesburg, VA',
    summary: 'A new family room built onto the home, with wood-look plank tile, recessed lighting and a new bank of windows.',
    summaryEs: 'Una nueva sala familiar construida en la casa, con piso de porcelanato tipo madera, luces empotradas y ventanas nuevas.',
    image: {
      src: real('recent-projects/addition-leesburg-va/after-tile-grouted-window-wall.jpg'),
      alt: 'Finished house extension with plank tile floor and new windows',
      placeholder: false,
    },
  },
  {
    slug: 'waterproofing-washington-dc',
    title: 'Basement Waterproofing & Finish',
    titleEs: 'Impermeabilización y Acabado de Sótano',
    category: 'Basement',
    categoryEs: 'Sótano',
    location: 'Washington, DC',
    summary: 'Waterproofing, new framing and insulation, drywall and paint, finished into an open living area.',
    summaryEs: 'Impermeabilización, nueva estructura y aislamiento, drywall y pintura, terminado como un área de estar abierta.',
    image: {
      src: real('recent-projects/waterproofing-washington-dc/after-living-area-windows-wide.jpg'),
      alt: 'Finished basement living area with a wall of windows in Washington, DC',
      placeholder: false,
    },
  },
  {
    slug: 'deck-alexandria-va',
    title: 'Finished Deck',
    titleEs: 'Terraza Terminada',
    category: 'Decks & Outdoor Living',
    categoryEs: 'Terrazas y Exteriores',
    location: 'Alexandria, VA',
    summary: 'Gray deck boards and stairs with white railings, black balusters and white fascia.',
    summaryEs: 'Tablas y escalones grises con barandas blancas, balaustres negros y fascia blanca.',
    image: {
      src: real('recent-projects/deck-alexandria-va/after-deck-stairs-railing-wide.jpg'),
      alt: 'Finished deck in Alexandria, VA with white railings and black balusters',
      placeholder: false,
    },
  },
]

export const BEFORE_AFTER = {
  before: {
    src: real('recent-projects/waterproofing-washington-dc/during-insulated-wall-framing.jpg'),
    alt: 'Basement wall opened up to the framing and insulation',
    placeholder: false,
  } as SiteImage,
  after: {
    src: real('recent-projects/waterproofing-washington-dc/after-living-area-windows-wide.jpg'),
    alt: 'The same basement wall finished, with drywall and paint',
    placeholder: false,
  } as SiteImage,
  title: 'Basement Waterproofing & Finish',
  titleEs: 'Impermeabilización y Acabado de Sótano',
  location: 'Washington, DC',
  projectHref: '/projects',
}

export const ABOUT_IMAGE: SiteImage = {
  src: real('team-carlos-04-portrait-blazer.jpg'),
  alt: 'Carlos Hernandez, founder of CR Home Pros',
  placeholder: false,
}
