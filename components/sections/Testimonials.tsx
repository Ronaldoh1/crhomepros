'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, ChevronLeft, ChevronRight, Quote, ArrowRight } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { TESTIMONIALS } from '@/lib/constants'
import { useTranslation } from '@/lib/i18n/provider'

export function Testimonials() {
  const t = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  const activeTestimonial = TESTIMONIALS[activeIndex]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-sm font-semibold text-gold-600 tracking-wider uppercase mb-4">
            {t.testimonials.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-dark-900 mb-6">
            {t.testimonials.title}
          </h2>
          <p className="text-lg text-dark-500">
            {t.testimonials.description}
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-dark-900 rounded-3xl p-8 md:p-12 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl" />
            <Quote className="absolute top-6 right-6 w-20 h-20 text-gold-500/20" />

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-5 h-5',
                    i < activeTestimonial.rating
                      ? 'text-gold-400 fill-gold-400'
                      : 'text-dark-600'
                  )}
                />
              ))}
            </div>

            {/* Quote */}
            <p className="text-lg md:text-xl text-white leading-relaxed mb-8 relative z-10">
              "{activeTestimonial.text.length > 300 
                ? activeTestimonial.text.slice(0, 300) + '...' 
                : activeTestimonial.text}"
            </p>

            {/* Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg">
                  {getInitials(activeTestimonial.name)}
                </div>
                <div>
                  <p className="font-semibold text-white">{activeTestimonial.name}</p>
                  <p className="text-white/70 text-sm">{activeTestimonial.location}</p>
                  <p className="text-gold-400 text-xs mt-1">{activeTestimonial.service}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-2">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    index === activeIndex
                      ? 'w-8 bg-gold-500'
                      : 'bg-white/30 hover:bg-white/50'
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-800 group"
          >
            {t.testimonials.readAll}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
