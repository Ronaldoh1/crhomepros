'use client'

import { resolveImageUrl } from '@/lib/resolve-images'
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from '@/lib/i18n/provider'

export function MeetCarlos() {
  const t = useTranslation()
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-dark-100 shadow-2xl">
              <Image
                src={resolveImageUrl("/images/team-carlos-01.png")}
                alt="Carlos Hernandez - Founder of CR Home Pros"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold-500/20 rounded-2xl -z-10" />
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            <span className="inline-block text-sm font-semibold text-gold-600 tracking-wider uppercase mb-4">
              {t.about.subtitle}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
              {t.about.title}
            </h2>

            <div className="space-y-4 text-lg text-dark-600 leading-relaxed mb-8">
              <p>{t.meetCarlos.intro}</p>
              <p>{t.meetCarlos.body}</p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="px-4 py-2 bg-primary-50 rounded-lg border border-primary-100">
                <p className="text-sm font-semibold text-primary-800">
                  {t.meetCarlos.badge1}
                </p>
              </div>
              <div className="px-4 py-2 bg-primary-50 rounded-lg border border-primary-100">
                <p className="text-sm font-semibold text-primary-800">
                  {t.meetCarlos.badge2}
                </p>
              </div>
              <div className="px-4 py-2 bg-primary-50 rounded-lg border border-primary-100">
                <p className="text-sm font-semibold text-primary-800">
                  {t.meetCarlos.badge3}
                </p>
              </div>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-medium group"
            >
              {t.meetCarlos.learnMore}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* The Team */}
        <div className="mt-16 pt-12 border-t border-dark-100">
          <h3 className="text-2xl font-display font-bold text-dark-900 mb-2 text-center">
            {t.meetCarlos.teamTitle}
          </h3>
          <p className="text-dark-500 text-center mb-8 max-w-2xl mx-auto">
            {t.meetCarlos.teamDesc}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
              <Image
                src={resolveImageUrl("/images/team-carlos-02.png")}
                alt="Carlos and team member"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-dark-900/80 to-transparent p-3">
                <p className="text-white text-sm font-semibold">{t.meetCarlos.teamLabel1}</p>
                <p className="text-white/60 text-xs">{t.meetCarlos.teamSub1}</p>
              </div>
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
              <Image
                src={resolveImageUrl("/images/team-carlos-03.png")}
                alt="Carlos and crew member painting"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-dark-900/80 to-transparent p-3">
                <p className="text-white text-sm font-semibold">{t.meetCarlos.teamLabel2}</p>
                <p className="text-white/60 text-xs">{t.meetCarlos.teamSub2}</p>
              </div>
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg bg-primary-100 flex items-center justify-center">
              <div className="text-center p-6">
                <p className="text-4xl mb-3">👷‍♂️</p>
                <p className="text-primary-800 font-bold text-lg">{t.meetCarlos.teamCount}</p>
                <p className="text-primary-600 text-sm mt-1">{t.meetCarlos.teamSpecialties}</p>
                <p className="text-primary-500 text-xs mt-3 italic">{t.meetCarlos.teamPhotoNote}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
