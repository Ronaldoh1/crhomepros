import { NextRequest, NextResponse } from 'next/server'
import { createReferralInDrive, isDriveConfigured } from '@/lib/google-drive'
import { sendReferralNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { referrerName, referrerEmail, referrerPhone, referralName, referralPhone, referralEmail, projectType, projectDetails, paymentMethod } = body

    if (!referrerName || !referrerEmail || !referralName || !referralPhone) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    console.log(`\n🤝 New Referral: ${referrerName} → ${referralName}`)

    if (isDriveConfigured()) {
      try {
        await createReferralInDrive({
          referrerName,
          referrerEmail,
          referrerPhone,
          referralName,
          referralPhone,
          referralEmail: referralEmail || '',
          projectType: projectType || '',
          projectDetails: projectDetails || '',
          paymentMethod: paymentMethod || 'Not specified',
        })
        console.log('✅ Referral logged to Google Drive')
      } catch (driveError: any) {
        console.error('❌ Drive error (non-fatal):', driveError?.message)
      }
    }

    try {
      await sendReferralNotification({ referrerName, referrerEmail, referrerPhone, referralName, referralPhone, projectType, projectDetails })
      console.log('📧 Referral notification sent ✅')
    } catch (emailError: any) {
      console.error('❌ Email error:', emailError?.message)
    }

    return NextResponse.json({ success: true, message: 'Referral submitted!' })
  } catch (error: any) {
    console.error('❌ Error processing referral:', error?.message)
    return NextResponse.json({ success: false, error: 'Failed to submit referral' }, { status: 500 })
  }
}
