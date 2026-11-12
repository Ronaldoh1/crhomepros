'use client'
import { DocumentList } from '../../_components/DocumentList'
export default function ContractsDraftsPage() {
  return <DocumentList type="contract" view="drafts" title="Draft Contracts" createHref="/admin/contracts" createLabel="New Contract" otherHref="/admin/contracts/sent" />
}
