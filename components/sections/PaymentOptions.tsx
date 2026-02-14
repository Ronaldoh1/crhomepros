'use client'

import Link from 'next/link'
import { CreditCard, Smartphone, DollarSign, Clock, Shield, FileText, Percent, ArrowRight } from 'lucide-react'

const iconMap: Record<string, any> = {
  CreditCard, Smartphone, DollarSign, Clock, Shield, FileText, Percent,
}

const paymentMethods = [
  { name: 'Credit & Debit Cards', nameEs: 'Tarjetas', icon: 'CreditCard', detail: 'Visa, Mastercard, Amex, Discover' },
  { name: 'Zelle', nameEs: 'Zelle', icon: 'Smartphone', detail: 'Instant bank transfers' },
  { name: 'Venmo', nameEs: 'Venmo', icon: 'Smartphone', detail: 'Quick mobile payments' },
  { name: 'Cash App', nameEs: 'Cash App', icon: 'DollarSign', detail: 'Mobile transfers' },
  { name: 'Check', nameEs: 'Cheque', icon: 'FileText', detail: 'Personal or business' },
  { name: 'Klarna', nameEs: 'Klarna', icon: 'Clock', detail: 'Split into 4 payments' },
  { name: 'Insurance Claims', nameEs: 'Seguros', icon: 'Shield', detail: 'We work with your insurer', highlight: true },
  { name: 'Financing', nameEs: 'Financiamiento', icon: 'Percent', detail: 'Flexible payment plans', highlight: true },
]

export function PaymentOptions() {
  return (
    <section className="py-16 bg-dark-50">
      <div className="container-custom">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 tracking-wider uppercase mb-3">
            <CreditCard className="w-4 h-4" />
            Flexible Payment
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-dark-900 mb-3">
            Payment Options That Work for You
          </h2>
          <p className="text-dark-500 max-w-xl mx-auto">
            We accept multiple payment methods and work directly with insurance companies. Financing available for larger projects.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {paymentMethods.map((method) => {
            const Icon = iconMap[method.icon] || CreditCard
            return (
              <div
                key={method.name}
                className={`p-4 rounded-xl text-center transition-all hover:shadow-md ${
                  method.highlight
                    ? 'bg-primary-50 border-2 border-primary-200'
                    : 'bg-white border border-dark-100'
                }`}
              >
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-3 ${
                  method.highlight ? 'bg-primary-100 text-primary-600' : 'bg-dark-100 text-dark-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-semibold text-dark-800 text-sm">{method.name}</div>
                <div className="text-dark-400 text-xs mt-1">{method.detail}</div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/financing" className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center gap-1">
            Learn about financing <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-dark-300">•</span>
          <Link href="/services" className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center gap-1">
            Insurance claims info <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
