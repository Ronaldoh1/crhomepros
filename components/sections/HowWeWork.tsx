'use client'

import { MessageSquare, FileText, Hammer, ThumbsUp } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/provider';

const stepIcons = [MessageSquare, FileText, Hammer, ThumbsUp]
const stepNumbers = ["01", "02", "03", "04"]

export function HowWeWork() {
  const t = useTranslation()

  const steps = [
    { title: t.howWeWork.steps.consult, description: t.howWeWork.steps.consultDesc },
    { title: t.howWeWork.steps.plan, description: t.howWeWork.steps.planDesc },
    { title: t.howWeWork.steps.build, description: t.howWeWork.steps.buildDesc },
    { title: t.howWeWork.steps.inspect, description: t.howWeWork.steps.inspectDesc },
  ]

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
          {steps.map((step, index) => {
            const Icon = stepIcons[index]
            return (
              <div
                key={stepNumbers[index]}
                className="relative bg-white rounded-2xl p-8 border border-dark-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {stepNumbers[index]}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors">
                  <Icon className="w-7 h-7 text-primary-600" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-semibold text-dark-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-dark-500 leading-relaxed">
                  {step.description}
                </p>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary-300 to-transparent" />
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-dark-600 italic">
            {t.howWeWork.bottomNote}
          </p>
        </div>
      </div>
    </section>
  );
}
