import { Metadata } from 'next'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, ArrowRight, Facebook, Instagram } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { COMPANY, HOURS, SERVICE_AREAS, SOCIAL } from '@/lib/constants'
import { formatPhoneLink, formatWhatsAppLink } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with CR Home Pros for a free estimate. Serving Washington DC, Maryland and Virginia.',
}

const contactMethods = [
  {
    icon: Phone,
    label: 'Phone',
    value: COMPANY.phoneFormatted,
    href: formatPhoneLink(COMPANY.phone),
    description: 'Mon-Sat, 8am-7pm',
  },
  {
    icon: WhatsAppIcon,
    label: 'WhatsApp',
    value: 'Message Us',
    href: formatWhatsAppLink(COMPANY.phone, "Hi! I am interested in your services."),
    description: 'Quick responses',
  },
  {
    icon: Mail,
    label: 'Email',
    value: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
    description: 'We reply within 24 hours',
  },
]

export default function ContactPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-dark-900 via-primary-900 to-dark-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-gold-400 tracking-wider uppercase mb-4">Get In Touch</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              {"Let's Talk About "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">Your Project</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              {"Have questions? Ready for an estimate? We'd love to hear from you. Reach out and let's discuss how we can help transform your home."}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-dark-100">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method) => (
              <a key={method.label} href={method.href} target={method.label === 'WhatsApp' ? '_blank' : undefined} rel={method.label === 'WhatsApp' ? 'noopener noreferrer' : undefined} className="flex items-center gap-4 p-6 bg-dark-50 rounded-2xl hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all group">
                <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                  <method.icon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-semibold text-dark-900">{method.value}</p>
                  <p className="text-sm text-dark-500">{method.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-dark-900 mb-6">Request a Free Estimate</h2>
              <p className="text-dark-500 mb-6">Tell us about your project and we will provide a detailed consultation within 24 hours. Our estimate process includes an on-site visit, project planning, and transparent pricing.</p>
              <div className="bg-primary-50 border border-primary-100 rounded-2xl p-8 mb-8">
                <h3 className="text-lg font-semibold text-dark-900 mb-4">What to expect:</h3>
                <ul className="space-y-3 text-dark-600">
                  <li className="flex items-start gap-3"><span className="text-gold-500 font-bold mt-0.5">1</span><span>Fill out a quick form about your project</span></li>
                  <li className="flex items-start gap-3"><span className="text-gold-500 font-bold mt-0.5">2</span><span>We will contact you within 24 hours to schedule a visit</span></li>
                  <li className="flex items-start gap-3"><span className="text-gold-500 font-bold mt-0.5">3</span><span>Receive a detailed, no-obligation estimate</span></li>
                </ul>
              </div>
              <Link href="/get-started" className="inline-flex items-center justify-center w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all shadow-lg shadow-gold-500/25">
                {"Get Your Free Estimate"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <p className="text-center text-sm text-dark-400 mt-4">
                {"Or call us directly at "}
                <a href={formatPhoneLink(COMPANY.phone)} className="text-primary-600 font-medium hover:underline">{COMPANY.phoneFormatted}</a>
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-dark-50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center"><Clock className="w-5 h-5 text-primary-600" /></div>
                  <h3 className="text-xl font-display font-semibold text-dark-900">Business Hours</h3>
                </div>
                <div className="space-y-3 text-dark-600">
                  <div className="flex justify-between"><span>Monday - Friday</span><span className="font-medium text-dark-900">{HOURS.weekday}</span></div>
                  <div className="flex justify-between"><span>Saturday</span><span className="font-medium text-dark-900">{HOURS.saturday}</span></div>
                  <div className="flex justify-between"><span>Sunday</span><span className="font-medium text-dark-900">{HOURS.sunday}</span></div>
                  <div className="pt-3 mt-3 border-t border-dark-200"><p className="text-sm text-gold-600 font-medium">{HOURS.emergency}</p></div>
                </div>
              </div>

              <div className="bg-dark-50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center"><MapPin className="w-5 h-5 text-primary-600" /></div>
                  <h3 className="text-xl font-display font-semibold text-dark-900">Service Area</h3>
                </div>
                <p className="text-dark-600 mb-4">We proudly serve the entire DMV area including:</p>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_AREAS.slice(0, 8).map((area) => (<span key={area} className="px-3 py-1 bg-white rounded-full text-sm text-dark-600">{area}</span>))}
                  <span className="px-3 py-1 bg-primary-100 rounded-full text-sm text-primary-700 font-medium">+ more</span>
                </div>
              </div>

              <div className="bg-dark-50 rounded-2xl p-8">
                <h3 className="text-xl font-display font-semibold text-dark-900 mb-4">Follow Us</h3>
                <p className="text-dark-500 mb-6">See our latest projects and updates on social media.</p>
                <div className="flex gap-3">
                  <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-dark-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"><Facebook className="w-5 h-5" /></a>
                  <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-dark-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"><Instagram className="w-5 h-5" /></a>
                  <a href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-dark-500 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z" /></svg>
                  </a>
                </div>
              </div>

              <div className="bg-gold-50 border border-gold-200 rounded-2xl p-6 text-center">
                <p className="text-lg font-semibold text-gold-800">{"Hablamos Espanol!"}</p>
                <p className="text-gold-700 text-sm mt-1">We are happy to assist you in Spanish.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary-800">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-primary-200 text-lg mb-8">Request your free estimate today. No obligation, just honest pricing.</p>
            <Link href="/get-started" className="btn-gold btn-lg">
              Start Your Project
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
