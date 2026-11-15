// Server-side helpers for the client page (/portal/<private link>).
// Everything here uses the Admin SDK, so it only runs in API routes.
import { randomBytes } from 'crypto'
import { Resend } from 'resend'
import { getAdminDb } from './firebase-admin-server'
import { emailKey, phoneKey } from './client-keys'
import type { PdfDocData } from './pdf-document'

export const OFFICE_EMAIL = 'crhomepros@gmail.com'
export const SITE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://crhomepros.com').trim().replace(/\/$/, '')
export const portalUrl = (token: string) => `${SITE_URL}/portal/${token}`
export const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
export const isEmail = (s: unknown) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())

export interface ClientRecord { email: string; name: string; phone?: string; token: string }

function db() {
  const d = getAdminDb()
  if (!d) throw new Error('The server database is not set up.')
  return d
}

/** One record per client email, with a long random private link */
export async function getOrCreateClient(email: string, name?: string, phone?: string): Promise<ClientRecord> {
  const key = emailKey(email)
  if (!isEmail(key)) throw new Error('The client email address is not valid.')
  const ref = db().collection('clients').doc(encodeURIComponent(key))
  const snap = await ref.get()
  if (snap.exists) {
    const c = snap.data() as ClientRecord
    const patch: Record<string, any> = {}
    if (name && name !== c.name) patch.name = name
    if (phone && phone !== c.phone) patch.phone = phone
    if (Object.keys(patch).length) await ref.set({ ...patch, updatedAt: new Date() }, { merge: true })
    return { ...c, ...patch }
  }
  const record: ClientRecord = { email: key, name: name || '', phone: phone || '', token: randomBytes(24).toString('hex') }
  await ref.set({ ...record, createdAt: new Date(), updatedAt: new Date() })
  return record
}

export async function findClientByToken(token: string): Promise<ClientRecord | null> {
  if (!/^[a-f0-9]{48}$/.test(token || '')) return null
  const snap = await db().collection('clients').where('token', '==', token).limit(1).get()
  return snap.empty ? null : (snap.docs[0].data() as ClientRecord)
}

/** Has this person (by email or phone) been a client before? Used for referrals. */
export async function pastClientCheck(email?: string, phone?: string): Promise<{ status: 'in-contract' | 'client' | 'none'; name?: string }> {
  const d = db()
  const found: any[] = []
  const ek = emailKey(email); const pk = phoneKey(phone)
  if (ek) (await d.collection('admin_documents').where('clientEmailKey', '==', ek).limit(25).get()).forEach(x => found.push(x.data()))
  if (pk) (await d.collection('admin_documents').where('clientPhoneKey', '==', pk).limit(25).get()).forEach(x => found.push(x.data()))
  if (!found.length) return { status: 'none' }
  const signed = found.find(x => x.type === 'contract' && x.status === 'signed')
  return { status: signed ? 'in-contract' : 'client', name: (signed || found[0]).clientName || '' }
}

export async function addMessage(m: {
  clientEmail: string; clientName?: string; from: 'client' | 'carlos' | 'system'
  kind: 'note' | 'question' | 'reply' | 'signed' | 'referral'
  docType?: string; docId?: string; docLabel?: string; text: string
}) {
  await db().collection('client_messages').add({
    ...m, clientEmailKey: emailKey(m.clientEmail), text: m.text.slice(0, 2000),
    read: m.from === 'carlos', createdAt: new Date(),
  })
}

// ── Email ─────────────────────────────────────
type MailButton = { label: string; url: string; secondary?: boolean }
/**
 * Branded email wrapper. `button` is the main call to action; pass an array for
 * several buttons. `opts.office` drops the "private link" caption for emails
 * that go to Carlos rather than to a client.
 */
export function emailShell(bodyHtml: string, button?: MailButton | MailButton[], opts: { office?: boolean } = {}) {
  const buttons = (button ? (Array.isArray(button) ? button : [button]) : [])
  const btnHtml = buttons.map(b => `<a href="${b.url}" style="${b.secondary
    ? 'background:#ffffff;color:#0b1b33;border:2px solid #0b1b33;'
    : 'background:#0b1b33;color:#ffffff;border:2px solid #0b1b33;'}text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:8px;display:inline-block;margin:0 8px 8px 0">${esc(b.label)}</a>`).join('')
  return `<div style="background:#f1f5f9;padding:24px 12px;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #cbd5e1">
    <div style="background:#0b1b33;padding:22px 28px;border-bottom:4px solid #fd9b14">
      <img src="${SITE_URL}/images/brand/logo-wordmark.png" alt="CR Home Pros" width="170" style="display:block;border:0">
    </div>
    <div style="padding:28px;font-size:15px;line-height:1.65;color:#0f172a">
      ${bodyHtml}
      ${buttons.length ? `<p style="margin:26px 0 8px">${btnHtml}</p>
      ${opts.office ? '' : '<p style="font-size:12px;color:#334155">This is your private link. Please do not share it.</p>'}` : ''}
    </div>
    <div style="background:#0b1b33;color:#ffffff;padding:16px 28px;font-size:12px;line-height:1.6">
      CR Home Pros &middot; C&amp;R General Services Inc. &middot; (571) 237-7164 &middot; crhomepros.com<br>Licensed, insured and bonded &middot; MHIC #05-132359
    </div>
  </div></div>`
}

export async function sendMail(opts: {
  to: string; subject: string; text: string; html: string
  attachments?: { filename: string; content: Buffer }[]; copyOffice?: boolean
}) {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('Email is not set up (RESEND_API_KEY missing).')
  const { error } = await new Resend(key).emails.send({
    from: process.env.EMAIL_FROM || 'CR Home Pros <noreply@crhomepros.com>',
    to: [opts.to], reply_to: OFFICE_EMAIL,
    ...(opts.copyOffice ? { bcc: [OFFICE_EMAIL] } : {}),
    subject: opts.subject, text: opts.text, html: opts.html,
    ...(opts.attachments ? { attachments: opts.attachments } : {}),
  })
  if (error) throw new Error(error.message || 'The email service rejected the message.')
}

// ── Stored document → PDF data ────────────────
const cents = (n: number) => (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Rebuilds the PDF input from a saved invoice or contract (same mapping as the editors) */
export function pdfDataFromRecord(doc: any): PdfDocData {
  const f = doc.formData || {}
  const base: PdfDocData = {
    number: doc.number, date: doc.date, clientName: doc.clientName, clientEmail: doc.clientEmail,
    clientPhone: doc.clientPhone, clientAddress: doc.clientAddress, signatureData: doc.signatureData || null,
    clientSignature: doc.clientSignature || null, notes: doc.notes || '',
    ...(doc.status === 'cancelled' ? { stamp: 'CANCELLED' } : doc.status === 'void' ? { stamp: 'VOID' } : {}),
  }
  if (doc.type === 'contract') {
    return {
      ...base,
      propertyAddress: doc.propertyAddress || '',
      projectName: f.projectTitle || doc.projectName || '',
      items: (doc.items || []).map((i: any) => ({ description: i.description })),
      freeformDescription: doc.freeformDescription ? `Note: ${doc.freeformDescription}` : '',
      // contracts saved since the tax and payment-plan change already carry the full text
      paymentStructure: doc.paymentPlan ? doc.paymentStructure || '' : `${doc.paymentStructure || ''}\n\nSum estimated to complete job: $${cents(doc.total)} USD`,
      contractTerms: doc.contractTerms || '',
    }
  }
  return {
    ...base, dueDate: doc.dueDate, projectName: doc.projectName, items: doc.items || [], taxRate: doc.taxRate || 0,
    payments: doc.payments || [], contractNumber: doc.contractNumber || '', isCorrection: !!doc.isCorrection,
  }
}
