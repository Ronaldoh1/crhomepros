'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { resolveImageUrl } from '@/lib/resolve-images'

// REAL projects from crgenserv.com - Carlos's actual work
const featuredProjects = [
  {
    id: 'kitchen-full-renovation',
    title: 'Full Kitchen Renovation',
    location: 'DMV Area',
    type: 'Kitchen',
    duration: '6 weeks',
    year: 2024,
    description: 'Complete kitchen transformation featuring custom cabinetry, premium countertops, modern appliances, and expert tiling work.',
    image: resolveImageUrl('/images/2024-01/img_3700-1024x746.JPEG'),
    beforeImage: resolveImageUrl('/images/2024-01/img_3702-780x1024.JPEG'),
  },
  {
    id: 'bathroom-remodel-1',
    title: 'Modern Bathroom Remodel',
    location: 'DMV Area',
    type: 'Bathroom',
    duration: '4 weeks',
    year: 2024,
    description: 'Luxurious bathroom renovation with custom tile work, modern fixtures, and premium finishes throughout.',
    image: resolveImageUrl('/images/2024-06/img_3497-1-768x1024.JPEG'),
    beforeImage: resolveImageUrl('/images/2024-01/img_0416-768x1024.JPEG'),
  },
  {
    id: 'complete-renovation-1',
    title: 'Complete Home Renovation',
    location: 'DMV Area',
    type: 'Renovation',
    duration: '12 weeks',
    year: 2024,
    description: 'Full property transformation including structural work, flooring, walls, and complete interior refinishing.',
    image: resolveImageUrl('/images/2024-01/img_1548-2-1024x768.JPEG'),
    beforeImage: resolveImageUrl('/images/2024-01/img_1506-768x1024.JPEG'),
  },
  {
    id: 'deck-restoration-1',
    title: 'Custom Deck Build',
    location: 'DMV Area',
    type: 'Deck',
    duration: '3 weeks',
    year: 2024,
    description: 'Beautiful deck construction with quality lumber, expert craftsmanship, and professional staining for long-lasting beauty.',
    image: resolveImageUrl('/images/2024-06/img_2386-1024x768.JPEG'),
    beforeImage: resolveImageUrl('/images/2024-06/img_2379-1024x768.JPEG'),
  },
]

export function FeaturedProjects() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showBefore, setShowBefore] = useState(false)

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
              Our Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white">
              Featured Projects
            </h2>
          </div>
          <p className="text-dark-300 max-w-md text-lg">
            See the quality of our craftsmanship. Every project completed with precision and pride.
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
              {showBefore ? 'View After' : 'View Before'}
            </button>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
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
              href={`/projects/${activeProject.id}`}
              className="inline-flex items-center gap-2 text-gold-400 font-semibold hover:text-gold-300 group"
            >
              View Full Project
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
            href="/projects"
            className="btn-outline-white"
          >
            View All Projects
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}
