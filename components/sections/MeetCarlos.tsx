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
              <p>
                Hi, I am Carlos. For over 20 years, my team and I have been
                helping DMV homeowners bring their renovation ideas to life.
              </p>
              <p>
                We treat every home like our own and believe quality work starts
                with clear communication and genuine care. Whether it is a
                complete kitchen transformation or a quick repair, we are here
                to make the process smooth and the results exceptional.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="px-4 py-2 bg-primary-50 rounded-lg border border-primary-100">
                <p className="text-sm font-semibold text-primary-800">
                  20+ Years Serving the DMV
                </p>
              </div>
              <div className="px-4 py-2 bg-primary-50 rounded-lg border border-primary-100">
                <p className="text-sm font-semibold text-primary-800">
                  500+ Projects Completed
                </p>
              </div>
              <div className="px-4 py-2 bg-primary-50 rounded-lg border border-primary-100">
                <p className="text-sm font-semibold text-primary-800">
                  MHIC Licensed & Insured
                </p>
              </div>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-medium group"
            >
              Learn more about our story
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* The Team */}
        <div className="mt-16 pt-12 border-t border-dark-100">
          <h3 className="text-2xl font-display font-bold text-dark-900 mb-2 text-center">
            The CR Home Pros Team
          </h3>
          <p className="text-dark-500 text-center mb-8 max-w-2xl mx-auto">
            A tight-knit crew of skilled craftsmen who take pride in every project. 
            Each member brings years of hands-on experience in their specialty.
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
                <p className="text-white text-sm font-semibold">Carlos & Team</p>
                <p className="text-white/60 text-xs">The crew</p>
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
                <p className="text-white text-sm font-semibold">On the Job</p>
                <p className="text-white/60 text-xs">Painting crew</p>
              </div>
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg bg-primary-100 flex items-center justify-center">
              <div className="text-center p-6">
                <p className="text-4xl mb-3">👷‍♂️</p>
                <p className="text-primary-800 font-bold text-lg">6 Skilled Craftsmen</p>
                <p className="text-primary-600 text-sm mt-1">Painters, carpenters, roofers, tile &amp; more</p>
                <p className="text-primary-500 text-xs mt-3 italic">Team photos coming soon — new CR Home Pros tees on the way!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
