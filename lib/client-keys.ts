// How a client is recognized across estimates, contracts, invoices and referrals.
export const emailKey = (email?: string | null) => String(email || '').trim().toLowerCase()
/** Last 10 digits, so "(301) 555-0101" and "+1 301-555-0101" match */
export const phoneKey = (phone?: string | null) => {
  const digits = String(phone || '').replace(/\D/g, '')
  return digits.length >= 10 ? digits.slice(-10) : ''
}

// Walk-in / non-tech clients may have a phone but no email. We still give them a
// private portal link so they can sign by texted link. To reuse the whole
// email-keyed client + document model unchanged, we mint a stable placeholder
// address from their phone. It is never a real inbox and is never emailed to.
const WALKIN_EMAIL_DOMAIN = 'walkin.crhomepros.local'
/** A placeholder address derived from a phone, or '' if the phone is unusable. */
export const walkinEmailFromPhone = (phone?: string | null) => {
  const pk = phoneKey(phone)
  return pk ? `${pk}@${WALKIN_EMAIL_DOMAIN}` : ''
}
/** True for the placeholder addresses above — these must never be emailed. */
export const isWalkinEmail = (email?: string | null) => String(email || '').trim().toLowerCase().endsWith(`@${WALKIN_EMAIL_DOMAIN}`)
