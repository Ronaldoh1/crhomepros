'use client'
// Calls an admin-only API route with the signed-in admin's Firebase ID token.
import { ensureAuth } from './firebase-auth'

export async function adminFetch(url: string, body: unknown): Promise<Response> {
  const user = ensureAuth()?.currentUser
  if (!user) throw new Error('You are signed out. Sign in again.')
  const token = await user.getIdToken()
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    let msg = `Server error ${res.status}`
    try { msg = (await res.json()).error || msg } catch {}
    throw new Error(msg)
  }
  return res
}
