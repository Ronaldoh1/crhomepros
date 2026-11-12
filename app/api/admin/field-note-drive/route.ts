import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/verify-admin'
import { isDriveConfigured, saveFieldEstimateToDrive } from '@/lib/google-drive'

export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_PHOTOS = 40

// Copies a field estimate (details + photos) into Carlos's Google Drive.
// The photos are already in Firebase Storage; the browser sends their links
// and the server fetches them, so a slow phone connection uploads each photo once.
export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  if (!isDriveConfigured()) {
    return NextResponse.json({ error: 'Google Drive is not connected. Open "Connect Drive" in the admin menu first.' }, { status: 400 })
  }

  try {
    const { note, photoUrls, driveFolderId } = await request.json()
    if (!note?.clientName) return NextResponse.json({ error: 'The client name is missing.' }, { status: 400 })

    // Only fetch field photos from this site's own storage bucket
    const bucket = (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '').trim()
    const prefix = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/admin%2Ffield-notes%2F`
    const urls: string[] = (Array.isArray(photoUrls) ? photoUrls : []).filter((u: unknown) => typeof u === 'string' && !!bucket && u.startsWith(prefix)).slice(0, MAX_PHOTOS)

    const photos: Buffer[] = []
    for (const url of urls) {
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error(`A photo could not be read from storage (HTTP ${res.status}).`)
      photos.push(Buffer.from(await res.arrayBuffer()))
    }

    const saved = await saveFieldEstimateToDrive(note, photos, typeof driveFolderId === 'string' ? driveFolderId : undefined)
    return NextResponse.json({ success: true, ...saved, photos: photos.length })
  } catch (error: any) {
    console.error('Field estimate Drive error:', error)
    const msg = String(error?.message || error)
    const hint = /invalid_grant|unauthorized|invalid_client/i.test(msg) ? ' The Google Drive connection expired: open "Connect Drive" in the admin menu and connect again.' : ''
    return NextResponse.json({ error: `Could not save to Google Drive. ${msg}${hint}` }, { status: 502 })
  }
}
