'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, ArrowRight, Calculator, Info } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { COMPANY } from '@/lib/constants'
import { formatPhoneLink, formatWhatsAppLink } from '@/lib/utils'
import { SERVICE_PRICING } from '@/lib/pricing-data'
import { useLocale, useTranslation } from '@/lib/i18n/provider'

export default function EstimateCostPage() {
  const { locale } = useLocale()
  const t = useTranslation()
  const lp = (path: string) => locale === 'en' ? path : `/es${path}`
  const isEs = locale === 'es'

  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedTier, setSelectedTier] = useState<number | null>(null)

  const service = SERVICE_PRICING.find((s) => s.id === selectedService)
  const tier = service && selectedTier !== null ? service.tiers[selectedTier] : null

  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <section className="container-custom text-center mb-12">
        <div className="w-14 h-14 mx-auto rounded-full bg-primary-100 flex items-center justify-center mb-4">
          <Calculator className="w-7 h-7 text-primary-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-dark-900 mb-4">
          {t.quoteEstimator.title}
        </h1>
        <p className="text-xl text-dark-500 max-w-2xl mx-auto mb-4">
          {t.quoteEstimator.description}
        </p>
        <div className="flex justify-center gap-3">
          <a href="/pricing" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full hover:bg-primary-100 transition-colors">
            📋 Full Pricing Guide
          </a>
          <a href="/blog/green-renovations-sustainability" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors">
            🌿 Eco-Friendly Options
          </a>
        </div>
      </section>

      {/* Service Selection */}
      <section className="container-custom mb-8">
        <h2 className="text-lg font-display font-semibold text-dark-700 mb-4">
          1. {t.quoteEstimator.selectService}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {SERVICE_PRICING.map((svc) => (
            <button
              key={svc.id}
              onClick={() => { setSelectedService(svc.id); setSelectedTier(null) }}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                selectedService === svc.id
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-dark-100 bg-white hover:border-primary-200 hover:shadow-sm'
              }`}
            >
              <span className="text-2xl block mb-2">{svc.icon}</span>
              <span className="text-sm font-medium text-dark-800">
                {isEs ? svc.nameEs : svc.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Size Selection */}
      {service && (
        <section className="container-custom mb-8">
          <h2 className="text-lg font-display font-semibold text-dark-700 mb-4">
            2. {t.quoteEstimator.selectSize}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.tiers.map((t2, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTier(idx)}
                className={`p-5 rounded-xl border-2 text-left transition-all ${
                  selectedTier === idx
                    ? 'border-gold-500 bg-gold-50 shadow-md'
                    : 'border-dark-100 bg-white hover:border-gold-200 hover:shadow-sm'
                }`}
              >
                <h3 className="font-display font-semibold text-dark-900 mb-1">
                  {isEs ? t2.labelEs : t2.label}
                </h3>
                <p className="text-sm text-dark-500">
                  {isEs ? t2.descriptionEs : t2.description}
                </p>
                <p className="text-lg font-bold text-primary-700 mt-3">
                  ${t2.min.toLocaleString()} – ${t2.max.toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Result */}
      {tier && (
        <section className="container-custom mb-12">
          <div className="max-w-lg mx-auto bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-8 text-center text-white shadow-xl">
            <p className="text-sm text-primary-200 mb-2">{t.quoteEstimator.estimatedRange}</p>
            <p className="text-5xl font-bold mb-1">
              ${tier.min.toLocaleString()} – ${tier.max.toLocaleString()}
            </p>
            <p className="text-primary-300 mb-6">
              {isEs ? tier.descriptionEs : tier.description} • {isEs ? service!.nameEs : service!.name}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={lp('/get-started')}
                className="btn-gold flex items-center justify-center gap-2"
              >
                {t.quoteEstimator.getExactQuote}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={formatPhoneLink(COMPANY.phone)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {COMPANY.phoneFormatted}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="container-custom mb-16">
        <div className="max-w-2xl mx-auto bg-dark-50 rounded-xl p-6 flex gap-4">
          <Info className="w-5 h-5 text-dark-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-dark-500">
            {t.quoteEstimator.disclaimer}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="container-custom">
        <div className="bg-gradient-to-br from-dark-900 to-dark-800 rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-display font-bold mb-4">{t.quoteEstimator.getExactQuote}</h2>
          <p className="text-dark-300 mb-8 max-w-xl mx-auto">
            {isEs
              ? 'Cada proyecto es único. Contáctanos para una visita gratis a domicilio y un presupuesto detallado sin compromiso.'
              : 'Every project is unique. Contact us for a free in-home visit and a detailed quote — no obligation.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={lp('/get-started')} className="btn-gold">
              {t.nav.getEstimate}
            </Link>
            <a
              href={formatWhatsAppLink(COMPANY.phone, isEs ? '¡Hola! Necesito un presupuesto para mi proyecto.' : 'Hi! I need a quote for my project.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
