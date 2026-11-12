import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ChefHat, Bath, Home, Warehouse, Hammer, Grid3X3, Paintbrush, Wrench, TreeDeciduous, Shield, Building, FileText, Phone } from 'lucide-react'
import { SERVICES, COMPANY } from '@/lib/constants'
import { formatPhoneLink } from '@/lib/utils'
import { EcoBanner } from '@/components/ui/EcoBadge'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (params.locale === 'es') {
    return {
      title: 'Nuestros Servicios',
      description: 'Servicios completos de mejoras para el hogar en DC, Maryland y Virginia. Remodelación de cocinas, renovación de baños, techos, concreto, pintura y más. Con licencia y seguro.',
    }
  }
  return {
    title: 'Our Services',
    description: 'Complete home improvement services in DC, Maryland & Virginia. Kitchen remodeling, bathroom renovation, roofing, concrete, painting & more. Licensed & insured.',
  }
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ChefHat, Bath, Home, Warehouse, Hammer, Grid3X3, Paintbrush, Wrench, TreeDeciduous, Shield, Building, FileText,
}

export default function ServicesPage({ params }: { params: { locale: string } }) {
  const es = params.locale === 'es'
  return (
    <>
      {/* Hero */}
      <section className="relative page-top pb-20 bg-dark-900 overflow-hidden">
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-gold-400 tracking-wider uppercase mb-4">
              {es ? 'Lo Que Hacemos' : 'What We Do'}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              {es ? 'Servicios Completos' : 'Complete Home'}{' '}
              <span className="text-gold-400">
                {es ? 'para su Hogar' : 'Services'}
              </span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              {es ? (
                <>Desde reparaciones menores hasta grandes remodelaciones, nuestro equipo calificado se encarga de cada aspecto de su proyecto de mejoras para el hogar con precisión y cuidado.</>
              ) : (<>
              From minor repairs to major renovations, our skilled team handles every aspect of your 
              home improvement project with precision and care.
              </>)}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => {
              const IconComponent = iconMap[service.icon] || Home
              return (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="group relative bg-white rounded-2xl border border-dark-100 p-8 hover:border-primary-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center mb-6 group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300">
                    <IconComponent className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-dark-900 mb-3 group-hover:text-primary-800 transition-colors">
                    {es ? service.nameEs : service.name}
                  </h3>
                  <p className="text-dark-600 mb-4">{es ? service.shortDescriptionEs : service.shortDescription}</p>
                  <div className="flex items-center justify-between text-sm text-dark-600 pt-4 border-t border-dark-100">
                    <span>{es && 'priceRangeEs' in service ? service.priceRangeEs : service.priceRange}</span>
                    <span>{es ? service.durationEs : service.duration}</span>
                  </div>
                  <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-primary-500" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Green Options Banner */}
      <section className="py-8">
        <div className="container-custom">
          <EcoBanner locale={params.locale} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-semibold text-gold-900 tracking-wider uppercase mb-4">
                {es ? '¿Por Qué CR Home Pros?' : 'Why CR Home Pros?'}
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
                {es ? 'Trabajo de Calidad, Siempre' : 'Quality Work, Every Time'}
              </h2>
              <div className="space-y-4">
                {(es ? [
                  'Con licencia (MHIC #05-132359) y totalmente asegurados',
                  'Estimados gratis y sin compromiso',
                  'Precios transparentes, sin cargos ocultos',
                  'Equipo bilingüe (inglés y español)',
                  'Áreas de trabajo limpias y respeto por su hogar',
                  'Garantías por escrito en nuestro trabajo',
                ] : [
                  'Licensed (MHIC #05-132359) and fully insured',
                  'Free, no-obligation estimates',
                  'Transparent pricing with no hidden fees',
                  'Bilingual team (English & Spanish)',
                  'Clean job sites and respectful of your home',
                  'Written warranties on our work',
                ]).map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-dark-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-dark-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-primary-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-display font-semibold mb-4">{es ? '¿No Sabe por Dónde Empezar?' : 'Not Sure Where to Start?'}</h3>
              <p className="text-primary-200 mb-6">
                {es ? 'Programe una consulta gratis y le ayudaremos a definir las prioridades de su hogar.' : 'Schedule a free consultation and we\'ll help you prioritize your home improvement needs.'}
              </p>
              <div className="space-y-3">
                <Link href="/get-started" className="btn-gold w-full justify-center">
                  {es ? 'Solicitar Consulta Gratis' : 'Request Free Consultation'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <a href={formatPhoneLink(COMPANY.phone)} className="btn-outline-white w-full justify-center">
                  <Phone className="w-5 h-5 mr-2" />
                  {COMPANY.phoneFormatted}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Green & Sustainable */}
      <section className="py-12 bg-emerald-50/50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">🌿</span>
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-emerald-800 mb-1">{es ? 'Opciones Ecológicas en Cada Proyecto' : 'Eco-Friendly Options on Every Project'}</h3>
              <p className="text-emerald-800 text-sm mb-2">
                {es ? 'Pinturas bajas en COV, electrodomésticos Energy Star, iluminación LED, materiales sostenibles y manejo responsable de desechos son parte de nuestro estándar.' : 'Low-VOC paints, Energy Star appliances, LED lighting, sustainable materials, and responsible waste handling are standard.'}
              </p>
              <Link href={es ? '/es/green' : "/en/green"} className="text-emerald-800 font-semibold text-sm hover:text-emerald-700 inline-flex items-center gap-1">
                {es ? 'Conozca nuestro enfoque de sostenibilidad →' : 'Read our sustainability approach →'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-16 bg-red-800">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white">
            <div>
              <h3 className="text-2xl font-display font-semibold mb-2">{es ? '🚨 Reparaciones de Emergencia Disponibles' : '🚨 Emergency Repairs Available'}</h3>
              <p className="text-white">{es ? '¿Daños por agua, filtraciones en el techo o reparaciones urgentes? Estamos disponibles 24/7.' : 'Water damage, roof leaks, or urgent repairs? We\'re on call 24/7.'}</p>
            </div>
            <a href={formatPhoneLink(COMPANY.phone)} className="flex items-center gap-2 bg-white text-red-800 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors">
              <Phone className="w-5 h-5" />
              {es ? 'Llame Ahora: ' : 'Call Now: '}{COMPANY.phoneFormatted}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
