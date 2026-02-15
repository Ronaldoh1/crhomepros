import { NextRequest, NextResponse } from 'next/server'
import { createReferralInDrive, isDriveConfigured } from '@/lib/google-drive'
import { sendNewReferralNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      referrerName, referrerEmail, referrerPhone,
      referralName, referralPhone, referralEmail,
      projectType, projectDetails, paymentMethod,
    } = body

    if (!referrerName || !referrerEmail || !referralName || !referralPhone || !projectType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save to Google Drive
    let driveFolderUrl: string | undefined

    if (isDriveConfigured()) {
      try {
        const result = await createReferralInDrive({
          referrerName, referrerEmail, referrerPhone,
          referralName, referralPhone, referralEmail,
          projectType, projectDetails, paymentMethod,
        })
        driveFolderUrl = result.folderUrl
      } catch (driveError) {
        console.error('Google Drive error (non-fatal):', driveError)
      }
    }

    // Send email notification
    await sendNewReferralNotification({
      referrerName, referrerEmail, referrerPhone,
      referralName, referralPhone,
      projectType, projectDetails,
    })

    return NextResponse.json({
      success: true,
      driveFolderUrl,
      message: 'Referral submitted successfully',
    })
  } catch (error) {
    console.error('Error submitting referral:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit referral' },
      { status: 500 }
    )
  }
}
