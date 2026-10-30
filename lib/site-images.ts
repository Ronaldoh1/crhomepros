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

export const HERO_IMAGE: SiteImage = {
  src: local('living-room.png'),
  alt: 'Bright finished living room with hardwood floors',
  placeholder: true,
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
  'basement-finishing': { src: local('basement.png'), alt: 'Basement being finished', placeholder: true },
  roofing: { src: local('home-exterior.png'), alt: 'House exterior with new roof', placeholder: true },
  'concrete-driveways': { src: local('concrete-work.png'), alt: 'Crew pouring a concrete driveway', placeholder: true },
  painting: { src: local('painting.png'), alt: 'Interior room prepared for painting', placeholder: true },
  'deck-outdoor': { src: local('deck.png'), alt: 'Covered wood deck with stone grill', placeholder: true },
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
    slug: 'basement-transformation',
    title: 'Complete Basement Transformation',
    titleEs: 'Transformación Completa de Sótano',
    category: 'Basement Finishing',
    categoryEs: 'Acabado de Sótano',
    location: 'Laurel, MD',
    summary: 'Raw concrete space turned into a finished family room with recessed lighting and a laundry nook.',
    summaryEs: 'Un espacio de concreto convertido en una sala familiar terminada con iluminación empotrada y área de lavandería.',
    image: { src: local('living-room.png'), alt: 'Finished basement family room', placeholder: true },
  },
  {
    slug: 'deck-outdoor-kitchen',
    title: 'Covered Deck & Outdoor Grill',
    titleEs: 'Terraza Cubierta y Parrilla Exterior',
    category: 'Decks & Outdoor Living',
    categoryEs: 'Terrazas y Exteriores',
    location: 'Prince George’s County, MD',
    summary: 'New wood deck with a covered roof and a stone grill station for year-round use.',
    summaryEs: 'Nueva terraza de madera con techo cubierto y estación de parrilla de piedra para todo el año.',
    image: { src: local('deck.png'), alt: 'Covered wood deck with stone grill', placeholder: true },
  },
  {
    slug: 'fence-bowie',
    title: 'Privacy Fence Installation',
    titleEs: 'Instalación de Cerca de Privacidad',
    category: 'Fencing',
    categoryEs: 'Cercas',
    location: 'Bowie, MD',
    summary: 'New privacy fence around the backyard, set level on a sloped lot.',
    summaryEs: 'Nueva cerca de privacidad alrededor del patio, nivelada en un terreno inclinado.',
    image: { src: local('home-exterior.png'), alt: 'Home exterior and yard', placeholder: true },
  },
]

export const BEFORE_AFTER = {
  before: { src: local('basement.png'), alt: 'Unfinished basement before the remodel', placeholder: true } as SiteImage,
  after: { src: local('living-room.png'), alt: 'Finished living space after the remodel', placeholder: true } as SiteImage,
  title: 'Basement to Family Room',
  titleEs: 'De Sótano a Sala Familiar',
  location: 'Laurel, MD',
  projectHref: '/projects',
}

export const ABOUT_IMAGE: SiteImage = {
  src: local('team-working.png'),
  alt: 'CR Home Pros crew at work',
  placeholder: true,
}
