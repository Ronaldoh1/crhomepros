'use client'

// Opens the Messages app (iPhone / Mac) with the client's number and a ready
// message that includes their private portal link. Carlos presses send himself
// from his own number — nothing is sent automatically, and there's no texting
// service or cost. The client taps the link and can review/sign on their page.

import { useState } from 'react'
import { MessageSquare, Loader2 } from 'lucide-react'
import { adminFetch } from '@/lib/admin-api'
import { useToast } from './Toast'

type DocType = 'estimate' | 'contract' | 'invoice'

const LEAD: Record<DocType, string> = {
  estimate: 'Here is your estimate from CR Home Pros',
  contract: 'Here is your contract from CR Home Pros — you can review and sign it here',
  invoice: 'Here is your invoice from CR Home Pros',
}

/** Normalize a phone to the tel/sms digits form; keep a leading + if present. */
function smsNumber(raw: string): string {
  const trimmed = (raw || '').trim()
  const plus = trimmed.startsWith('+')
  const digits = trimmed.replace(/[^\d]/g, '')
  return plus ? `+${digits}` : digits
}

export function TextToClientButton({
  email, phone, name, docType, docNumber, className,
}: {
  email?: string
  phone?: string
  name?: string
  docType: DocType
  docNumber?: string
  className?: string
}) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const go = async () => {
    const num = smsNumber(phone || '')
    if (!num || num.replace(/\D/g, '').length < 10) {
      toast("Add the client's mobile number to the document first.", 'error')
      return
    }
    if (!email) {
      toast("Add the client's email first — the private link is tied to it.", 'error')
      return
    }
    setLoading(true)
    try {
      const res = await adminFetch('/api/admin/client-link', { email, name, phone })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || 'No link')
      const greeting = name ? `Hi ${name.split(' ')[0]}, ` : ''
      const numText = docNumber ? ` (${docNumber})` : ''
      const body = `${greeting}${LEAD[docType]}${numText}:\n${data.url}`
      // sms:NUMBER&body=... opens Messages on iPhone and Mac, pre-filled.
      // Apple platforms use sms:NUMBER&body=... ; others use ?body=...
      const isApple = /iPhone|iPad|iPod|Mac/i.test(navigator.userAgent || navigator.platform || '')
      const href = `sms:${num}${isApple ? '&' : '?'}body=${encodeURIComponent(body)}`
      window.location.href = href
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
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />} Text to client
    </button>
  )
}
