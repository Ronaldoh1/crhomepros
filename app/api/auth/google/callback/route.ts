// ============================================
// GET /api/auth/google/callback
// Handles OAuth2 callback from Google Drive authorization
// One-time setup: Carlos clicks "Connect Drive" in admin,
// authorizes, gets redirected here with code, we exchange for tokens.
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { getTokensFromCode } from '@/lib/google-drive'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const error = request.nextUrl.searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL('/admin?drive=error&msg=' + error, request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/admin?drive=error&msg=no_code', request.url))
  }

  try {
    const tokens = await getTokensFromCode(code)
    
    // In production, store this securely. For now, display it so it can be
    // copied to GOOGLE_DRIVE_REFRESH_TOKEN env variable.
    const refreshToken = tokens.refresh_token || 'No refresh token (already authorized?)'
    
    // Redirect to admin with success + token display
    const adminUrl = new URL('/admin', request.url)
    adminUrl.searchParams.set('drive', 'success')
    adminUrl.searchParams.set('token', refreshToken)
    
    return NextResponse.redirect(adminUrl)
  } catch (err: any) {
    console.error('Google OAuth error:', err)
    return NextResponse.redirect(
      new URL('/admin?drive=error&msg=' + encodeURIComponent(err.message || 'unknown'), request.url)
    )
  }
}
