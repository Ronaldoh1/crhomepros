// ============================================
// Image URL Resolver
// ============================================
// Converts local paths to Firebase Storage CDN URLs.
// Images are stored in gs://crhomepros.firebasestorage.app/projects/

/**
 * Resolve an image path to Firebase Storage URL.
 * /images/2024-01/img_xxx.JPEG → https://firebasestorage.googleapis.com/v0/b/.../o/projects%2F2024-01%2Fimg_xxx.JPEG?alt=media
 */
export function resolveImageUrl(localPath: string): string {
  // Already a full URL? Return as-is
  if (localPath.startsWith('http://') || localPath.startsWith('https://')) {
    return localPath
  }

  // Only the original 2024 batches live in Firebase Storage.
  // Everything else (2025+, fence, basement) is in /public/ and serves directly.
  const firebaseFolders = ['/images/2024-01/', '/images/2024-06/']
  const isFirebaseImage = firebaseFolders.some(folder => localPath.startsWith(folder))
  
  if (!isFirebaseImage) {
    // Serve directly from /public/ (Next.js static files)
    return localPath
  }

  // Convert local path to Firebase Storage path
  // /images/2024-01/img_1234.JPEG → projects/2024-01/img_1234.JPEG
  const storagePath = localPath
    .replace(/^\/images\//, 'projects/')
    .replace(/^\//, '')

  const encoded = encodeURIComponent(storagePath)
  
  return `https://firebasestorage.googleapis.com/v0/b/crhomepros.firebasestorage.app/o/${encoded}?alt=media`
}

/**
 * Resolve all image arrays in a gallery project.
 * Use this when rendering gallery/project components.
 */
export function resolveProjectImages<T extends { images: string[]; beforeImages?: string[] }>(
  project: T
): T {
  return {
    ...project,
    images: project.images.map(resolveImageUrl),
    beforeImages: project.beforeImages?.map(resolveImageUrl),
  }
}
