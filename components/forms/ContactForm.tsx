'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SERVICES, COMPANY } from '@/lib/constants'
import { formatWhatsAppLink } from '@/lib/utils'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  service: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to send message')

      setIsSubmitting(false)
      setIsSuccess(true)
      reset()
      setTimeout(() => setIsSuccess(false), 10000)
    } catch (err: any) {
      setIsSubmitting(false)
      setError('Something went wrong. Please try calling us directly.')
      console.error('Contact form error:', err)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent!</h3>
        <p className="text-green-700 mb-4">
          Thank you for reaching out. We'll get back to you within 24 hours.
        </p>
        <p className="text-sm text-green-600">
          Need a faster response?{' '}
          <a
            href={formatWhatsAppLink(COMPANY.phone, "Hi! I just submitted a contact form on your website.")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            Message us on WhatsApp →
          </a>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-dark-700 mb-1.5">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder="John Smith"
          {...register('name')}
          className={cn(
            'w-full px-4 py-3 rounded-xl border bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            errors.name ? 'border-red-300' : 'border-dark-200 focus:border-primary-500'
          )}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>

      {/* Email + Phone */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-dark-700 mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            className={cn(
              'w-full px-4 py-3 rounded-xl border bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              errors.email ? 'border-red-300' : 'border-dark-200 focus:border-primary-500'
            )}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-dark-700 mb-1.5">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            {...register('phone')}
            className={cn(
              'w-full px-4 py-3 rounded-xl border bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              errors.phone ? 'border-red-300' : 'border-dark-200 focus:border-primary-500'
            )}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Service */}
      <div>
        <label htmlFor="service" className="block text-sm font-medium text-dark-700 mb-1.5">
          Service Interested In
        </label>
        <select
          id="service"
          {...register('service')}
          className="w-full px-4 py-3 rounded-xl border border-dark-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        >
          <option value="">Select a service (optional)</option>
          {SERVICES.map((s) => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-dark-700 mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Tell us about your project..."
          {...register('message')}
          className={cn(
            'w-full px-4 py-3 rounded-xl border bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-y',
            errors.message ? 'border-red-300' : 'border-dark-200 focus:border-primary-500'
          )}
        />
        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Message
          </>
        )}
      </button>

      <p className="text-center text-sm text-dark-400">
        We typically respond within 24 hours.
      </p>
    </form>
  )
}
