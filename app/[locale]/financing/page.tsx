'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Clock, TrendingUp, CreditCard, Calculator, Phone, CheckCircle, DollarSign, Percent, ArrowRight } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { COMPANY } from '@/lib/constants'
import { formatPhoneLink, formatWhatsAppLink } from '@/lib/utils'
import { useLocale, useTranslation } from '@/lib/i18n/provider'

export default function FinancingPage() {
  const { locale } = useLocale()
  const t = useTranslation()
  const lp = (path: string) => locale === 'en' ? path : `/es${path}`

  const [projectCost, setProjectCost] = useState(15000)
  const [termMonths, setTermMonths] = useState(36)
  const [apr, setApr] = useState(6.99)

  const monthlyPayment = (() => {
    const rate = apr / 100 / 12
    if (rate === 0) return projectCost / termMonths
    return (projectCost * rate * Math.pow(1 + rate, termMonths)) / (Math.pow(1 + rate, termMonths) - 1)
  })()

  const benefits = [
    { icon: Clock, title: t.financing.benefits.noWait, desc: t.financing.benefits.noWaitDesc },
    { icon: Shield, title: t.financing.benefits.preserve, desc: t.financing.benefits.preserveDesc },
    { icon: TrendingUp, title: t.financing.benefits.increase, desc: t.financing.benefits.increaseDesc },
    { icon: CreditCard, title: t.financing.benefits.flexible, desc: t.financing.benefits.flexibleDesc },
  ]

  const options = [
    { title: t.financing.options.zeroInterest, desc: t.financing.options.zeroInterestDesc, icon: Percent },
    { title: t.financing.options.lowMonthly, desc: t.financing.options.lowMonthlyDesc, icon: DollarSign },
    { title: t.financing.options.noMoney, desc: t.financing.options.noMoneyDesc, icon: CheckCircle },
    { title: t.financing.options.quickApproval, desc: t.financing.options.quickApprovalDesc, icon: ArrowRight },
  ]

  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <section className="container-custom text-center mb-16">
        <span className="inline-block text-sm font-semibold text-gold-600 tracking-wider uppercase mb-4">
          {t.financing.title}
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-dark-900 mb-6">
          {t.financing.subtitle}
        </h1>
        <p className="text-xl text-dark-500 max-w-2xl mx-auto">
          {t.financing.description}
        </p>
      </section>

      {/* Why Finance */}
      <section className="container-custom mb-20">
        <h2 className="text-3xl font-display font-bold text-dark-900 text-center mb-12">
          {t.financing.whyFinance}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="bg-white/80 hover:bg-white/80 hover:bg-white rounded-2xl p-6 border border-dark-100 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                <b.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-display font-semibold text-dark-900 mb-2">{b.title}</h3>
              <p className="text-sm text-dark-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Financing Options */}
      <section className="bg-dark-50 py-16 mb-20">
        <div className="container-custom">
          <h2 className="text-3xl font-display font-bold text-dark-900 text-center mb-12">
            {t.financing.options.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {options.map((opt) => (
              <div key={opt.title} className="bg-white/80 hover:bg-white/80 hover:bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 mx-auto rounded-full bg-gold-100 flex items-center justify-center mb-4">
                  <opt.icon className="w-7 h-7 text-gold-600" />
                </div>
                <h3 className="font-display font-semibold text-dark-900 mb-2">{opt.title}</h3>
                <p className="text-sm text-dark-500">{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Calculator */}
      <section className="container-custom mb-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <Calculator className="w-7 h-7 text-primary-600" />
            </div>
            <h2 className="text-3xl font-display font-bold text-dark-900 mb-3">
              {t.financing.calculator.title}
            </h2>
          </div>

          <div className="bg-white/80 hover:bg-white/80 hover:bg-white rounded-2xl border border-dark-100 p-8 shadow-lg">
            {/* Project Cost Slider */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-dark-700">{t.financing.calculator.projectCost}</label>
                <span className="text-2xl font-bold text-primary-700">${projectCost.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={100000}
                step={500}
                value={projectCost}
                onChange={(e) => setProjectCost(Number(e.target.value))}
                className="w-full h-2 bg-dark-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-dark-400 mt-1">
                <span>$1,000</span>
                <span>$100,000</span>
              </div>
            </div>

            {/* Term Slider */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-dark-700">{t.financing.calculator.term}</label>
                <span className="text-lg font-bold text-dark-900">{termMonths} {t.financing.calculator.months}</span>
              </div>
              <input
                type="range"
                min={6}
                max={60}
                step={6}
                value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value))}
                className="w-full h-2 bg-dark-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-dark-400 mt-1">
                <span>6 {t.financing.calculator.months}</span>
                <span>60 {t.financing.calculator.months}</span>
              </div>
            </div>

            {/* APR */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-dark-700">{t.financing.calculator.rate}</label>
                <span className="text-lg font-bold text-dark-900">{apr}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={24.99}
                step={0.5}
                value={apr}
                onChange={(e) => setApr(Number(e.target.value))}
                className="w-full h-2 bg-dark-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-dark-400 mt-1">
                <span>0%</span>
                <span>24.99%</span>
              </div>
            </div>

            {/* Result */}
            <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-xl p-6 text-center text-white">
              <p className="text-sm text-primary-200 mb-1">{t.financing.calculator.estimated}</p>
              <p className="text-5xl font-bold mb-1">${Math.round(monthlyPayment).toLocaleString()}</p>
              <p className="text-sm text-primary-200">/{locale === 'es' ? 'mes' : 'mo'}</p>
            </div>

            <p className="text-xs text-dark-400 mt-4 text-center">
              {t.financing.calculator.disclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-custom">
        <div className="bg-gradient-to-br from-dark-900 to-dark-800 rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-display font-bold mb-4">{t.financing.cta}</h2>
          <p className="text-dark-300 mb-8 max-w-xl mx-auto">{t.financing.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={formatPhoneLink(COMPANY.phone)}
              className="btn-gold flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              {COMPANY.phoneFormatted}
            </a>
            <a
              href={formatWhatsAppLink(COMPANY.phone, locale === 'es' ? '¡Hola! Me interesa el financiamiento para mi proyecto.' : 'Hi! I\'m interested in financing options for my project.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
              WhatsApp
            </a>
            <Link
              href={lp('/get-started')}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
            >
              {t.nav.getEstimate}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
