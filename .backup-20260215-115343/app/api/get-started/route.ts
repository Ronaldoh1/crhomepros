import { NextRequest, NextResponse } from 'next/server'
import { createLeadInDrive, isDriveConfigured } from '@/lib/google-drive'
import { sendNewLeadNotification, sendLeadConfirmation } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      firstName, lastName, email, phone, preferredContact,
      address, city, state, zip, services,
      projectDescription, timeline, budget,
      additionalNotes, howDidYouHear,
      images, // base64 encoded images from form
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !address || !services?.length) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate communication tag
    const contactTag = preferredContact ? `[${preferredContact.toUpperCase()}]` : '[PHONE]'

    // Convert base64 images to Buffers for email attachments + Drive upload
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
          console.warn(`Failed to decode image ${i}:`, e)
        }
      }
    }

    // Save lead to Google Drive (if configured)
    let driveFolderUrl: string | undefined
    let folderName: string | undefined

    if (isDriveConfigured()) {
      try {
        const date = new Date().toISOString().split('T')[0]
        const primaryService = services[0] || 'General'
        folderName = `${firstName} ${lastName} - ${primaryService} - ${date}`
        
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
      } catch (driveError) {
        console.error('Google Drive error (non-fatal):', driveError)
      }
    }

    // Send notification email with image attachments + Drive link
    try {
      console.log('📧 Sending lead notification email...')
      const emailSent = await sendNewLeadNotification({
        firstName, lastName, email, phone,
        address, city, state, services,
        projectDescription, timeline, budget,
        preferredContact: preferredContact || 'phone',
        contactTag,
        additionalNotes: additionalNotes || '',
        driveFolderUrl,
        attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
      })
      console.log('📧 Lead notification email result:', emailSent ? '✅ SUCCESS' : '❌ FAILED')
    } catch (emailError) {
      console.error('❌ Failed to send lead notification email:', emailError)
    }

    // Send confirmation to customer
    try {
      console.log('📧 Sending confirmation email to customer...')
      const confirmSent = await sendLeadConfirmation(email, firstName)
      console.log('📧 Confirmation email result:', confirmSent ? '✅ SUCCESS' : '❌ FAILED')
    } catch (emailError) {
      console.error('❌ Failed to send confirmation email:', emailError)
    }

    return NextResponse.json({
      success: true,
      driveFolderUrl,
      message: 'Lead submitted successfully',
    })
  } catch (error) {
    console.error('Error submitting lead:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit lead' },
      { status: 500 }
    )
  }
}
