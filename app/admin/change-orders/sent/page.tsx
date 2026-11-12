'use client'
import { DocumentList } from '../../_components/DocumentList'
export default function ChangeOrdersSentPage() {
  return <DocumentList type="change-order" view="sent" title="Sent Change Orders" createHref="/admin/change-orders" createLabel="New Change Order" otherHref="/admin/change-orders/drafts" />
}
