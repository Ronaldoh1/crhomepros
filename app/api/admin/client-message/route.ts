import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/verify-admin'
import { getOrCreateClient, addMessage, portalUrl, sendMail, emailShell, esc, isEmail } from '@/lib/portal-server'

export const runtime = 'nodejs'

// Carlos answers a client's note or question. The answer shows on the client's
// page and the client gets an email. Admin only.
export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const { clientEmail, clientName, docType, docId, docLabel, text } = await request.json()
    const msg = String(text || '').trim()
    if (!isEmail(clientEmail)) return NextResponse.json({ error: 'The client email is missing.' }, { status: 400 })
    if (!msg) return NextResponse.json({ error: 'Write your answer first.' }, { status: 400 })
    const client = await getOrCreateClient(clientEmail, clientName)
    await addMessage({ clientEmail: client.email, clientName: client.name, from: 'carlos', kind: 'reply', docType, docId, docLabel, text: msg })
    const url = portalUrl(client.token)
    await sendMail({
      to: client.email, subject: `CR Home Pros answered${docLabel ? `: ${docLabel}` : ' your message'}`,
      text: `Carlos from CR Home Pros wrote:\n\n${msg}\n\nSee it on your page: ${url}`,
      html: emailShell(`<p>Carlos from CR Home Pros wrote${docLabel ? ` about <strong>${esc(docLabel)}</strong>` : ''}:</p><p style="background:#f1f5f9;padding:14px;border-radius:8px;white-space:pre-wrap">${esc(msg)}</p>`, { label: 'Open your page', url }),
    })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Client message error:', e)
    return NextResponse.json({ error: e?.message || 'The answer could not be sent.' }, { status: 500 })
  }
}
