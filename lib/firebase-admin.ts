// ============================================
// Firebase Admin Configuration (Server-side)
// ============================================
// This is for server-side operations (API routes)
// NEVER import this in client components!

import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getAuth, Auth } from 'firebase-admin/auth'
import { getStorage, Storage } from 'firebase-admin/storage'

// Parse the private key (handle escaped newlines)
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')

// Admin configuration
const adminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: privateKey,
  }),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
}

// Initialize Firebase Admin (prevent re-initialization)
let adminApp: App
let adminDb: Firestore
let adminAuth: Auth
let adminStorage: Storage

if (getApps().length === 0) {
  adminApp = initializeApp(adminConfig)
} else {
  adminApp = getApps()[0]
}

// Initialize admin services
adminDb = getFirestore(adminApp)
adminAuth = getAuth(adminApp)
adminStorage = getStorage(adminApp)

// Export admin services
export { adminApp, adminDb, adminAuth, adminStorage }
export default adminApp
