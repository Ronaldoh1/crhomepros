'use client'
import { DocumentList } from '../../_components/DocumentList'
export default function ChangeOrdersDraftsPage() {
  return <DocumentList type="change-order" view="drafts" title="Draft Change Orders" createHref="/admin/change-orders" createLabel="New Change Order" otherHref="/admin/change-orders/sent" />
}
