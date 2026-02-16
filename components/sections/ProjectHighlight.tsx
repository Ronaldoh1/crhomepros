'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Calendar, Hammer } from 'lucide-react'
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider'
import { resolveImageUrl } from '@/lib/resolve-images'
import { useTranslation, useLocale } from '@/lib/i18n/provider'

const highlightProject = {
  id: 'basement-painting-md',
  title: 'Complete Basement Transformation',
  titleEs: 'Transformación Completa de Sótano',
  location: 'Laurel, MD',
  date: 'October 2024',
  category: 'Basement Finishing',
  description:
    'From raw, unfinished space to a beautiful finished living area. Drywall installed throughout, recessed lighting, tile flooring, and a clean blue-gray palette with a bold accent wall. Includes a dedicated laundry nook with fresh trim and built-in storage.',
  descriptionEs:
    'De un espacio sin terminar a una hermosa área habitable. Drywall instalado, iluminación empotrada, piso de azulejo y una paleta azul-gris con pared de acento. Incluye área de lavandería con molduras y almacenamiento integrado.',
  beforeImages: [
    resolveImageUrl('/images/2025-05/basement-md-before-01.png'),
    resolveImageUrl('/images/2025-05/basement-md-before-02.png'),
  ],
  duringImage: resolveImageUrl('/images/2025-05/basement-md-during-01.png'),
  afterImages: [
    resolveImageUrl('/images/2025-05/basement-md-after-01.png'),
    resolveImageUrl('/images/2025-05/basement-md-after-02.png'),
    resolveImageUrl('/images/2025-05/basement-md-after-03.png'),
    resolveImageUrl('/images/2025-05/basement-md-after-04.png'),
  ],
}

export function ProjectHighlight() {
  const t = useTranslation()
  const { locale } = useLocale()
  const [activeAfter, setActiveAfter] = useState(0)
  const p = highlightProject

  const stats = [
    { label: t.projectHighlight.projectDuration, value: '3 weeks' },
    { label: t.projectHighlight.area, value: '~800 sq ft' },
    { label: t.projectHighlight.budgetRange, value: '$20K–$40K' },
  ]

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-50/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-100/30 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 tracking-wider uppercase mb-4">
              <Hammer className="w-4 h-4" />
              {t.projectHighlight.badge}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-dark-900">
              {t.projectHighlight.title}
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 group"
          >
            {t.projectHighlight.viewAll}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Before/After Slider */}
          <div className="space-y-6">
            <BeforeAfterSlider
              beforeImage={p.beforeImages[0]}
              afterImage={p.afterImages[activeAfter]}
              beforeLabel={t.projectHighlight.before}
              afterLabel={t.projectHighlight.after}
              className="shadow-xl"
            />

            {/* After thumbnails */}
            <div className="flex gap-3">
              {p.afterImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveAfter(i)}
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all ${
                    i === activeAfter
                      ? 'ring-2 ring-primary-500 ring-offset-2'
                      : 'opacity-60 hover:opacity-90'
                  }`}
                >
                  <Image src={img} alt={`After view ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
              {/* During thumbnail */}
              <button
                onClick={() => {}}
                className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden opacity-60 hover:opacity-90 transition-all"
                title="During construction"
              >
                <Image src={p.duringImage} alt="During construction" fill className="object-cover" />
                <div className="absolute inset-0 bg-dark-900/40 flex items-center justify-center">
                  <span className="text-white text-2xs font-bold uppercase">{t.projectHighlight.during}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Right: Project Details */}
          <div className="space-y-6 lg:sticky lg:top-32">
            {/* Badge */}
            <span className="inline-block px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
              {p.category}
            </span>

            <h3 className="text-2xl md:text-3xl font-display font-bold text-dark-900">
              {locale === 'es' ? p.titleEs : p.title}
            </h3>

            <div className="flex items-center gap-4 text-dark-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{p.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{p.date}</span>
              </div>
            </div>

            <p className="text-dark-600 text-lg leading-relaxed">
              {locale === 'es' ? p.descriptionEs : p.description}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-dark-100">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-lg font-bold text-dark-900">{stat.value}</div>
                  <div className="text-sm text-dark-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/get-started"
                className="btn-primary text-center"
              >
                {t.projectHighlight.startProject}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/estimate-cost"
                className="btn-outline text-center"
              >
                {t.projectHighlight.getEstimate}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
