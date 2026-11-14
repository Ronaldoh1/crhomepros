// How a contract's total is split into payments. Used by the contract editor,
// the invoice, the PDFs and the server, so the amounts always agree.

export type PaymentPlan = 'thirds' | 'halves'

export interface Payment {
  label: string
  amount: number
  /** Carlos ticked "Payment received" */
  received?: boolean
  /** Day it was received (YYYY-MM-DD) */
  receivedAt?: string
}

export const PAYMENT_PLANS: Record<PaymentPlan, { name: string; parts: [number, string][] }> = {
  thirds: {
    name: '3 equal payments',
    parts: [
      [1 / 3, 'Payment 1: to start the job, when the contract is signed'],
      [1 / 3, 'Payment 2: while the work is being done, at the project midpoint'],
      [1 / 3, 'Payment 3: final payment, on completion and customer satisfaction'],
    ],
  },
  halves: {
    name: '50% / 50%',
    parts: [
      [0.5, 'Payment 1: to start the job, when the contract is signed'],
      [0.5, 'Payment 2: final payment, on completion and customer satisfaction'],
    ],
  },
}

export const usd = (n: number) => `$${(Math.round((Number(n) || 0) * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const cents = (n: number) => Math.round((Number(n) || 0) * 100)

/** Splits the total; the last payment absorbs the rounding so they add up exactly */
export function buildPayments(total: number, plan: PaymentPlan = 'thirds'): Payment[] {
  const parts = (PAYMENT_PLANS[plan] || PAYMENT_PLANS.thirds).parts
  let left = cents(total)
  return parts.map(([share, label], i) => {
    const c = i === parts.length - 1 ? left : Math.round(cents(total) * share)
    left -= c
    return { label, amount: c / 100, received: false }
  })
}

/** The payment lines written into the contract */
export const paymentLines = (payments: Payment[]) => payments.map(p => `${usd(p.amount)} USD. ${p.label}.`).join('\n')

export const paidSoFar = (payments: Payment[] = []) => payments.filter(p => p.received).reduce((s, p) => s + cents(p.amount), 0) / 100
export const balanceDue = (total: number, payments: Payment[] = []) => (cents(total) - cents(paidSoFar(payments))) / 100
/** The next payment the client owes, if any */
export const nextPayment = (payments: Payment[] = []) => payments.find(p => !p.received) || null

/** Sales tax on a price, to the cent */
export const taxOn = (price: number, ratePercent: number) => Math.round(cents(price) * (Number(ratePercent) || 0) / 100) / 100

/** Shown to the client on every estimate */
export const TAX_NOTE = 'Taxes are not included in this estimate. They are added in the contract and on the invoice.'
export const TAX_NOTE_ES = 'Los impuestos no están incluidos en este presupuesto. Se agregan en el contrato y en la factura.'
