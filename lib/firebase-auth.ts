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
  deleteField,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
  type Timestamp,
  type Firestore,
} from 'firebase/firestore'
import { emailKey, phoneKey } from './client-keys'
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
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

// The ONE account allowed into the admin area. Deliberately hard-coded (not a
// setting) so no other account can be added by mistake. The same address is
// enforced by the database and storage rules (firestore.rules, storage.rules).
const ADMIN_EMAILS = ['crhomepros@gmail.com']
googleProvider.setCustomParameters({ login_hint: ADMIN_EMAILS[0], prompt: 'select_account' })

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

export async function loginWithGoogle() {
  const auth = requireAuth()
  const result = await signInWithPopup(auth, googleProvider)
  if (!isAdminEmail(result.user.email)) {
    await signOut(auth)
    throw new Error(`This Google account is not authorized. Sign in with ${ADMIN_EMAILS[0]}.`)
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
  // Must be the admin address AND signed in with Google (no password accounts)
  const viaGoogle = !!user?.providerData.some((p) => p.providerId === 'google.com')
  return isAdminEmail(user?.email) && viaGoogle
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
  /** Field estimate this invoice was made from (one invoice per estimate) */
  estimateId?: string
  /** The client first declined the estimate and later came back */
  estimateReopened?: boolean
  /** Set when the client signs a contract on their page */
  clientSignature?: { dataUrl?: string; name?: string; signedAt?: string; ip?: string }
  signedFileUrl?: string
  signedFileName?: string
  emailSubject?: string
  emailBody?: string
  /** Full editor form, so a draft reopens exactly as it was left */
  formData?: Record<string, any>
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
    // how the client page finds this client's documents
    clientEmailKey: emailKey(docData.clientEmail),
    clientPhoneKey: phoneKey(docData.clientPhone),
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

// ── Document numbers ─────────────────────────
// Format PREFIX-YEAR-0001. The next number is one above the highest
// existing number of that type for the year, and is checked again on save.

const NUMBER_PREFIX: Record<DocumentRecord['type'], string> = { invoice: 'INV', 'change-order': 'CO', contract: 'CTR' }

export async function nextDocumentNumber(type: DocumentRecord['type']): Promise<string> {
  const db = requireDb()
  const year = new Date().getFullYear()
  const start = `${NUMBER_PREFIX[type]}-${year}-`
  const snap = await getDocs(query(collection(db, DOCS_COLLECTION), where('type', '==', type)))
  let highest = 0
  snap.docs.forEach(d => {
    const n = String(d.data().number || '')
    if (!n.startsWith(start)) return
    const seq = parseInt(n.slice(start.length), 10) // "0007-CORRECTED" reads as 7
    if (seq > highest) highest = seq
  })
  return `${start}${String(highest + 1).padStart(4, '0')}`
}

/** true when another document of this type already uses the number */
export async function isDocumentNumberTaken(type: DocumentRecord['type'], baseNumber: string, exceptId?: string | null): Promise<boolean> {
  const db = requireDb()
  const base = baseNumber.replace(/-CORRECTED$/i, '').trim()
  if (!base) return false
  const snap = await getDocs(query(collection(db, DOCS_COLLECTION), where('number', 'in', [base, `${base}-CORRECTED`])))
  return snap.docs.some(d => d.id !== exceptId && d.data().type === type)
}

/**
 * Returns a number that is safe to save under.
 * New document: keeps the wanted number if free, otherwise takes the next free one.
 * Existing document: throws if someone changed the number to one already in use.
 */
export async function confirmDocumentNumber(type: DocumentRecord['type'], wanted: string, savedId?: string | null): Promise<string> {
  const base = (wanted || '').replace(/-CORRECTED$/i, '').trim()
  if (base && !(await isDocumentNumberTaken(type, base, savedId))) return base
  if (savedId && base) throw new Error(`The number ${base} is already used by another document. Type a different number.`)
  for (let i = 0; i < 5; i++) {
    const next = await nextDocumentNumber(type)
    if (!(await isDocumentNumberTaken(type, next, savedId))) return next
  }
  throw new Error('Could not find a free document number. Please tell Ron.')
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
  clientPhone?: string
  clientEmail?: string
  address: string
  serviceType: string
  notes: string
  measurements?: string
  materialsNeeded?: string
  estimatedCost?: string
  nextSteps?: string
  /** Photo links (Firebase Storage). Very old notes may hold inline image data instead. */
  photos: string[]
  /** Storage paths of the photos, same order as `photos`, so they can be deleted */
  photoPaths?: string[]
  /** Google Drive copy of this estimate */
  driveFolderId?: string
  driveFolderUrl?: string
  /** 'draft' and 'complete' are from the first version and count as "new" */
  status: EstimateStatus | 'draft' | 'complete'
  /** Day the status last changed (YYYY-MM-DD) */
  statusChangedAt?: string
  /** The client declined once and later came back */
  wasReopened?: boolean
  /** Day to call the client back (YYYY-MM-DD) */
  followUpDate?: string
  /** The one invoice made from this estimate */
  invoiceId?: string
  invoiceNumber?: string
  /** Shown on the client's page (set by "Send to client") */
  sharedWithClient?: boolean
  sharedAt?: string
  /** Contract made from this estimate */
  contractId?: string
  createdAt?: any
  updatedAt?: any
}

export type EstimateStatus = 'new' | 'quoted' | 'accepted' | 'invoiced' | 'declined' | 'reopened' | 'discarded'

const FIELD_NOTES_COLLECTION = 'field_notes'

/** Reserve an id first, so photos can be uploaded under it before the note is saved */
export function newFieldNoteId(): string {
  return doc(collection(requireDb(), FIELD_NOTES_COLLECTION)).id
}

export async function saveFieldNote(noteData: FieldNoteRecord, isNew = !noteData.id): Promise<string> {
  const db = requireDb()
  const docRef = noteData.id
    ? doc(db, FIELD_NOTES_COLLECTION, noteData.id)
    : doc(collection(db, FIELD_NOTES_COLLECTION))

  await setDoc(docRef, {
    ...noteData,
    id: docRef.id,
    clientEmailKey: emailKey(noteData.clientEmail),
    clientPhoneKey: phoneKey(noteData.clientPhone),
    updatedAt: serverTimestamp(),
    ...(isNew ? { createdAt: serverTimestamp() } : {}),
  }, { merge: true })
  return docRef.id
}

export async function getFieldNote(id: string): Promise<FieldNoteRecord | null> {
  const snap = await getDoc(doc(requireDb(), FIELD_NOTES_COLLECTION, id))
  return snap.exists() ? ({ ...snap.data(), id: snap.id } as FieldNoteRecord) : null
}

/** Change some fields of an estimate. A value of null removes that field. */
export async function updateFieldNote(id: string, patch: { [K in keyof FieldNoteRecord]?: FieldNoteRecord[K] | null }): Promise<void> {
  const data: Record<string, any> = { updatedAt: serverTimestamp() }
  Object.entries(patch).forEach(([k, v]) => { data[k] = v === null ? deleteField() : v })
  await setDoc(doc(requireDb(), FIELD_NOTES_COLLECTION, id), data, { merge: true })
}

/** Upload one (already shrunk) field photo. Stored privately: admin only. */
export async function uploadFieldPhoto(noteId: string, photo: Blob): Promise<{ url: string; path: string }> {
  const s = requireStorage()
  const path = `admin/field-notes/${noteId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const storageRef = ref(s, path)
  await uploadBytes(storageRef, photo, { contentType: 'image/jpeg' })
  return { url: await getDownloadURL(storageRef), path }
}

export async function deleteFieldPhoto(path: string): Promise<void> {
  const s = ensureStorage()
  if (!s || !path) return
  try { await deleteObject(ref(s, path)) } catch { /* already gone */ }
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


// ============================================
// Client messages and notifications
// ============================================
// Notes and questions from the client page, Carlos's answers, and system
// events (contract signed, referral sent). Written by the server.

export interface ClientMessage {
  id?: string
  clientEmail: string
  clientEmailKey: string
  clientName?: string
  from: 'client' | 'carlos' | 'system'
  kind: 'note' | 'question' | 'reply' | 'signed' | 'referral'
  docType?: string
  docId?: string
  docLabel?: string
  text: string
  read: boolean
  createdAt?: any
}

export async function getClientMessages(max = 300): Promise<ClientMessage[]> {
  const q = query(collection(requireDb(), 'client_messages'), orderBy('createdAt', 'desc'), limit(max))
  return (await getDocs(q)).docs.map(d => ({ ...d.data(), id: d.id } as ClientMessage))
}

export async function markMessagesRead(ids: string[]): Promise<void> {
  const db = requireDb()
  await Promise.all(ids.map(id => setDoc(doc(db, 'client_messages', id), { read: true }, { merge: true })))
}

// ============================================
// Past projects
// ============================================
// One per signed contract. "Before" photos come from the field estimate;
// Carlos adds the "after" photos. Private until he marks one ready to publish.

export interface PastProject {
  id?: string
  contractId?: string
  contractNumber?: string
  estimateId?: string
  clientName: string
  clientEmail?: string
  clientEmailKey?: string
  address?: string
  title: string
  workDone: string
  beforePhotos: string[]
  beforePaths?: string[]
  afterPhotos: string[]
  afterPaths?: string[]
  status: 'in-progress' | 'completed'
  /** Carlos marked it ready for the public gallery (nothing is public yet) */
  published: boolean
  /** Public wording, with no client details */
  publicCity?: string
  startedAt?: string
  completedAt?: string
  createdAt?: any
  updatedAt?: any
}

export async function getPastProjects(): Promise<PastProject[]> {
  const q = query(collection(requireDb(), 'past_projects'), orderBy('createdAt', 'desc'))
  return (await getDocs(q)).docs.map(d => ({ ...d.data(), id: d.id } as PastProject))
}

export async function updatePastProject(id: string, patch: Partial<PastProject>): Promise<void> {
  await setDoc(doc(requireDb(), 'past_projects', id), { ...patch, updatedAt: serverTimestamp() }, { merge: true })
}

export async function createPastProject(p: PastProject): Promise<string> {
  const ref = p.id ? doc(requireDb(), 'past_projects', p.id) : doc(collection(requireDb(), 'past_projects'))
  await setDoc(ref, { ...p, id: ref.id, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true })
  return ref.id
}

export async function deletePastProject(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), 'past_projects', id))
}

/** Upload one (already shrunk) project photo. Stored privately until published. */
export async function uploadProjectPhoto(projectId: string, photo: Blob): Promise<{ url: string; path: string }> {
  const s = requireStorage()
  const path = `admin/past-projects/${projectId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const storageRef = ref(s, path)
  await uploadBytes(storageRef, photo, { contentType: 'image/jpeg' })
  return { url: await getDownloadURL(storageRef), path }
}

// ── Public project library ───────────────────
// A copy of a past project with nothing private in it: no client name,
// address, email, price or contract number. Only this copy is public.

export interface PublicProject {
  id: string
  title: string
  city: string
  workDone: string
  beforePhotos: string[]
  afterPhotos: string[]
  completedAt?: string
}

export async function publishProject(p: PastProject): Promise<void> {
  const pub: PublicProject = {
    id: p.id!, title: p.title || 'Project', city: p.publicCity || '', workDone: p.workDone || '',
    beforePhotos: p.beforePhotos || [], afterPhotos: p.afterPhotos || [], completedAt: p.completedAt || '',
  }
  await setDoc(doc(requireDb(), 'public_projects', p.id!), { ...pub, publishedAt: serverTimestamp() })
}

export async function unpublishProject(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), 'public_projects', id))
}

export async function getPublicProjects(): Promise<PublicProject[]> {
  const db = ensureDb()
  if (!db) return []
  const snap = await getDocs(collection(db, 'public_projects'))
  return snap.docs.map(d => ({ ...(d.data() as PublicProject), id: d.id })).sort((a, b) => String(b.completedAt).localeCompare(String(a.completedAt)))
}
