'use client'

import { useState, useEffect } from 'react'
import { Phone, X, ArrowUp } from "lucide-react"
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon"
import { cn, formatPhoneLink, formatWhatsAppLink } from '@/lib/utils'
import { COMPANY } from '@/lib/constants'

export function FloatingContact() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
      setShowBackToTop(window.scrollY > 800)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Back to Top - bottom left */}
      <button
        onClick={scrollToTop}
        className={cn(
          'fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-dark-800/80 backdrop-blur-sm text-white flex items-center justify-center shadow-lg hover:bg-dark-700 transition-all duration-500 border border-white/10',
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        )}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Contact FAB - bottom right */}
      <div
        className={cn(
          'fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 transition-all duration-500',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        )}
      >
        {/* Expanded options */}
        <div
          className={cn(
            'flex flex-col gap-3 transition-all duration-300',
            isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          )}
        >
          {/* WhatsApp */}
          <a
            href={formatWhatsAppLink(COMPANY.phone, "Hi! I'm interested in your services.")}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3"
          >
            <span className="px-3 py-1.5 bg-white rounded-lg shadow-lg text-sm font-medium text-dark-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              WhatsApp Us
            </span>
            <div className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all whatsapp-pulse">
              <WhatsAppIcon className="w-6 h-6" />
            </div>
          </a>

          {/* Phone */}
          <a
            href={formatPhoneLink(COMPANY.phone)}
            className="group flex items-center gap-3"
          >
            <span className="px-3 py-1.5 bg-white rounded-lg shadow-lg text-sm font-medium text-dark-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {COMPANY.phoneFormatted}
            </span>
            <div className="w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all">
              <Phone className="w-6 h-6" />
            </div>
          </a>
        </div>

        {/* Main toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300',
            isExpanded
              ? 'bg-dark-800 text-white rotate-0'
              : 'bg-gold-500 text-dark-900 hover:bg-gold-400'
          )}
          aria-label={isExpanded ? 'Close contact options' : 'Open contact options'}
        >
          {isExpanded ? (
            <X className="w-6 h-6" />
          ) : (
            <Phone className="w-6 h-6" />
          )}
        </button>
      </div>
    </>
  )
}
