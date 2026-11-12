'use client'
import { DocumentList } from '../../_components/DocumentList'
export default function InvoicesDraftsPage() {
  return <DocumentList type="invoice" view="drafts" title="Draft Invoices" createHref="/admin/invoices" createLabel="New Invoice" otherHref="/admin/invoices/sent" />
}
