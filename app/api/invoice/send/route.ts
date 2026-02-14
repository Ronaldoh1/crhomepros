import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder_key')
const FROM_EMAIL = process.env.EMAIL_FROM || 'CR Home Pros <noreply@crhomepros.com>'

export async function POST(request: NextRequest) {
  try {
    const invoice = await request.json()
    const { clientEmail, clientName, invoiceNumber, date, dueDate, projectName, items, notes, subtotal, tax, total, signatureData } = invoice

    if (!clientEmail || !clientName) {
      return NextResponse.json({ success: false, error: 'Missing client info' }, { status: 400 })
    }

    const itemRows = items.map((item: any) =>
      `<tr>
        <td style="padding:10px;border-bottom:1px solid #e5e7eb;">${item.description || '—'}</td>
        <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
        <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right;">$${Number(item.unitPrice).toFixed(2)}</td>
        <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;">$${(item.quantity * item.unitPrice).toFixed(2)}</td>
      </tr>`
    ).join('')

    const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#0f172a,#1e40af);padding:28px;color:white;">
        <table width="100%"><tr>
          <td><h1 style="margin:0;font-size:28px;">INVOICE</h1><p style="margin:4px 0 0;color:#94a3b8;">${invoiceNumber}</p></td>
          <td style="text-align:right;">
            <p style="margin:0;font-size:18px;font-weight:bold;">CR Home Pros</p>
            <p style="margin:4px 0 0;color:#94a3b8;font-size:12px;">Licensed & Insured • MHIC #05-132359</p>
            <p style="margin:2px 0 0;color:#94a3b8;font-size:12px;">crhomepros@gmail.com • (301) 602-2553</p>
          </td>
        </tr></table>
      </div>

      <div style="padding:24px;">
        <table width="100%"><tr>
          <td style="vertical-align:top;">
            <p style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0;">Bill To</p>
            <p style="font-weight:bold;margin:4px 0;">${clientName}</p>
            <p style="color:#6b7280;font-size:13px;margin:0;">${clientEmail}</p>
          </td>
          <td style="text-align:right;vertical-align:top;">
            <p style="font-size:13px;margin:2px 0;"><span style="color:#6b7280;">Date:</span> <b>${date}</b></p>
            <p style="font-size:13px;margin:2px 0;"><span style="color:#6b7280;">Due:</span> <b>${dueDate}</b></p>
            ${projectName ? `<p style="font-size:13px;margin:2px 0;"><span style="color:#6b7280;">Project:</span> <b>${projectName}</b></p>` : ''}
          </td>
        </tr></table>

        <table width="100%" style="margin-top:20px;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:2px solid #1e40af;">
              <th style="text-align:left;padding:10px;font-size:11px;color:#6b7280;text-transform:uppercase;">Description</th>
              <th style="text-align:center;padding:10px;font-size:11px;color:#6b7280;text-transform:uppercase;width:60px;">Qty</th>
              <th style="text-align:right;padding:10px;font-size:11px;color:#6b7280;text-transform:uppercase;width:90px;">Rate</th>
              <th style="text-align:right;padding:10px;font-size:11px;color:#6b7280;text-transform:uppercase;width:90px;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <div style="text-align:right;margin-top:16px;">
          <p style="margin:4px 0;font-size:14px;"><span style="color:#6b7280;">Subtotal:</span> $${Number(subtotal).toFixed(2)}</p>
          <p style="margin:4px 0;font-size:14px;"><span style="color:#6b7280;">Tax:</span> $${Number(tax).toFixed(2)}</p>
          <p style="margin:8px 0;font-size:20px;font-weight:bold;color:#1e40af;border-top:2px solid #e5e7eb;padding-top:8px;">Total: $${Number(total).toFixed(2)}</p>
        </div>

        ${notes ? `<div style="background:#f8fafc;padding:12px;border-radius:8px;margin-top:16px;"><p style="font-size:11px;color:#6b7280;margin:0 0 4px;text-transform:uppercase;">Notes</p><p style="font-size:13px;color:#374151;margin:0;white-space:pre-line;">${notes}</p></div>` : ''}

        ${signatureData ? `<div style="margin-top:20px;border-top:1px solid #e5e7eb;padding-top:12px;"><p style="font-size:11px;color:#6b7280;margin:0 0 4px;">Authorized Signature</p><img src="${signatureData}" alt="Signature" style="height:50px;"/><p style="font-size:13px;font-weight:600;margin:4px 0 0;">Carlos Hernandez — CR Home Pros</p></div>` : ''}
      </div>

      <div style="background:#0f172a;padding:14px;text-align:center;color:#6b7280;font-size:11px;">
        CR Home Pros | MHIC #05-132359 | (301) 602-2553 | crhomepros.com
      </div>
    </div>`

    await resend.emails.send({
      from: FROM_EMAIL,
      to: clientEmail,
      cc: process.env.EMAIL_TO_LEADS || 'crhomepros@gmail.com',
      subject: `Invoice ${invoiceNumber} from CR Home Pros — $${Number(total).toFixed(2)}`,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Invoice send error:', error)
    return NextResponse.json({ success: false, error: 'Failed to send invoice' }, { status: 500 })
  }
}
