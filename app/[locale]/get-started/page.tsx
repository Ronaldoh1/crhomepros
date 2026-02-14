import { Metadata } from 'next'
import { Shield, Clock, Phone, CheckCircle } from 'lucide-react'
import { COMPANY } from '@/lib/constants'
import { IntakeForm } from '@/components/forms/IntakeForm'

export const metadata: Metadata = {
  title: 'Get Started - Free Estimate',
  description: 'Request a free home improvement estimate from CR Home Pros. Fill out our simple form and get a consultation within 24 hours.',
}

const benefits = [
  { icon: CheckCircle, text: 'Free, no-obligation estimate' },
  { icon: Clock, text: 'Response within 24 hours' },
  { icon: Shield, text: 'Licensed & insured (MHIC #05-132359)' },
  { icon: Phone, text: 'Bilingual team available' },
]

export default function GetStartedPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-12 bg-gradient-to-br from-dark-900 via-primary-900 to-dark-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-sm font-semibold text-gold-400 tracking-wider uppercase mb-4">
              Free Consultation
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Let's Start Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                Project
              </span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-8">
              Tell us about your project and we'll provide a free estimate within 24 hours. 
              No obligation, no pressure—just honest advice.
            </p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.text} className="flex items-center gap-2 text-white/70">
                  <benefit.icon className="w-5 h-5 text-gold-400" />
                  <span className="text-sm">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <IntakeForm />
          </div>
        </div>
      </section>

      {/* Bottom trust bar */}
      <section className="py-8 bg-dark-50 border-t border-dark-100">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
            <p className="text-dark-500">
              <strong className="text-dark-700">{COMPANY.projectsCompleted}</strong> projects completed
            </p>
            <span className="hidden md:block text-dark-300">•</span>
            <p className="text-dark-500">
              <strong className="text-dark-700">{COMPANY.yearsInBusiness}+</strong> years experience
            </p>
            <span className="hidden md:block text-dark-300">•</span>
            <p className="text-dark-500">
              <strong className="text-dark-700">{COMPANY.license}</strong>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
