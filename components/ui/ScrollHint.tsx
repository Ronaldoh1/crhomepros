'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * Subtle scroll hint — shows a gentle bouncing chevron at the bottom of a section
 * when the user hasn't scrolled yet. Fades out after first scroll.
 * Use inside any section that has more content below the fold.
 */
export function ScrollHint({ className = '' }: { className?: string }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setVisible(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Auto-fade after 6 seconds even without scroll
    const timer = setTimeout(() => setVisible(false), 6000)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`flex flex-col items-center gap-1 transition-opacity duration-700 ${visible ? 'opacity-60' : 'opacity-0'} ${className}`}
    >
      <span className="text-[10px] uppercase tracking-widest text-current font-medium">Scroll</span>
      <div className="animate-bounce">
        <ChevronDown className="w-5 h-5" />
      </div>
    </div>
  )
}
