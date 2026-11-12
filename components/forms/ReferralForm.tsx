'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2, CheckCircle, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SERVICES } from '@/lib/constants'
import { useLocale } from '@/lib/i18n/provider'

const STRINGS = {
  en: {
    errReferrerName: 'Your name is required',
    errEmail: 'Please enter a valid email',
    errReferrerPhone: 'Please enter a valid phone number',
    errReferralName: 'Their name is required',
    errReferralPhone: 'Please enter their phone number',
    errProjectType: 'Please select a service',
    alertError: 'Something went wrong. Please try again.',
    successTitle: 'Referral Submitted!',
    successText: "Thank you! We'll reach out to your referral within 24 hours. Once their project is complete, your reward will be on its way!",
    submitAnother: 'Submit Another Referral',
    yourInfo: 'Your Information',
    yourName: 'Your Name *',
    yourEmail: 'Your Email *',
    yourPhone: 'Your Phone *',
    whoReferring: 'Who Are You Referring?',
    theirName: 'Their Name *',
    theirPhone: 'Their Phone *',
    theirEmail: 'Their Email (optional)',
    projectAddress: 'Project Address (optional)',
    addressPlaceholder: '123 Main St, City, State',
    whatNeed: 'What Do They Need?',
    serviceNeeded: 'Service Needed *',
    selectService: 'Select a service',
    otherService: 'Other / Not Sure',
    additionalDetails: 'Additional Details (optional)',
    detailsPlaceholder: 'Any details about their project that might help us...',
    howPaid: 'How Would You Like to Be Paid?',
    payCheck: 'Check',
    payCredit: 'Project Credit',
    submitting: 'Submitting...',
    submit: 'Submit Referral',
    footnote: "We'll reach out to your referral within 24 hours and keep you updated on the status.",
  },
  es: {
    errReferrerName: 'Su nombre es obligatorio',
    errEmail: 'Ingrese un correo electrónico válido',
    errReferrerPhone: 'Ingrese un número de teléfono válido',
    errReferralName: 'El nombre de la persona es obligatorio',
    errReferralPhone: 'Ingrese el número de teléfono de la persona',
    errProjectType: 'Seleccione un servicio',
    alertError: 'Algo salió mal. Por favor, inténtelo de nuevo.',
    successTitle: '¡Referido Enviado!',
    successText: '¡Gracias! Nos comunicaremos con su referido dentro de 24 horas. Una vez que su proyecto esté terminado, ¡su recompensa estará en camino!',
    submitAnother: 'Enviar Otro Referido',
    yourInfo: 'Su Información',
    yourName: 'Su Nombre *',
    yourEmail: 'Su Correo Electrónico *',
    yourPhone: 'Su Teléfono *',
    whoReferring: '¿A Quién Nos Refiere?',
    theirName: 'Nombre de la Persona *',
    theirPhone: 'Teléfono de la Persona *',
    theirEmail: 'Correo Electrónico de la Persona (opcional)',
    projectAddress: 'Dirección del Proyecto (opcional)',
    addressPlaceholder: '123 Main St, Ciudad, Estado',
    whatNeed: '¿Qué Necesita?',
    serviceNeeded: 'Servicio Requerido *',
    selectService: 'Seleccione un servicio',
    otherService: 'Otro / No Estoy Seguro',
    additionalDetails: 'Detalles Adicionales (opcional)',
    detailsPlaceholder: 'Cualquier detalle sobre su proyecto que pueda ayudarnos...',
    howPaid: '¿Cómo Le Gustaría Recibir su Pago?',
    payCheck: 'Cheque',
    payCredit: 'Crédito para su Proyecto',
    submitting: 'Enviando...',
    submit: 'Enviar Referido',
    footnote: 'Nos comunicaremos con su referido dentro de 24 horas y le mantendremos informado sobre el estado.',
  },
}

// Spanish display names for services (option values stay as service IDs)
const SERVICE_NAMES_ES: Record<string, string> = {
  'kitchen-remodeling': 'Remodelación de Cocina',
  'bathroom-renovation': 'Renovación de Baño',
  'basement-finishing': 'Terminación de Sótano',
  'roofing': 'Techos',
  'concrete-driveways': 'Concreto y Entradas',
  'flooring': 'Pisos y Azulejos',
  'painting': 'Pintura Interior y Exterior',
  'deck-outdoor': 'Decks y Espacios Exteriores',
  'fencing': 'Cercas',
  'complete-renovations': 'Remodelaciones Completas',
  'insurance-claims': 'Reclamaciones de Seguro',
}

function buildReferralSchema(t: (typeof STRINGS)['en']) {
  return z.object({
    // Referrer info
    referrerName: z.string().min(2, t.errReferrerName),
    referrerEmail: z.string().email(t.errEmail),
    referrerPhone: z.string().min(10, t.errReferrerPhone),

    // Referral info
    referralName: z.string().min(2, t.errReferralName),
    referralPhone: z.string().min(10, t.errReferralPhone),
    referralEmail: z.string().email(t.errEmail).optional().or(z.literal('')),
    referralAddress: z.string().optional(),

    // Project info
    projectType: z.string().min(1, t.errProjectType),
    projectDetails: z.string().optional(),

    // Payment preference
    paymentMethod: z.enum(['check', 'venmo', 'zelle', 'credit']),
  })
}

type ReferralFormData = z.infer<ReturnType<typeof buildReferralSchema>>

export function ReferralForm({ locale: localeProp }: { locale?: string } = {}) {
  const { locale: ctxLocale } = useLocale()
  const locale = localeProp || ctxLocale
  const es = locale === 'es'
  const t = es ? STRINGS.es : STRINGS.en
  const referralSchema = useMemo(() => buildReferralSchema(t), [t])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      paymentMethod: 'check',
    },
  })

  const onSubmit = async (data: ReferralFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Submission failed')
      setIsSubmitting(false)
      setIsSuccess(true)
      reset()
    } catch (err) {
      console.error('Referral form error:', err)
      setIsSubmitting(false)
      alert(t.alertError)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          {t.successTitle}
        </h3>
        <p className="text-green-800 mb-4">
          {t.successText}
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-green-600 font-medium hover:text-green-700"
        >
          {t.submitAnother}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Your Information */}
      <div>
        <h3 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-800 text-white text-sm flex items-center justify-center">1</span>
          {t.yourInfo}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="referrerName" className="label">{t.yourName}</label>
            <input
              {...register('referrerName')}
              type="text"
              id="referrerName"
              placeholder={es ? 'Juan Pérez' : 'John Smith'}
              className={cn('input', errors.referrerName && 'border-red-500')}
            />
            {errors.referrerName && <p className="mt-1 text-sm text-red-500">{errors.referrerName.message}</p>}
          </div>
          <div>
            <label htmlFor="referrerEmail" className="label">{t.yourEmail}</label>
            <input
              {...register('referrerEmail')}
              type="email"
              id="referrerEmail"
              placeholder="john@example.com"
              className={cn('input', errors.referrerEmail && 'border-red-500')}
            />
            {errors.referrerEmail && <p className="mt-1 text-sm text-red-500">{errors.referrerEmail.message}</p>}
          </div>
          <div>
            <label htmlFor="referrerPhone" className="label">{t.yourPhone}</label>
            <input
              {...register('referrerPhone')}
              type="tel"
              id="referrerPhone"
              placeholder="(555) 123-4567"
              className={cn('input', errors.referrerPhone && 'border-red-500')}
            />
            {errors.referrerPhone && <p className="mt-1 text-sm text-red-500">{errors.referrerPhone.message}</p>}
          </div>
        </div>
      </div>

      {/* Referral Information */}
      <div>
        <h3 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-800 text-white text-sm flex items-center justify-center">2</span>
          {t.whoReferring}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="referralName" className="label">{t.theirName}</label>
            <input
              {...register('referralName')}
              type="text"
              id="referralName"
              placeholder={es ? 'María García' : 'Jane Doe'}
              className={cn('input', errors.referralName && 'border-red-500')}
            />
            {errors.referralName && <p className="mt-1 text-sm text-red-500">{errors.referralName.message}</p>}
          </div>
          <div>
            <label htmlFor="referralPhone" className="label">{t.theirPhone}</label>
            <input
              {...register('referralPhone')}
              type="tel"
              id="referralPhone"
              placeholder="(555) 987-6543"
              className={cn('input', errors.referralPhone && 'border-red-500')}
            />
            {errors.referralPhone && <p className="mt-1 text-sm text-red-500">{errors.referralPhone.message}</p>}
          </div>
          <div>
            <label htmlFor="referralEmail" className="label">{t.theirEmail}</label>
            <input
              {...register('referralEmail')}
              type="email"
              id="referralEmail"
              placeholder="jane@example.com"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="referralAddress" className="label">{t.projectAddress}</label>
            <input
              {...register('referralAddress')}
              type="text"
              id="referralAddress"
              placeholder={t.addressPlaceholder}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div>
        <h3 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-800 text-white text-sm flex items-center justify-center">3</span>
          {t.whatNeed}
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="projectType" className="label">{t.serviceNeeded}</label>
            <select
              {...register('projectType')}
              id="projectType"
              className={cn('input', errors.projectType && 'border-red-500')}
            >
              <option value="">{t.selectService}</option>
              {SERVICES.map((service) => (
                <option key={service.id} value={service.id}>
                  {(es && SERVICE_NAMES_ES[service.id]) || service.name}
                </option>
              ))}
              <option value="other">{t.otherService}</option>
            </select>
            {errors.projectType && <p className="mt-1 text-sm text-red-500">{errors.projectType.message}</p>}
          </div>
          <div>
            <label htmlFor="projectDetails" className="label">{t.additionalDetails}</label>
            <textarea
              {...register('projectDetails')}
              id="projectDetails"
              rows={3}
              placeholder={t.detailsPlaceholder}
              className="textarea"
            />
          </div>
        </div>
      </div>

      {/* Payment Preference */}
      <div>
        <h3 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-800 text-white text-sm flex items-center justify-center">4</span>
          {t.howPaid}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'check', label: t.payCheck },
            { value: 'venmo', label: 'Venmo' },
            { value: 'zelle', label: 'Zelle' },
            { value: 'credit', label: t.payCredit },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 p-3 bg-white rounded-lg border border-dark-200 cursor-pointer hover:border-primary-300 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50"
            >
              <input
                {...register('paymentMethod')}
                type="radio"
                value={option.value}
                className="text-primary-600"
              />
              <span className="text-sm font-medium text-dark-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-gold w-full btn-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.submitting}
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              {t.submit}
            </>
          )}
        </button>
        <p className="text-sm text-dark-600 text-center mt-4">
          {t.footnote}
        </p>
      </div>
    </form>
  )
}
