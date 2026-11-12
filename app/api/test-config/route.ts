import { NextResponse } from 'next/server'
import { isDriveConfigured } from '@/lib/google-drive'
import { isEmailConfigured } from '@/lib/email'
import { getAdminDb } from '@/lib/firebase-admin-server'

// Health check for everything behind the website.
// Open /api/test-config after a deploy. It never shows secret values,
// only whether each piece is set and whether a live test worked.
export const dynamic = 'force-dynamic'

const OLD_PROJECT = 'crhomepros' // locked project, billing closed
const OLD_BUCKET = 'crhomepros.firebasestorage.app' // returns 402

export async function GET() {
  const env = process.env
  const rawClientProject = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ''
  const clientProject = rawClientProject.replace(/\\n|\n|"/g, '').trim()
  const adminProject = env.FIREBASE_ADMIN_PROJECT_ID || clientProject
  const bucket = env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || ''
  const hasAdminKey = !!(env.FIREBASE_ADMIN_CLIENT_EMAIL && env.FIREBASE_ADMIN_PRIVATE_KEY && env.FIREBASE_ADMIN_PRIVATE_KEY.length > 100)

  // Live test: write and delete one document with the server credentials
  let databaseWrite = 'not tested'
  try {
    const db = getAdminDb()
    if (!db) {
      databaseWrite = '❌ server database not configured'
    } else {
      const ref = await db.collection('_healthcheck').add({ at: new Date().toISOString() })
      await ref.delete()
      databaseWrite = '✅ write + delete worked'
    }
  } catch (e: any) {
    databaseWrite = `❌ ${String(e?.message || e).slice(0, 200)}`
  }

  // Live test: the database the admin pages (invoices, contracts, leads) use.
  // A "not found" for a test document means the database is alive.
  let websiteDatabase = 'not tested'
  if (clientProject && env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(clientProject.trim())}/databases/(default)/documents/_healthcheck/ping?key=${env.NEXT_PUBLIC_FIREBASE_API_KEY.trim()}`
      const res = await fetch(url, { cache: 'no-store' })
      const body = await res.text()
      websiteDatabase =
        res.status === 404 && body.includes('not found') && !body.includes('database') ? '✅ database reachable'
        : res.status === 403 && /billing|disabled|suspended/i.test(body) ? `❌ billing problem: ${body.slice(0, 160)}`
        : res.status === 403 ? '✅ database reachable (security rules active)'
        : res.status === 200 ? '✅ database reachable'
        : `❌ HTTP ${res.status}: ${body.replace(/\s+/g, ' ').slice(0, 200)}`
    } catch (e: any) {
      websiteDatabase = `❌ ${String(e?.message || e).slice(0, 120)}`
    }
  }

  // Settings pasted with a stray newline or quotes break every Firebase call
  const firebaseVars = Object.keys(env).filter((k) => k.includes('FIREBASE'))
  const badlyFormatted = firebaseVars.filter((k) => {
    const v = env[k] || ''
    if (k === 'FIREBASE_ADMIN_PRIVATE_KEY') return false
    return /\\n|\n|^\s|\s$|^"|"$/.test(v)
  })

  // Live test: does the storage bucket answer?
  let storageCheck = 'not tested'
  if (bucket) {
    try {
      const res = await fetch(`https://firebasestorage.googleapis.com/v0/b/${bucket}/o?maxResults=1`, { cache: 'no-store' })
      storageCheck =
        res.status === 402 ? '❌ 402: bucket belongs to a project with billing closed'
        : res.status === 404 ? '❌ 404: bucket not found'
        : res.status === 200 || res.status === 403 ? `✅ bucket reachable (HTTP ${res.status})`
        : `⚠️ HTTP ${res.status}`
    } catch (e: any) {
      storageCheck = `❌ ${String(e?.message || e).slice(0, 120)}`
    }
  }

  const problems: string[] = []
  if (badlyFormatted.length) problems.push(`These settings contain a stray newline, space or quotes and must be retyped in Vercel: ${badlyFormatted.join(', ')}`)
  if (websiteDatabase.startsWith('❌')) problems.push(`The admin database (invoices, contracts, leads) is not working: ${websiteDatabase}`)
  if (!clientProject) problems.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set')
  if (adminProject === OLD_PROJECT) problems.push(`FIREBASE_ADMIN_PROJECT_ID is "${OLD_PROJECT}" (locked project). Set it to "${clientProject || 'crhomepros-9309c'}".`)
  if (clientProject && adminProject !== clientProject) problems.push(`Server project (${adminProject}) and website project (${clientProject}) differ: form leads and the admin panel use different databases.`)
  if (!hasAdminKey) problems.push('FIREBASE_ADMIN_CLIENT_EMAIL / FIREBASE_ADMIN_PRIVATE_KEY missing: contact, get-started and referral forms cannot save to the database.')
  if (bucket === OLD_BUCKET) problems.push(`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is the old bucket. Set it to "${clientProject || 'crhomepros-9309c'}.firebasestorage.app".`)
  const resendKey = env.RESEND_API_KEY || ''
  if (isEmailConfigured() && (!resendKey.startsWith('re_') || resendKey.length < 30)) problems.push(`RESEND_API_KEY looks wrong (${resendKey.length} characters; real keys start with "re_" and are about 36). Create a new key at resend.com.`)
  if ((env.EMAIL_FROM || '').includes('resend.dev') || !env.EMAIL_FROM) problems.push('EMAIL_FROM uses Resend\'s test address, which can only email the Resend account owner. Verify crhomepros.com in Resend and set EMAIL_FROM to e.g. "CR Home Pros <noreply@crhomepros.com>".')
  if (!isEmailConfigured()) problems.push('RESEND_API_KEY missing or invalid: no lead emails or invoice emails are sent.')
  if (!isDriveConfigured()) problems.push('Google Drive not connected (optional backup of leads/documents).')

  const status = {
    overall: problems.length === 0 ? '✅ ALL SYSTEMS READY' : `⚠️ ${problems.length} problem(s)`,
    problems,
    firebase: {
      website_project: JSON.stringify(rawClientProject) || '(not set)',
      website_database_test: websiteDatabase,
      badly_formatted_settings: badlyFormatted,
      server_project: adminProject || '(not set)',
      server_credentials_present: hasAdminKey,
      database_write_test: databaseWrite,
      storage_bucket: JSON.stringify(bucket) || '(not set)',
      storage_test: storageCheck,
      admin_login: 'Google sign-in, crhomepros@gmail.com only',
    },
    email: {
      provider: 'Resend',
      from: env.EMAIL_FROM || 'CR Home Pros <onboarding@resend.dev> (default)',
      to: env.EMAIL_TO_LEADS || 'crhomepros@gmail.com (default)',
      status: isEmailConfigured() ? '✅ READY' : '❌ MISSING OR INVALID API KEY',
    },
    google_drive: {
      status: isDriveConfigured() ? '✅ READY' : '❌ NOT CONNECTED',
      refresh_token_present: !!(env.GOOGLE_DRIVE_REFRESH_TOKEN && env.GOOGLE_DRIVE_REFRESH_TOKEN.length > 10),
    },
  }

  return NextResponse.json(status, { status: 200 })
}
