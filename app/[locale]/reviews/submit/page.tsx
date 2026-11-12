'use client'

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Star, Send, Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SERVICES } from '@/lib/constants'
import { getDb } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useLocale } from '@/lib/i18n/provider'
import { LocaleLink as Link } from '@/lib/i18n/link'

const STRINGS = {
  en: {
    errName: 'Name is required',
    errEmail: 'Valid email required',
    errLocation: 'City/Area is required',
    errService: 'Please select a service',
    errRating: 'Please select a rating',
    errTitle: 'Please add a short title',
    errReview: 'Please write at least 20 characters',
    errYear: 'Please enter the year',
    submitError: 'Something went wrong. Please try again.',
    thankYou: 'Thank You!',
    successText: 'Your review has been submitted and is pending approval. We appreciate you taking the time to share your experience!',
    viewAll: 'View All Reviews',
    back: 'Back to Reviews',
    heading: 'Share Your Experience',
    intro: "We'd love to hear about your project! Your feedback helps other homeowners find quality contractors they can trust.",
    overallRating: 'Overall Rating *',
    yourName: 'Your Name *',
    namePlaceholder: 'John S.',
    email: 'Email *',
    emailPlaceholder: 'john@example.com',
    cityArea: 'City/Area *',
    serviceReceived: 'Service Received *',
    selectService: 'Select a service',
    reviewTitle: 'Review Title *',
    titlePlaceholder: 'Excellent kitchen transformation!',
    yourReview: 'Your Review *',
    reviewPlaceholder: 'Tell us about your experience working with CR Home Pros...',
    projectYear: 'Project Year *',
    recommend: 'I would recommend CR Home Pros',
    submitting: 'Submitting...',
    submit: 'Submit Review',
    note: 'Your review will be visible after approval. We may edit for clarity but never change your meaning.',
  },
  es: {
    errName: 'El nombre es obligatorio',
    errEmail: 'Ingrese un correo electrónico válido',
    errLocation: 'La ciudad o zona es obligatoria',
    errService: 'Seleccione un servicio',
    errRating: 'Seleccione una calificación',
    errTitle: 'Agregue un título breve',
    errReview: 'Escriba al menos 20 caracteres',
    errYear: 'Ingrese el año',
    submitError: 'Algo salió mal. Por favor, inténtelo de nuevo.',
    thankYou: '¡Gracias!',
    successText: 'Su reseña fue enviada y está pendiente de aprobación. ¡Le agradecemos que se haya tomado el tiempo de compartir su experiencia!',
    viewAll: 'Ver Todas las Reseñas',
    back: 'Volver a Reseñas',
    heading: 'Comparta Su Experiencia',
    intro: '¡Nos encantaría saber de su proyecto! Sus comentarios ayudan a otros propietarios a encontrar contratistas de calidad en los que puedan confiar.',
    overallRating: 'Calificación General *',
    yourName: 'Su Nombre *',
    namePlaceholder: 'Juan S.',
    email: 'Correo Electrónico *',
    emailPlaceholder: 'juan@ejemplo.com',
    cityArea: 'Ciudad/Zona *',
    serviceReceived: 'Servicio Recibido *',
    selectService: 'Seleccione un servicio',
    reviewTitle: 'Título de la Reseña *',
    titlePlaceholder: '¡Excelente transformación de cocina!',
    yourReview: 'Su Reseña *',
    reviewPlaceholder: 'Cuéntenos sobre su experiencia trabajando con CR Home Pros...',
    projectYear: 'Año del Proyecto *',
    recommend: 'Recomendaría a CR Home Pros',
    submitting: 'Enviando...',
    submit: 'Enviar Reseña',
    note: 'Su reseña será visible después de ser aprobada. Podemos editarla para mayor claridad, pero nunca cambiaremos su significado.',
  },
}

type Strings = (typeof STRINGS)['en']

const makeReviewSchema = (t: Strings) => z.object({
  name: z.string().min(2, t.errName),
  email: z.string().email(t.errEmail),
  location: z.string().min(2, t.errLocation),
  service: z.string().min(1, t.errService),
  rating: z.number().min(1, t.errRating).max(5),
  title: z.string().min(5, t.errTitle),
  review: z.string().min(20, t.errReview),
  recommend: z.boolean(),
  projectYear: z.string().min(4, t.errYear),
})

type ReviewFormData = z.infer<ReturnType<typeof makeReviewSchema>>

export default function SubmitReviewPage() {
  const { locale } = useLocale()
  const es = locale === 'es'
  const t = es ? STRINGS.es : STRINGS.en
  const reviewSchema = useMemo(() => makeReviewSchema(t), [t])
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      recommend: true,
    },
  })

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)
    try {
      const db = getDb()
      if (db) {
        await addDoc(collection(db, 'reviews'), {
          name: data.name,
          email: data.email,
          location: data.location,
          service: data.service,
          rating: data.rating,
          text: data.review,
          recommend: data.recommend,
          approved: false, // pending moderation
          createdAt: serverTimestamp(),
        })
      }
      setIsSubmitting(false)
      setIsSuccess(true)
    } catch (err) {
      console.error('Review submit error:', err)
      setIsSubmitting(false)
      alert(t.submitError)
    }
  }

  const handleRatingClick = (value: number) => {
    setRating(value)
    setValue('rating', value)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-dark-900 mb-4">
            {t.thankYou}
          </h2>
          <p className="text-dark-600 mb-6">
            {t.successText}
          </p>
          <Link href="/reviews" className="btn-primary">
            {t.viewAll}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="page-top pb-12 bg-dark-900">
        <div className="container-custom">
          <Link href="/reviews" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />{t.back}
          </Link>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t.heading}
          </h1>
          <p className="text-white/90 text-lg max-w-2xl">
            {t.intro}
          </p>
        </div>
      </section>

      <section className="py-12 bg-dark-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-dark-100 space-y-6">
              
              {/* Rating */}
              <div>
                <label className="label mb-3">{t.overallRating}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingClick(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          'w-10 h-10 transition-colors',
                          (hoverRating || rating) >= value
                            ? 'text-gold-400 fill-gold-400'
                            : 'text-dark-200'
                        )}
                      />
                    </button>
                  ))}
                </div>
                {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating.message}</p>}
              </div>

              {/* Name & Email */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t.yourName}</label>
                  <input {...register('name')} className={cn('input', errors.name && 'border-red-500')} placeholder={t.namePlaceholder} />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label">{t.email}</label>
                  <input {...register('email')} type="email" className={cn('input', errors.email && 'border-red-500')} placeholder={t.emailPlaceholder} />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              {/* Location & Service */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t.cityArea}</label>
                  <input {...register('location')} className={cn('input', errors.location && 'border-red-500')} placeholder="Bethesda, MD" />
                  {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>}
                </div>
                <div>
                  <label className="label">{t.serviceReceived}</label>
                  <select {...register('service')} className={cn('input', errors.service && 'border-red-500')}>
                    <option value="">{t.selectService}</option>
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {(es && (s as { nameEs?: string }).nameEs) || s.name}
                      </option>
                    ))}
                  </select>
                  {errors.service && <p className="mt-1 text-sm text-red-500">{errors.service.message}</p>}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="label">{t.reviewTitle}</label>
                <input {...register('title')} className={cn('input', errors.title && 'border-red-500')} placeholder={t.titlePlaceholder} />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
              </div>

              {/* Review */}
              <div>
                <label className="label">{t.yourReview}</label>
                <textarea {...register('review')} rows={5} className={cn('textarea', errors.review && 'border-red-500')} placeholder={t.reviewPlaceholder} />
                {errors.review && <p className="mt-1 text-sm text-red-500">{errors.review.message}</p>}
              </div>

              {/* Project Year & Recommend */}
              <div className="grid md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="label">{t.projectYear}</label>
                  <input {...register('projectYear')} className={cn('input', errors.projectYear && 'border-red-500')} placeholder="2024" />
                  {errors.projectYear && <p className="mt-1 text-sm text-red-500">{errors.projectYear.message}</p>}
                </div>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-dark-50 rounded-lg">
                    <input {...register('recommend')} type="checkbox" className="w-5 h-5 text-primary-600 rounded" />
                    <span className="text-dark-700">{t.recommend}</span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isSubmitting} className="btn-gold w-full btn-lg">
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" />{t.submitting}</>
                ) : (
                  <><Send className="w-5 h-5 mr-2" />{t.submit}</>
                )}
              </button>

              <p className="text-sm text-dark-600 text-center">
                {t.note}
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
