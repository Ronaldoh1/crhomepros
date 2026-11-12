// ============================================
// Google Drive Service — Lead Management
// ============================================
// Creates folders, generates lead docs, uploads images
// directly to Carlos's Google Drive via OAuth2 refresh token.
//
// SETUP:
// 1. Carlos authorizes via /admin/connect-drive (one-time)
// 2. Refresh token stored in GOOGLE_DRIVE_REFRESH_TOKEN env
// 3. All form submissions auto-create folders in Drive
//
// FOLDER STRUCTURE:
// CR Home Pros/
//   ├── Leads/
//   │   └── [2026-02-13] John Smith - Kitchen/
//   │       ├── Lead-Details.docx
//   │       └── photos/
//   ├── In Progress/
//   └── Completed/
// ============================================

import { google } from 'googleapis'
import { Readable } from 'stream'

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive',
]

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID || ''
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET || ''
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI || 'https://crhomepros.com/api/auth/google/callback'
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || ''

// Root folder names
const ROOT_FOLDER_NAME = 'CR Home Pros'
const LEADS_FOLDER_NAME = 'Leads'
const IN_PROGRESS_FOLDER_NAME = 'In Progress'
const COMPLETED_FOLDER_NAME = 'Completed'

// ============================================
// OAuth2 Client
// ============================================

function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

  if (REFRESH_TOKEN) {
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
  }

  return oauth2Client
}

function getDrive() {
  return google.drive({ version: 'v3', auth: getOAuth2Client() })
}

/**
 * Generate the authorization URL for Carlos to grant access (one-time setup)
 */
export function getAuthUrl(): string {
  const oauth2Client = getOAuth2Client()
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  })
}

/**
 * Exchange authorization code for tokens (callback handler)
 */
export async function getTokensFromCode(code: string) {
  const oauth2Client = getOAuth2Client()
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

// ============================================
// Folder Management
// ============================================

/**
 * Find or create a folder by name under a parent folder
 */
async function findOrCreateFolder(name: string, parentId?: string): Promise<string> {
  const drive = getDrive()

  // Search for existing folder
  const safeName = name.replace(/\\/g, '\\\\').replace(/'/g, "\\'") // names like O'Brien
  let query = `name='${safeName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`
  if (parentId) {
    query += ` and '${parentId}' in parents`
  }

  const search = await drive.files.list({
    q: query,
    fields: 'files(id, name)',
    spaces: 'drive',
  })

  if (search.data.files && search.data.files.length > 0) {
    return search.data.files[0].id!
  }

  // Create folder
  const folder = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : undefined,
    },
    fields: 'id',
  })

  return folder.data.id!
}

/**
 * Initialize the CR Home Pros folder structure in Drive
 */
export async function initializeFolderStructure(): Promise<{
  rootId: string
  leadsId: string
  inProgressId: string
  completedId: string
}> {
  const rootId = await findOrCreateFolder(ROOT_FOLDER_NAME)
  const leadsId = await findOrCreateFolder(LEADS_FOLDER_NAME, rootId)
  const inProgressId = await findOrCreateFolder(IN_PROGRESS_FOLDER_NAME, rootId)
  const completedId = await findOrCreateFolder(COMPLETED_FOLDER_NAME, rootId)

  return { rootId, leadsId, inProgressId, completedId }
}

// ============================================
// Lead Folder Creation
// ============================================

export interface LeadData {
  firstName: string
  lastName: string
  email: string
  phone: string
  preferredContact?: string
  address: string
  city: string
  state: string
  zip?: string
  services: string[]
  projectDescription: string
  timeline?: string
  budget?: string
  additionalNotes?: string
  howDidYouHear?: string
}

/**
 * Create a lead folder with all details in Google Drive
 * Returns the folder URL for Carlos to access
 */
export async function createLeadInDrive(lead: LeadData, images?: Buffer[]): Promise<{
  folderId: string
  folderUrl: string
  docId?: string
}> {
  const drive = getDrive()

  // Get or create the Leads folder
  const { leadsId } = await initializeFolderStructure()

  // Create lead-specific folder
  const date = new Date().toISOString().split('T')[0]
  const folderName = `[${date}] ${lead.firstName} ${lead.lastName} - ${lead.services[0] || 'General'}`
  const folderId = await findOrCreateFolder(folderName, leadsId)

  // Create the lead details document (plain text for reliability)
  const contactTag = lead.preferredContact ? `[${lead.preferredContact.toUpperCase()}]` : '[PHONE]'
  const docContent = buildLeadDocument(lead, contactTag, date)

  const docFile = await drive.files.create({
    requestBody: {
      name: `Lead-Details-${lead.firstName}-${lead.lastName}.txt`,
      parents: [folderId],
      mimeType: 'text/plain',
    },
    media: {
      mimeType: 'text/plain',
      body: docContent,
    },
    fields: 'id',
  })

  // Upload images if provided
  if (images && images.length > 0) {
    const photosId = await findOrCreateFolder('photos', folderId)

    for (let i = 0; i < images.length; i++) {

      await drive.files.create({
        requestBody: {
          name: `project-photo-${i + 1}.jpg`,
          parents: [photosId],
        },
        media: {
          mimeType: 'image/jpeg',
          body: Readable.from(images[i]),
        },
        fields: 'id',
      })
    }
  }

  const folderUrl = `https://drive.google.com/drive/folders/${folderId}`

  return {
    folderId,
    folderUrl,
    docId: docFile.data.id || undefined,
  }
}

/**
 * Build a formatted lead details document
 */
function buildLeadDocument(lead: LeadData, contactTag: string, date: string): string {
  const contactEmoji: Record<string, string> = {
    phone: '📞', email: '✉️', text: '💬', whatsapp: '🟢',
  }
  const emoji = contactEmoji[lead.preferredContact || 'phone'] || '📞'

  return `
════════════════════════════════════════
   CR HOME PROS — NEW LEAD
   ${date}
════════════════════════════════════════

${emoji} PREFERRED CONTACT: ${(lead.preferredContact || 'phone').toUpperCase()} ${contactTag}

────────────────────────────────────────
CONTACT INFORMATION
────────────────────────────────────────
Name:       ${lead.firstName} ${lead.lastName}
Phone:      ${lead.phone}
Email:      ${lead.email}
Address:    ${lead.address}
City:       ${lead.city}, ${lead.state} ${lead.zip || ''}

────────────────────────────────────────
PROJECT DETAILS
────────────────────────────────────────
Services:   ${lead.services.join(', ')}
Timeline:   ${lead.timeline || 'Not specified'}
Budget:     ${lead.budget || 'Not specified'}

Description:
${lead.projectDescription}

${lead.additionalNotes ? `Additional Notes:\n${lead.additionalNotes}\n` : ''}
${lead.howDidYouHear ? `How They Found Us: ${lead.howDidYouHear}\n` : ''}
────────────────────────────────────────
STATUS: NEW — Awaiting contact
────────────────────────────────────────

CR Home Pros | (301) 602-2553
Licensed & Insured — MHIC #05-132359
crhomepros.com
`.trim()
}

// ============================================
// Referral Folder Creation
// ============================================

export interface ReferralData {
  referrerName: string
  referrerEmail: string
  referrerPhone: string
  referralName: string
  referralPhone: string
  referralEmail?: string
  projectType: string
  projectDetails?: string
  paymentMethod: string
}

export async function createReferralInDrive(referral: ReferralData): Promise<{
  folderId: string
  folderUrl: string
}> {
  const drive = getDrive()
  const { leadsId } = await initializeFolderStructure()

  const date = new Date().toISOString().split('T')[0]
  const folderName = `[${date}] REFERRAL - ${referral.referralName} (by ${referral.referrerName})`
  const folderId = await findOrCreateFolder(folderName, leadsId)

  const docContent = `
════════════════════════════════════════
   CR HOME PROS — REFERRAL
   ${date}
════════════════════════════════════════

REFERRED BY:
  Name:   ${referral.referrerName}
  Phone:  ${referral.referrerPhone}
  Email:  ${referral.referrerEmail}
  Pay via: ${referral.paymentMethod}

REFERRED PERSON:
  Name:   ${referral.referralName}
  Phone:  ${referral.referralPhone}
  ${referral.referralEmail ? `Email:  ${referral.referralEmail}` : ''}

PROJECT:
  Type:    ${referral.projectType}
  ${referral.projectDetails ? `Details: ${referral.projectDetails}` : ''}

STATUS: PENDING — Awaiting contact
`.trim()

  await drive.files.create({
    requestBody: {
      name: `Referral-${referral.referralName}.txt`,
      parents: [folderId],
      mimeType: 'text/plain',
    },
    media: {
      mimeType: 'text/plain',
      body: docContent,
    },
    fields: 'id',
  })

  return {
    folderId,
    folderUrl: `https://drive.google.com/drive/folders/${folderId}`,
  }
}

// ============================================
// Contact Message (simpler — just append to a log)
// ============================================

export async function logContactInDrive(contact: {
  name: string
  email: string
  phone: string
  message: string
  service?: string
}): Promise<void> {
  const drive = getDrive()
  const { leadsId } = await initializeFolderStructure()

  const date = new Date().toISOString().split('T')[0]
  const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  await drive.files.create({
    requestBody: {
      name: `[${date}] Contact - ${contact.name}.txt`,
      parents: [leadsId],
      mimeType: 'text/plain',
    },
    media: {
      mimeType: 'text/plain',
      body: `CONTACT MESSAGE — ${date} ${time}\n\nName: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone}\nService: ${contact.service || 'General'}\n\nMessage:\n${contact.message}`,
    },
    fields: 'id',
  })
}

// ============================================
// Field Estimates (Carlos's on-site notes and photos)
// ============================================

export interface FieldEstimateData {
  clientName: string
  clientPhone?: string
  clientEmail?: string
  address?: string
  projectName?: string
  serviceType?: string
  notes?: string
  measurements?: string
  materialsNeeded?: string
  estimatedCost?: string
  nextSteps?: string
  date?: string
}

/**
 * Saves a field estimate to Drive:
 *   CR Home Pros / Field Estimates / [date] Client - Project /
 *     Estimate-Details.txt  +  photo-01.jpg, photo-02.jpg, ...
 * Saving the same estimate again refreshes the same folder.
 */
export async function saveFieldEstimateToDrive(
  est: FieldEstimateData,
  photos: Buffer[],
  existingFolderId?: string,
): Promise<{ folderId: string; folderUrl: string }> {
  const drive = getDrive()
  const { rootId } = await initializeFolderStructure()
  const estimatesId = await findOrCreateFolder('Field Estimates', rootId)

  const date = est.date || new Date().toISOString().split('T')[0]
  const clean = (v?: string) => (v || '').replace(/[\\/\n\r]+/g, ' ').trim()
  const folderName = `[${date}] ${clean(est.clientName) || 'Client'}${est.projectName ? ` - ${clean(est.projectName)}` : ''}`.slice(0, 120)

  let folderId = ''
  if (existingFolderId) {
    try {
      const f = await drive.files.get({ fileId: existingFolderId, fields: 'id, trashed' })
      if (f.data.id && !f.data.trashed) {
        folderId = existingFolderId
        await drive.files.update({ fileId: folderId, requestBody: { name: folderName } })
        // clear the old copy so the folder always matches the latest save
        const old = await drive.files.list({ q: `'${folderId}' in parents and trashed=false`, fields: 'files(id)', pageSize: 200 })
        for (const file of old.data.files || []) {
          if (file.id) await drive.files.update({ fileId: file.id, requestBody: { trashed: true } })
        }
      }
    } catch { /* folder was deleted in Drive: make a new one */ }
  }
  if (!folderId) folderId = await findOrCreateFolder(folderName, estimatesId)

  const line = (label: string, value?: string) => (value && value.trim() ? `${label}\n${value.trim()}\n\n` : '')
  const body = [
    '========================================',
    '   CR HOME PROS - FIELD ESTIMATE',
    `   ${date}`,
    '========================================',
    '',
    `Client:   ${est.clientName || ''}`,
    `Phone:    ${est.clientPhone || ''}`,
    `Email:    ${est.clientEmail || ''}`,
    `Address:  ${est.address || ''}`,
    `Project:  ${est.projectName || ''}`,
    `Service:  ${est.serviceType || ''}`,
    `Photos:   ${photos.length}`,
    '',
    '----------------------------------------',
    '',
    line('SITE NOTES', est.notes) + line('MEASUREMENTS', est.measurements) + line('MATERIALS NEEDED', est.materialsNeeded)
      + line('ESTIMATED COST', est.estimatedCost) + line('NEXT STEPS', est.nextSteps),
  ].join('\n')

  await drive.files.create({
    requestBody: { name: 'Estimate-Details.txt', parents: [folderId], mimeType: 'text/plain' },
    media: { mimeType: 'text/plain', body },
    fields: 'id',
  })
  for (let i = 0; i < photos.length; i++) {
    await drive.files.create({
      requestBody: { name: `photo-${String(i + 1).padStart(2, '0')}.jpg`, parents: [folderId] },
      media: { mimeType: 'image/jpeg', body: Readable.from(photos[i]) },
      fields: 'id',
    })
  }
  return { folderId, folderUrl: `https://drive.google.com/drive/folders/${folderId}` }
}

/**
 * Check if Google Drive is configured (has refresh token)
 */
export function isDriveConfigured(): boolean {
  return !!(CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN)
}
