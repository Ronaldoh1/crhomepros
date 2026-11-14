'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Hammer, ArrowRight, MapPin, Images } from 'lucide-react'
import { getPublicProjects, type PublicProject } from '@/lib/firebase-auth'
import { useLocale } from '@/lib/i18n/provider'

// Project Library: finished jobs with before and after photos, published by
// Carlos from the admin portal. Shows "coming soon" until the first one is published.
export default function ProjectLibraryPage() {
  const { locale } = useLocale()
  const es = locale === 'es'
  const lp = (path: string) => (es ? `/es${path}` : path)
  const [projects, setProjects] = useState<PublicProject[] | null>(null)
  const [open, setOpen] = useState<string | null>(null)

  useEffect(() => { getPublicProjects().then(setProjects).catch(() => setProjects([])) }, [])

  const t = es ? {
    badge: 'Biblioteca de Proyectos', title: 'Trabajos terminados,', highlight: 'antes y después',
    intro: 'Proyectos reales de CR Home Pros en DC, Maryland y Virginia: qué se hizo y cómo quedó.',
    soon: 'Próximamente', soonText: 'Estamos reuniendo las fotos de antes y después de nuestros trabajos más recientes. Vuelva pronto.',
    gallery: 'Ver la galería de fotos', estimate: 'Solicitar un estimado gratis', before: 'Antes', after: 'Después', done: 'Qué se hizo', more: 'Ver el proyecto', less: 'Ocultar', loading: 'Cargando…',
  } : {
    badge: 'Project Library', title: 'Finished jobs,', highlight: 'before and after',
    intro: 'Real CR Home Pros projects in DC, Maryland and Virginia: what was done and how it turned out.',
    soon: 'Coming soon', soonText: 'We are gathering before and after photos from our most recent jobs. Check back soon.',
    gallery: 'See the photo gallery', estimate: 'Request a free estimate', before: 'Before', after: 'After', done: 'What was done', more: 'See the project', less: 'Hide', loading: 'Loading…',
  }

  const photos = (label: string, list: string[]) => list.length > 0 && (
    <div>
      <p className="text-sm font-bold uppercase tracking-wide text-primary-800 mb-2">{label}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {list.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="block aspect-[4/3] rounded-lg overflow-hidden bg-dark-100"><img src={src} alt={`${label} ${i + 1}`} loading="lazy" className="w-full h-full object-cover" /></a>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <section className="relative page-top pb-16 bg-dark-900 overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/20 border border-gold-500/30 mb-6">
              <Images className="w-5 h-5 text-gold-400" />
              <span className="text-gold-300 font-medium">{t.badge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">{t.title} <span className="text-gold-400">{t.highlight}</span></h1>
            <p className="text-xl text-white/90 leading-relaxed">{t.intro}</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          {projects === null ? <p className="text-center text-dark-800">{t.loading}</p> : projects.length === 0 ? (
            <div className="max-w-xl mx-auto text-center rounded-2xl border-2 border-dashed border-dark-300 bg-dark-50 p-10">
              <Hammer className="w-12 h-12 text-gold-600 mx-auto mb-4" />
              <h2 className="text-3xl font-display font-bold text-dark-900 mb-3">{t.soon}</h2>
              <p className="text-lg text-dark-800 mb-8">{t.soonText}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={lp('/projects')} className="btn-primary">{t.gallery}</Link>
                <Link href={lp('/get-started')} className="btn-gold">{t.estimate} <ArrowRight className="w-5 h-5 ml-2" /></Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map(p => {
                const cover = p.afterPhotos[0] || p.beforePhotos[0]
                const isOpen = open === p.id
                return (
                  <article key={p.id} className={`rounded-2xl border border-dark-200 bg-white overflow-hidden shadow-sm ${isOpen ? 'md:col-span-2' : ''}`}>
                    {cover && !isOpen && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover} alt={p.title} loading="lazy" className="w-full aspect-[16/10] object-cover" />
                    )}
                    <div className="p-6">
                      <h2 className="text-2xl font-display font-bold text-dark-900">{p.title}</h2>
                      {p.city && <p className="mt-1 flex items-center gap-1.5 text-dark-800"><MapPin className="w-4 h-4 text-gold-600" /> {p.city}</p>}
                      {isOpen && (
                        <div className="mt-5 space-y-5">
                          {p.workDone && <div><p className="text-sm font-bold uppercase tracking-wide text-primary-800 mb-1">{t.done}</p><p className="text-dark-900 whitespace-pre-line">{p.workDone}</p></div>}
                          {photos(t.before, p.beforePhotos)}
                          {photos(t.after, p.afterPhotos)}
                        </div>
                      )}
                      <button onClick={() => setOpen(isOpen ? null : p.id)} className="mt-4 font-semibold text-primary-800 underline">{isOpen ? t.less : t.more}</button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
