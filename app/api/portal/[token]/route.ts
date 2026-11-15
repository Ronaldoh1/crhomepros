import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin-server'
import { emailKey, phoneKey } from '@/lib/client-keys'
import { afterContractSigned } from '@/lib/contract-signed'
import { balanceDue, paidSoFar } from '@/lib/payment-plan'
import {
  findClientByToken, addMessage, sendMail, emailShell, esc, isEmail, portalUrl, pdfDataFromRecord, OFFICE_EMAIL, SITE_URL,
} from '@/lib/portal-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// The client page. The long random link is the key: whoever has it sees only
// that client's shared estimates, sent contracts and invoices.
const iso = (t: any) => (t?.toDate ? t.toDate() : t ? new Date(t) : null)?.toISOString?.() || null
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status })

async function load(token: string) {
  const client = await findClientByToken(token)
  const db = getAdminDb()
  if (!client || !db) return null
  return { client, db, key: emailKey(client.email) }
}

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const ctx = await load(params.token)
    if (!ctx) return bad('This link is not valid. Ask CR Home Pros to send you a new one.', 404)
    const { client, db, key } = ctx

    const [docsSnap, notesSnap, msgSnap, refSnap] = await Promise.all([
      db.collection('admin_documents').where('clientEmailKey', '==', key).get(),
      db.collection('field_notes').where('clientEmailKey', '==', key).get(),
      db.collection('client_messages').where('clientEmailKey', '==', key).get(),
      db.collection('referrals').where('referrerEmailKey', '==', key).get(),
    ])
    const docs = docsSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })).filter(d => d.status && d.status !== 'draft')

    const contracts = docs.filter(d => d.type === 'contract').map(d => ({
      id: d.id, number: d.number, date: d.date, projectName: d.formData?.projectTitle || d.projectName || '',
      propertyAddress: d.propertyAddress || d.clientAddress || '',
      scope: (d.items || []).map((i: any) => i.description).filter(Boolean),
      scopeNote: d.freeformDescription || '', paymentStructure: d.paymentStructure || '',
      subtotal: d.subtotal || d.total || 0, taxRate: d.taxRate || 0, tax: d.tax || 0,
      payments: (d.payments || []).map((p: any) => ({ label: p.label, amount: p.amount })),
      total: d.total || 0, terms: d.contractTerms || '', notes: d.notes || '',
      status: d.status === 'cancelled' ? 'cancelled' : d.status === 'signed' ? 'signed' : 'to-sign',
      signedAt: d.clientSignature?.signedAt || null, signedName: d.clientSignature?.name || null,
    }))
    const invoices = docs.filter(d => d.type === 'invoice').map(d => ({
      id: d.id, number: d.number, date: d.date, dueDate: d.dueDate || '', projectName: d.projectName || '',
      total: d.total || 0, status: d.status === 'void' ? 'void' : d.status === 'paid' ? 'paid' : 'sent',
      payments: (d.payments || []).map((p: any) => ({ label: p.label, amount: p.amount, received: !!p.received, receivedAt: p.receivedAt || '' })),
      paid: paidSoFar(d.payments || []), balance: balanceDue(d.total || 0, d.payments || []),
    }))
    // Estimates: only the ones Carlos chose to share, and only the client-facing parts
    const estimates = notesSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })).filter(n => n.sharedWithClient && n.status !== 'discarded').map(n => ({
      id: n.id, projectName: n.projectName || '', address: n.address || '', estimatedCost: n.estimatedCost || '',
      nextSteps: n.nextSteps || '', photos: (n.photos || []).filter((p: string) => typeof p === 'string' && p.startsWith('https://')).slice(0, 24),
      status: n.status === 'invoiced' || n.status === 'contracted' ? 'contracted' : n.status === 'accepted' ? 'accepted' : n.status === 'declined' ? 'declined' : 'open',
      approvedAt: n.clientApproval?.signedAt || null, approvedName: n.clientApproval?.name || null,
      date: iso(n.createdAt),
    }))
    const messages = msgSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
      .filter(m => m.kind === 'note' || m.kind === 'question' || m.kind === 'reply')
      .map(m => ({ id: m.id, from: m.from, docType: m.docType || '', docId: m.docId || '', text: m.text, at: iso(m.createdAt) }))
      .sort((a, b) => String(a.at).localeCompare(String(b.at)))
    const referrals = refSnap.docs.map(d => d.data() as any).map(r => ({ name: r.referralName || '', at: iso(r.createdAt) }))

    return NextResponse.json({ client: { name: client.name, email: client.email }, contracts, estimates, invoices, messages, referrals })
  } catch (e: any) {
    console.error('Portal load error:', e)
    return bad('Your page could not be loaded. Please try again in a moment.', 500)
  }
}

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const ctx = await load(params.token)
    if (!ctx) return bad('This link is not valid.', 404)
    const { client, db, key } = ctx
    const body = await req.json().catch(() => ({}))
    const action = String(body.action || '')

    // simple abuse guard: at most 40 things sent from one client page per day
    const since = Date.now() - 86400000
    const recent = (await db.collection('client_messages').where('clientEmailKey', '==', key).get()).docs
      .filter(d => d.data().from !== 'carlos' && (d.data().createdAt?.toDate?.().getTime?.() || 0) > since).length
    if (recent >= 40) return bad('You have sent a lot today. Please call us at (571) 237-7164.', 429)

    // ── A note on an estimate or a question about a contract ──
    if (action === 'message') {
      const text = String(body.text || '').trim()
      const docType = body.docType === 'contract' ? 'contract' : 'estimate'
      const docId = String(body.docId || '')
      if (!text) return bad('Write your message first.')
      if (text.length > 2000) return bad('Please keep the message under 2,000 characters.')
      const snap = await db.collection(docType === 'contract' ? 'admin_documents' : 'field_notes').doc(docId).get()
      const d = snap.data() as any
      const visible = docType === 'contract' ? d?.type === 'contract' && d?.status && d.status !== 'draft' : !!d?.sharedWithClient
      if (!snap.exists || d.clientEmailKey !== key || !visible) return bad('That document was not found.', 404)
      const docLabel = docType === 'contract' ? `Contract ${d.number || ''}` : `Estimate: ${d.projectName || ''}`
      await addMessage({ clientEmail: client.email, clientName: client.name, from: 'client', kind: docType === 'contract' ? 'question' : 'note', docType, docId, docLabel, text })
      await sendMail({
        to: OFFICE_EMAIL, subject: `${client.name || client.email} sent a ${docType === 'contract' ? 'question' : 'note'}: ${docLabel}`,
        text: `${client.name || client.email} wrote about ${docLabel}:\n\n${text}\n\nOpen the ${docType}: ${SITE_URL}${docType === 'contract' ? `/admin/contracts?id=${docId}` : `/admin/estimates?open=${docId}`}\nAnswer: ${SITE_URL}/admin/messages`,
        html: emailShell(`<p><strong>${esc(client.name || client.email)}</strong> wrote about <strong>${esc(docLabel)}</strong>:</p><p style="background:#f1f5f9;padding:14px;border-radius:8px;white-space:pre-wrap">${esc(text)}</p>`, [{ label: docType === 'contract' ? 'Open contract' : 'Open estimate', url: `${SITE_URL}${docType === 'contract' ? `/admin/contracts?id=${docId}` : `/admin/estimates?open=${docId}`}` }, { label: 'Answer', url: `${SITE_URL}/admin/messages`, secondary: true }], { office: true }),
      }).catch(e => console.error('Notify email failed:', e?.message))
      return NextResponse.json({ success: true })
    }

    // ── Refer a friend ──
    if (action === 'referral') {
      const name = String(body.name || '').trim().slice(0, 120)
      const email = String(body.email || '').trim().slice(0, 160)
      const phone = String(body.phone || '').trim().slice(0, 40)
      const details = String(body.details || '').trim().slice(0, 1000)
      if (!name) return bad('Add your friend\'s name.')
      if (!email && !phone) return bad('Add your friend\'s email or phone number.')
      if (email && !isEmail(email)) return bad('That email address does not look right.')
      await db.collection('referrals').add({
        referrerName: client.name || '', referrerEmail: client.email, referrerEmailKey: key, referrerPhone: client.phone || '',
        referralName: name, referralEmail: email, referralEmailKey: emailKey(email), referralPhone: phone, referralPhoneKey: phoneKey(phone),
        projectDetails: details, status: 'pending', source: 'client-page', referrerIsClient: true,
        createdAt: new Date(), updatedAt: new Date(),
      })
      await addMessage({ clientEmail: client.email, clientName: client.name, from: 'system', kind: 'referral', text: `Referred ${name}${phone ? `, ${phone}` : ''}${email ? `, ${email}` : ''}${details ? `. ${details}` : ''}` })
      await sendMail({
        to: OFFICE_EMAIL, subject: `New referral from ${client.name || client.email}: ${name}`,
        text: `${client.name || client.email} referred ${name}.\nPhone: ${phone || '-'}\nEmail: ${email || '-'}\n${details}\n\n${SITE_URL}/admin/leads`,
        html: emailShell(`<p><strong>${esc(client.name || client.email)}</strong> referred a friend:</p><p><strong>${esc(name)}</strong><br>Phone: ${esc(phone || '-')}<br>Email: ${esc(email || '-')}</p>${details ? `<p style="white-space:pre-wrap">${esc(details)}</p>` : ''}`, { label: 'Open referrals', url: `${SITE_URL}/admin/leads` }, { office: true }),
      }).catch(e => console.error('Notify email failed:', e?.message))
      return NextResponse.json({ success: true })
    }

    // ── Approve and sign an estimate ──
    if (action === 'approve-estimate') {
      const docId = String(body.docId || '')
      const name = String(body.name || '').trim().slice(0, 120)
      const signature = String(body.signature || '')
      if (!body.agree) return bad('Please tick the box to approve.')
      if (name.length < 2) return bad('Type your full name.')
      if (!signature.startsWith('data:image/png;base64,') || signature.length < 600) return bad('Please add your signature.')
      if (signature.length > 400000) return bad('The signature image is too large. Please clear it and sign again.')
      const ref = db.collection('field_notes').doc(docId)
      const signedAt = new Date().toISOString()
      const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || ''
      const result = await db.runTransaction(async tx => {
        const snap = await tx.get(ref)
        const d = snap.data() as any
        if (!snap.exists || d.clientEmailKey !== key || !d.sharedWithClient) return 'NOT_FOUND'
        if (d.clientApproval?.signedAt) return 'ALREADY'
        if (['discarded', 'declined', 'contracted', 'invoiced'].includes(d.status)) return 'CLOSED'
        tx.update(ref, { status: 'accepted', statusChangedAt: signedAt.slice(0, 10), clientApproval: { dataUrl: signature, name, signedAt, ip }, updatedAt: new Date() })
        return d
      })
      if (result === 'NOT_FOUND') return bad('That estimate was not found.', 404)
      if (result === 'ALREADY') return bad('This estimate is already approved.', 409)
      if (result === 'CLOSED') return bad('This estimate can no longer be approved. Please call us at (571) 237-7164.', 409)
      const label = `Estimate: ${result.projectName || ''}`
      await addMessage({ clientEmail: client.email, clientName: client.name, from: 'system', kind: 'signed', docType: 'estimate', docId, docLabel: label, text: `${name} approved and signed the estimate for ${result.projectName || 'the job'}${result.estimatedCost ? ` (${result.estimatedCost})` : ''}. You can now create the contract.` })
      await sendMail({
        to: OFFICE_EMAIL, subject: `${client.name || client.email} approved the estimate: ${result.projectName || ''}`,
        text: `${name} approved and signed the estimate. Create the contract: ${SITE_URL}/admin/estimates?open=${docId}`,
        html: emailShell(`<p><strong>${esc(name)}</strong> approved and signed the estimate for <strong>${esc(result.projectName || 'the job')}</strong>${result.estimatedCost ? ` (${esc(result.estimatedCost)})` : ''}.</p><p>The next step is the contract.</p>`, { label: 'Open the estimate', url: `${SITE_URL}/admin/estimates?open=${docId}` }, { office: true }),
      }).catch(e => console.error('Notify email failed:', e?.message))
      return NextResponse.json({ success: true, signedAt })
    }

    // ── Sign a contract ──
    if (action === 'sign') {
      const docId = String(body.docId || '')
      const name = String(body.name || '').trim().slice(0, 120)
      const signature = String(body.signature || '')
      if (!body.agree) return bad('Please tick the box to agree before signing.')
      if (name.length < 2) return bad('Type your full name.')
      if (!signature.startsWith('data:image/png;base64,') || signature.length < 600) return bad('Please add your signature.')
      if (signature.length > 400000) return bad('The signature image is too large. Please clear it and sign again.')

      const ref = db.collection('admin_documents').doc(docId)
      const signedAt = new Date().toISOString()
      const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || ''
      const clientSignature = { dataUrl: signature, name, signedAt, ip, userAgent: (req.headers.get('user-agent') || '').slice(0, 300), consent: 'Agreed to sign electronically' }

      // one signature per contract, even if the button is pressed twice
      const contract = await db.runTransaction(async tx => {
        const snap = await tx.get(ref)
        const d = snap.data() as any
        if (!snap.exists || d.type !== 'contract' || d.clientEmailKey !== key) throw new Error('NOT_FOUND')
        if (d.status === 'signed') throw new Error('ALREADY')
        if (d.status !== 'sent') throw new Error('NOT_READY')
        tx.update(ref, { status: 'signed', clientSignature, signedAt: new Date(), updatedAt: new Date() })
        return { id: snap.id, ...d, status: 'signed', clientSignature }
      }).catch(e => {
        if (e.message === 'ALREADY') return 'ALREADY' as const
        if (e.message === 'NOT_FOUND' || e.message === 'NOT_READY') return 'NOT_FOUND' as const
        throw e
      })
      if (contract === 'ALREADY') return bad('This contract is already signed.', 409)
      if (contract === 'NOT_FOUND') return bad('That contract was not found or is not ready to sign.', 404)

      // Invoice, past project, notification and signed copies
      await afterContractSigned(db, contract, name, 'online')

      return NextResponse.json({ success: true, signedAt })
    }

    return bad('Unknown action.')
  } catch (e: any) {
    console.error('Portal action error:', e)
    return bad('That did not go through. Please try again, or call us at (571) 237-7164.', 500)
  }
}
