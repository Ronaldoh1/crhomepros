// What happens the moment a contract is signed (online by the client, or
// marked "signed on paper" by Carlos). Server only.
//  1. The invoice for the contract is created, waiting for Carlos to approve and send
//  2. The estimate it came from is marked "In contract"
//  3. A past project is started, with the estimate photos as "before"
//  4. Carlos is notified, and both sides get the signed PDF
import type { Firestore } from 'firebase-admin/firestore'
import { emailKey, phoneKey } from './client-keys'
import { buildPayments, type PaymentPlan } from './payment-plan'
import { buildDocumentPdf } from './pdf-document'
import { addMessage, sendMail, emailShell, esc, portalUrl, pdfDataFromRecord, getOrCreateClient, SITE_URL, OFFICE_EMAIL } from './portal-server'

/** Next free INV-YEAR-0001 number (same rule as the admin editors) */
async function nextInvoiceNumber(db: Firestore): Promise<string> {
  const start = `INV-${new Date().getFullYear()}-`
  const snap = await db.collection('admin_documents').where('type', '==', 'invoice').get()
  let highest = 0
  snap.forEach(d => {
    const n = String(d.data().number || '')
    if (n.startsWith(start)) highest = Math.max(highest, parseInt(n.slice(start.length), 10) || 0)
  })
  return `${start}${String(highest + 1).padStart(4, '0')}`
}

export async function afterContractSigned(db: Firestore, contract: any, signerName: string, how: 'online' | 'paper') {
  const key = emailKey(contract.clientEmail)
  const today = new Date().toISOString().slice(0, 10)
  const title = contract.formData?.projectTitle || contract.projectName || 'Project'
  const out: { invoiceId?: string; invoiceNumber?: string } = {}

  // 1. One invoice per contract. The contract document id is reused, so a
  //    second signing attempt can never create a second invoice.
  try {
    const invRef = db.collection('admin_documents').doc(`inv-${contract.id}`)
    const existing = await invRef.get()
    if (existing.exists) {
      out.invoiceId = invRef.id; out.invoiceNumber = existing.data()?.number
    } else {
      const number = await nextInvoiceNumber(db)
      const subtotal = Number(contract.subtotal) || 0
      const taxRate = Number(contract.taxRate) || 0
      const total = Number(contract.total) || 0
      const plan: PaymentPlan = contract.paymentPlan === 'halves' ? 'halves' : 'thirds'
      const payments = (Array.isArray(contract.payments) && contract.payments.length ? contract.payments : buildPayments(total, plan))
        .map((p: any) => ({ label: p.label, amount: Number(p.amount) || 0, received: false }))
      await invRef.set({
        id: invRef.id, type: 'invoice', number, status: 'draft',
        contractId: contract.id, contractNumber: contract.number || '', estimateId: contract.estimateId || '',
        clientName: contract.clientName || '', clientEmail: contract.clientEmail || '', clientPhone: contract.clientPhone || '',
        clientAddress: contract.clientAddress || contract.propertyAddress || '',
        clientEmailKey: key, clientPhoneKey: phoneKey(contract.clientPhone),
        projectName: title, date: today, dueDate: '',
        items: [{ id: '1', description: `${title}, as agreed in contract ${contract.number || ''}`.trim(), quantity: 1, unitPrice: subtotal }],
        subtotal, taxRate, tax: Number(contract.tax) || 0, total,
        paymentPlan: plan, payments,
        notes: 'Thank you for choosing CR Home Pros!',
        signatureData: contract.signatureData || null,
        createdAt: new Date(), updatedAt: new Date(),
      })
      await db.collection('admin_documents').doc(contract.id).set({ invoiceId: invRef.id, invoiceNumber: number }, { merge: true })
      out.invoiceId = invRef.id; out.invoiceNumber = number
    }
  } catch (e: any) { console.error('Invoice not created:', e?.message) }

  // 2 + 3. Estimate and past project
  try {
    let estimateId = contract.estimateId || ''
    let note: any = null
    if (estimateId) note = (await db.collection('field_notes').doc(estimateId).get()).data()
    if (!note && key) {
      const cands = (await db.collection('field_notes').where('clientEmailKey', '==', key).get()).docs.map(d => ({ id: d.id, ...(d.data() as any) }))
        .filter(n => n.status !== 'discarded' && !n.contractId).sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
      if (cands[0]) { note = cands[0]; estimateId = cands[0].id }
    }
    if (note && estimateId && note.status !== 'discarded') {
      await db.collection('field_notes').doc(estimateId).set({ status: 'contracted', statusChangedAt: today, contractId: contract.id, updatedAt: new Date() }, { merge: true })
    }
    await db.collection('past_projects').doc(contract.id).set({
      contractId: contract.id, contractNumber: contract.number || '', estimateId,
      clientName: contract.clientName || '', clientEmail: contract.clientEmail || '', clientEmailKey: key,
      address: contract.propertyAddress || contract.clientAddress || '', title,
      workDone: (contract.items || []).map((i: any) => i.description).filter(Boolean).join('\n'),
      beforePhotos: (note?.photos || []).filter((p: string) => typeof p === 'string' && p.startsWith('https://')), beforePaths: note?.photoPaths || [],
      afterPhotos: [], afterPaths: [], status: 'in-progress', published: false, startedAt: today,
      createdAt: new Date(), updatedAt: new Date(),
    }, { merge: true })
  } catch (e: any) { console.error('Past project not created:', e?.message) }

  // 4. Tell Carlos, and send the signed copy
  await addMessage({
    clientEmail: contract.clientEmail, clientName: contract.clientName, from: 'system', kind: 'signed', docType: 'contract', docId: contract.id,
    docLabel: `Contract ${contract.number || ''}`,
    text: `${signerName} signed contract ${contract.number || ''}${how === 'paper' ? ' on paper' : ''}. Invoice ${out.invoiceNumber || ''} is ready for you to approve and send.`,
  }).catch(() => {})

  if (how === 'online') {
    // Carlos gets his own actionable email, straight to the invoice to approve
    await sendMail({
      to: OFFICE_EMAIL, subject: `${signerName} signed contract ${contract.number || ''} — invoice ${out.invoiceNumber || ''} ready`,
      text: `${signerName} signed contract ${contract.number || ''} online.\nInvoice ${out.invoiceNumber || ''} is ready to approve and send: ${SITE_URL}/admin/invoices?id=${out.invoiceId || ''}`,
      html: emailShell(`<p><strong>${esc(signerName)}</strong> signed contract <strong>${esc(contract.number || '')}</strong> online.</p><p>Invoice <strong>${esc(out.invoiceNumber || '')}</strong> was created and is ready for you to approve and send.</p>`, { label: 'Open the invoice', url: `${SITE_URL}/admin/invoices?id=${out.invoiceId || ''}` }, { office: true }),
    }).catch(e => console.error('Office sign email failed:', e?.message))
    try {
      const client = await getOrCreateClient(contract.clientEmail, contract.clientName, contract.clientPhone)
      const pdf = Buffer.from(await buildDocumentPdf('contract', pdfDataFromRecord(contract)))
      await sendMail({
        to: client.email,
        attachments: [{ filename: `contract-${String(contract.number || 'signed').replace(/[^\w.-]/g, '_')}-signed.pdf`, content: pdf }],
        subject: `Signed: contract ${contract.number || ''} with CR Home Pros`,
        text: `Thank you, ${signerName}. Your signed contract ${contract.number || ''} is attached.\n\nYour invoice will follow shortly.\n\nYour page: ${portalUrl(client.token)}`,
        html: emailShell(`<p>Thank you, ${esc(signerName)}.</p><p>Your contract <strong>${esc(contract.number || '')}</strong> is signed. A copy is attached for your records.</p><p>Your invoice, with the first payment to start the job, will follow shortly.</p>`, { label: 'Open your page', url: portalUrl(client.token) }),
      })
    } catch (e: any) { console.error('Signed-copy email failed:', e?.message) }
  } else {
    await sendMail({
      to: OFFICE_EMAIL, subject: `Contract ${contract.number || ''} marked as signed on paper`,
      text: `Invoice ${out.invoiceNumber || ''} is ready to approve and send: ${SITE_URL}/admin/invoices?id=${out.invoiceId || ''}`,
      html: emailShell(`<p>Contract <strong>${esc(contract.number || '')}</strong> for ${esc(contract.clientName || '')} was marked as signed on paper.</p><p>Invoice <strong>${esc(out.invoiceNumber || '')}</strong> is ready for you to approve and send.</p>`, { label: 'Open the invoice', url: `${SITE_URL}/admin/invoices?id=${out.invoiceId || ''}` }, { office: true }),
    }).catch(() => {})
  }
  return out
}
