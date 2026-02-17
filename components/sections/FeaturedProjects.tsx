'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { resolveImageUrl } from '@/lib/resolve-images'
import { useTranslation, useLocale } from '@/lib/i18n/provider'

// REAL projects from crgenserv.com - Carlos's actual work
const projectImages = [
  {
    id: 'kitchen-full-renovation',
    image: resolveImageUrl('/images/2025-05/bathroom-tile-01.png'),
    beforeImage: '/images/2024-01/img_3702-780x1024.JPEG',
  },
  {
    id: 'bathroom-remodel-1',
    image: resolveImageUrl('/images/2025-05/roofing-md-01.png'),
    beforeImage: '/images/2024-01/img_0416-768x1024.JPEG',
  },
  {
    id: 'complete-renovation-1',
    image: resolveImageUrl('/images/2025-05/deck-pg-county-01.png'),
    beforeImage: '/images/2024-01/img_1506-768x1024.JPEG',
  },
  {
    id: 'deck-restoration-1',
    image: resolveImageUrl('/images/2025-fence-bowie/fence-after-01.png'),
    beforeImage: '/images/2024-06/img_2379-1024x768.JPEG',
  },
]

export function FeaturedProjects() {
  const t = useTranslation()
  const { locale } = useLocale()
  const lp = (path: string) => `/${locale}${path}`

  const [activeIndex, setActiveIndex] = useState(0)
  const [showBefore, setShowBefore] = useState(false)

  // Build translated project data
  const featuredProjects = projectImages.map((proj, i) => ({
    ...proj,
    title: (t.featuredProjects as any)[`p${i}Title`] || '',
    type: (t.featuredProjects as any)[`p${i}Type`] || '',
    duration: (t.featuredProjects as any)[`p${i}Duration`] || '',
    description: (t.featuredProjects as any)[`p${i}Desc`] || '',
    location: 'DMV Area',
  }))

  const activeProject = featuredProjects[activeIndex]

  const nextProject = () => {
    setActiveIndex((prev) => (prev + 1) % featuredProjects.length)
    setShowBefore(false)
  }

  const prevProject = () => {
    setActiveIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length)
    setShowBefore(false)
  }

  return (
    <section className="section-padding bg-dark-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-900/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="inline-block text-sm font-semibold text-gold-400 tracking-wider uppercase mb-4">
              {t.featuredProjects.badge}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white">
              {t.featuredProjects.title}
            </h2>
          </div>
          <p className="text-dark-300 max-w-md text-lg">
            {t.featuredProjects.description}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image Side */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
            {/* Main Image */}
            <Image
              src={showBefore ? activeProject.beforeImage : activeProject.image}
              alt={activeProject.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Before/After Toggle */}
            <button
              onClick={() => setShowBefore(!showBefore)}
              className="absolute bottom-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg font-medium text-sm text-dark-800 hover:bg-white transition-colors"
            >
              {showBefore ? t.featuredProjects.viewAfter : t.featuredProjects.viewBefore}
            </button>

            {/* Navigation Arrows - Desktop Only */}
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-4 right-4 justify-between pointer-events-none">
              <button
                onClick={prevProject}
                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-dark-800 hover:bg-white transition-colors pointer-events-auto"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextProject}
                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-dark-800 hover:bg-white transition-colors pointer-events-auto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Arrows - Mobile Only (Below Image) */}
            <div className="flex md:hidden gap-4 justify-center mt-4 absolute bottom-16 left-1/2 -translate-x-1/2">
              <button
                onClick={prevProject}
                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-dark-800 hover:bg-white transition-colors shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextProject}
                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-dark-800 hover:bg-white transition-colors shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Type Badge */}
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-gold-500 rounded-full text-sm font-semibold text-dark-900">
              {activeProject.type}
            </div>
          </div>

          {/* Info Side */}
          <div className="space-y-6">
            {/* Project Details */}
            <div className="flex items-center gap-4 text-dark-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{activeProject.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{activeProject.duration}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
              {activeProject.title}
            </h3>

            {/* Description */}
            <p className="text-dark-300 text-lg leading-relaxed">
              {activeProject.description}
            </p>

            {/* CTA */}
            <Link
              href={lp(`/projects/${activeProject.id}`)}
              className="inline-flex items-center gap-2 text-gold-400 font-semibold hover:text-gold-300 group"
            >
              {t.featuredProjects.viewFull}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Project Thumbnails */}
            <div className="flex gap-3 pt-6 border-t border-white/10">
              {featuredProjects.map((project, index) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setActiveIndex(index)
                    setShowBefore(false)
                  }}
                  className={cn(
                    'relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all',
                    index === activeIndex
                      ? 'ring-2 ring-gold-500 ring-offset-2 ring-offset-dark-900'
                      : 'opacity-50 hover:opacity-80'
                  )}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href={lp('/projects')}
            className="btn-outline-white"
          >
            {t.featuredProjects.viewAll}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}
