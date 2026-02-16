'use client'

import { Award, Shield, Languages, CheckCircle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/provider'
import { WHY_CHOOSE_US, COMPANY } from '@/lib/constants'

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Shield,
  Languages,
  CheckCircle,
}

export function WhyChooseUs() {
  const t = useTranslation()
  return (
    <section className="section-padding bg-dark-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Content */}
          <div>
            <span className="inline-block text-sm font-semibold text-gold-600 tracking-wider uppercase mb-4">
              {t.services.whyChoose}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-dark-900 mb-6">
              {COMPANY.yearsInBusiness}+ {t.whyChoose.heading}{' '}
              <span className="text-primary-700">{t.whyChoose.headingAccent}</span>
            </h2>
            <p className="text-lg text-dark-500 leading-relaxed mb-8">
              {t.whyChoose.description}
            </p>

            {/* Quote */}
            <blockquote className="relative pl-6 border-l-4 border-gold-500 italic text-dark-600">
              <p className="text-lg mb-4">
                &quot;{t.whyChoose.quote}&quot;
              </p>
              <footer className="not-italic">
                <strong className="text-dark-900">{t.whyChoose.quoteAuthor}</strong>
                <span className="text-dark-400"> — {t.whyChoose.quoteRole}</span>
              </footer>
            </blockquote>
          </div>

          {/* Right - Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {WHY_CHOOSE_US.map((item, index) => {
              const IconComponent = iconMap[item.icon] || CheckCircle
              
              return (
                <div
                  key={item.title}
                  className="group p-6 bg-white rounded-2xl border border-dark-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:scale-110 transition-all duration-300">
                    <IconComponent className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-display font-semibold text-dark-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-dark-500">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
