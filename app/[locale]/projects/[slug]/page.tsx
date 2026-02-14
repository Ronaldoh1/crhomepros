'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Clock, Calendar, ChevronLeft, ChevronRight, Phone } from 'lucide-react'
import { cn, formatPhoneLink } from '@/lib/utils'
import { COMPANY } from '@/lib/constants'

// Sample project data - will come from Firebase
const projectsData: Record<string, {
  title: string
  location: string
  type: string
  duration: string
  year: number
  description: string
  challenge: string
  solution: string
  images: { url: string; caption: string }[]
}> = {
  'bethesda-kitchen-2024': {
    title: 'Modern Kitchen Transformation',
    location: 'Bethesda, MD',
    type: 'Kitchen',
    duration: '6 weeks',
    year: 2024,
    description: 'Complete kitchen remodel featuring custom cabinetry, quartz countertops, and modern appliances. The homeowners wanted a bright, open space for family gatherings.',
    challenge: 'The existing kitchen had a closed layout with poor natural light and outdated fixtures.',
    solution: 'We removed a non-load-bearing wall to open the space, installed large windows, and chose light-colored cabinets and countertops to maximize brightness.',
    images: [
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80', caption: 'After: Open concept kitchen' },
      { url: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&q=80', caption: 'Custom island with seating' },
      { url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&q=80', caption: 'Modern appliances' },
    ],
  },
  'silver-spring-bathroom': {
    title: 'Spa-Inspired Master Bath',
    location: 'Silver Spring, MD',
    type: 'Bathroom',
    duration: '4 weeks',
    year: 2024,
    description: 'Luxurious master bathroom renovation with walk-in shower, freestanding tub, and heated floors.',
    challenge: 'Small footprint with outdated plumbing and poor ventilation.',
    solution: 'Reconfigured the layout to maximize space, updated all plumbing, and added proper ventilation with a modern exhaust fan.',
    images: [
      { url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80', caption: 'Completed master bath' },
      { url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&q=80', caption: 'Walk-in shower detail' },
    ],
  },
}

const defaultProject = {
  title: 'Project Details',
  location: 'DMV Area',
  type: 'Renovation',
  duration: '4 weeks',
  year: 2024,
  description: 'A beautiful home improvement project by CR Home Pros.',
  challenge: 'The client needed a fresh, modern update.',
  solution: 'We delivered quality craftsmanship on time and on budget.',
  images: [
    { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', caption: 'Project result' },
  ],
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projectsData[params.slug] || defaultProject
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % project.images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + project.images.length) % project.images.length)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-12 bg-gradient-to-br from-dark-900 via-primary-900 to-dark-950">
        <div className="container-custom relative z-10">
          <Link href="/projects" className="inline-flex items-center text-primary-300 hover:text-white mb-6">
            ← Back to Projects
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-gold-500 text-dark-900 rounded-full text-sm font-semibold">
              {project.type}
            </span>
            <span className="px-3 py-1 bg-white/10 text-white rounded-full text-sm">
              {project.year}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-white/70">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {project.location}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {project.duration}
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-8 bg-dark-900">
        <div className="container-custom">
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden">
            <Image
              src={project.images[currentImage].url}
              alt={project.images[currentImage].caption}
              fill
              className="object-cover"
            />
            
            {/* Navigation */}
            {project.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-dark-900" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-dark-900" />
                </button>
              </>
            )}

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-white">{project.images[currentImage].caption}</p>
            </div>
          </div>

          {/* Thumbnails */}
          {project.images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {project.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={cn(
                    'relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all',
                    currentImage === i ? 'border-gold-500' : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <Image src={img.url} alt={img.caption} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Details */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-display font-bold text-dark-900 mb-4">About This Project</h2>
                  <p className="text-dark-600 leading-relaxed">{project.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-display font-semibold text-dark-900 mb-3">The Challenge</h3>
                  <p className="text-dark-600 leading-relaxed">{project.challenge}</p>
                </div>

                <div>
                  <h3 className="text-xl font-display font-semibold text-dark-900 mb-3">Our Solution</h3>
                  <p className="text-dark-600 leading-relaxed">{project.solution}</p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-dark-50 rounded-xl p-6">
                  <h3 className="font-semibold text-dark-900 mb-4">Project Details</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-dark-500">Type</dt>
                      <dd className="font-medium text-dark-900">{project.type}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-dark-500">Location</dt>
                      <dd className="font-medium text-dark-900">{project.location}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-dark-500">Duration</dt>
                      <dd className="font-medium text-dark-900">{project.duration}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-dark-500">Year</dt>
                      <dd className="font-medium text-dark-900">{project.year}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-primary-800 rounded-xl p-6 text-white">
                  <h3 className="font-semibold mb-3">Want Similar Results?</h3>
                  <p className="text-primary-200 text-sm mb-4">
                    Let's discuss your project and bring your vision to life.
                  </p>
                  <Link href="/get-started" className="btn-gold w-full justify-center text-sm">
                    Get Free Estimate
                  </Link>
                </div>
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
              Ready to Transform Your Space?
            </h2>
            <p className="text-lg text-dark-500 mb-8">
              Get a free consultation and see what's possible for your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started" className="btn-gold btn-lg">
                Start Your Project <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a href={formatPhoneLink(COMPANY.phone)} className="btn-outline btn-lg">
                <Phone className="w-5 h-5 mr-2" /> Call Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
