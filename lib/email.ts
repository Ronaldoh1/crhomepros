// ============================================
// Email Service using Resend
// ============================================
import { Resend } from 'resend'

const RESEND_KEY = process.env.RESEND_API_KEY || ''
const resend = new Resend(RESEND_KEY)

const FROM_EMAIL = process.env.EMAIL_FROM || 'CR Home Pros <onboarding@resend.dev>'
const CARLOS_EMAIL = process.env.EMAIL_TO_LEADS || 'crhomepros@gmail.com'

// ============================================
// Interfaces
// ============================================

interface LeadEmailData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  services: string[]
  projectDescription: string
  timeline: string
  budget: string
  preferredContact?: string
  contactTag?: string
  additionalNotes?: string
  driveFolderUrl?: string
  driveFolderName?: string
  attachments?: { filename: string; content: Buffer }[]
}

interface ReferralEmailData {
  referrerName: string
  referrerEmail: string
  referrerPhone: string
  referralName: string
  referralPhone: string
  projectType: string
  projectDetails?: string
}

interface ContactEmailData {
  name: string
  email: string
  phone: string
  message: string
  service?: string
}

// ============================================
// Helper: Check if email is configured
// ============================================

export function isEmailConfigured(): boolean {
  return !!(RESEND_KEY && RESEND_KEY.length > 5 && RESEND_KEY !== 'placeholder_key')
}

// ============================================
// Send Functions
// ============================================

export async function sendNewLeadNotification(lead: LeadEmailData): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.error('❌ Email not configured — RESEND_API_KEY is missing or placeholder')
    return false
  }

  try {
    const tag = lead.contactTag || '[PHONE]'
    const contactMethodLabel = (lead.preferredContact || 'phone').toUpperCase()
    const contactMethodEmoji: Record<string, string> = {
      PHONE: '📞',
      EMAIL: '✉️',
      TEXT: '💬',
      WHATSAPP: '🟢',
    }
    const emoji = contactMethodEmoji[contactMethodLabel] || '📞'

    const driveSection = lead.driveFolderUrl
      ? `
      <div style="background: #ecfdf5; padding: 16px; margin-top: 16px; border-radius: 8px; border: 2px solid #10b981;">
        <p style="margin: 0 0 8px; font-size: 16px; font-weight: bold; color: #065f46;">📁 Google Drive Folder Created</p>
        <p style="margin: 0 0 4px; color: #047857; font-size: 14px;">
          <strong>Location:</strong> CR Home Pros → Project Leads → ${lead.driveFolderName || 'New Lead'}
        </p>
        <a href="${lead.driveFolderUrl}" style="display: inline-block; margin-top: 8px; padding: 10px 20px; background: #059669; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
          🗂️ Open Folder in Drive
        </a>
      </div>`
      : ''

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: CARLOS_EMAIL,
      subject: `🔥 ${tag} New Lead: ${lead.firstName} ${lead.lastName} - ${lead.services.join(', ')}`,
      attachments: lead.attachments?.map(a => ({
        filename: a.filename,
        content: a.content,
      })),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af, #0f172a); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🏠 New Project Lead!</h1>
            <p style="color: #c4a052; margin: 8px 0 0; font-size: 16px; font-weight: bold;">
              ${emoji} Preferred Contact: ${contactMethodLabel}
            </p>
          </div>

          <div style="padding: 20px; background: #f8fafc;">
            ${driveSection}

            <h2 style="color: #1e40af; margin-top: 20px;">Contact Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${lead.firstName} ${lead.lastName}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Address:</td><td style="padding: 8px;">${lead.address}, ${lead.city}, ${lead.state}</td></tr>
            </table>

            <h2 style="color: #1e40af; margin-top: 20px;">Project Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold;">Services:</td><td style="padding: 8px;">${lead.services.join(', ')}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Timeline:</td><td style="padding: 8px;">${lead.timeline}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Budget:</td><td style="padding: 8px;">${lead.budget}</td></tr>
            </table>

            <div style="background: white; padding: 15px; margin-top: 20px; border-radius: 8px; border-left: 4px solid #c4a052;">
              <p style="margin: 0; font-weight: bold;">Project Description:</p>
              <p style="margin: 10px 0 0 0;">${lead.projectDescription}</p>
            </div>

            ${lead.additionalNotes ? `
            <div style="background: white; padding: 15px; margin-top: 12px; border-radius: 8px; border-left: 4px solid #94a3b8;">
              <p style="margin: 0; font-weight: bold;">Additional Notes:</p>
              <p style="margin: 10px 0 0 0;">${lead.additionalNotes}</p>
            </div>` : ''}

            ${lead.attachments && lead.attachments.length > 0 ? `
            <div style="background: #fef3c7; padding: 12px; margin-top: 12px; border-radius: 8px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">📸 ${lead.attachments.length} photo(s) attached below</p>
            </div>` : ''}
          </div>

          <div style="background: #c4a052; padding: 15px; text-align: center;">
            ${contactMethodLabel === 'WHATSAPP'
              ? `<a href="https://wa.me/${lead.phone.replace(/\\D/g, '')}" style="color: #0f172a; font-weight: bold; font-size: 18px; text-decoration: none;">🟢 Reply via WhatsApp</a>`
              : `<a href="tel:${lead.phone}" style="color: #0f172a; font-weight: bold; font-size: 18px; text-decoration: none;">📞 Call Now: ${lead.phone}</a>`
            }
          </div>
        </div>
      `,
    })

    if (result.error) { console.error('❌ Lead email error:', JSON.stringify(result.error)); return false; } console.log('📧 Lead notification sent:', result.data?.id)
    return true
  } catch (error: any) {
    console.error('❌ Failed to send lead notification:', error?.message || error)
    return false
  }
}

export async function sendLeadConfirmation(customerEmail: string, firstName: string): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.error('❌ Email not configured — skipping customer confirmation')
    return false
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: '✅ CR Home Pros — We Received Your Request!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af, #0f172a); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Thank You, ${firstName}!</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <p style="font-size: 16px; color: #334155;">We've received your project details and our team is reviewing them now.</p>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #c4a052; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: #1e40af;">What Happens Next:</p>
              <ul style="margin: 10px 0 0; padding-left: 20px; color: #475569;">
                <li>We'll review your project details within 24 hours</li>
                <li>A team member will contact you to schedule a free on-site consultation</li>
                <li>You'll receive a detailed written estimate</li>
              </ul>
            </div>
            <p style="color: #64748b; font-size: 14px;">
              Need to reach us sooner? Call <a href="tel:+15712377164" style="color: #1e40af;">(571) 237-7164</a>
            </p>
          </div>
          <div style="background: #0f172a; padding: 15px; text-align: center;">
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">CR Home Pros | Licensed (MHIC #05-132359) & Insured | crhomepros.com</p>
          </div>
        </div>
      `,
    })

    if (result.error) { console.error('❌ Confirmation email error:', JSON.stringify(result.error)); return false; } console.log('📧 Confirmation email sent to', customerEmail, result.data?.id)
    return true
  } catch (error: any) {
    console.error('❌ Failed to send confirmation email:', error?.message || error)
    return false
  }
}

export async function sendReferralNotification(referral: ReferralEmailData): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.error('❌ Email not configured — skipping referral notification')
    return false
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: CARLOS_EMAIL,
      subject: `🤝 New Referral from ${referral.referrerName}: ${referral.referralName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #059669, #0f172a); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🤝 New Referral!</h1>
          </div>
          <div style="padding: 20px; background: #f8fafc;">
            <h2 style="color: #059669;">Referred By</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${referral.referrerName}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${referral.referrerEmail}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${referral.referrerPhone}</td></tr>
            </table>
            <h2 style="color: #1e40af; margin-top: 20px;">Referred Person</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${referral.referralName}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${referral.referralPhone}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Project:</td><td style="padding: 8px;">${referral.projectType}</td></tr>
            </table>
            ${referral.projectDetails ? `
            <div style="background: white; padding: 15px; margin-top: 12px; border-radius: 8px; border-left: 4px solid #059669;">
              <p style="margin: 0; font-weight: bold;">Details:</p>
              <p style="margin: 10px 0 0 0;">${referral.projectDetails}</p>
            </div>` : ''}
          </div>
          <div style="background: #059669; padding: 15px; text-align: center;">
            <a href="tel:${referral.referralPhone}" style="color: white; font-weight: bold; font-size: 18px; text-decoration: none;">📞 Call ${referral.referralName}: ${referral.referralPhone}</a>
          </div>
        </div>
      `,
    })
    return true
  } catch (error: any) {
    console.error('❌ Failed to send referral notification:', error?.message || error)
    return false
  }
}

export async function sendContactFormNotification(data: ContactEmailData): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.error('❌ Email not configured — skipping contact notification')
    return false
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: CARLOS_EMAIL,
      subject: `💬 New Message from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af, #0f172a); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">💬 New Contact Message</h1>
          </div>
          <div style="padding: 20px; background: #f8fafc;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${data.name}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${data.email}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${data.phone}</td></tr>
              ${data.service ? `<tr><td style="padding: 8px; font-weight: bold;">Service:</td><td style="padding: 8px;">${data.service}</td></tr>` : ''}
            </table>
            <div style="background: white; padding: 15px; margin-top: 12px; border-radius: 8px; border-left: 4px solid #1e40af;">
              <p style="margin: 0; font-weight: bold;">Message:</p>
              <p style="margin: 10px 0 0 0;">${data.message}</p>
            </div>
          </div>
          <div style="background: #c4a052; padding: 15px; text-align: center;">
            <a href="tel:${data.phone}" style="color: #0f172a; font-weight: bold; font-size: 18px; text-decoration: none;">📞 Call: ${data.phone}</a>
          </div>
        </div>
      `,
    })
    return true
  } catch (error: any) {
    console.error('❌ Failed to send contact notification:', error?.message || error)
    return false
  }
}
