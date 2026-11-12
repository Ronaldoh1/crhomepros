'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SERVICES, COMPANY } from '@/lib/constants'
import { formatWhatsAppLink } from '@/lib/utils'
import { trackFormSubmission } from '@/lib/analytics'
import { useLocale } from '@/lib/i18n/provider'

const makeContactSchema = (es: boolean) => z.object({
  name: z.string().min(2, es ? 'El nombre debe tener al menos 2 caracteres' : 'Name must be at least 2 characters'),
  email: z.string().email(es ? 'Por favor, ingrese un correo electrónico válido' : 'Please enter a valid email'),
  phone: z.string().min(10, es ? 'Por favor, ingrese un número de teléfono válido' : 'Please enter a valid phone number'),
  service: z.string().optional(),
  message: z.string().min(10, es ? 'El mensaje debe tener al menos 10 caracteres' : 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<ReturnType<typeof makeContactSchema>>

export function ContactForm() {
  const { locale } = useLocale()
  const es = locale === 'es'
  const contactSchema = useMemo(() => makeContactSchema(es), [es])
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

      // Track successful submission in GA4
      trackFormSubmission('contact')

      setIsSubmitting(false)
      setIsSuccess(true)
      reset()
      setTimeout(() => setIsSuccess(false), 10000)
    } catch (err: any) {
      setIsSubmitting(false)
      setError(es ? 'Algo salió mal. Por favor, llámenos directamente.' : 'Something went wrong. Please try calling us directly.')
      console.error('Contact form error:', err)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">{es ? '¡Mensaje Enviado!' : 'Message Sent!'}</h3>
        <p className="text-green-800 mb-4">
          {es ? 'Gracias por comunicarse con nosotros. Le responderemos en menos de 24 horas.' : "Thank you for reaching out. We'll get back to you within 24 hours."}
        </p>
        <p className="text-sm text-green-600">
          {es ? '¿Necesita una respuesta más rápida?' : 'Need a faster response?'}{' '}
          <a
            href={formatWhatsAppLink(COMPANY.phone, es ? '¡Hola! Acabo de enviar un formulario de contacto en su sitio web.' : "Hi! I just submitted a contact form on your website.")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            {es ? 'Escríbanos por WhatsApp →' : 'Message us on WhatsApp →'}
          </a>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-dark-700 mb-1.5">
          {es ? 'Su Nombre' : 'Your Name'} <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder={es ? 'Juan Pérez' : 'John Smith'}
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
            {es ? 'Correo Electrónico' : 'Email'} <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder={es ? 'juan@ejemplo.com' : 'john@example.com'}
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
            {es ? 'Teléfono' : 'Phone'} <span className="text-red-500">*</span>
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
          {es ? 'Servicio de Interés' : 'Service Interested In'}
        </label>
        <select
          id="service"
          {...register('service')}
          className="w-full px-4 py-3 rounded-xl border border-dark-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        >
          <option value="">{es ? 'Seleccione un servicio (opcional)' : 'Select a service (optional)'}</option>
          {SERVICES.map((s) => (
            <option key={s.id} value={s.name}>{es ? s.nameEs : s.name}</option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-dark-700 mb-1.5">
          {es ? 'Mensaje' : 'Message'} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder={es ? 'Cuéntenos sobre su proyecto...' : 'Tell us about your project...'}
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
            {es ? 'Enviando...' : 'Sending...'}
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            {es ? 'Enviar Mensaje' : 'Send Message'}
          </>
        )}
      </button>

      <p className="text-center text-sm text-dark-600">
        {es ? 'Normalmente respondemos en menos de 24 horas.' : 'We typically respond within 24 hours.'}
      </p>
    </form>
  )
}
