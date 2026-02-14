'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Phone, ArrowRight, ChevronDown, Leaf } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { COMPANY } from '@/lib/constants'
import { SERVICE_PRICING, EMERGENCY_RATES } from '@/lib/pricing-data'
import { formatPhoneLink, formatWhatsAppLink } from '@/lib/utils'
import { EcoBadge } from '@/components/ui/EcoBadge'

export default function PricingDictionaryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedService, setExpandedService] = useState<string | null>(null)

  const filteredServices = SERVICE_PRICING.filter(
    (svc) =>
      svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.tiers.some(
        (t) =>
          t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  const toggleService = (id: string) =>
    setExpandedService((prev) => (prev === id ? null : id))

  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <section className="container-custom text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-dark-900 mb-4">
          Pricing Guide
        </h1>
        <p className="text-xl text-dark-500 max-w-2xl mx-auto mb-6">
          Transparent pricing for every service we offer. These are typical ranges for the DMV area — your
          actual quote depends on scope, materials, and site conditions.
        </p>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services... (e.g. kitchen, roof, deck)"
            className="w-full pl-12 pr-4 py-3 border-2 border-dark-200 rounded-xl text-dark-800 placeholder:text-dark-400 focus:border-primary-500 focus:ring-0 transition-colors"
          />
        </div>
        <EcoBadge size="md" />
      </section>

      {/* Pricing Grid */}
      <section className="container-custom">
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredServices.map((service) => {
            const isExpanded = expandedService === service.id
            const minPrice = Math.min(...service.tiers.map((t) => t.min))
            const maxPrice = Math.max(...service.tiers.map((t) => t.max))

            return (
              <div
                key={service.id}
                className="bg-white border border-dark-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Service Header */}
                <button
                  onClick={() => toggleService(service.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{service.icon}</span>
                    <div>
                      <h3 className="text-lg font-display font-bold text-dark-900">
                        {service.name}
                      </h3>
                      <p className="text-sm text-dark-400">
                        ${minPrice.toLocaleString()} – ${maxPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden md:inline text-sm text-dark-400">
                      {service.tiers.length} options
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-dark-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Tiers */}
                {isExpanded && (
                  <div className="px-6 pb-5 border-t border-dark-50">
                    <div className="grid gap-3 mt-4">
                      {service.tiers.map((tier, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-dark-50 rounded-lg"
                        >
                          <div>
                            <div className="font-semibold text-dark-800">{tier.label}</div>
                            <div className="text-sm text-dark-500">{tier.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-dark-900 text-lg">
                              ${tier.min.toLocaleString()}
                            </div>
                            <div className="text-sm text-dark-400">
                              to ${tier.max.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Eco note for applicable services */}
                    {['kitchen', 'bathroom', 'basement', 'painting'].includes(service.id) && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                        <Leaf className="w-4 h-4" />
                        Eco-friendly material options available for this service
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12 text-dark-400">
            No services match &ldquo;{searchQuery}&rdquo;. Try a different search term.
          </div>
        )}
      </section>

      {/* Emergency Rates */}
      {EMERGENCY_RATES.enabled && (
        <section className="container-custom mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white text-xl">🚨</div>
                <div>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-dark-900">24/7 Emergency Rates</h2>
                  <p className="text-sm text-dark-500">Dispatch fee: ${EMERGENCY_RATES.calloutFee.min}–${EMERGENCY_RATES.calloutFee.max} (covers first hour)</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {EMERGENCY_RATES.categories.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-red-100">
                    <span className="text-2xl">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-dark-900 truncate">{cat.name}</p>
                      <p className="text-xs text-dark-500">{cat.rate}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-dark-400 mt-4 text-center">
                Emergency rates apply to after-hours, weekends &amp; holidays. Call <a href={formatPhoneLink(COMPANY.phone)} className="text-red-600 font-semibold">{COMPANY.phoneFormatted}</a> now.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-custom mt-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary-800 to-primary-900 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            Ready for Your Free Estimate?
          </h2>
          <p className="text-primary-200 mb-6 max-w-lg mx-auto">
            These ranges are starting points. Contact us for a detailed, no-obligation quote tailored
            to your specific project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={formatPhoneLink(COMPANY.phone)}
              className="btn-gold inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call {COMPANY.phone}
            </a>
            <Link href="/get-started" className="btn-outline-white inline-flex items-center justify-center gap-2">
              Request a Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container-custom mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-dark-400">
            All prices are estimates for the Washington D.C., Maryland, and Virginia metro area.
            Actual costs vary based on project scope, materials, permits, site conditions, and
            complexity. Contact us for a free, detailed quote. Licensed MHIC #05-132359 &amp; #109350.
          </p>
        </div>
      </section>
    </div>
  )
}
