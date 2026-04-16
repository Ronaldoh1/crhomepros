import { NextRequest, NextResponse } from 'next/server'
import { createLeadInDrive, isDriveConfigured } from '@/lib/google-drive'
import { sendNewLeadNotification, sendLeadConfirmation, isEmailConfigured } from '@/lib/email'
import { saveLead } from '@/lib/firebase-admin-server'
import { isBundleLead, formatBundleEmailSubject, formatBundleEmailHeader } from '@/lib/banners'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      firstName, lastName, email, phone, preferredContact,
      address, city, state, zip, services,
      projectDescription, timeline, budget,
      additionalNotes, howDidYouHear,
      images,
      bannerId, promoCode, discountPercent, isBundle: isBundleFlag,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !address || !services?.length) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log(`\n🏠 New Lead: ${firstName} ${lastName} — ${services.join(', ')}`)

    // Save to Firebase (primary data store)
    try {
      await saveLead({
        firstName, lastName, email, phone, preferredContact,
        address, city, state, zip, services,
        projectDescription, timeline, budget,
        howDidYouHear, additionalNotes,
        bannerId: bannerId || null, promoCode: promoCode || null, discountPercent: discountPercent || 0, isBundle: bundleDetected,
      })
    } catch (fbError: any) {
      console.error('❌ Firebase save error (non-fatal):', fbError?.message || fbError)
    }

    // Bundle + promo detection
    const bundleDetected = isBundleFlag || isBundleLead(services || [])
    const promoInfo = promoCode ? { code: promoCode, discount: discountPercent || 0, bannerId: bannerId || '' } : null

    if (bundleDetected) {
      console.log('📦 BUNDLE LEAD detected: ' + services.join(' + '))
    }
    if (promoInfo) {
      console.log('🏷️ Promo: ' + promoInfo.code + ' (' + promoInfo.discount + '% off)')
    }

    // Generate communication tag
    const contactTag = preferredContact ? `[${preferredContact.toUpperCase()}]` : '[PHONE]'

    // Convert base64 images to Buffers
    const imageBuffers: Buffer[] = []
    const emailAttachments: { filename: string; content: Buffer }[] = []

    if (images && Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        try {
          const base64Data = images[i].replace(/^data:image\/\w+;base64,/, '')
          const buffer = Buffer.from(base64Data, 'base64')
          imageBuffers.push(buffer)
          const ext = images[i].startsWith('data:image/png') ? 'png' : 'jpg'
          emailAttachments.push({
            filename: `project-photo-${i + 1}.${ext}`,
            content: buffer,
          })
        } catch (e) {
          console.warn(`⚠️ Failed to decode image ${i}:`, e)
        }
      }
      console.log(`📸 ${imageBuffers.length} photo(s) processed`)
    }

    // Save lead to Google Drive
    let driveFolderUrl: string | undefined
    const folderName = `${firstName} ${lastName} - ${services[0] || 'General'} - ${new Date().toISOString().split('T')[0]}`

    if (isDriveConfigured()) {
      try {
        console.log('📁 Creating Google Drive folder...')
        const driveResult = await createLeadInDrive(
          {
            firstName, lastName, email, phone,
            preferredContact: preferredContact || 'phone',
            address, city: city || '', state: state || '', zip: zip || '',
            services, projectDescription: projectDescription || '',
            timeline: timeline || '', budget: budget || '',
            additionalNotes: additionalNotes || '',
            howDidYouHear: howDidYouHear || '',
          },
          imageBuffers.length > 0 ? imageBuffers : undefined
        )
        driveFolderUrl = driveResult.folderUrl
        console.log('✅ Google Drive folder created:', driveFolderUrl)
      } catch (driveError: any) {
        console.error('❌ Google Drive error (non-fatal):', driveError?.message || driveError)
      }
    } else {
      console.log('⏭️ Google Drive not configured — skipping folder creation')
    }

    // Send notification email to Carlos
    try {
      console.log('📧 Sending lead notification email...')
      const emailSent = await sendNewLeadNotification({
        firstName, lastName, email, phone,
        address, city: city || '', state: state || '',
        services, projectDescription: projectDescription || '',
        timeline: timeline || '', budget: budget || '',
        preferredContact: preferredContact || 'phone',
        contactTag,
        additionalNotes: additionalNotes || '',
        driveFolderUrl,
        driveFolderName: folderName,
        attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
      })
      console.log('📧 Lead notification result:', emailSent ? '✅ SUCCESS' : '❌ FAILED')
    } catch (emailError: any) {
      console.error('❌ Email send error:', emailError?.message || emailError)
    }

    // Send confirmation to customer
    try {
      console.log('📧 Sending confirmation email to customer...')
      const confirmSent = await sendLeadConfirmation(email, firstName)
      console.log('📧 Confirmation result:', confirmSent ? '✅ SUCCESS' : '❌ FAILED')
    } catch (emailError: any) {
      console.error('❌ Confirmation email error:', emailError?.message || emailError)
    }

    return NextResponse.json({
      success: true,
      driveFolderUrl,
      message: 'Lead submitted successfully',
    })
  } catch (error: any) {
    console.error('❌ Error submitting lead:', error?.message || error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit lead' },
      { status: 500 }
    )
  }
}
