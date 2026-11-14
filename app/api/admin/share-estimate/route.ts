import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/verify-admin'
import { getAdminDb } from '@/lib/firebase-admin-server'
import { emailKey, phoneKey } from '@/lib/client-keys'
import { getOrCreateClient, portalUrl, sendMail, emailShell, esc, isEmail } from '@/lib/portal-server'

export const runtime = 'nodejs'

// Shares a field estimate with the client: it appears on their page and they
// get an email with their private link. Admin only.
export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const { estimateId } = await request.json()
    const db = getAdminDb()
    if (!db) return NextResponse.json({ error: 'The server database is not set up.' }, { status: 500 })
    const ref = db.collection('field_notes').doc(String(estimateId || ''))
    const snap = await ref.get()
    const n = snap.data() as any
    if (!snap.exists) return NextResponse.json({ error: 'That estimate was not found.' }, { status: 404 })
    if (!isEmail(n.clientEmail)) return NextResponse.json({ error: 'Add the client\'s email address to the estimate first.' }, { status: 400 })
    if (n.status === 'discarded') return NextResponse.json({ error: 'A discarded estimate cannot be sent.' }, { status: 400 })

    const client = await getOrCreateClient(n.clientEmail, n.clientName, n.clientPhone)
    const url = portalUrl(client.token)
    const first = String(n.clientName || '').split(' ')[0] || 'there'
    await sendMail({
      to: client.email, copyOffice: true,
      subject: `Your estimate from CR Home Pros${n.projectName ? `: ${n.projectName}` : ''}`,
      text: `Hi ${first},\n\nThank you for having us out. Your estimate${n.projectName ? ` for ${n.projectName}` : ''} is ready${n.estimatedCost ? `: ${n.estimatedCost}` : ''}.\n\nSee it, with the photos from our visit, on your page:\n${url}\n\nYou can send us a note or a question from there.\n\nCarlos Hernandez\nCR Home Pros\n(571) 237-7164`,
      html: emailShell(`<p>Hi ${esc(first)},</p><p>Thank you for having us out. Your estimate${n.projectName ? ` for <strong>${esc(n.projectName)}</strong>` : ''} is ready${n.estimatedCost ? `: <strong>${esc(n.estimatedCost)}</strong>` : ''}.</p><p>You can see it, with the photos from our visit, on your page. You can also send us a note or a question from there.</p><p>Carlos Hernandez<br>CR Home Pros &middot; (571) 237-7164</p>`, { label: 'See your estimate', url }),
    })
    const today = new Date().toISOString().slice(0, 10)
    await ref.set({
      sharedWithClient: true, sharedAt: today, clientEmailKey: emailKey(n.clientEmail), clientPhoneKey: phoneKey(n.clientPhone),
      ...(n.status === 'new' || !n.status || n.status === 'complete' || n.status === 'draft' ? { status: 'quoted', statusChangedAt: today } : {}),
      updatedAt: new Date(),
    }, { merge: true })
    return NextResponse.json({ success: true, to: client.email })
  } catch (e: any) {
    console.error('Share estimate error:', e)
    return NextResponse.json({ error: e?.message || 'The estimate could not be sent.' }, { status: 500 })
  }
}
