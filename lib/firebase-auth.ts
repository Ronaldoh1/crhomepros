// ============================================
// Firebase Auth — Client-Side Configuration
// ============================================
// Provides Firebase Auth for the admin portal.
// Carlos authenticates via email/password or Google.
// Only the configured admin email can access /admin.
// ============================================

import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
  type Auth,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  type Timestamp,
  type Firestore,
} from 'firebase/firestore'
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  type FirebaseStorage,
} from 'firebase/storage'

// Firebase config from env
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
}

// ── Lazy Firebase Initialization ──────────────
// Nothing initializes at module load time.
// Each getter creates the instance on first call, then caches it.
let _app: ReturnType<typeof initializeApp> | null = null
let _auth: Auth | null = null
let _db: Firestore | null = null
let _storage: FirebaseStorage | null = null

function ensureApp() {
  if (_app) return _app
  if (getApps().length) { _app = getApp(); return _app }
  if (!firebaseConfig.apiKey) return null
  try {
    _app = initializeApp(firebaseConfig)
    return _app
  } catch (e) {
    console.error('Firebase init failed:', e)
    return null
  }
}

function ensureAuth(): Auth | null {
  if (_auth) return _auth
  const app = ensureApp()
  if (!app) return null
  try {
    _auth = getAuth(app)
    return _auth
  } catch (e) {
    console.error('Firebase Auth init failed:', e)
    return null
  }
}

function ensureDb(): Firestore | null {
  if (_db) return _db
  const app = ensureApp()
  if (!app) return null
  try {
    _db = getFirestore(app)
    return _db
  } catch (e) {
    console.error('Firestore init failed:', e)
    return null
  }
}

function ensureStorage(): FirebaseStorage | null {
  if (_storage) return _storage
  const app = ensureApp()
  if (!app) return null
  try {
    _storage = getStorage(app)
    return _storage
  } catch (e) {
    console.error('Firebase Storage init failed:', e)
    return null
  }
}

const googleProvider = new GoogleAuthProvider()

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'crhomepros@gmail.com,crgeneralservicesinc@gmail.com')
  .split(',')
  .map(e => e.trim().toLowerCase())

// Legacy single export for backward compat
const ADMIN_EMAIL = ADMIN_EMAILS[0]

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

// Helper: throw if Firebase not ready
function requireAuth(): Auth {
  const auth = ensureAuth()
  if (!auth) throw new Error('Firebase not configured. Add NEXT_PUBLIC_FIREBASE_API_KEY to .env.local (see .env.example)')
  return auth
}

function requireDb(): Firestore {
  const db = ensureDb()
  if (!db) throw new Error('Firebase not configured. Add NEXT_PUBLIC_FIREBASE_API_KEY to .env.local')
  return db
}

function requireStorage(): FirebaseStorage {
  const s = ensureStorage()
  if (!s) throw new Error('Firebase Storage not configured. Check .env.local')
  return s
}

// ── Auth Functions ──────────────────────────

export async function loginWithEmail(email: string, password: string) {
  const auth = requireAuth()
  const cred = await signInWithEmailAndPassword(auth, email, password)
  if (!isAdminEmail(cred.user.email)) {
    await signOut(auth)
    throw new Error('Unauthorized. This account is not an admin.')
  }
  return cred.user
}

export async function loginWithGoogle() {
  const auth = requireAuth()
  const result = await signInWithPopup(auth, googleProvider)
  if (!isAdminEmail(result.user.email)) {
    await signOut(auth)
    throw new Error('Unauthorized. This Google account is not an admin.')
  }
  return result.user
}

export async function logout() {
  const auth = ensureAuth()
  if (!auth) return
  return signOut(auth)
}

export function onAuthChange(callback: (user: User | null) => void) {
  const auth = ensureAuth()
  if (!auth) {
    // Firebase not configured — treat as logged out, redirect to login
    callback(null)
    return () => {} // no-op unsubscribe
  }
  return onAuthStateChanged(auth, callback)
}

export function isAdmin(user: User | null): boolean {
  return isAdminEmail(user?.email)
}

export const isFirebaseConfigured = () => !!firebaseConfig.apiKey

// ── Firestore — Documents ────────────────────

export interface DocumentRecord {
  id?: string
  type: 'invoice' | 'change-order' | 'contract'
  number: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientAddress: string
  propertyAddress?: string
  projectName: string
  date: string
  dueDate?: string
  items: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
  }>
  freeformDescription?: string
  notes: string
  subtotal: number
  tax: number
  taxRate: number
  total: number
  paymentStructure?: string
  contractTerms?: string
  signatureData: string | null
  status: 'draft' | 'sent' | 'signed' | 'paid'
  signedFileUrl?: string
  signedFileName?: string
  emailSubject?: string
  emailBody?: string
  createdAt?: Timestamp | any
  updatedAt?: Timestamp | any
}

const DOCS_COLLECTION = 'admin_documents'

export async function saveDocument(docData: DocumentRecord): Promise<string> {
  const db = requireDb()
  const docRef = docData.id
    ? doc(db, DOCS_COLLECTION, docData.id)
    : doc(collection(db, DOCS_COLLECTION))

  const payload = {
    ...docData,
    id: docRef.id,
    updatedAt: serverTimestamp(),
    ...(docData.id ? {} : { createdAt: serverTimestamp() }),
  }

  await setDoc(docRef, payload, { merge: true })
  return docRef.id
}

export async function getDocument(id: string): Promise<DocumentRecord | null> {
  const db = requireDb()
  const snap = await getDoc(doc(db, DOCS_COLLECTION, id))
  return snap.exists() ? (snap.data() as DocumentRecord) : null
}

export async function getDocumentsByType(type: DocumentRecord['type']): Promise<DocumentRecord[]> {
  const db = requireDb()
  const q = query(
    collection(db, DOCS_COLLECTION),
    where('type', '==', type),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as DocumentRecord))
}

export async function getAllDocuments(): Promise<DocumentRecord[]> {
  const db = requireDb()
  const q = query(collection(db, DOCS_COLLECTION), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as DocumentRecord))
}

export async function deleteDocument(id: string): Promise<void> {
  const db = requireDb()
  await deleteDoc(doc(db, DOCS_COLLECTION, id))
}

// ── Storage — Signature & Signed Documents ───

export async function getSavedSignatureUrl(): Promise<string | null> {
  const s = ensureStorage()
  if (!s) return null
  try {
    const storageRef = ref(s, 'admin/signature/carlos-default.png')
    return await getDownloadURL(storageRef)
  } catch {
    return null // No saved signature yet
  }
}

export async function uploadSignedDocument(
  file: File,
  documentId: string,
  type: string
): Promise<string> {
  const s = requireStorage()
  const db = requireDb()
  const ext = file.name.split('.').pop() || 'pdf'
  const path = `signed-documents/${type}/${documentId}.${ext}`
  const storageRef = ref(s, path)
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)

  await setDoc(doc(db, DOCS_COLLECTION, documentId), {
    signedFileUrl: url,
    signedFileName: file.name,
    status: 'signed',
    updatedAt: serverTimestamp(),
  }, { merge: true })

  return url
}

// Export
export { ADMIN_EMAIL, ADMIN_EMAILS, ensureAuth, ensureDb, ensureStorage }

// ── Reviews Management ──────────────────────

export interface ReviewRecord {
  id?: string
  name: string
  email: string
  location: string
  service: string
  rating: number
  text: string
  recommend?: boolean
  projectYear?: string
  approved: boolean
  createdAt?: any
  updatedAt?: any
}

export async function getReviews(approvedOnly = false): Promise<ReviewRecord[]> {
  const db = requireDb()
  let q
  if (approvedOnly) {
    q = query(collection(db, 'reviews'), where('approved', '==', true), orderBy('createdAt', 'desc'))
  } else {
    q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'))
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as ReviewRecord))
}

export async function approveReview(id: string, approved: boolean): Promise<void> {
  const db = requireDb()
  await setDoc(doc(db, 'reviews', id), { approved, updatedAt: serverTimestamp() }, { merge: true })
}

export async function deleteReview(id: string): Promise<void> {
  const db = requireDb()
  await deleteDoc(doc(db, 'reviews', id))
}

// ── Leads / Contacts / Referrals ──────────────

export interface LeadRecord {
  id?: string
  firstName?: string
  lastName?: string
  name?: string
  email: string
  phone: string
  address?: string
  city?: string
  state?: string
  zip?: string
  services?: string[]
  projectDescription?: string
  timeline?: string
  budget?: string
  message?: string
  service?: string
  status: string
  source: string
  createdAt?: any
}

export async function getLeads(): Promise<LeadRecord[]> {
  const db = requireDb()
  const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as LeadRecord))
}

export async function getContacts(): Promise<LeadRecord[]> {
  const db = requireDb()
  const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as LeadRecord))
}

export async function getReferrals(): Promise<any[]> {
  const db = requireDb()
  const q = query(collection(db, 'referrals'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ ...d.data(), id: d.id }))
}

export async function updateLeadStatus(id: string, status: string, collectionName = 'leads'): Promise<void> {
  const db = requireDb()
  await setDoc(doc(db, collectionName, id), { status, updatedAt: serverTimestamp() }, { merge: true })
}

// ── Field Notes ──────────────────────

export interface FieldNoteRecord {
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
  createdAt?: any
  updatedAt?: any
}

const FIELD_NOTES_COLLECTION = 'field_notes'

export async function saveFieldNote(noteData: FieldNoteRecord): Promise<string> {
  const db = requireDb()
  const docRef = noteData.id
    ? doc(db, FIELD_NOTES_COLLECTION, noteData.id)
    : doc(collection(db, FIELD_NOTES_COLLECTION))

  await setDoc(docRef, {
    ...noteData,
    id: docRef.id,
    updatedAt: serverTimestamp(),
    ...(noteData.id ? {} : { createdAt: serverTimestamp() }),
  }, { merge: true })
  return docRef.id
}

export async function getFieldNotes(): Promise<FieldNoteRecord[]> {
  const db = requireDb()
  const q = query(collection(db, FIELD_NOTES_COLLECTION), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as FieldNoteRecord))
}

export async function deleteFieldNote(id: string): Promise<void> {
  const db = requireDb()
  await deleteDoc(doc(db, FIELD_NOTES_COLLECTION, id))
}
