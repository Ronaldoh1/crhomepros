// ============================================
// Firebase Admin SDK — Server-Side Only
// ============================================
// Used by API routes to save leads, contacts,
// referrals, and reviews to Firestore.
// ============================================

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

let app: App | null = null
let db: Firestore | null = null

function getAdminApp(): App | null {
  if (app) return app
  if (getApps().length > 0) {
    app = getApps()[0]
    return app
  }

  // Try environment variables first
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (projectId && clientEmail && privateKey) {
    app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    })
    return app
  }

  // Fallback: initialize with just project ID (works in some environments)
  if (projectId) {
    try {
      app = initializeApp({ projectId })
      return app
    } catch {
      // ignore
    }
  }

  console.warn('⚠️ Firebase Admin not configured — data will not be saved to Firestore')
  return null
}

export function getAdminDb(): Firestore | null {
  if (db) return db
  const adminApp = getAdminApp()
  if (!adminApp) return null
  db = getFirestore(adminApp)
  return db
}

// ── Helper: Save any document to a collection ──
export async function saveToFirestore(
  collectionName: string,
  data: Record<string, any>
): Promise<string | null> {
  const firestore = getAdminDb()
  if (!firestore) {
    console.warn(`⚠️ Firestore not available — skipping save to ${collectionName}`)
    return null
  }

  try {
    const docRef = await firestore.collection(collectionName).add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log(`✅ Saved to Firestore: ${collectionName}/${docRef.id}`)
    return docRef.id
  } catch (error: any) {
    console.error(`❌ Firestore save error (${collectionName}):`, error?.message || error)
    return null
  }
}

// ── Typed helpers for each collection ──

export async function saveContact(data: {
  name: string
  email: string
  phone: string
  message: string
  service?: string
}) {
  return saveToFirestore('contacts', {
    ...data,
    status: 'new',
    source: 'contact-form',
  })
}

export async function saveLead(data: {
  firstName: string
  lastName: string
  email: string
  phone: string
  preferredContact?: string
  address: string
  city: string
  state: string
  zip: string
  services: string[]
  projectDescription: string
  timeline: string
  budget: string
  howDidYouHear?: string
  additionalNotes?: string
  /** who referred them, and whether that person is a past client */
  referredBy?: Record<string, string>
}) {
  return saveToFirestore('leads', {
    ...data,
    status: 'new',
    source: 'get-started-form',
  })
}

export async function saveReferral(data: {
  referrerName: string
  referrerEmail: string
  referrerPhone: string
  referralName: string
  referralPhone: string
  referralEmail?: string
  projectType?: string
  projectDetails?: string
  paymentMethod?: string
}) {
  const digits = (v?: string) => { const d = String(v || '').replace(/\D/g, ''); return d.length >= 10 ? d.slice(-10) : '' }
  return saveToFirestore('referrals', {
    ...data,
    referrerEmailKey: String(data.referrerEmail || '').trim().toLowerCase(),
    referralEmailKey: String(data.referralEmail || '').trim().toLowerCase(),
    referralPhoneKey: digits(data.referralPhone),
    status: 'pending',
    source: 'referral-form',
  })
}
