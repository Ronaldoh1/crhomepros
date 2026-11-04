'use client'

import { X, Phone, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { COMPANY } from '@/lib/constants'

interface EmergencyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-xl font-bold">Emergency Service</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing */}
        <div className="p-6 space-y-4">
          <p className="text-dark-600 text-sm">
            We respond to emergencies fast. Here are our on-call rates:
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-dark-50 rounded-xl">
              <div>
                <p className="font-semibold text-dark-900">Standard Emergency</p>
                <p className="text-sm text-dark-600">Mon–Fri, 8AM–6PM</p>
              </div>
              <span className="text-xl font-bold text-red-800">$150<span className="text-sm font-normal text-dark-600">/hr</span></span>
            </div>

            <div className="flex items-center justify-between p-3 bg-dark-50 rounded-xl">
              <div>
                <p className="font-semibold text-dark-900">After Hours</p>
                <p className="text-sm text-dark-600">Mon–Fri, 6PM–8AM</p>
              </div>
              <span className="text-xl font-bold text-red-800">$200<span className="text-sm font-normal text-dark-600">/hr</span></span>
            </div>

            <div className="flex items-center justify-between p-3 bg-dark-50 rounded-xl">
              <div>
                <p className="font-semibold text-dark-900">Weekends & Holidays</p>
                <p className="text-sm text-dark-600">Sat–Sun, all day</p>
              </div>
              <span className="text-xl font-bold text-red-800">$250<span className="text-sm font-normal text-dark-600">/hr</span></span>
            </div>
          </div>

          <p className="text-xs text-dark-600 italic">
            Dispatch fee of $75 applies. Minimum 1-hour service call.
            Additional work billed separately. We'll provide a full estimate before starting major repairs.
          </p>

          <div className="space-y-3">
            <a
              href="tel:5712377164"
              className="flex items-center justify-center gap-3 w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold text-lg transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Now: (571) 237-7164
            </a>
            <Link
              href="/contact"
              onClick={onClose}
              className="block text-center w-full bg-dark-100 hover:bg-dark-200 text-dark-900 py-3 rounded-xl font-semibold transition-colors"
            >
              Or Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
