// ============================================
// Email Service using Resend
// ============================================

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder_key')

const FROM_EMAIL = process.env.EMAIL_FROM || 'CR Home Pros <noreply@crhomepros.com>'
const CARLOS_EMAIL = process.env.EMAIL_TO_LEADS || 'crhomepros@gmail.com'

// ============================================
// Email Templates
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
// Send Functions
// ============================================

export async function sendNewLeadNotification(lead: LeadEmailData): Promise<boolean> {
  try {
    const tag = lead.contactTag || '[PHONE]'
    const contactMethodLabel = (lead.preferredContact || 'phone').toUpperCase()
    const contactMethodEmoji = {
      'PHONE': '📞',
      'EMAIL': '✉️',
      'TEXT': '💬',
      'WHATSAPP': '🟢',
    }[contactMethodLabel] || '📞'

    await resend.emails.send({
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
              ${contactMethodEmoji} Prefers: ${contactMethodLabel}
            </p>
          </div>
          
          <div style="padding: 20px; background: #f8fafc;">
            <div style="background: ${contactMethodLabel === 'WHATSAPP' ? '#25D366' : contactMethodLabel === 'TEXT' ? '#3b82f6' : contactMethodLabel === 'EMAIL' ? '#8b5cf6' : '#1e40af'}; color: white; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; font-weight: bold; font-size: 14px;">
              ${contactMethodEmoji} PREFERRED CONTACT: ${contactMethodLabel} ${contactMethodLabel === 'WHATSAPP' ? '— Open WhatsApp: wa.me/' + lead.phone.replace(/\\D/g, '') : contactMethodLabel === 'TEXT' ? '— Send text to: ' + lead.phone : ''}
            </div>

            <h2 style="color: #1e40af;">Contact Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold;">Name:</td>
                <td style="padding: 8px;">${lead.firstName} ${lead.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Phone:</td>
                <td style="padding: 8px;"><a href="tel:${lead.phone}">${lead.phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Email:</td>
                <td style="padding: 8px;"><a href="mailto:${lead.email}">${lead.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Address:</td>
                <td style="padding: 8px;">${lead.address}, ${lead.city}, ${lead.state}</td>
              </tr>
            </table>
            
            <h2 style="color: #1e40af; margin-top: 20px;">Project Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold;">Services:</td>
                <td style="padding: 8px;">${lead.services.join(', ')}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Timeline:</td>
                <td style="padding: 8px;">${lead.timeline}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Budget:</td>
                <td style="padding: 8px;">${lead.budget}</td>
              </tr>
            </table>
            
            <div style="background: white; padding: 15px; margin-top: 20px; border-radius: 8px; border-left: 4px solid #c4a052;">
              <p style="margin: 0; font-weight: bold;">Project Description:</p>
              <p style="margin: 10px 0 0 0;">${lead.projectDescription}</p>
            </div>

            ${lead.additionalNotes ? `
            <div style="background: white; padding: 15px; margin-top: 12px; border-radius: 8px; border-left: 4px solid #94a3b8;">
              <p style="margin: 0; font-weight: bold;">Additional Notes:</p>
              <p style="margin: 10px 0 0 0;">${lead.additionalNotes}</p>
            </div>
            ` : ''}

            ${lead.driveFolderUrl ? `
            <div style="background: #e0f2fe; padding: 15px; margin-top: 12px; border-radius: 8px; border-left: 4px solid #0ea5e9; text-align: center;">
              <a href="${lead.driveFolderUrl}" style="color: #0369a1; font-weight: bold; font-size: 16px; text-decoration: none;">
                📁 Open Lead Folder in Google Drive
              </a>
            </div>
            ` : ''}

            ${lead.attachments && lead.attachments.length > 0 ? `
            <div style="background: #fef3c7; padding: 12px; margin-top: 12px; border-radius: 8px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">📸 ${lead.attachments.length} photo(s) attached below</p>
            </div>
            ` : ''}
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
    
    return true
  } catch (error) {
    console.error('Error sending lead notification:', error)
    return false
  }
}

export async function sendNewReferralNotification(referral: ReferralEmailData): Promise<boolean> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: CARLOS_EMAIL,
      subject: `💰 New Referral from ${referral.referrerName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #c4a052, #a08941); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">💰 New Referral!</h1>
          </div>
          
          <div style="padding: 20px; background: #f8fafc;">
            <h2 style="color: #1e40af;">Referrer Information</h2>
            <p><strong>Name:</strong> ${referral.referrerName}</p>
            <p><strong>Email:</strong> ${referral.referrerEmail}</p>
            <p><strong>Phone:</strong> ${referral.referrerPhone}</p>
            
            <h2 style="color: #1e40af; margin-top: 20px;">Referred Person</h2>
            <p><strong>Name:</strong> ${referral.referralName}</p>
            <p><strong>Phone:</strong> <a href="tel:${referral.referralPhone}">${referral.referralPhone}</a></p>
            <p><strong>Project Type:</strong> ${referral.projectType}</p>
            ${referral.projectDetails ? `<p><strong>Details:</strong> ${referral.projectDetails}</p>` : ''}
          </div>
          
          <div style="background: #1e40af; padding: 15px; text-align: center;">
            <a href="tel:${referral.referralPhone}" style="color: white; font-weight: bold; font-size: 18px; text-decoration: none;">
              📞 Call Referral: ${referral.referralPhone}
            </a>
          </div>
        </div>
      `,
    })
    
    return true
  } catch (error) {
    console.error('Error sending referral notification:', error)
    return false
  }
}

export async function sendContactFormNotification(contact: ContactEmailData): Promise<boolean> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: CARLOS_EMAIL,
      subject: `📬 Contact Form: ${contact.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1e40af; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">📬 New Contact Message</h1>
          </div>
          
          <div style="padding: 20px; background: #f8fafc;">
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${contact.phone}">${contact.phone}</a></p>
            ${contact.service ? `<p><strong>Service:</strong> ${contact.service}</p>` : ''}
            
            <div style="background: white; padding: 15px; margin-top: 15px; border-radius: 8px;">
              <p style="margin: 0; font-weight: bold;">Message:</p>
              <p style="margin: 10px 0 0 0;">${contact.message}</p>
            </div>
          </div>
          
          <div style="background: #c4a052; padding: 15px; text-align: center;">
            <a href="tel:${contact.phone}" style="color: #0f172a; font-weight: bold; text-decoration: none;">
              📞 ${contact.phone}
            </a>
          </div>
        </div>
      `,
    })
    
    return true
  } catch (error) {
    console.error('Error sending contact notification:', error)
    return false
  }
}

// Auto-reply to customer
export async function sendLeadConfirmation(email: string, firstName: string): Promise<boolean> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Thank you for contacting CR Home Pros!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af, #0f172a); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">CR Home Pros</h1>
            <p style="color: #c4a052; margin: 10px 0 0 0;">Your Home. Our Expertise.</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #1e40af;">Thank You, ${firstName}!</h2>
            <p>We've received your project request and are excited to help transform your home!</p>
            
            <p><strong>What happens next:</strong></p>
            <ul>
              <li>Our team will review your project details</li>
              <li>We'll contact you within 24 hours</li>
              <li>We'll schedule a free on-site consultation</li>
              <li>You'll receive a detailed, no-obligation estimate</li>
            </ul>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Need immediate assistance?</strong></p>
              <p style="margin: 10px 0 0 0;">
                Call us at <a href="tel:5712377164" style="color: #1e40af; font-weight: bold;">(571) 237-7164</a>
              </p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
                🌎 ¡Hablamos Español!
              </p>
            </div>
            
            <p>We look forward to working with you!</p>
            <p><strong>Carlos Hernandez</strong><br>Owner, CR Home Pros</p>
          </div>
          
          <div style="background: #0f172a; padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>CR Home Pros | MHIC #05-132359 | Licensed & Insured</p>
            <p>6509 Perry Ct, Hyattsville, MD 20784</p>
          </div>
        </div>
      `,
    })
    
    return true
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return false
  }
}
