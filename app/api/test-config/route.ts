import { NextResponse } from 'next/server'
import { isDriveConfigured } from '@/lib/google-drive'
import { isEmailConfigured } from '@/lib/email'

export async function GET() {
  const resendKey = process.env.RESEND_API_KEY
  const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID
  const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET
  const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN
  const emailFrom = process.env.EMAIL_FROM || 'CR Home Pros <onboarding@resend.dev>'
  const emailTo = process.env.EMAIL_TO_LEADS || 'crhomepros@gmail.com'

  const status = {
    email: {
      provider: 'Resend',
      from: emailFrom,
      to: emailTo,
      api_key_configured: !!(resendKey && resendKey.length > 5),
      api_key_length: resendKey?.length || 0,
      status: isEmailConfigured() ? '✅ READY' : '❌ MISSING OR INVALID API KEY',
    },
    google_drive: {
      configured: isDriveConfigured(),
      client_id_present: !!driveClientId,
      client_secret_present: !!driveClientSecret,
      refresh_token_present: !!(driveRefreshToken && driveRefreshToken.length > 10),
      refresh_token_length: driveRefreshToken?.length || 0,
      status: isDriveConfigured() ? '✅ READY' : '❌ MISSING CONFIG',
    },
    overall_status:
      isEmailConfigured() && isDriveConfigured()
        ? '✅ ALL SYSTEMS READY'
        : '⚠️ CONFIGURATION INCOMPLETE',
  }

  return NextResponse.json(status, { status: 200 })
}
