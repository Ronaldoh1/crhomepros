'use client'

import Link from 'next/link'
import { ArrowRight, ChefHat, Bath, Home, Warehouse, Hammer, Grid3X3, Paintbrush, Wrench, TreeDeciduous, Fence, Building, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation, useLocale } from '@/lib/i18n/provider'
import { SERVICES } from '@/lib/constants'

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ChefHat, Bath, Home, Warehouse, Hammer, Grid3X3, Paintbrush, Wrench, TreeDeciduous, Fence, Building, FileText,
}

// Map service constant IDs to dictionary keys
const serviceIdToKey: Record<string, string> = {
  'kitchen-remodeling': 'kitchen',
  'bathroom-renovation': 'bathroom',
  'basement-finishing': 'basement',
  'roofing': 'roofing',
  'concrete-driveways': 'concrete',
  'flooring': 'flooring',
  'painting': 'painting',
  'deck-outdoor': 'deck',
  'fencing': 'fencing',
  'complete-renovations': 'completeRenovations',
  'insurance-claims': 'insuranceClaims',
}

export function ServicesPreview() {
  const t = useTranslation()
  const { locale } = useLocale()
  const lp = (path: string) => `/${locale}${path}`

  // Show first 8 services
  const displayServices = SERVICES.slice(0, 8)

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-gold-600 tracking-wider uppercase mb-4">
            {t.services.title}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-dark-900 mb-6">
            {t.services.subtitle}
          </h2>
          <p className="text-lg text-dark-500 leading-relaxed">
            {t.services.description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {displayServices.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Home
            const dictKey = serviceIdToKey[service.id]
            const translated = dictKey ? (t.services as any)[dictKey] : null
            
            return (
              <Link
                key={service.id}
                href={lp(`/services/${service.id}`)}
                className={cn(
                  'group relative p-6 md:p-8 rounded-2xl border border-dark-100 bg-white',
                  'hover:border-primary-200 hover:shadow-xl hover:-translate-y-1',
                  'transition-all duration-300'
                )}
              >
                {/* Icon */}
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300">
                  <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-primary-600" />
                </div>

                {/* Content */}
                <h3 className="font-display font-semibold text-dark-900 mb-2 group-hover:text-primary-800 transition-colors">
                  {translated?.name || service.name}
                </h3>
                <p className="text-sm text-dark-500 line-clamp-2">
                  {translated?.short || service.shortDescription}
                </p>

                {/* Hover arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-primary-500" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link
            href={lp('/services')}
            className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-800 group"
          >
            {t.services.viewAll}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
