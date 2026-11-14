import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/verify-admin'
import { getAdminDb } from '@/lib/firebase-admin-server'
import { afterContractSigned } from '@/lib/contract-signed'

export const runtime = 'nodejs'
export const maxDuration = 60

// Creates the invoice for a signed contract that does not have one yet
// (contracts signed before invoices were automatic). One invoice per contract.
export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const { contractId } = await request.json()
    const db = getAdminDb()
    if (!db) return NextResponse.json({ error: 'The server database is not set up.' }, { status: 500 })
    const snap = await db.collection('admin_documents').doc(String(contractId || '')).get()
    const d = snap.data() as any
    if (!snap.exists || d.type !== 'contract') return NextResponse.json({ error: 'That contract was not found.' }, { status: 404 })
    if (d.status !== 'signed') return NextResponse.json({ error: 'An invoice can only be made from a signed contract.' }, { status: 400 })
    const made = await afterContractSigned(db, { id: snap.id, ...d }, d.clientSignature?.name || d.clientName || 'The client', 'paper')
    if (!made.invoiceId) return NextResponse.json({ error: 'The invoice could not be created.' }, { status: 500 })
    return NextResponse.json({ success: true, ...made })
  } catch (e: any) {
    console.error('Create invoice error:', e)
    return NextResponse.json({ error: e?.message || 'The invoice could not be created.' }, { status: 500 })
  }
}
