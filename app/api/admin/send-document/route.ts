import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { buildDocumentPdf } from '@/lib/pdf-document'
import { verifyAdminRequest } from '@/lib/verify-admin'
import { getOrCreateClient, portalUrl, emailShell } from '@/lib/portal-server'

export const runtime = 'nodejs'

const OFFICE_EMAIL = 'crhomepros@gmail.com'
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Emails an invoice, change order or contract to the client with the PDF
// attached. Carlos gets a copy, and replies go to his inbox. Admin only.
export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const { type, data, to, subject, message } = await request.json()
    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return NextResponse.json({ error: 'The client email address is missing or not valid.' }, { status: 400 })
    }
    const key = process.env.RESEND_API_KEY
    if (!key) return NextResponse.json({ error: 'Email is not set up (RESEND_API_KEY missing).' }, { status: 500 })

    const pdf = await buildDocumentPdf(type, data || {})
    const filename = `${type}-${String(data?.number || 'document').replace(/[^\w.-]/g, '_')}.pdf`
    // Every client gets a private page; contracts are signed there
    let link = ''
    try { link = portalUrl((await getOrCreateClient(to, data?.clientName, data?.clientPhone)).token) } catch (e: any) { console.error('Client page link not created:', e?.message) }
    const isContract = type === 'contract'
    const linkLine = link ? (isContract ? `\n\nReview and sign it online here:\n${link}` : `\n\nSee all your documents here:\n${link}`) : ''
    const body = String(message || '') + linkLine
    const html = emailShell(
      `<div>${esc(String(message || '')).replace(/\n/g, '<br>')}</div>`,
      link ? { label: isContract ? 'Review and sign your contract' : 'See your documents', url: link } : undefined,
    )

    const resend = new Resend(key)
    const { data: sent, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'CR Home Pros <noreply@crhomepros.com>',
      to: [to],
      bcc: [OFFICE_EMAIL],
      reply_to: OFFICE_EMAIL,
      subject: String(subject || `${type} ${data?.number || ''}`),
      text: body,
      html,
      attachments: [{ filename, content: Buffer.from(pdf) }],
    })
    if (error) return NextResponse.json({ error: error.message || 'The email service rejected the message.' }, { status: 502 })
    return NextResponse.json({ success: true, id: sent?.id })
  } catch (error: any) {
    console.error('Send document error:', error)
    return NextResponse.json({ error: error?.message || 'Could not send the email.' }, { status: 500 })
  }
}
