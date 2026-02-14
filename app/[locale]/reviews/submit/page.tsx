'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Star, Send, Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SERVICES } from '@/lib/constants'
import { getDb } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const reviewSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  location: z.string().min(2, 'City/Area is required'),
  service: z.string().min(1, 'Please select a service'),
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().min(5, 'Please add a short title'),
  review: z.string().min(20, 'Please write at least 20 characters'),
  recommend: z.boolean(),
  projectYear: z.string().min(4, 'Please enter the year'),
})

type ReviewFormData = z.infer<typeof reviewSchema>

export default function SubmitReviewPage() {
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
      alert('Something went wrong. Please try again.')
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
            Thank You!
          </h2>
          <p className="text-dark-500 mb-6">
            Your review has been submitted and is pending approval. We appreciate you taking 
            the time to share your experience!
          </p>
          <Link href="/reviews" className="btn-primary">
            View All Reviews
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="pt-32 pb-12 bg-gradient-to-br from-dark-900 via-primary-900 to-dark-950">
        <div className="container-custom">
          <Link href="/reviews" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />Back to Reviews
          </Link>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Share Your Experience
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            We'd love to hear about your project! Your feedback helps other homeowners 
            find quality contractors they can trust.
          </p>
        </div>
      </section>

      <section className="py-12 bg-dark-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-dark-100 space-y-6">
              
              {/* Rating */}
              <div>
                <label className="label mb-3">Overall Rating *</label>
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
                  <label className="label">Your Name *</label>
                  <input {...register('name')} className={cn('input', errors.name && 'border-red-500')} placeholder="John S." />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input {...register('email')} type="email" className={cn('input', errors.email && 'border-red-500')} placeholder="john@example.com" />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              {/* Location & Service */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">City/Area *</label>
                  <input {...register('location')} className={cn('input', errors.location && 'border-red-500')} placeholder="Bethesda, MD" />
                  {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>}
                </div>
                <div>
                  <label className="label">Service Received *</label>
                  <select {...register('service')} className={cn('input', errors.service && 'border-red-500')}>
                    <option value="">Select a service</option>
                    {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  {errors.service && <p className="mt-1 text-sm text-red-500">{errors.service.message}</p>}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="label">Review Title *</label>
                <input {...register('title')} className={cn('input', errors.title && 'border-red-500')} placeholder="Excellent kitchen transformation!" />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
              </div>

              {/* Review */}
              <div>
                <label className="label">Your Review *</label>
                <textarea {...register('review')} rows={5} className={cn('textarea', errors.review && 'border-red-500')} placeholder="Tell us about your experience working with CR Home Pros..." />
                {errors.review && <p className="mt-1 text-sm text-red-500">{errors.review.message}</p>}
              </div>

              {/* Project Year & Recommend */}
              <div className="grid md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="label">Project Year *</label>
                  <input {...register('projectYear')} className={cn('input', errors.projectYear && 'border-red-500')} placeholder="2024" />
                  {errors.projectYear && <p className="mt-1 text-sm text-red-500">{errors.projectYear.message}</p>}
                </div>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-dark-50 rounded-lg">
                    <input {...register('recommend')} type="checkbox" className="w-5 h-5 text-primary-600 rounded" />
                    <span className="text-dark-700">I would recommend CR Home Pros</span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isSubmitting} className="btn-gold w-full btn-lg">
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" />Submitting...</>
                ) : (
                  <><Send className="w-5 h-5 mr-2" />Submit Review</>
                )}
              </button>

              <p className="text-sm text-dark-400 text-center">
                Your review will be visible after approval. We may edit for clarity but never change your meaning.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
