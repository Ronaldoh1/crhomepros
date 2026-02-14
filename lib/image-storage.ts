// ============================================
// Image Storage Utility
// ============================================
// Resolves project images from Firebase Storage (production)
// with automatic fallback to local /public/images/ (dev)
//
// Firebase Storage structure:
//   gs://<bucket>/projects/<category>/<project-id>/<filename>
//   gs://<bucket>/site/og-image.jpg
//   gs://<bucket>/site/carlos-headshot.jpg
//
// Usage:
//   const url = getImageUrl('projects/kitchen/kitchen-pg-county/01.jpg')
//   const url = getProjectImageUrl('kitchen-pg-county', '01.jpg')

const STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

/**
 * Get a Firebase Storage download URL for a given path.
 * Falls back to local /images/ path if Firebase is not configured.
 */
export function getStorageUrl(path: string): string {
  if (!STORAGE_BUCKET) {
    return `/images/${path}`
  }

  const encodedPath = encodeURIComponent(path)
  return `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodedPath}?alt=media`
}

/**
 * Get image URL for a project photo.
 * @param projectId - e.g. 'kitchen-pg-county'
 * @param filename - e.g. '01.jpg'
 */
export function getProjectImageUrl(projectId: string, filename: string): string {
  return getStorageUrl(`projects/${projectId}/${filename}`)
}

/**
 * Get image URL for a site asset (logo, og-image, headshot, etc.)
 */
export function getSiteImageUrl(filename: string): string {
  return getStorageUrl(`site/${filename}`)
}

/**
 * Storage path constants for organized uploads
 */
export const STORAGE_PATHS = {
  projects: 'projects',
  site: 'site',
  testimonials: 'testimonials',
  docs: 'docs',
} as const

/**
 * Map of local image paths to Firebase Storage paths.
 * Used by the migration script and for URL resolution.
 */
export function localPathToStoragePath(localPath: string): string {
  // /images/2024-01/img_1234.JPEG → projects/legacy-2024-01/img_1234.JPEG
  // /images/2025-05/kitchen-pg-county-01.png → projects/kitchen-pg-county/01.png
  return localPath
    .replace(/^\/images\//, '')
    .replace(/^\//, '')
}
