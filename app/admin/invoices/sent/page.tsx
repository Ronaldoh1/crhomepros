'use client'
import { DocumentList } from '../../_components/DocumentList'
export default function InvoicesSentPage() {
  return <DocumentList type="invoice" view="sent" title="Sent Invoices" createHref="/admin/invoices" createLabel="New Invoice" otherHref="/admin/invoices/drafts" />
}
