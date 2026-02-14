// ============================================
// Firebase Client Configuration
// ============================================
// This initializes Firebase for client-side use

import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, Auth } from 'firebase/auth'
import { getStorage, FirebaseStorage } from 'firebase/storage'
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase only when API key is available
let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null
let storage: FirebaseStorage | null = null
let analytics: Analytics | null = null

function getFirebaseApp(): FirebaseApp | null {
  if (!firebaseConfig.apiKey) return null
  if (app) return app
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  return app
}

function getDb(): Firestore | null {
  if (db) return db
  const a = getFirebaseApp()
  if (!a) return null
  db = getFirestore(a)
  return db
}

function getFirebaseAuth(): Auth | null {
  if (auth) return auth
  const a = getFirebaseApp()
  if (!a) return null
  auth = getAuth(a)
  return auth
}

function getFirebaseStorage(): FirebaseStorage | null {
  if (storage) return storage
  const a = getFirebaseApp()
  if (!a) return null
  storage = getStorage(a)
  return storage
}

// Initialize Analytics (only in browser and if supported)
if (typeof window !== 'undefined' && firebaseConfig.apiKey) {
  const a = getFirebaseApp()
  if (a) {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(a)
      }
    })
  }
}

// Export lazy getters and values
export { getFirebaseApp as getApp, getDb, getFirebaseAuth, getFirebaseStorage, analytics }
export { app, db, auth, storage }
export default app

// ============================================
// Helper Types
// ============================================

export interface Lead {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  preferredContact?: 'phone' | 'email' | 'text' | 'whatsapp'
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
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost'
  createdAt: Date
  updatedAt: Date
}

export interface Referral {
  id?: string
  referrerName: string
  referrerEmail: string
  referrerPhone: string
  referralName: string
  referralPhone: string
  referralEmail?: string
  projectType: string
  projectDetails?: string
  paymentMethod: 'check' | 'venmo' | 'zelle' | 'credit'
  status: 'pending' | 'contacted' | 'converted' | 'paid'
  reward?: number
  createdAt: Date
  updatedAt: Date
}

export interface FieldNote {
  id?: string
  projectName: string
  clientName: string
  address: string
  serviceType: string
  notes: string
  measurements?: string
  materialsNeeded?: string
  estimatedCost?: string
  nextSteps?: string
  photos: string[]
  status: 'draft' | 'complete'
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface Project {
  id?: string
  title: string
  slug: string
  description: string
  location: string
  type: string
  duration: string
  year: number
  images: string[]
  beforeImage?: string
  afterImage?: string
  featured: boolean
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id?: string
  name: string
  email?: string
  location: string
  rating: number
  text: string
  service: string
  approved: boolean
  createdAt: Date
}
