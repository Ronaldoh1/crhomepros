import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/verify-admin'
import { getOrCreateClient, portalUrl } from '@/lib/portal-server'
import { walkinEmailFromPhone } from '@/lib/client-keys'

export const runtime = 'nodejs'

// Returns a client's private portal link (creating the client record if needed),
// so the admin can drop it into a text message composed in the Messages app.
// Works for a walk-in client who has a phone but no email, by minting a stable
// placeholder address from the phone. Nothing is emailed or sent from here.
// Admin only.
export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const { email, name, phone } = await request.json()
    const realEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : ''
    // No real email? Build one from the phone so a walk-in can still get a link.
    const useEmail = realEmail || walkinEmailFromPhone(phone)
    if (!useEmail) {
      return NextResponse.json({ error: "A valid client email or mobile number is needed to build the link." }, { status: 400 })
    }
    const client = await getOrCreateClient(useEmail, name, phone)
    return NextResponse.json({ url: portalUrl(client.token) })
  } catch (e: any) {
    console.error('client-link failed:', e?.message)
    return NextResponse.json({ error: 'The client link could not be created.' }, { status: 500 })
  }
}
