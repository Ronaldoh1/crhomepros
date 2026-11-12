'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator, ArrowRight, Info, Phone, CheckCircle } from 'lucide-react'
import { cn, formatCurrency, formatPhoneLink } from '@/lib/utils'
import { COMPANY } from '@/lib/constants'
import { useLocale } from '@/lib/i18n/provider'

// Service pricing data
const serviceData = [
  {
    id: 'kitchen',
    name: 'Kitchen Remodel',
    nameEs: 'Remodelación de Cocina',
    basePrice: 15000,
    pricePerSqFt: 150,
    description: 'Complete kitchen transformation',
    descriptionEs: 'Transformación completa de su cocina',
  },
  {
    id: 'bathroom',
    name: 'Bathroom Renovation',
    nameEs: 'Renovación de Baño',
    basePrice: 8000,
    pricePerSqFt: 200,
    description: 'Full bathroom remodel',
    descriptionEs: 'Remodelación completa del baño',
  },
  {
    id: 'basement',
    name: 'Basement Finishing',
    nameEs: 'Acabado de Sótano',
    basePrice: 20000,
    pricePerSqFt: 50,
    description: 'Convert unfinished basement',
    descriptionEs: 'Convierta su sótano sin terminar',
  },
  {
    id: 'deck',
    name: 'Deck Installation',
    nameEs: 'Construcción de Terraza',
    basePrice: 5000,
    pricePerSqFt: 35,
    description: 'New deck construction',
    descriptionEs: 'Construcción de una terraza nueva',
  },
  {
    id: 'roofing',
    name: 'Roofing',
    nameEs: 'Techos',
    basePrice: 8000,
    pricePerSqFt: 5,
    description: 'Roof replacement',
    descriptionEs: 'Reemplazo de techo',
  },
  {
    id: 'painting',
    name: 'Interior Painting',
    nameEs: 'Pintura Interior',
    basePrice: 1500,
    pricePerSqFt: 3,
    description: 'Professional painting',
    descriptionEs: 'Pintura profesional',
  },
  {
    id: 'flooring',
    name: 'Flooring',
    nameEs: 'Pisos',
    basePrice: 2000,
    pricePerSqFt: 12,
    description: 'New flooring installation',
    descriptionEs: 'Instalación de pisos nuevos',
  },
]

const materialLevels = [
  { id: 'budget', name: 'Budget-Friendly', nameEs: 'Económico', multiplier: 0.8, description: 'Quality materials at value prices', descriptionEs: 'Materiales de calidad a buen precio' },
  { id: 'mid', name: 'Mid-Range', nameEs: 'Gama Media', multiplier: 1.0, description: 'Popular brands and finishes', descriptionEs: 'Marcas y acabados populares' },
  { id: 'premium', name: 'Premium', nameEs: 'Premium', multiplier: 1.4, description: 'High-end materials and brands', descriptionEs: 'Materiales y marcas de alta gama' },
  { id: 'luxury', name: 'Luxury', nameEs: 'Lujo', multiplier: 2.0, description: 'Top-tier, custom options', descriptionEs: 'Opciones exclusivas y a la medida' },
]

export default function EstimatePage() {
  const { locale } = useLocale()
  const es = locale === 'es'
  const lp = (path: string) => (es ? `/es${path}` : path)
  const [selectedService, setSelectedService] = useState('')
  const [squareFootage, setSquareFootage] = useState(200)
  const [materialLevel, setMaterialLevel] = useState('mid')
  const [showResult, setShowResult] = useState(false)

  const service = serviceData.find((s) => s.id === selectedService)
  const material = materialLevels.find((m) => m.id === materialLevel)

  const calculateEstimate = () => {
    if (!service || !material) return { low: 0, high: 0 }
    
    const baseEstimate = service.basePrice + (squareFootage * service.pricePerSqFt)
    const adjustedEstimate = baseEstimate * material.multiplier
    
    return {
      low: Math.round(adjustedEstimate * 0.85),
      high: Math.round(adjustedEstimate * 1.15),
    }
  }

  const estimate = calculateEstimate()

  const handleCalculate = () => {
    if (selectedService) {
      setShowResult(true)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative page-top pb-12 bg-dark-900 overflow-hidden">
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/20 border border-gold-500/30 mb-6">
              <Calculator className="w-5 h-5 text-gold-400" />
              <span className="text-gold-300 font-medium">{es ? 'Estimado Instantáneo' : 'Instant Estimate'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              {es ? 'Calculadora de' : 'Project Cost'}{' '}
              <span className="text-gold-400">
                {es ? 'Costos del Proyecto' : 'Calculator'}
              </span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              {es ? (
                <>Obtenga un estimado aproximado de su proyecto en segundos. Para una cotización precisa, programe una consulta gratuita.</>
              ) : (
                <>Get a ballpark estimate for your project in seconds. For an accurate quote, 
              schedule a free consultation.</>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-dark-100 shadow-xl overflow-hidden">
              {/* Calculator Form */}
              <div className="p-6 md:p-8 space-y-8">
                {/* Step 1: Service */}
                <div>
                  <h3 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary-800 text-white text-sm flex items-center justify-center">1</span>
                    {es ? 'Seleccione el Tipo de Proyecto' : 'Select Your Project Type'}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {serviceData.map((svc) => (
                      <button
                        key={svc.id}
                        onClick={() => {
                          setSelectedService(svc.id)
                          setShowResult(false)
                        }}
                        className={cn(
                          'p-4 rounded-xl border-2 text-left transition-all',
                          selectedService === svc.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-dark-100 hover:border-primary-200'
                        )}
                      >
                        <p className="font-semibold text-dark-900">{es ? svc.nameEs : svc.name}</p>
                        <p className="text-xs text-dark-600 mt-1">{es ? svc.descriptionEs : svc.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Size */}
                <div>
                  <h3 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary-800 text-white text-sm flex items-center justify-center">2</span>
                    {es ? 'Área Aproximada (pies cuadrados)' : 'Approximate Square Footage'}
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="50"
                      max="2000"
                      step="50"
                      value={squareFootage}
                      onChange={(e) => {
                        setSquareFootage(Number(e.target.value))
                        setShowResult(false)
                      }}
                      className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                    <div className="flex justify-between text-sm text-dark-600">
                      <span>50 {es ? 'pies²' : 'sq ft'}</span>
                      <span className="text-lg font-bold text-primary-700">{squareFootage} {es ? 'pies²' : 'sq ft'}</span>
                      <span>2000 {es ? 'pies²' : 'sq ft'}</span>
                    </div>
                  </div>
                </div>

                {/* Step 3: Material Level */}
                <div>
                  <h3 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary-800 text-white text-sm flex items-center justify-center">3</span>
                    {es ? 'Nivel de Calidad de Materiales' : 'Material Quality Level'}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {materialLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => {
                          setMaterialLevel(level.id)
                          setShowResult(false)
                        }}
                        className={cn(
                          'p-4 rounded-xl border-2 text-left transition-all',
                          materialLevel === level.id
                            ? 'border-gold-500 bg-gold-50'
                            : 'border-dark-100 hover:border-gold-200'
                        )}
                      >
                        <p className="font-semibold text-dark-900">{es ? level.nameEs : level.name}</p>
                        <p className="text-xs text-dark-600 mt-1">{es ? level.descriptionEs : level.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculate Button */}
                <button
                  onClick={handleCalculate}
                  disabled={!selectedService}
                  className={cn(
                    'w-full py-4 rounded-xl font-semibold text-lg transition-all',
                    selectedService
                      ? 'bg-primary-800 text-white hover:bg-primary-700'
                      : 'bg-dark-100 text-dark-600 cursor-not-allowed'
                  )}
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  {es ? 'Calcular Estimado' : 'Calculate Estimate'}
                </button>
              </div>

              {/* Result */}
              {showResult && selectedService && (
                <div className="bg-gradient-to-r from-primary-800 to-primary-900 p-6 md:p-8 text-white">
                  <h3 className="text-xl font-semibold mb-4">{es ? 'Su Rango Estimado' : 'Your Estimated Range'}</h3>
                  <div className="flex items-baseline gap-4 mb-6">
                    <span className="text-4xl md:text-5xl font-bold">
                      {formatCurrency(estimate.low)} - {formatCurrency(estimate.high)}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-2 mb-6 text-primary-200">
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      {es ? (
                        <>Este es un estimado aproximado basado en costos promedio de proyectos. El costo real puede variar según los requisitos específicos, las condiciones del lugar y los materiales que elija.</>
                      ) : (
                        <>This is a rough estimate based on average project costs. Your actual cost may vary 
                      based on specific requirements, site conditions, and material selections.</>
                      )}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Link
                      href={lp('/get-started')}
                      className="flex items-center justify-center gap-2 bg-gold-500 text-dark-900 px-6 py-3 rounded-xl font-semibold hover:bg-gold-400 transition-colors"
                    >
                      {es ? 'Obtener Cotización Precisa' : 'Get Accurate Quote'}
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <a
                      href={formatPhoneLink(COMPANY.phone)}
                      className="flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      {es ? 'Llámenos para Conversar' : 'Call to Discuss'}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="mt-8 bg-dark-50 rounded-xl p-6">
              <h4 className="font-semibold text-dark-900 mb-3">{es ? 'Cómo Funcionan Nuestros Estimados' : 'How Our Estimates Work'}</h4>
              <ul className="space-y-2 text-dark-600">
                {(es ? [
                  'Esta calculadora ofrece un rango general basado en costos promedio de proyectos en el área del DMV',
                  'El precio final depende de los requisitos específicos del proyecto, los materiales y las condiciones del lugar',
                  'Siempre entregamos un estimado detallado y por escrito después de una consulta en su hogar',
                  'Nuestros estimados incluyen mano de obra, materiales, permisos y limpieza',
                ] : [
                  'This calculator provides a general range based on average project costs in the DMV area',
                  'Final pricing depends on specific project requirements, materials, and site conditions',
                  'We always provide a detailed, written estimate after an on-site consultation',
                  'Our estimates include labor, materials, permits, and cleanup',
                ]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
              {es ? '¿Desea una Cotización Precisa?' : 'Want an Accurate Quote?'}
            </h2>
            <p className="text-lg text-dark-600 mb-8">
              {es ? (
                <>Programe una consulta gratuita en su hogar. Evaluaremos su proyecto en persona y le daremos un estimado detallado y sin compromiso.</>
              ) : (
                <>Schedule a free on-site consultation. We'll assess your project in person and provide 
              a detailed, no-obligation estimate.</>
              )}
            </p>
            <Link href={lp('/get-started')} className="btn-gold btn-lg">
              {es ? 'Programar Consulta Gratuita' : 'Schedule Free Consultation'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
