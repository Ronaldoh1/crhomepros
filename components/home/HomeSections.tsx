'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Phone, MapPin, ShieldCheck, Award, Languages, FileCheck2, Star } from 'lucide-react'
import { COMPANY, SERVICES, SERVICE_AREAS, TESTIMONIALS } from '@/lib/constants'
import { formatPhoneLink } from '@/lib/utils'
import { useLocale, useTranslation } from '@/lib/i18n/provider'
import { useLocalePath } from '@/lib/i18n/link'
import { HERO_IMAGE, SERVICE_IMAGES, FEATURED_PROJECTS, BEFORE_AFTER, type SiteImage } from '@/lib/site-images'

// ─────────────────────────────────────────────
// Shared building blocks
// ─────────────────────────────────────────────

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={`block text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.1em] md:tracking-[0.14em] ${
        light ? 'text-gold-300' : 'text-gold-700'
      }`}
    >
      {children}
    </span>
  )
}

function SectionHeader({
  eyebrow,
  title,
  light = false,
  action,
}: {
  eyebrow: string
  title: string
  light?: boolean
  action?: React.ReactNode
}) {
  return (
    <div className="mb-10 md:mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <Eyebrow light={light}>{eyebrow}</Eyebrow>
        <h2
          className={`mt-3 text-[30px] leading-tight md:text-[40px] font-display font-semibold ${
            light ? 'text-white' : 'text-dark-900'
          }`}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}

function ArrowLink({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-[15px] font-semibold uppercase tracking-wide ${
        light ? 'text-white hover:text-gold-300' : 'text-dark-900 hover:text-primary-700'
      }`}
    >
      {children}
      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  )
}

/** Image with a small "Sample photo" tag while it is still a placeholder. */
function Photo({
  image,
  className = '',
  sizes,
  priority = false,
}: {
  image: SiteImage
  className?: string
  sizes: string
  priority?: boolean
}) {
  const r = useTranslation().redesign
  return (
    <div className={`relative overflow-hidden bg-dark-100 ${className}`}>
      <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      {image.placeholder && (
        <span className="absolute bottom-2 left-2 rounded bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white/90">
          {r.sample}
        </span>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// 1. Hero: one photo, one headline, two buttons, service area
// ─────────────────────────────────────────────
export function HomeHero() {
  const t = useTranslation()
  const r = t.redesign
  const lp = useLocalePath()

  return (
    <section className="bg-dark-900" style={{ paddingTop: 'var(--header-h, 108px)' }}>
      <div className="container-custom grid items-center gap-8 py-8 md:py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-20">
        <Photo
          image={HERO_IMAGE}
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="aspect-[4/3] w-full rounded-2xl lg:order-last lg:aspect-square"
        />
        <div>
          <Eyebrow light>{r.hero.eyebrow}</Eyebrow>
          <h1 className="mt-4 text-[34px] leading-[1.1] md:text-5xl lg:text-[56px] font-display font-semibold text-white">
            {r.hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{r.hero.subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={lp('/get-started')} className="btn-gold !rounded-lg !px-7 !py-4 text-[17px] font-semibold">
              {r.cta}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <a
              href={formatPhoneLink(COMPANY.phone)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/25 px-7 py-4 text-[17px] font-semibold text-white transition-colors hover:border-white hover:bg-white/5"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              {r.call} {COMPANY.phoneFormatted}
            </a>
          </div>
          <p className="mt-6 flex items-center gap-2 text-[15px] text-white/65">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            {r.hero.areaLabel}
          </p>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// 2. Trust strip: four specific proofs, no duplicates
// ─────────────────────────────────────────────
export function TrustStrip() {
  const r = useTranslation().redesign
  const items = [
    { icon: ShieldCheck, title: r.trust.licensed, detail: r.trust.licensedDetail },
    { icon: Award, title: r.trust.years, detail: r.trust.yearsDetail },
    { icon: Languages, title: r.trust.spanish, detail: r.trust.spanishDetail },
    { icon: FileCheck2, title: r.trust.estimates, detail: r.trust.estimatesDetail },
  ]
  return (
    <section className="border-b border-dark-100 bg-white">
      <ul className="container-custom grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4 lg:py-12">
        {items.map(({ icon: Icon, title, detail }) => (
          <li key={title} className="flex items-start gap-3">
            <Icon className="mt-0.5 h-7 w-7 shrink-0 text-gold-600" aria-hidden="true" />
            <div>
              <p className="font-semibold text-dark-900 leading-snug">{title}</p>
              <p className="mt-1 text-[15px] leading-snug text-dark-500">{detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

// ─────────────────────────────────────────────
// 3. Services: six photo cards
// ─────────────────────────────────────────────
const SERVICE_KEY: Record<string, string> = {
  'kitchen-remodeling': 'kitchen',
  'bathroom-renovation': 'bathroom',
  'basement-finishing': 'basement',
  roofing: 'roofing',
  'concrete-driveways': 'concrete',
  'deck-outdoor': 'deck',
}

export function ServiceCards() {
  const t = useTranslation()
  const r = t.redesign
  const lp = useLocalePath()
  const ids = Object.keys(SERVICE_KEY)
  const services = SERVICES.filter((s) => ids.includes(s.id))

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-custom">
        <SectionHeader
          eyebrow={r.services.eyebrow}
          title={r.services.title}
          action={<ArrowLink href={lp('/services')}>{r.services.viewAll}</ArrowLink>}
        />
        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const copy = (t.services as Record<string, any>)[SERVICE_KEY[s.id]]
            const image = SERVICE_IMAGES[s.id]
            return (
              <li key={s.id}>
                <Link href={lp(`/services/${s.id}`)} className="group block">
                  {image && (
                    <Photo
                      image={image}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="aspect-[4/3] rounded-xl"
                    />
                  )}
                  <h3 className="mt-5 text-xl font-display font-semibold text-dark-900 group-hover:text-primary-700">
                    {copy?.name ?? s.name}
                  </h3>
                  <p className="mt-2 text-[17px] leading-relaxed text-dark-600">{copy?.short ?? s.shortDescription}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-semibold text-primary-700">
                    {r.services.viewService}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// 4. Featured projects: big photo, short story, arrow (Clark style)
// ─────────────────────────────────────────────
export function ProjectCards() {
  const r = useTranslation().redesign
  const { locale } = useLocale()
  const lp = useLocalePath()
  const es = locale === 'es'

  return (
    <section className="bg-dark-900 py-20 md:py-28">
      <div className="container-custom">
        <SectionHeader
          light
          eyebrow={r.projects.eyebrow}
          title={r.projects.title}
          action={
            <ArrowLink light href={lp('/projects')}>
              {r.projects.viewAll}
            </ArrowLink>
          }
        />
        <ul className="grid gap-12 md:grid-cols-3 md:gap-8">
          {FEATURED_PROJECTS.map((p) => (
            <li key={p.slug}>
              <Link href={lp('/projects')} className="group block">
                <Photo image={p.image} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/3] rounded-xl" />
                <p className="mt-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-gold-300">
                  {es ? p.categoryEs : p.category} · {p.location}
                </p>
                <h3 className="mt-2 text-xl font-display font-semibold text-white">{es ? p.titleEs : p.title}</h3>
                <p className="mt-2 text-[17px] leading-relaxed text-white/75">{es ? p.summaryEs : p.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-white group-hover:text-gold-300">
                  {r.projects.viewProject}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// 5. Before / after: manual, keyboard-accessible slider
// ─────────────────────────────────────────────
export function BeforeAfterShowcase() {
  const r = useTranslation().redesign
  const { locale } = useLocale()
  const lp = useLocalePath()
  const [pos, setPos] = useState(50)
  const { before, after } = BEFORE_AFTER

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-custom grid items-center gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-dark-100 select-none">
          <Image src={after.src} alt={after.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <Image src={before.src} alt={before.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }}>
            <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-dark-800 shadow-lg">
              ‹ ›
            </span>
          </div>
          <span className="absolute left-3 top-3 rounded-md bg-dark-900/85 px-3 py-1 text-sm font-semibold text-white">
            {r.beforeAfter.before}
          </span>
          <span className="absolute right-3 top-3 rounded-md bg-gold-500 px-3 py-1 text-sm font-semibold text-dark-900">
            {r.beforeAfter.after}
          </span>
          {(before.placeholder || after.placeholder) && (
            <span className="absolute bottom-2 left-2 rounded bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white/90">
              {r.sample}
            </span>
          )}
          <input
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label={`${r.beforeAfter.before} / ${r.beforeAfter.after}`}
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
        <div>
          <Eyebrow>{r.beforeAfter.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-[30px] leading-tight md:text-[40px] font-display font-semibold text-dark-900">
            {locale === 'es' ? BEFORE_AFTER.titleEs : BEFORE_AFTER.title}
          </h2>
          <p className="mt-3 flex items-center gap-2 text-[17px] text-dark-500">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {BEFORE_AFTER.location}
          </p>
          <p className="mt-4 text-[15px] text-dark-500">{r.beforeAfter.title}</p>
          <div className="mt-8">
            <ArrowLink href={lp(BEFORE_AFTER.projectHref)}>{r.beforeAfter.viewProject}</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// 6. How it works: four steps
// ─────────────────────────────────────────────
export function HowItWorks() {
  const r = useTranslation().redesign
  const steps = [
    { n: '01', title: r.how.s1, text: r.how.s1d },
    { n: '02', title: r.how.s2, text: r.how.s2d },
    { n: '03', title: r.how.s3, text: r.how.s3d },
    { n: '04', title: r.how.s4, text: r.how.s4d },
  ]
  return (
    <section className="bg-dark-50 py-20 md:py-28">
      <div className="container-custom">
        <SectionHeader eyebrow={r.how.eyebrow} title={r.how.title} />
        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="border-t-2 border-dark-900 pt-5">
              <span className="font-display text-sm font-semibold text-gold-700">{s.n}</span>
              <h3 className="mt-2 text-xl font-display font-semibold text-dark-900">{s.title}</h3>
              <p className="mt-2 text-[17px] leading-relaxed text-dark-600">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// 7. Reviews: three real testimonials
// ─────────────────────────────────────────────
export function ReviewCards() {
  const r = useTranslation().redesign
  const lp = useLocalePath()
  const reviews = TESTIMONIALS.slice(0, 3)
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-custom">
        <SectionHeader
          eyebrow={r.reviews.eyebrow}
          title={r.reviews.title}
          action={<ArrowLink href={lp('/reviews')}>{r.reviews.readAll}</ArrowLink>}
        />
        <ul className="grid gap-6 md:grid-cols-3">
          {reviews.map((rv) => (
            <li key={rv.id} className="flex flex-col rounded-xl border border-dark-100 p-7">
              <div className="flex gap-0.5" aria-label={`${rv.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < rv.rating ? 'fill-gold-500 text-gold-500' : 'text-dark-200'}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[17px] leading-relaxed text-dark-700">
                “{rv.text.length > 220 ? `${rv.text.slice(0, 220).trimEnd()}…` : rv.text}”
              </blockquote>
              <p className="mt-6 font-semibold text-dark-900">{rv.name}</p>
              <p className="text-[15px] text-dark-500">
                {rv.location} · {rv.service}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// 8. Service areas
// ─────────────────────────────────────────────
export function ServiceAreas() {
  const r = useTranslation().redesign
  const lp = useLocalePath()
  return (
    <section id="service-areas" className="scroll-mt-28 border-t border-dark-100 bg-white py-20 md:py-28">
      <div className="container-custom grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <Eyebrow>{r.areas.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-[30px] leading-tight md:text-[40px] font-display font-semibold text-dark-900">
            {r.areas.title}
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-dark-600">{r.areas.text}</p>
          <div className="mt-6">
            <ArrowLink href={lp('/contact')}>{r.areas.ask}</ArrowLink>
          </div>
        </div>
        <ul className="flex flex-wrap content-start gap-3">
          {SERVICE_AREAS.map((area) => (
            <li
              key={area}
              className="inline-flex items-center gap-2 rounded-full border border-dark-200 px-4 py-2 text-[15px] text-dark-700"
            >
              <MapPin className="h-4 w-4 text-gold-600" aria-hidden="true" />
              {area}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// 10. Closing CTA band
// ─────────────────────────────────────────────
export function ClosingCTA() {
  const r = useTranslation().redesign
  const lp = useLocalePath()
  return (
    <section className="bg-primary-900 py-20 md:py-24">
      <div className="container-custom text-center">
        <h2 className="text-[30px] leading-tight md:text-[44px] font-display font-semibold text-white">{r.closing.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/80">{r.closing.text}</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={lp('/get-started')} className="btn-gold !rounded-lg !px-8 !py-4 text-[17px] font-semibold">
            {r.cta}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <a
            href={formatPhoneLink(COMPANY.phone)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 px-8 py-4 text-[17px] font-semibold text-white hover:border-white"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            {r.call} {COMPANY.phoneFormatted}
          </a>
        </div>
      </div>
    </section>
  )
}
