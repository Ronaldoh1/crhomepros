import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/verify-admin'
import { getAdminDb } from '@/lib/firebase-admin-server'
import { afterContractSigned } from '@/lib/contract-signed'

export const runtime = 'nodejs'
export const maxDuration = 60

// Carlos marks a sent contract as signed on paper. The same things happen as
// when a client signs online: the invoice is created and a past project starts.
export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const { contractId, signerName } = await request.json()
    const db = getAdminDb()
    if (!db) return NextResponse.json({ error: 'The server database is not set up.' }, { status: 500 })
    const ref = db.collection('admin_documents').doc(String(contractId || ''))
    const name = String(signerName || '').trim().slice(0, 120)
    const signedAt = new Date().toISOString()
    const contract = await db.runTransaction(async tx => {
      const snap = await tx.get(ref)
      const d = snap.data() as any
      if (!snap.exists || d.type !== 'contract') throw new Error('That contract was not found.')
      if (d.status === 'signed') throw new Error('This contract is already signed.')
      if (d.status !== 'sent') throw new Error('Send the contract to the client first.')
      const clientSignature = { name: name || d.clientName || '', signedAt, method: 'paper' }
      tx.update(ref, { status: 'signed', clientSignature, signedAt: new Date(), updatedAt: new Date() })
      return { id: snap.id, ...d, status: 'signed', clientSignature }
    })
    const made = await afterContractSigned(db, contract, contract.clientSignature.name, 'paper')
    return NextResponse.json({ success: true, signedAt, ...made })
  } catch (e: any) {
    console.error('Paper-signed error:', e)
    return NextResponse.json({ error: e?.message || 'The contract could not be marked as signed.' }, { status: 400 })
  }
}
