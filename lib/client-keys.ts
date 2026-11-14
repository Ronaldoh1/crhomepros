// How a client is recognized across estimates, contracts, invoices and referrals.
export const emailKey = (email?: string | null) => String(email || '').trim().toLowerCase()
/** Last 10 digits, so "(301) 555-0101" and "+1 301-555-0101" match */
export const phoneKey = (phone?: string | null) => {
  const digits = String(phone || '').replace(/\D/g, '')
  return digits.length >= 10 ? digits.slice(-10) : ''
}
