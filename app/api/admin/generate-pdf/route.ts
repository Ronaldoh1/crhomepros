import { NextRequest, NextResponse } from 'next/server'
import { buildDocumentPdf } from '@/lib/pdf-document'
import { verifyAdminRequest } from '@/lib/verify-admin'

export const runtime = 'nodejs'

// Builds the PDF for an invoice, change order or contract (admin only).
export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const { type, data } = await request.json()
    const pdf = await buildDocumentPdf(type, data || {})
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${type}-${String(data?.number || 'document').replace(/[^\w.-]/g, '_')}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ error: error?.message || 'PDF generation failed' }, { status: 500 })
  }
}
