'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2, CheckCircle, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SERVICES } from '@/lib/constants'

const referralSchema = z.object({
  // Referrer info
  referrerName: z.string().min(2, 'Your name is required'),
  referrerEmail: z.string().email('Please enter a valid email'),
  referrerPhone: z.string().min(10, 'Please enter a valid phone number'),
  
  // Referral info
  referralName: z.string().min(2, 'Their name is required'),
  referralPhone: z.string().min(10, 'Please enter their phone number'),
  referralEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  referralAddress: z.string().optional(),
  
  // Project info
  projectType: z.string().min(1, 'Please select a service'),
  projectDetails: z.string().optional(),
  
  // Payment preference
  paymentMethod: z.enum(['check', 'venmo', 'zelle', 'credit']),
})

type ReferralFormData = z.infer<typeof referralSchema>

export function ReferralForm() {
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
      alert('Something went wrong. Please try again.')
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Referral Submitted!
        </h3>
        <p className="text-green-700 mb-4">
          Thank you! We'll reach out to your referral within 24 hours. Once their project is 
          complete, your reward will be on its way!
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-green-600 font-medium hover:text-green-700"
        >
          Submit Another Referral
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
          Your Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="referrerName" className="label">Your Name *</label>
            <input
              {...register('referrerName')}
              type="text"
              id="referrerName"
              placeholder="John Smith"
              className={cn('input', errors.referrerName && 'border-red-500')}
            />
            {errors.referrerName && <p className="mt-1 text-sm text-red-500">{errors.referrerName.message}</p>}
          </div>
          <div>
            <label htmlFor="referrerEmail" className="label">Your Email *</label>
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
            <label htmlFor="referrerPhone" className="label">Your Phone *</label>
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
          Who Are You Referring?
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="referralName" className="label">Their Name *</label>
            <input
              {...register('referralName')}
              type="text"
              id="referralName"
              placeholder="Jane Doe"
              className={cn('input', errors.referralName && 'border-red-500')}
            />
            {errors.referralName && <p className="mt-1 text-sm text-red-500">{errors.referralName.message}</p>}
          </div>
          <div>
            <label htmlFor="referralPhone" className="label">Their Phone *</label>
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
            <label htmlFor="referralEmail" className="label">Their Email (optional)</label>
            <input
              {...register('referralEmail')}
              type="email"
              id="referralEmail"
              placeholder="jane@example.com"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="referralAddress" className="label">Project Address (optional)</label>
            <input
              {...register('referralAddress')}
              type="text"
              id="referralAddress"
              placeholder="123 Main St, City, State"
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div>
        <h3 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-800 text-white text-sm flex items-center justify-center">3</span>
          What Do They Need?
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="projectType" className="label">Service Needed *</label>
            <select
              {...register('projectType')}
              id="projectType"
              className={cn('input', errors.projectType && 'border-red-500')}
            >
              <option value="">Select a service</option>
              {SERVICES.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
              <option value="other">Other / Not Sure</option>
            </select>
            {errors.projectType && <p className="mt-1 text-sm text-red-500">{errors.projectType.message}</p>}
          </div>
          <div>
            <label htmlFor="projectDetails" className="label">Additional Details (optional)</label>
            <textarea
              {...register('projectDetails')}
              id="projectDetails"
              rows={3}
              placeholder="Any details about their project that might help us..."
              className="textarea"
            />
          </div>
        </div>
      </div>

      {/* Payment Preference */}
      <div>
        <h3 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-800 text-white text-sm flex items-center justify-center">4</span>
          How Would You Like to Be Paid?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'check', label: 'Check' },
            { value: 'venmo', label: 'Venmo' },
            { value: 'zelle', label: 'Zelle' },
            { value: 'credit', label: 'Project Credit' },
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
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Referral
            </>
          )}
        </button>
        <p className="text-sm text-dark-400 text-center mt-4">
          We'll reach out to your referral within 24 hours and keep you updated on the status.
        </p>
      </div>
    </form>
  )
}
