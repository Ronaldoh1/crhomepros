// ============================================
// Sample photos (temporary, for the redesign preview)
// ============================================
// While Carlos's real photos are being collected, every image on the
// public site is swapped for a sample photo picked by subject
// (kitchen, bathroom, roofing, crew...).
//
// When the real photos are uploaded to the new storage bucket:
//   1. Set USE_SAMPLE_PHOTOS = false
//   2. Make sure BUCKET in lib/resolve-images.ts points at the new bucket
// Every page then shows the real photos again, using the original file names.

export const USE_SAMPLE_PHOTOS = true

const local = (file: string) => `/images/placeholder/${file}`
const unsplash = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=75&auto=format&fit=crop`

const LOCAL_FILES = new Set([
  'basement.png', 'concrete-work.png', 'consultation.png', 'deck.png', 'home-exterior.png',
  'hvac-unit.png', 'living-room.png', 'mold-damage.png', 'painting.png', 'team-working.png',
])

export const SAMPLE_POOLS: Record<string, string[]> = {
  kitchen: [
    unsplash('photo-1556909114-f6e7ad7d3136'),
    unsplash('photo-1556909172-54557c7e4fb7'),
    unsplash('photo-1556909212-d5b604d0c90d'),
  ],
  bathroom: [unsplash('photo-1552321554-5fefe8c9ef14'), unsplash('photo-1620626011761-996317b8d101')],
  basement: [local('basement.png'), local('living-room.png')],
  roofing: [local('home-exterior.png'), unsplash('photo-1600585154340-be6161a56a0c')],
  concrete: [local('concrete-work.png')],
  deck: [local('deck.png')],
  fence: [local('home-exterior.png'), unsplash('photo-1600607687939-ce8a6c25118c')],
  painting: [local('painting.png'), unsplash('photo-1560448204-e02f11c3d0e2')],
  renovation: [local('living-room.png'), unsplash('photo-1503387762-592deb58ef4e'), unsplash('photo-1504307651254-35680f356dfd')],
  crew: [local('team-working.png'), local('consultation.png')],
  before: [local('basement.png'), local('mold-damage.png')],
}

// Order matters: first match wins.
const KEYWORDS: [RegExp, string][] = [
  [/team|carlos|crew|founder/i, 'crew'],
  [/kitchen/i, 'kitchen'],
  [/bath|tile|shower/i, 'bathroom'],
  [/basement/i, 'basement'],
  [/roof|shingle|tearoff|underlayment/i, 'roofing'],
  [/concrete|driveway|masonry/i, 'concrete'],
  [/deck|patio|outdoor/i, 'deck'],
  [/fenc/i, 'fence'],
  [/paint/i, 'painting'],
  [/renovation|remodel/i, 'renovation'],
  [/before/i, 'before'],
]

const CATEGORY_TO_POOL: Record<string, string> = {
  Kitchen: 'kitchen',
  Bathroom: 'bathroom',
  Basement: 'basement',
  Roofing: 'roofing',
  Concrete: 'concrete',
  Deck: 'deck',
  Fencing: 'fence',
  Painting: 'painting',
  'Complete Renovation': 'renovation',
  before: 'before',
}

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function isSamplePhoto(src: string) {
  return src.startsWith('/images/placeholder/') || src.startsWith('https://images.unsplash.com/')
}

/** Pick a sample photo for an original image path. `category` is a hint for unnamed files like img_3700.JPEG. */
export function samplePhotoFor(path: string, category?: string): string {
  // Blog images already exist locally under the same file name.
  const blog = path.match(/\/blog\/([^/?]+)$/)
  if (blog && LOCAL_FILES.has(blog[1])) return local(blog[1])

  const file = path.split('/').pop() || path
  let pool = KEYWORDS.find(([re]) => re.test(file))?.[1]
  if (!pool && category) pool = CATEGORY_TO_POOL[category]
  if (!pool) pool = KEYWORDS.find(([re]) => re.test(path))?.[1] // folder names, e.g. 2025-fence-bowie
  const list = SAMPLE_POOLS[pool || 'renovation']
  return list[hash(path) % list.length]
}
