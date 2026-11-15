import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/verify-admin'
import { getAdminDb } from '@/lib/firebase-admin-server'
import { addMessage, getOrCreateClient, sendMail, emailShell, esc, portalUrl } from '@/lib/portal-server'
import { paidSoFar, usd } from '@/lib/payment-plan'

export const runtime = 'nodejs'
export const maxDuration = 60

// Carlos cancels a contract (sent or signed). Admin only, and final:
//  - the contract is marked cancelled and stays on file, locked
//  - its invoice is voided (payments already received stay on record)
//  - the estimate is released, so a new contract can be drafted from it
//  - the past project is removed unless work photos were already added
export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const { contractId, reason, tellClient } = await request.json()
    const why = String(reason || '').trim().slice(0, 600)
    if (why.length < 3) return NextResponse.json({ error: 'Write the reason for cancelling. It is kept in your records.' }, { status: 400 })
    const db = getAdminDb()
    if (!db) return NextResponse.json({ error: 'The server database is not set up.' }, { status: 500 })
    const ref = db.collection('admin_documents').doc(String(contractId || ''))
    const today = new Date().toISOString().slice(0, 10)
    const stamp = { cancelledAt: new Date().toISOString(), cancelReason: why }

    const result = await db.runTransaction(async tx => {
      const snap = await tx.get(ref)
      const c = snap.data() as any
      if (!snap.exists || c.type !== 'contract') throw new Error('That contract was not found.')
      if (c.status === 'cancelled') throw new Error('This contract is already cancelled.')
      if (c.status !== 'sent' && c.status !== 'signed') throw new Error('Only a contract that was sent can be cancelled. Delete a draft instead.')
      const invRef = c.invoiceId ? db.collection('admin_documents').doc(c.invoiceId) : null
      const inv = invRef ? ((await tx.get(invRef)).data() as any) : null
      tx.update(ref, { status: 'cancelled', statusBeforeCancel: c.status, ...stamp, updatedAt: new Date() })
      if (invRef && inv && inv.status !== 'void') tx.update(invRef, { status: 'void', statusBeforeVoid: inv.status || 'draft', voidedAt: stamp.cancelledAt, voidReason: `Contract ${c.number || ''} was cancelled`, updatedAt: new Date() })
      return { contract: { id: snap.id, ...c }, invoice: inv ? { id: c.invoiceId, ...inv } : null }
    })
    const { contract, invoice } = result
    const received = invoice ? paidSoFar(invoice.payments || []) : 0

    // Release the estimate: it keeps its photos and price and can get a new contract
    try {
      if (contract.estimateId) {
        const nref = db.collection('field_notes').doc(contract.estimateId)
        const n = (await nref.get()).data() as any
        if (n && n.contractId === contract.id) {
          const { FieldValue } = await import('firebase-admin/firestore')
          await nref.set({
            contractId: FieldValue.delete(), status: n.status === 'discarded' ? 'discarded' : n.clientApproval?.signedAt ? 'accepted' : 'quoted',
            statusChangedAt: today, lastContractCancelled: contract.number || '', updatedAt: new Date(),
          }, { merge: true })
        }
      }
    } catch (e: any) { console.error('Estimate not released:', e?.message) }

    // The past project only stays if the job was really under way
    try {
      const pref = db.collection('past_projects').doc(contract.id)
      const p = (await pref.get()).data() as any
      if (p && !(p.afterPhotos || []).length && !p.published) await pref.delete()
      else if (p) await pref.set({ contractCancelled: true, updatedAt: new Date() }, { merge: true })
    } catch (e: any) { console.error('Past project not updated:', e?.message) }

    if (tellClient && contract.clientEmail) {
      try {
        const client = await getOrCreateClient(contract.clientEmail, contract.clientName, contract.clientPhone)
        const first = String(contract.clientName || '').split(' ')[0] || 'there'
        await sendMail({
          to: client.email, copyOffice: true,
          subject: `Cancelled: contract ${contract.number || ''} with CR Home Pros`,
          text: `Hi ${first},\n\nContract ${contract.number || ''} has been cancelled${invoice ? `, and invoice ${invoice.number || ''} is void. Nothing more is due on it` : ''}.${received > 0 ? `\n\nWe have ${usd(received)} on record as received. Carlos will contact you about it.` : ''}\n\nIf the job goes ahead with changes, we will send you a new contract.\n\nCarlos Hernandez\nCR Home Pros\n(571) 237-7164`,
          html: emailShell(`<p>Hi ${esc(first)},</p><p>Contract <strong>${esc(contract.number || '')}</strong> has been cancelled${invoice ? `, and invoice <strong>${esc(invoice.number || '')}</strong> is void. Nothing more is due on it` : ''}.</p>${received > 0 ? `<p>We have <strong>${esc(usd(received))}</strong> on record as received. Carlos will contact you about it.</p>` : ''}<p>If the job goes ahead with changes, we will send you a new contract.</p><p>Carlos Hernandez<br>CR Home Pros &middot; (571) 237-7164</p>`, { label: 'Open your page', url: portalUrl(client.token) }),
        })
      } catch (e: any) { console.error('Cancellation email failed:', e?.message) }
    }
    await addMessage({
      clientEmail: contract.clientEmail || 'unknown', clientName: contract.clientName, from: 'carlos', kind: 'reply', docType: 'contract', docId: contract.id, docLabel: `Contract ${contract.number || ''}`,
      text: `Contract ${contract.number || ''} was cancelled${invoice ? ` and invoice ${invoice.number || ''} voided` : ''}.`,
    }).catch(() => {})

    return NextResponse.json({ success: true, invoiceVoided: invoice?.number || '', received, estimateReleased: !!contract.estimateId })
  } catch (e: any) {
    console.error('Cancel contract error:', e)
    return NextResponse.json({ error: e?.message || 'The contract could not be cancelled.' }, { status: 400 })
  }
}
