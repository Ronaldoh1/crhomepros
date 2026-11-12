import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { buildDocumentPdf } from '@/lib/pdf-document'
import { verifyAdminRequest } from '@/lib/verify-admin'

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
    const body = String(message || '')
    const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#0f172a;max-width:640px">${esc(body).replace(/\n/g, '<br>')}</div>`

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
