import { NextRequest, NextResponse } from 'next/server'
import { logReferralInDrive, isDriveConfigured } from '@/lib/google-drive'
import { sendReferralNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { referrerName, referrerEmail, referrerPhone, referralName, referralPhone, projectType, projectDetails } = body

    if (!referrerName || !referrerEmail || !referralName || !referralPhone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log(`\n🤝 New Referral: ${referrerName} → ${referralName}`)

    // Log to Google Drive
    if (isDriveConfigured()) {
      try {
        await logReferralInDrive({ referrerName, referrerEmail, referrerPhone, referralName, referralPhone, projectType, projectDetails })
        console.log('✅ Referral logged to Google Drive')
      } catch (driveError: any) {
        console.error('❌ Google Drive error (non-fatal):', driveError?.message || driveError)
      }
    }

    // Send email notification
    try {
      await sendReferralNotification({ referrerName, referrerEmail, referrerPhone, referralName, referralPhone, projectType, projectDetails })
      console.log('📧 Referral notification sent ✅')
    } catch (emailError: any) {
      console.error('❌ Email error:', emailError?.message || emailError)
    }

    return NextResponse.json({ success: true, message: 'Referral submitted!' })
  } catch (error: any) {
    console.error('❌ Error processing referral:', error?.message || error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit referral' },
      { status: 500 }
    )
  }
}
