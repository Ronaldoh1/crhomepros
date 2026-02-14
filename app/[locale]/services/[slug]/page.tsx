import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowRight, CheckCircle, Clock, DollarSign, Phone, ChefHat, Bath, Home, Warehouse, Hammer, Grid3X3, Paintbrush, Wrench, TreeDeciduous, Shield, Building, FileText } from 'lucide-react'
import { SERVICES, COMPANY, TESTIMONIALS } from '@/lib/constants'
import { formatPhoneLink } from '@/lib/utils'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ChefHat, Bath, Home, Warehouse, Hammer, Grid3X3, Paintbrush, Wrench, TreeDeciduous, Shield, Building, FileText,
}

const serviceContent: Record<string, {
  heroImage: string
  benefits: string[]
  process: { title: string; description: string }[]
  faqs: { q: string; a: string }[]
}> = {
  'kitchen-remodeling': {
    heroImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
    benefits: [
      'Custom cabinet design and installation',
      'Premium countertop options (quartz, granite, marble)',
      'Modern appliance integration',
      'Efficient layout optimization',
      'Quality flooring and backsplash',
      'Updated plumbing and electrical',
    ],
    process: [
      { title: 'Consultation', description: 'We discuss your vision, needs, and budget' },
      { title: 'Design', description: 'Create detailed plans and 3D renderings' },
      { title: 'Selection', description: 'Choose materials, finishes, and fixtures' },
      { title: 'Construction', description: 'Expert demolition and installation' },
    ],
    faqs: [
      { q: 'How long does a kitchen remodel take?', a: 'Most kitchen remodels take 4-8 weeks depending on scope.' },
      { q: 'Can I stay in my home during the remodel?', a: 'Yes! We minimize disruption to your daily life.' },
      { q: 'Do you handle permits?', a: 'Absolutely. We handle all necessary permits and inspections.' },
    ],
  },
  'bathroom-renovation': {
    heroImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80',
    benefits: [
      'Walk-in showers and soaking tubs',
      'Heated flooring options',
      'Custom vanities and storage',
      'Modern lighting design',
      'Water-efficient fixtures',
      'Accessibility modifications available',
    ],
    process: [
      { title: 'Assessment', description: 'Evaluate space and plumbing requirements' },
      { title: 'Design', description: 'Create your spa-inspired bathroom plan' },
      { title: 'Demolition', description: 'Careful removal of existing fixtures' },
      { title: 'Installation', description: 'Expert plumbing, tile, and fixture work' },
    ],
    faqs: [
      { q: 'How long does a bathroom renovation take?', a: 'A typical bathroom renovation takes 2-4 weeks.' },
      { q: 'Can you work with my existing layout?', a: 'Yes, though moving fixtures can improve the space.' },
      { q: 'Do you offer accessibility features?', a: 'Yes, including grab bars, walk-in tubs, and more.' },
    ],
  },
}

const defaultContent = {
  heroImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
  benefits: [
    'Professional, licensed contractors',
    'Quality materials and workmanship',
    'Transparent pricing',
    'Clean job sites',
    'Warranty on all work',
    'Timely project completion',
  ],
  process: [
    { title: 'Consultation', description: 'Free on-site assessment and estimate' },
    { title: 'Planning', description: 'Detailed project scope and timeline' },
    { title: 'Execution', description: 'Professional installation by our team' },
    { title: 'Completion', description: 'Final walkthrough and satisfaction guarantee' },
  ],
  faqs: [
    { q: 'Do you provide free estimates?', a: 'Yes! We offer free, no-obligation estimates.' },
    { q: 'Are you licensed and insured?', a: 'Yes, fully licensed (MHIC #05-132359) and insured.' },
    { q: 'What areas do you serve?', a: 'We serve DC, Maryland, and Northern Virginia.' },
  ],
}

export async function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.id }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = SERVICES.find((s) => s.id === params.slug)
  if (!service) return { title: 'Service Not Found' }
  return { title: service.name, description: service.shortDescription }
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = SERVICES.find((s) => s.id === params.slug)
  if (!service) notFound()

  const content = serviceContent[params.slug] || defaultContent
  const IconComponent = iconMap[service.icon] || Home
  const relatedTestimonial = TESTIMONIALS[0]

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-dark-900 via-primary-900 to-dark-950 overflow-hidden">
        <div className="absolute inset-0">
          <Image src={content.heroImage} alt={service.name} fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 to-dark-900/70" />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <Link href="/services" className="inline-flex items-center text-primary-300 hover:text-white mb-6">
              ← Back to Services
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gold-500/20 flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-gold-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">{service.name}</h1>
            <p className="text-xl text-white/70 leading-relaxed mb-8">{service.shortDescription}</p>
            <div className="flex flex-wrap gap-6 text-white/70 mb-8">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gold-400" />
                <span>{service.priceRange}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold-400" />
                <span>{service.duration}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/get-started" className="btn-gold btn-lg">
                Get Free Estimate <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a href={formatPhoneLink(COMPANY.phone)} className="btn-outline-white btn-lg">
                <Phone className="w-5 h-5 mr-2" /> {COMPANY.phoneFormatted}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-semibold text-gold-600 tracking-wider uppercase mb-4">What's Included</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">Our {service.name} Services</h2>
              <div className="space-y-4">
                {content.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-dark-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src={content.heroImage} alt={service.name} fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-gold-600 tracking-wider uppercase mb-4">Our Process</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900">How We Work</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.process.map((step, index) => (
              <div key={step.title} className="bg-white rounded-2xl p-6 border border-dark-100">
                <div className="w-10 h-10 rounded-full bg-primary-800 text-white flex items-center justify-center font-bold mb-4">{index + 1}</div>
                <h3 className="text-lg font-semibold text-dark-900 mb-2">{step.title}</h3>
                <p className="text-dark-500 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-padding bg-primary-800">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="text-6xl text-primary-600 mb-6">"</div>
            <p className="text-xl md:text-2xl leading-relaxed mb-8">{relatedTestimonial.text}</p>
            <p className="font-semibold">{relatedTestimonial.name}</p>
            <p className="text-primary-300">{relatedTestimonial.location}</p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900">FAQs About {service.name}</h2>
            </div>
            <div className="space-y-4">
              {content.faqs.map((faq, i) => (
                <div key={i} className="bg-dark-50 rounded-xl p-6">
                  <h3 className="font-semibold text-dark-900 mb-2">{faq.q}</h3>
                  <p className="text-dark-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-gold-500 to-gold-600">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-dark-700 mb-8">Let's discuss your {service.name.toLowerCase()} project.</p>
            <Link href="/get-started" className="btn bg-dark-900 text-white hover:bg-dark-800 btn-lg">
              Request Free Estimate <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
