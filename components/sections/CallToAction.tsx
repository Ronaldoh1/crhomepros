'use client'

import Link from 'next/link'
import { useTranslation, useLocale } from '@/lib/i18n/provider'
import { Phone, ArrowRight } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { COMPANY, SERVICE_AREAS } from '@/lib/constants'
import { formatPhoneLink, formatWhatsAppLink } from '@/lib/utils'

export function CallToAction() {
  const t = useTranslation()
  const { locale } = useLocale()
  const lp = (path: string) => `/${locale}${path}`

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), 
                             linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            {t.cta.title}
          </h2>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed">
            {t.cta.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <div className="w-full sm:w-auto">
              <Link
                href={lp('/get-started')}
                className="group flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-dark-900 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-gold-500/20 hover:shadow-xl hover:shadow-gold-500/30 hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto justify-center"
              >
                {t.cta.button}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-xs text-white/50 mt-2 text-center">{t.cta.noObligation}</p>
            </div>
            
            <div className="w-full sm:w-auto">
              <a
                href={formatPhoneLink(COMPANY.phone)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 hover:border-white/30 transition-all duration-300 w-full sm:w-auto justify-center"
              >
                <Phone className="w-5 h-5" />
                {t.cta.callNow}
              </a>
              <p className="text-xs text-white/50 mt-2 text-center">{t.cta.letsDiscuss}</p>
            </div>
          </div>

          {/* WhatsApp - translated message */}
          <a
            href={formatWhatsAppLink(COMPANY.phone, t.common.whatsappGreeting)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
            <span>{t.cta.orWhatsApp}</span>
          </a>

          {/* Service Areas */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm text-white/50 mb-3">{t.cta.proudlyServing}</p>
            <p className="text-white/70">
              {SERVICE_AREAS.slice(0, 6).join(' • ')} {t.cta.andSurrounding}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
