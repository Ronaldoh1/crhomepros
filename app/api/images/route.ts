// ============================================
// POST /api/images — Upload images to Firebase Storage
// ============================================
import { NextRequest, NextResponse } from 'next/server'
import { getStorage } from 'firebase-admin/storage'
import { getApps } from 'firebase-admin/app'

// Lazy init admin (reuse existing if available)
function getBucket() {
  if (getApps().length === 0) {
    // Import will initialize if needed
    require('@/lib/firebase-admin')
  }
  return getStorage().bucket()
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const folder = formData.get('folder') as string || 'projects/uploads'

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const bucket = getBucket()
    const uploaded: { name: string; url: string; size: number }[] = []

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
      const storagePath = `${folder}/${safeName}`

      const fileRef = bucket.file(storagePath)
      
      await fileRef.save(buffer, {
        metadata: {
          contentType: file.type,
          cacheControl: 'public, max-age=31536000',
        },
      })

      await fileRef.makePublic()

      const bucketName = bucket.name
      const url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(storagePath)}?alt=media`

      uploaded.push({
        name: safeName,
        url,
        size: buffer.length,
      })
    }

    return NextResponse.json({
      success: true,
      uploaded,
      count: uploaded.length,
    })
  } catch (error: unknown) {
    console.error('Image upload error:', error)
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
