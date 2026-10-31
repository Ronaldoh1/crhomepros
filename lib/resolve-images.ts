// ============================================
// Image URL Resolver
// ============================================
// Converts local image paths to Firebase Storage CDN URLs.
// Gallery data uses paths like '/images/2025-05/kitchen.png'
// This resolver maps them to the correct Firebase Storage location.

import { USE_SAMPLE_PHOTOS, samplePhotoFor, isCommittedPhoto } from './sample-photos'
import { LOGO } from './site-images'

const BUCKET = 'crhomepros-9309c.firebasestorage.app' // old bucket crhomepros.firebasestorage.app is offline (402)

/**
 * Map local /images/ paths to Firebase Storage paths.
 * 
 * Firebase Storage structure:
 *   blog/           ← blog images
 *   projects/       ← all project images (2024-01, 2024-06, 2025-05, fence, basement)
 *   site/           ← logo, og-image
 *   team/           ← team photos
 */
function toStoragePath(localPath: string): string {
  // Strip leading /images/
  const rel = localPath.replace(/^\/images\//, '')

  // Blog images: /images/blog/x.png → blog/x.png
  if (rel.startsWith('blog/')) return rel

  // Team photos: /images/team-carlos-01.png → team/team-carlos-01.png
  if (rel.startsWith('team-')) return `team/${rel}`

  // Logo & site assets: /images/logo.png → site/logo.png
  if (rel === 'logo.png' || rel === 'og-image.jpg') return `site/${rel}`

  // Everything else (project folders): /images/2025-05/x.png → projects/2025-05/x.png
  return `projects/${rel}`
}

/**
 * Resolve an image path to Firebase Storage CDN URL.
 */
export function resolveImageUrl(localPath: string, category?: string): string {
  // Already a full URL, or one of our own local files? Return as-is
  if (localPath.startsWith('http://') || localPath.startsWith('https://')) {
    return localPath
  }
  if (
    localPath.startsWith('/images/placeholder/') ||
    localPath.startsWith('/images/brand/') ||
    isCommittedPhoto(localPath)
  ) {
    return localPath
  }

  // Logo is always served locally
  if (/\/logo\.png$/.test(localPath)) return LOGO.wordmark

  // Redesign preview: show sample photos until Carlos's photos are uploaded
  if (USE_SAMPLE_PHOTOS) return samplePhotoFor(localPath, category)

  const storagePath = toStoragePath(localPath)
  const encoded = encodeURIComponent(storagePath)
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encoded}?alt=media`
}

/**
 * Resolve all images in a gallery project.
 */
export function resolveProjectImages<T extends { images: string[]; beforeImages?: string[]; category?: string }>(
  project: T
): T {
  return {
    ...project,
    images: project.images.map((p) => resolveImageUrl(p, project.category)),
    ...(project.beforeImages && {
      beforeImages: project.beforeImages.map((p) => resolveImageUrl(p, "before")),
    }),
  }
}

/**
 * Get Firebase Storage URL for a specific file.
 */
export function getStorageUrl(storagePath: string): string {
  const encoded = encodeURIComponent(storagePath)
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encoded}?alt=media`
}

export function getProjectImageUrl(folder: string, filename: string): string {
  return getStorageUrl(`projects/${folder}/${filename}`)
}

export function getSiteImageUrl(filename: string): string {
  return getStorageUrl(`site/${filename}`)
}

export const STORAGE_PATHS = {
  projects: 'projects',
  blog: 'blog',
  site: 'site',
  team: 'team',
} as const
