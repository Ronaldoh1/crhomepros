'use client'

import Link from 'next/link'
import { CreditCard, Smartphone, DollarSign, Clock, Shield, FileText, Percent, ArrowRight } from 'lucide-react'
import { useTranslation, useLocale } from '@/lib/i18n/provider'

const iconMap: Record<string, any> = {
  CreditCard, Smartphone, DollarSign, Clock, Shield, FileText, Percent,
}

export function PaymentOptions() {
  const t = useTranslation()
  const { locale } = useLocale()

  const paymentMethods = [
    { name: t.payment.methods.creditCards, icon: 'CreditCard', detail: t.payment.methods.creditCardsDetail },
    { name: t.payment.methods.zelle, icon: 'Smartphone', detail: t.payment.methods.zelleDetail },
    { name: t.payment.methods.venmo, icon: 'Smartphone', detail: t.payment.methods.venmoDetail },
    { name: t.payment.methods.cashApp, icon: 'DollarSign', detail: t.payment.methods.cashAppDetail },
    { name: t.payment.methods.check, icon: 'FileText', detail: t.payment.methods.checkDetail },
    { name: t.payment.methods.klarna, icon: 'Clock', detail: t.payment.methods.klarnaDetail },
    { name: t.payment.methods.insurance, icon: 'Shield', detail: t.payment.methods.insuranceDetail, highlight: true },
    { name: t.payment.methods.financing, icon: 'Percent', detail: t.payment.methods.financingDetail, highlight: true },
  ]

  return (
    <section className="py-16 bg-dark-50">
      <div className="container-custom">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 tracking-wider uppercase mb-3">
            <CreditCard className="w-4 h-4" />
            {t.payment.badge}
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-dark-900 mb-3">
            {t.payment.title}
          </h2>
          <p className="text-dark-500 max-w-xl mx-auto">
            {t.payment.description}
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
            {t.payment.learnFinancing} <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-dark-300">•</span>
          <Link href="/services" className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center gap-1">
            {t.payment.insuranceClaims} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
