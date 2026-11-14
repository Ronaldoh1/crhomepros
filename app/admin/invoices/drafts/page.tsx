'use client'
import { DocumentList } from '../../_components/DocumentList'
export default function InvoicesDraftsPage() {
  return <DocumentList type="invoice" view="drafts" title="Invoices to Approve" createHref="/admin/invoices" createLabel="How invoices are made" otherHref="/admin/invoices/sent" />
}
