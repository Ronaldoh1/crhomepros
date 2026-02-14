import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Award, Users, Heart, CheckCircle } from 'lucide-react'
import { COMPANY, SERVICE_AREAS } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about CR Home Pros - ${COMPANY.yearsInBusiness}+ years of trusted craftsmanship serving the DMV area. Meet our team and discover our commitment to quality.`,
}

const milestones = [
  { year: '2004', event: 'Carlos begins his journey in construction and home improvement' },
  { year: '2009', event: 'CR Home Pros officially established' },
  { year: '2012', event: 'Expanded team to handle larger renovation projects' },
  { year: '2015', event: 'Earned MHIC License #05-132359 in Maryland' },
  { year: '2018', event: 'Completed 250th project milestone' },
  { year: '2020', event: 'Adapted to serve clients safely during pandemic' },
  { year: '2024', event: '500+ projects completed, rebranded as CR Home Pros' },
]

const values = [
  {
    icon: Heart,
    title: 'Passion for Craft',
    description: 'We love what we do. Every nail, every tile, every detail matters to us.',
  },
  {
    icon: Shield,
    title: 'Integrity First',
    description: 'Honest pricing, transparent communication, and no surprises.',
  },
  {
    icon: Users,
    title: 'Client Partnership',
    description: 'Your vision drives our work. We listen, collaborate, and deliver.',
  },
  {
    icon: Award,
    title: 'Excellence Always',
    description: 'We never cut corners. Quality workmanship is our reputation.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-dark-900 via-primary-900 to-dark-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-gold-400 tracking-wider uppercase mb-4">
              Our Story
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Building Dreams,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                One Home at a Time
              </span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              For over {COMPANY.yearsInBusiness} years, CR Home Pros has been transforming houses into 
              dream homes across the DMV area. We're not just contractors—we're craftsmen who take 
              pride in every project.
            </p>
          </div>
        </div>
      </section>

      {/* Carlos's Story */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-dark-100">
                <Image
                  src="/images/team-carlos-02.png"
                  alt="Carlos Hernandez - Founder"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-dark-900">{COMPANY.license}</p>
                    <p className="text-sm text-dark-500">Licensed Contractor/Salesman</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="inline-block text-sm font-semibold text-gold-600 tracking-wider uppercase mb-4">
                Meet the Founder
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
                Carlos Hernandez
              </h2>
              <div className="space-y-4 text-dark-600 leading-relaxed">
                <p>
                  With over two decades of hands-on experience in home improvement, Carlos Hernandez 
                  has built CR Home Pros on a foundation of trust, quality, and personalized 
                  attention. What started as a passion for craftsmanship has grown into a full-service 
                  renovation company that treats every home like it's their own.
                </p>
                <p>
                  Carlos and his skilled team specialize in transforming spaces—from complete kitchen 
                  renovations to emergency repairs. They've earned a reputation throughout the DMV area 
                  for showing up on time, communicating clearly, and delivering results that exceed expectations.
                </p>
                <p className="italic border-l-4 border-gold-500 pl-4 py-2 bg-gold-50/50 rounded-r-lg">
                  "My team and I are dedicated to bringing your home's potential to life, one improvement 
                  at a time. With a passion for craftsmanship and a commitment to quality, we're not just 
                  renovating spaces—we're here to help you build the dream space you've always envisioned. 
                  Let's create something beautiful together."
                </p>
              </div>
              
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-dark-100">
                <div>
                  <p className="text-3xl font-bold text-primary-700">{COMPANY.yearsInBusiness}+</p>
                  <p className="text-sm text-dark-500">Years Experience</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-700">500+</p>
                  <p className="text-sm text-dark-500">Projects Done</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-700">100%</p>
                  <p className="text-sm text-dark-500">Commitment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-gold-600 tracking-wider uppercase mb-4">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
              What We Stand For
            </h2>
            <p className="text-lg text-dark-500">
              These aren't just words on a wall—they guide every decision we make and every project we take on.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-8 border border-dark-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-display font-semibold text-dark-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-dark-500">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-gold-600 tracking-wider uppercase mb-4">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900">
              {COMPANY.yearsInBusiness}+ Years of Growth
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex gap-6 pb-8 last:pb-0">
                <div className="flex-shrink-0 w-20">
                  <span className="text-xl font-bold text-primary-700">{milestone.year}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-gold-500" />
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-dark-200 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <p className="text-dark-700">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section-padding bg-primary-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-gold-400 tracking-wider uppercase mb-4">
              Where We Work
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Proudly Serving the DMV
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {SERVICE_AREAS.map((area) => (
              <span
                key={area}
                className="px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect - FAQ Style */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-semibold text-gold-600 tracking-wider uppercase mb-4">
                Working with Us
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900">
                What to Expect
              </h2>
            </div>

            <div className="space-y-8">
              <div className="border-l-4 border-primary-500 pl-6 py-2">
                <h3 className="text-xl font-display font-semibold text-dark-900 mb-3">
                  Do you work in occupied homes?
                </h3>
                <p className="text-dark-600 leading-relaxed">
                  Yes! We understand you have a life to live. We respect your daily routine, 
                  keep our work areas clean, and minimize disruption. Many of our clients 
                  continue living in their homes during renovations.
                </p>
              </div>

              <div className="border-l-4 border-primary-500 pl-6 py-2">
                <h3 className="text-xl font-display font-semibold text-dark-900 mb-3">
                  How long do projects typically take?
                </h3>
                <p className="text-dark-600 leading-relaxed">
                  Timeline depends on the project scope. A bathroom remodel might take 2-3 weeks, 
                  while a full kitchen could be 4-6 weeks. We provide detailed timelines upfront 
                  and keep you updated on progress every step of the way.
                </p>
              </div>

              <div className="border-l-4 border-primary-500 pl-6 py-2">
                <h3 className="text-xl font-display font-semibold text-dark-900 mb-3">
                  What about permits and inspections?
                </h3>
                <p className="text-dark-600 leading-relaxed">
                  We handle everything. From pulling permits to scheduling inspections, 
                  we navigate the bureaucracy so you don&apos;t have to. As a licensed Maryland 
                  contractor, we ensure all work meets code requirements.
                </p>
              </div>

              <div className="border-l-4 border-primary-500 pl-6 py-2">
                <h3 className="text-xl font-display font-semibold text-dark-900 mb-3">
                  How do you handle changes during the project?
                </h3>
                <p className="text-dark-600 leading-relaxed">
                  We get it—sometimes you see the space coming together and want to adjust. 
                  We&apos;re flexible! Any changes are documented in writing with clear pricing 
                  before we proceed. No surprise charges, ever.
                </p>
              </div>

              <div className="border-l-4 border-primary-500 pl-6 py-2">
                <h3 className="text-xl font-display font-semibold text-dark-900 mb-3">
                  What if I have questions during the project?
                </h3>
                <p className="text-dark-600 leading-relaxed">
                  Carlos and our project managers are just a call or text away. We provide 
                  daily updates and welcome your questions. This is your home—you should 
                  never feel in the dark about what&apos;s happening.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-dark-500 mb-8">
              Let's discuss your vision. Schedule a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started" className="btn-gold btn-lg">
                Get Free Estimate
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/projects" className="btn-outline btn-lg">
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
