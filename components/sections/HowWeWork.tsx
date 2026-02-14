'use client'

import { MessageSquare, FileText, Hammer, ThumbsUp } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/provider';

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Free Consultation",
    description:
      "We listen to your vision and assess your space. No pressure, just honest advice.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Detailed Estimate",
    description:
      "Clear pricing with no surprises. You will know exactly what to expect before we start.",
  },
  {
    number: "03",
    icon: Hammer,
    title: "Quality Work",
    description:
      "Professional execution with daily updates. We keep you informed every step of the way.",
  },
  {
    number: "04",
    icon: ThumbsUp,
    title: "Your Satisfaction",
    description:
      "We are not done until you are happy. Your complete satisfaction is our guarantee.",
  },
];

export function HowWeWork() {
  const t = useTranslation()
  return (
    <section className="section-padding bg-dark-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-gold-600 tracking-wider uppercase mb-4">
            {t.howWeWork.title}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
            {t.howWeWork.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-primary-900">
              ✓
            </span>
          </h2>
          <p className="text-lg text-dark-500">
            {t.howWeWork.subtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative bg-white rounded-2xl p-8 border border-dark-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Number Badge */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {step.number}
                </span>
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors">
                <step.icon className="w-7 h-7 text-primary-600" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-display font-semibold text-dark-900 mb-3">
                {step.title}
              </h3>
              <p className="text-dark-500 leading-relaxed">
                {step.description}
              </p>

              {/* Connector Line (desktop only, not on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary-300 to-transparent" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-dark-600 italic">
            Every project is unique, but our commitment to quality and
            communication never changes.
          </p>
        </div>
      </div>
    </section>
  );
}
