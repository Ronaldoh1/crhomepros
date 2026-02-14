'use client'

import Link from 'next/link'
import { Leaf, Zap, Droplets, Wind, Sun, ArrowRight, CheckCircle, TreePine, Recycle, ThermometerSun } from 'lucide-react'
import { useTranslation, useLocale } from '@/lib/i18n/provider'

const greenServices = [
  {
    icon: Zap,
    title: 'Energy-Efficient Upgrades',
    titleEs: 'Mejoras de Eficiencia Energética',
    description: 'LED lighting, smart thermostats, insulation upgrades, and energy-efficient windows that cut utility bills by 20-40%.',
    descriptionEs: 'Iluminación LED, termostatos inteligentes, mejoras de aislamiento y ventanas eficientes que reducen facturas un 20-40%.',
    savings: 'Save $800-2,000/year',
  },
  {
    icon: Sun,
    title: 'Solar-Ready Designs',
    titleEs: 'Diseños Preparados para Solar',
    description: 'We design renovations with solar panel readiness — pre-wired electrical, structural reinforcement, and optimal roof angles.',
    descriptionEs: 'Diseñamos renovaciones listas para paneles solares — cableado pre-instalado, refuerzo estructural y ángulos óptimos.',
    savings: 'Up to 30% tax credit',
  },
  {
    icon: Droplets,
    title: 'Water Conservation',
    titleEs: 'Conservación de Agua',
    description: 'Low-flow fixtures, greywater-ready plumbing, rain barrel systems, and drought-resistant landscaping integration.',
    descriptionEs: 'Griferías de bajo flujo, plomería lista para aguas grises, sistemas de recolección de lluvia.',
    savings: 'Save 30-50% on water',
  },
  {
    icon: Wind,
    title: 'Indoor Air Quality',
    titleEs: 'Calidad del Aire Interior',
    description: 'VOC-free paints, formaldehyde-free materials, HEPA filtration systems, and proper ventilation design.',
    descriptionEs: 'Pinturas sin VOC, materiales sin formaldehído, sistemas de filtración HEPA y diseño de ventilación.',
    savings: 'Healthier living',
  },
  {
    icon: Recycle,
    title: 'Sustainable Materials',
    titleEs: 'Materiales Sostenibles',
    description: 'Reclaimed wood, bamboo flooring, recycled glass countertops, cork insulation, and locally-sourced materials.',
    descriptionEs: 'Madera recuperada, pisos de bambú, encimeras de vidrio reciclado, aislamiento de corcho.',
    savings: 'Reduced carbon footprint',
  },
  {
    icon: ThermometerSun,
    title: 'Climate-Resilient Renovations',
    titleEs: 'Renovaciones Resistentes al Clima',
    description: 'Storm-proof roofing, impact-resistant windows, flood-resistant basement finishing, and backup power planning.',
    descriptionEs: 'Techos resistentes a tormentas, ventanas anti-impacto, sótanos resistentes a inundaciones.',
    savings: 'Lower insurance premiums',
  },
]

const taxCredits = [
  { item: 'Heat pumps', credit: 'Up to $2,000', itemEs: 'Bombas de calor' },
  { item: 'Insulation & air sealing', credit: 'Up to $1,200', itemEs: 'Aislamiento' },
  { item: 'Energy-efficient windows', credit: 'Up to $600', itemEs: 'Ventanas eficientes' },
  { item: 'Solar panels', credit: '30% of cost', itemEs: 'Paneles solares' },
  { item: 'Water heaters (heat pump)', credit: 'Up to $2,000', itemEs: 'Calentadores de agua' },
  { item: 'Electric panel upgrade', credit: 'Up to $600', itemEs: 'Panel eléctrico' },
]

export default function GreenPage() {
  const t = useTranslation()
  const { locale } = useLocale()
  const isEs = locale === 'es'
  const lp = (path: string) => locale === 'en' ? path : `/es${path}`

  return (
    <main className="pt-24 pb-16">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 5C15 20 5 30 15 45c10-5 20-10 30-5C55 30 45 15 30 5z\' fill=\'white\' fill-opacity=\'0.3\'/%3E%3C/svg%3E")' }} />
        <div className="container-custom relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Leaf className="w-4 h-4 text-green-300" />
              <span className="text-sm font-medium">
                {isEs ? 'Remodelación Consciente' : 'Mindful Remodeling'}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              {isEs ? (
                <>Renueva Tu Espacio. <span className="text-green-300">Respeta el Planeta.</span></>
              ) : (
                <>Regenerate Your Space. <span className="text-green-300">Respect the Planet.</span></>
              )}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
              {isEs
                ? 'Renovaciones inteligentes que reducen costos de energía, mejoran la calidad del aire y aumentan el valor de tu hogar — todo mientras cuidas el medio ambiente.'
                : "Smart renovations that cut energy costs, improve air quality, and increase your home's value — all while being kind to the earth."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={lp('/get-started')} className="btn bg-white text-green-900 hover:bg-green-50 font-bold px-8 py-4 rounded-xl text-lg">
                {isEs ? 'Auditoría Eco Gratis' : 'Free Eco Audit'}
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
              <Link href={lp('/projects')} className="btn bg-white/10 text-white border border-white/30 hover:bg-white/20 px-8 py-4 rounded-xl text-lg">
                {isEs ? 'Ver Proyectos Verdes' : 'See Green Projects'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900">
              {isEs ? 'Servicios de Remodelación Verde' : 'Green Remodeling Services'}
            </h2>
            <p className="text-dark-500 mt-4 max-w-2xl mx-auto">
              {isEs
                ? 'Cada proyecto incluye opciones sostenibles que protegen tu bolsillo y el planeta.'
                : 'Every project includes sustainable options that protect your wallet and the planet.'
              }
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {greenServices.map((service, i) => (
              <div key={i} className="group bg-white border border-dark-100 rounded-2xl p-6 hover:shadow-xl hover:border-green-200 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <service.icon className="w-6 h-6 text-green-700" />
                </div>
                <h3 className="text-lg font-bold text-dark-900 mb-2">
                  {isEs ? service.titleEs : service.title}
                </h3>
                <p className="text-dark-500 text-sm mb-4">
                  {isEs ? service.descriptionEs : service.description}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                  <TreePine className="w-3.5 h-3.5" />
                  {service.savings}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tax Credits */}
      <section className="py-16 bg-dark-50">
        <div className="container-custom">
          <div className="bg-gradient-to-br from-green-800 to-emerald-700 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-display font-bold mb-4">
                  {isEs ? '💰 Créditos Fiscales 2025-2026' : '💰 2025-2026 Tax Credits'}
                </h2>
                <p className="text-white/80 mb-6">
                  {isEs
                    ? 'El gobierno federal ofrece créditos fiscales significativos para mejoras de eficiencia energética. Te ayudamos a maximizar tus ahorros.'
                    : 'The federal government offers significant tax credits for energy efficiency upgrades. We help you maximize your savings.'
                  }
                </p>
                <Link href={lp('/get-started')} className="inline-flex items-center gap-2 bg-white text-green-800 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors">
                  {isEs ? 'Consulta Gratis' : 'Free Consultation'} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {taxCredits.map((credit, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0" />
                      <span className="text-sm font-medium">{isEs ? credit.itemEs : credit.item}</span>
                    </div>
                    <span className="text-green-300 font-bold text-sm whitespace-nowrap">{credit.credit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container-custom text-center">
          <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-4">
            {isEs ? '¿Listo para una Renovación Consciente?' : 'Ready for a Mindful Renovation?'}
          </h2>
          <p className="text-dark-500 max-w-xl mx-auto mb-8">
            {isEs
              ? 'Cada proyecto que hacemos considera el impacto ambiental. Tu hogar puede ser hermoso Y responsable.'
              : "Every project we take on considers environmental impact. Your home can be beautiful AND responsible."
            }
          </p>
          <Link
            href={lp('/get-started')}
            className="inline-flex items-center gap-2 bg-green-700 text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-green-600 transition-colors"
          >
            {isEs ? 'Solicita Tu Auditoría Eco' : 'Request Your Eco Audit'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  )
}
