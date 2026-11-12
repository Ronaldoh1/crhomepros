// Server-side check that an API request comes from Carlos's signed-in admin
// session: a Firebase ID token for crhomepros@gmail.com, signed in with Google.
import { getAuth } from 'firebase-admin/auth'
import { getAdminDb } from './firebase-admin-server'

const ADMIN_EMAIL = 'crhomepros@gmail.com'

export async function verifyAdminRequest(request: Request): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const header = request.headers.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return { ok: false, status: 401, error: 'Not signed in.' }
  if (!getAdminDb()) return { ok: false, status: 500, error: 'Server is not connected to Firebase.' }
  try {
    const decoded = await getAuth().verifyIdToken(token)
    const viaGoogle = decoded.firebase?.sign_in_provider === 'google.com'
    if ((decoded.email || '').toLowerCase() !== ADMIN_EMAIL || !decoded.email_verified || !viaGoogle) {
      return { ok: false, status: 403, error: 'This account is not authorized.' }
    }
    return { ok: true }
  } catch {
    return { ok: false, status: 401, error: 'Your session expired. Sign in again.' }
  }
}
