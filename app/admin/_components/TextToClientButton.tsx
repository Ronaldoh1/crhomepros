'use client'

// Opens the Messages app (iPhone / Mac) with the client's number and a ready
// message that includes their private portal link. Carlos presses send himself
// from his own number — nothing is sent automatically, and there's no texting
// service or cost. The client taps the link and can review/sign on their page,
// so even a walk-in with a phone but no email gets a documented, signed record.

import { useState } from 'react'
import { MessageSquare, Loader2 } from 'lucide-react'
import { adminFetch } from '@/lib/admin-api'
import { useToast } from './Toast'

type DocType = 'estimate' | 'contract' | 'invoice'

// The composed message depends on the document type and the action the client
// should take. {n} is the document number (dropped when absent).
const MESSAGE: Record<DocType, { withNum: string; noNum: string }> = {
  estimate: {
    withNum: 'Here is your estimate {n} from CR Home Pros. You can review it and approve it here:',
    noNum: 'Here is your estimate from CR Home Pros. You can review it and approve it here:',
  },
  contract: {
    withNum: 'Here is your contract {n} from CR Home Pros. You can review it and sign it here:',
    noNum: 'Here is your contract from CR Home Pros. You can review it and sign it here:',
  },
  invoice: {
    withNum: 'Here is your invoice {n} from CR Home Pros. You can view it and the payment details here:',
    noNum: 'Here is your invoice from CR Home Pros. You can view it and the payment details here:',
  },
}

/** Normalize a phone to the sms: digits form; keep a leading + if present. */
function smsNumber(raw: string): string {
  const trimmed = (raw || '').trim()
  const plus = trimmed.startsWith('+')
  const digits = trimmed.replace(/[^\d]/g, '')
  return plus ? `+${digits}` : digits
}

export function TextToClientButton({
  email, phone, name, docType, docNumber, label, className, onSent,
}: {
  email?: string
  phone?: string
  name?: string
  docType: DocType
  docNumber?: string
  label?: string
  className?: string
  /** Called after the Messages app is opened, so the caller can log "texted"
   *  and, for a walk-in contract, mark it ready to sign. */
  onSent?: () => void | Promise<void>
}) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const go = async () => {
    const num = smsNumber(phone || '')
    if (!num || num.replace(/\D/g, '').length < 10) {
      toast("Add the client's mobile number to the document first.", 'error')
      return
    }
    setLoading(true)
    try {
      const res = await adminFetch('/api/admin/client-link', { email, name, phone })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || 'No link')
      const greeting = name ? `Hi ${name.split(' ')[0]}, ` : ''
      const tpl = docNumber ? MESSAGE[docType].withNum.replace('{n}', docNumber) : MESSAGE[docType].noNum
      const body = `${greeting}${tpl}\n${data.url}`
      // sms:NUMBER&body=... opens Messages on iPhone and Mac, pre-filled.
      const isApple = /iPhone|iPad|iPod|Mac/i.test(navigator.userAgent || navigator.platform || '')
      const href = `sms:${num}${isApple ? '&' : '?'}body=${encodeURIComponent(body)}`
      window.location.href = href
      if (onSent) await onSent()
    } catch (e) {
      toast(e instanceof Error && e.message !== 'No link' ? e.message : 'The link could not be built.', 'error')
    }
    setLoading(false)
  }

  return (
    <button
      onClick={go}
      disabled={loading}
      className={className || 'flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 text-sm disabled:opacity-50'}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />} {label || 'Text to client'}
    </button>
  )
}
