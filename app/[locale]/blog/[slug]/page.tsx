import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from 'lucide-react'
import { BLOG_POSTS, getPostBySlug, getLocalizedPost, getLocalizedCategory } from '@/lib/blog-posts'
import { resolveImageUrl } from '@/lib/resolve-images'

interface BlogPostPageProps {
  params: { slug: string; locale: string }
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return { title: 'Post Not Found' }
  const localized = getLocalizedPost(post, params.locale || 'en')
  return { title: localized.title + ' | CR Home Pros', description: localized.excerpt }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const rawPost = getPostBySlug(params.slug)
  if (!rawPost) notFound()

  const locale = params.locale || 'en'
  const isEs = locale === 'es'
  const post = getLocalizedPost(rawPost, locale)
  const dateFmt = isEs ? 'es-ES' : 'en-US'

  const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === params.slug)
  const prevPost = currentIndex > 0 ? getLocalizedPost(BLOG_POSTS[currentIndex - 1], locale) : null
  const nextPost = currentIndex < BLOG_POSTS.length - 1 ? getLocalizedPost(BLOG_POSTS[currentIndex + 1], locale) : null

  return (
    <>
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-dark-900 via-primary-900 to-dark-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <Link href={"/" + locale + "/blog"} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> {isEs ? 'Volver al Blog' : 'Back to Blog'}
            </Link>
            <div className="flex items-center gap-4 text-white/90 mb-4">
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium">{getLocalizedCategory(post.category, locale)}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <span className="flex items-center gap-2"><User className="w-4 h-4" />{post.author}</span>
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{new Date(post.date).toLocaleDateString(dateFmt, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{post.readTime} {isEs ? 'lectura' : 'read'}</span>
            </div>
          </div>
        </div>
      </section>

      <article className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12 -mt-12 shadow-xl">
              <Image src={resolveImageUrl(post.image)} alt={post.title} fill className="object-cover" priority />
            </div>
            <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-dark-900 prose-p:text-dark-600 prose-a:text-primary-700 prose-strong:text-dark-900 prose-img:rounded-xl whitespace-pre-line">
              {post.content}
            </div>
          </div>
        </div>
      </article>

      <section className="bg-dark-50 py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto grid grid-cols-2 gap-6">
            {prevPost ? (
              <Link href={"/" + locale + "/blog/" + prevPost.slug} className="group p-6 bg-white rounded-xl hover:shadow-md transition-shadow">
                <span className="text-sm text-dark-500 mb-2 block">{isEs ? 'Anterior' : 'Previous Post'}</span>
                <span className="font-display font-semibold text-dark-900 group-hover:text-primary-800 transition-colors line-clamp-2">{prevPost.title}</span>
              </Link>
            ) : <div />}
            {nextPost ? (
              <Link href={"/" + locale + "/blog/" + nextPost.slug} className="group p-6 bg-white rounded-xl hover:shadow-md transition-shadow text-right">
                <span className="text-sm text-dark-500 mb-2 block">{isEs ? 'Siguiente' : 'Next Post'}</span>
                <span className="font-display font-semibold text-dark-900 group-hover:text-primary-800 transition-colors line-clamp-2">{nextPost.title}</span>
              </Link>
            ) : <div />}
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary-800">
        <div className="container-custom text-center text-white max-w-2xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-4">{isEs ? '¿Listo Para Tu Proyecto?' : 'Ready to Start Your Project?'}</h2>
          <p className="text-primary-200 mb-8">{isEs ? 'Contáctenos para una consulta gratuita.' : 'Contact us for a free consultation and detailed estimate.'}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={"/" + locale + "/get-started"} className="btn-gold">{isEs ? 'Estimado Gratis' : 'Get Free Estimate'} <ArrowRight className="w-5 h-5 ml-2" /></Link>
            <Link href={"/" + locale + "/contact"} className="px-6 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">{isEs ? 'Contactar' : 'Contact Us'}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
