'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Phone } from 'lucide-react'
import { cn, formatPhoneLink, formatWhatsAppLink } from '@/lib/utils'
import { FAQ, COMPANY } from '@/lib/constants'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-gold-600 tracking-wider uppercase mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-dark-500">
              Quick answers to the questions we hear most from DMV homeowners.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {FAQ.map((item, index) => (
              <div
                key={index}
                className="border border-dark-100 rounded-xl overflow-hidden hover:border-primary-200 transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-semibold text-dark-900 pr-4">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-dark-400 transition-transform duration-200 flex-shrink-0',
                      openIndex === index && 'rotate-180'
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <p className="px-6 pb-5 text-dark-600 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions? */}
          <div className="mt-10 text-center bg-dark-50 rounded-2xl p-8">
            <p className="text-dark-700 font-medium mb-4">Still have questions? We're happy to help.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={formatPhoneLink(COMPANY.phone)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-700 text-white font-medium hover:bg-primary-800 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call {COMPANY.phoneFormatted}
              </a>
              <a
                href={formatWhatsAppLink(COMPANY.phone, "Hi! I have a question about your services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
