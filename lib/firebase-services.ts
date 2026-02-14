// ============================================
// Firebase Services - Database Operations
// ============================================

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { getDb, getFirebaseStorage, Lead, Referral, FieldNote, Project, Review } from './firebase'

function requireDb() {
  const d = getDb()
  if (!d) throw new Error('Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_API_KEY env var.')
  return d
}

function requireStorage() {
  const s = getFirebaseStorage()
  if (!s) throw new Error('Firebase Storage is not configured.')
  return s
}

// ============================================
// LEADS
// ============================================

export async function createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> {
  const lead = {
    ...leadData,
    status: 'new' as const,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
  
  const docRef = await addDoc(collection(requireDb(), 'leads'), lead)
  return docRef.id
}

export async function getLead(id: string): Promise<Lead | null> {
  const docRef = doc(requireDb(), 'leads', id)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Lead
  }
  return null
}

export async function getLeads(options?: {
  status?: Lead['status']
  limit?: number
  startAfter?: DocumentData
}): Promise<Lead[]> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]
  
  if (options?.status) {
    constraints.unshift(where('status', '==', options.status))
  }
  if (options?.limit) {
    constraints.push(limit(options.limit))
  }
  if (options?.startAfter) {
    constraints.push(startAfter(options.startAfter))
  }
  
  const q = query(collection(requireDb(), 'leads'), ...constraints)
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Lead))
}

export async function updateLeadStatus(id: string, status: Lead['status']): Promise<void> {
  const docRef = doc(requireDb(), 'leads', id)
  await updateDoc(docRef, {
    status,
    updatedAt: Timestamp.now(),
  })
}

// ============================================
// REFERRALS
// ============================================

export async function createReferral(referralData: Omit<Referral, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> {
  const referral = {
    ...referralData,
    status: 'pending' as const,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
  
  const docRef = await addDoc(collection(requireDb(), 'referrals'), referral)
  return docRef.id
}

export async function getReferrals(options?: {
  status?: Referral['status']
  referrerEmail?: string
}): Promise<Referral[]> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]
  
  if (options?.status) {
    constraints.unshift(where('status', '==', options.status))
  }
  if (options?.referrerEmail) {
    constraints.unshift(where('referrerEmail', '==', options.referrerEmail))
  }
  
  const q = query(collection(requireDb(), 'referrals'), ...constraints)
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Referral))
}

export async function updateReferralStatus(
  id: string,
  status: Referral['status'],
  reward?: number
): Promise<void> {
  const docRef = doc(requireDb(), 'referrals', id)
  const updates: any = {
    status,
    updatedAt: Timestamp.now(),
  }
  if (reward !== undefined) {
    updates.reward = reward
  }
  await updateDoc(docRef, updates)
}

// ============================================
// FIELD NOTES
// ============================================

export async function createFieldNote(
  noteData: Omit<FieldNote, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string
): Promise<string> {
  const note = {
    ...noteData,
    createdBy: userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
  
  const docRef = await addDoc(collection(requireDb(), 'fieldNotes'), note)
  return docRef.id
}

export async function getFieldNotes(userId?: string): Promise<FieldNote[]> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]
  
  if (userId) {
    constraints.unshift(where('createdBy', '==', userId))
  }
  
  const q = query(collection(requireDb(), 'fieldNotes'), ...constraints)
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as FieldNote))
}

export async function updateFieldNote(id: string, updates: Partial<FieldNote>): Promise<void> {
  const docRef = doc(requireDb(), 'fieldNotes', id)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

// ============================================
// PROJECTS
// ============================================

export async function getProjects(options?: {
  type?: string
  featured?: boolean
  published?: boolean
  limit?: number
}): Promise<Project[]> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]
  
  if (options?.type) {
    constraints.unshift(where('type', '==', options.type))
  }
  if (options?.featured !== undefined) {
    constraints.unshift(where('featured', '==', options.featured))
  }
  if (options?.published !== undefined) {
    constraints.unshift(where('published', '==', options.published))
  }
  if (options?.limit) {
    constraints.push(limit(options.limit))
  }
  
  const q = query(collection(requireDb(), 'projects'), ...constraints)
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Project))
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const q = query(collection(requireDb(), 'projects'), where('slug', '==', slug), limit(1))
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) return null
  
  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() } as Project
}

export async function createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const project = {
    ...projectData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
  
  const docRef = await addDoc(collection(requireDb(), 'projects'), project)
  return docRef.id
}

// ============================================
// REVIEWS
// ============================================

export async function createReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'approved'>): Promise<string> {
  const review = {
    ...reviewData,
    approved: false,
    createdAt: Timestamp.now(),
  }
  
  const docRef = await addDoc(collection(requireDb(), 'reviews'), review)
  return docRef.id
}

export async function getReviews(options?: {
  approved?: boolean
  limit?: number
}): Promise<Review[]> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]
  
  if (options?.approved !== undefined) {
    constraints.unshift(where('approved', '==', options.approved))
  }
  if (options?.limit) {
    constraints.push(limit(options.limit))
  }
  
  const q = query(collection(requireDb(), 'reviews'), ...constraints)
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Review))
}

export async function approveReview(id: string): Promise<void> {
  const docRef = doc(requireDb(), 'reviews', id)
  await updateDoc(docRef, { approved: true })
}

// ============================================
// FILE UPLOAD
// ============================================

export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const storageRef = ref(requireStorage(), path)
  
  // Upload file
  const snapshot = await uploadBytes(storageRef, file)
  
  // Get download URL
  const downloadURL = await getDownloadURL(snapshot.ref)
  
  return downloadURL
}

export async function uploadMultipleFiles(
  files: File[],
  basePath: string
): Promise<string[]> {
  const uploadPromises = files.map((file, index) => {
    const path = `${basePath}/${Date.now()}_${index}_${file.name}`
    return uploadFile(file, path)
  })
  
  return Promise.all(uploadPromises)
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(requireStorage(), path)
  await deleteObject(storageRef)
}
