// Google Analytics 4 event tracking
// Usage: import { trackEvent } from '@/lib/analytics'

export const GA_ID = 'G-N9HJY6JHEC'

// Core gtag function
export const gtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag(...args)
  }
}

// Track custom events
export const trackEvent = (action: string, params?: Record<string, any>) => {
  gtag('event', action, params)
}

// === Pre-built events for CR Home Pros ===

// Phone call clicks
export const trackPhoneClick = (location: string) => {
  trackEvent('phone_click', {
    event_category: 'contact',
    event_label: location, // e.g. 'navbar', 'footer', 'hero', 'floating'
  })
}

// WhatsApp clicks
export const trackWhatsAppClick = (location: string) => {
  trackEvent('whatsapp_click', {
    event_category: 'contact',
    event_label: location,
  })
}

// Form submissions
export const trackFormSubmission = (formName: string) => {
  trackEvent('form_submission', {
    event_category: 'lead',
    event_label: formName, // e.g. 'contact', 'intake', 'referral'
  })
}

// Service interest (clicked a service card)
export const trackServiceClick = (serviceId: string) => {
  trackEvent('service_click', {
    event_category: 'engagement',
    event_label: serviceId,
  })
}

// CTA clicks
export const trackCTAClick = (ctaName: string, location: string) => {
  trackEvent('cta_click', {
    event_category: 'engagement',
    event_label: `${ctaName}_${location}`,
  })
}

// Language switch
export const trackLanguageSwitch = (from: string, to: string) => {
  trackEvent('language_switch', {
    event_category: 'engagement',
    event_label: `${from}_to_${to}`,
  })
}

// Project gallery views
export const trackProjectView = (projectId: string) => {
  trackEvent('project_view', {
    event_category: 'engagement',
    event_label: projectId,
  })
}

// Emergency button clicks
export const trackEmergencyClick = () => {
  trackEvent('emergency_click', {
    event_category: 'contact',
    event_label: 'emergency_modal',
  })
}
