import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin-server'
import { emailKey } from '@/lib/client-keys'
import { buildDocumentPdf } from '@/lib/pdf-document'
import { findClientByToken, pdfDataFromRecord } from '@/lib/portal-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// PDF of one of the client's own sent contracts or invoices
export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const client = await findClientByToken(params.token)
    const db = getAdminDb()
    const id = req.nextUrl.searchParams.get('doc') || ''
    if (!client || !db || !id) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const snap = await db.collection('admin_documents').doc(id).get()
    const d = snap.data() as any
    if (!snap.exists || d.clientEmailKey !== emailKey(client.email) || !d.status || d.status === 'draft' || !['contract', 'invoice'].includes(d.type)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const pdf = await buildDocumentPdf(d.type, pdfDataFromRecord(d))
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${d.type}-${String(d.number || 'document').replace(/[^\w.-]/g, '_')}.pdf"`,
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (e: any) {
    console.error('Portal PDF error:', e)
    return NextResponse.json({ error: 'The PDF could not be created.' }, { status: 500 })
  }
}
