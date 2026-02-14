import { NextRequest, NextResponse } from 'next/server'
import { logContactInDrive, isDriveConfigured } from '@/lib/google-drive'
import { sendContactFormNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, service } = body

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log to Google Drive
    if (isDriveConfigured()) {
      try {
        await logContactInDrive({ name, email, phone, message, service })
      } catch (driveError) {
        console.error('Google Drive error (non-fatal):', driveError)
      }
    }

    // Send email notification
    await sendContactFormNotification({ name, email, phone, message, service })

    return NextResponse.json({ success: true, message: 'Message sent!' })
  } catch (error) {
    console.error('Error processing contact:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
