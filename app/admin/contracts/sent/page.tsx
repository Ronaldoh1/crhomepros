'use client'
import { DocumentList } from '../../_components/DocumentList'
export default function ContractsSentPage() {
  return <DocumentList type="contract" view="sent" title="Sent Contracts" createHref="/admin/contracts" createLabel="New Contract" otherHref="/admin/contracts/drafts" />
}
