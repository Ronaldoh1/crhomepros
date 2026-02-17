'use client'

import { resolveImageUrl } from '@/lib/resolve-images'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Phone, Shield, Award, Languages, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { ScrollIndicator } from '@/components/ScrollIndicator'
import { cn, formatPhoneLink } from '@/lib/utils'
import { COMPANY } from '@/lib/constants'
import { useTranslation, useLocale } from '@/lib/i18n/provider'

// Slideshow images
const slideImages = [
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80', // Modern kitchen
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1920&q=80', // Bathroom
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&q=80', // Construction/renovation
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&q=80', // Living room
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80', // Beautiful home exterior
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80', // Modern home
]

export function Hero() {
  const t = useTranslation()
  const { locale } = useLocale()
  const lp = (path: string) => `/${locale}${path}`

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const SLIDE_DURATION = 5000 // 5 seconds per slide
  const [progress, setProgress] = useState(0)

  const slides = [
    { image: slideImages[0], tagline: t.hero.slides.s1tagline, subtitle: t.hero.slides.s1subtitle },
    { image: slideImages[1], tagline: t.hero.slides.s2tagline, subtitle: t.hero.slides.s2subtitle },
    { image: slideImages[2], tagline: t.hero.slides.s3tagline, subtitle: t.hero.slides.s3subtitle },
    { image: slideImages[3], tagline: t.hero.slides.s4tagline, subtitle: t.hero.slides.s4subtitle },
    { image: slideImages[4], tagline: t.hero.slides.s5tagline, subtitle: t.hero.slides.s5subtitle },
    { image: slideImages[5], tagline: t.hero.slides.s6tagline, subtitle: t.hero.slides.s6subtitle },
  ]

  const trustBadges = [
    { icon: Shield, label: t.hero.trustBadges.licensed, detail: t.hero.trustBadges.licensedDetail },
    { icon: Award, label: t.hero.trustBadges.years, detail: t.hero.since },
    { icon: Languages, label: t.hero.trustBadges.spanish, detail: t.hero.trustBadges.spanish },
    { icon: CheckCircle, label: t.hero.trustBadges.estimates, detail: t.hero.trustBadges.estimates },
  ]

  // Track scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-advance slideshow
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Handle slide timing and progress bar
  useEffect(() => {
    if (isPaused) return

    // Reset progress when slide changes
    setProgress(0)

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + (100 / (SLIDE_DURATION / 50)) // Update every 50ms
      })
    }, 50)

    // Auto-advance to next slide
    const slideTimer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, SLIDE_DURATION)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(slideTimer)
    }
  }, [currentSlide, isPaused])

  const goToSlide = useCallback((index: number) => {
    setProgress(0)
    setCurrentSlide(index)
  }, [])

  const nextSlide = useCallback(() => {
    setProgress(0)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setProgress(0)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  return (
    <section 
      className="relative min-h-screen flex items-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000',
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            )}
          >
            {/* Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/80 to-dark-900/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-dark-900/40" />
          </div>
        ))}
        
        {/* Additional design elements */}
        <div className="absolute inset-0 bg-primary-900/20 mix-blend-multiply" />
        
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Slide Navigation Arrows - Hidden on mobile, visible on desktop */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 items-center justify-center text-white transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 items-center justify-center text-white transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Content */}
      <div className="relative z-10 container-custom py-24 lg:py-32">
        <div className="max-w-4xl">
          {/* Logo - Large with parallax scroll effect */}
          <div
            className={cn(
              'mb-6 transition-all duration-700',
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
            style={{
              transform: `translateY(${scrollY * 0.3}px) scale(${Math.max(1 - scrollY * 0.001, 0.7)})`,
              opacity: Math.max(1 - scrollY * 0.003, 0),
            }}
          >
            <div className="relative h-32 sm:h-36 lg:h-44 w-auto inline-block">
              <Image
                src={resolveImageUrl("/images/logo.png")}
                alt="CR Home Pros - Complete Home Services"
                width={600}
                height={180}
                className="h-full w-auto object-contain"
                style={{ 
          maxWidth: 'none',
          filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 40px rgba(196, 160, 82, 0.2))',
          mixBlendMode: 'normal'
        }}
                priority
                quality={100}
                unoptimized
              />
            </div>
          </div>

          {/* Animated Tagline */}
          <div className="relative min-h-[180px] lg:min-h-[200px] mb-8">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={cn(
                  'absolute top-0 left-0 transition-all duration-700',
                  index === currentSlide 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8 pointer-events-none'
                )}
              >
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                  {slide.tagline.split(' ').map((word, i) => (
                    <span key={i}>
                      {i === 0 || i === slide.tagline.split(' ').length - 1 ? (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500">
                          {word}
                        </span>
                      ) : (
                        word
                      )}{' '}
                    </span>
                  ))}
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-white/70 max-w-2xl leading-relaxed">
                  {slide.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div
            className={cn(
              'flex flex-col sm:flex-row items-start gap-4 mb-10 transition-all duration-700 delay-300',
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <Link
              href={lp('/get-started')}
              className="group flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-dark-900 px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-gold-500/25 hover:shadow-xl hover:shadow-gold-500/40 hover:-translate-y-1 transition-all duration-300"
            >
              {t.hero.cta}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={formatPhoneLink(COMPANY.phone)}
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 hover:border-white/40 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              {COMPANY.phoneFormatted}
            </a>
          </div>

          {/* Trust Badges */}
          <div
            className={cn(
              'grid grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-700 delay-400',
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3"
              >
                <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                  <badge.icon className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{badge.label}</p>
                  <p className="text-white/50 text-xs">{badge.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Counter - shows current slide number */}
      <div className="absolute bottom-8 right-8 z-20 hidden lg:flex items-center gap-2 text-white/60 text-sm font-medium">
        <span className="text-white">{String(currentSlide + 1).padStart(2, '0')}</span>
        <span>/</span>
        <span>{String(slides.length).padStart(2, '0')}</span>
      </div>

      {/* Slide Indicators with Progress */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="relative group"
            aria-label={`Go to slide ${index + 1}`}
          >
            {/* Background track */}
            <div className={cn(
              'h-1.5 rounded-full transition-all duration-300 overflow-hidden',
              index === currentSlide ? 'w-12 bg-white/30' : 'w-3 bg-white/20 hover:bg-white/40'
            )}>
              {/* Progress fill - only show on current slide */}
              {index === currentSlide && (
                <div 
                  className="h-full bg-gold-500 rounded-full transition-all duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Bilingual Badge - floating */}
      <div className="hidden lg:block absolute top-32 right-8 z-20">
        <div className="bg-gold-500 text-dark-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-bounce-slow">
          {t.hero.bilingualBadge}
        </div>
      </div>

      {/* Bottom gradient for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  )
}
