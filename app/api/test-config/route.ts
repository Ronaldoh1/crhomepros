import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    email: {
      status: process.env.RESEND_API_KEY ? '✅ READY' : '❌ NOT CONFIGURED',
      provider: 'Resend',
      from: 'CR Home Pros <onboarding@resend.dev>',
      api_key_configured: !!process.env.RESEND_API_KEY,
    },
    google_drive: {
      status:
        process.env.GOOGLE_DRIVE_CLIENT_ID &&
        process.env.GOOGLE_DRIVE_CLIENT_SECRET &&
        process.env.GOOGLE_DRIVE_REFRESH_TOKEN
          ? '✅ READY'
          : '❌ NOT CONFIGURED',
      client_configured: !!(
        process.env.GOOGLE_DRIVE_CLIENT_ID &&
        process.env.GOOGLE_DRIVE_CLIENT_SECRET
      ),
      refresh_token_configured: !!process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
    },
  };

  const allReady =
    config.email.status === '✅ READY' &&
    config.google_drive.status === '✅ READY';

  return NextResponse.json({
    ...config,
    overall_status: allReady ? '✅ ALL SYSTEMS READY' : '⚠️ CONFIGURATION INCOMPLETE',
  });
}
