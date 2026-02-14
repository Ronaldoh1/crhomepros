import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from 'lucide-react'
import { BLOG_POSTS, getPostBySlug } from '@/lib/blog-posts'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  return {
    title: `${post.title} | CR Home Pros Blog`,
    description: post.excerpt,
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // Find next and previous posts
  const currentIndex = BLOG_POSTS.findIndex(p => p.slug === params.slug)
  const previousPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null
  const nextPost = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null

  // Format content with proper spacing
  const formattedContent = post.content
    .split('\n\n')
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-dark-900 via-primary-900 to-dark-950">
        <div className="container-custom">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-gold-500/20 border border-gold-500/30 rounded-full text-sm font-medium text-gold-400">
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-white/70">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime} read
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="relative -mt-8">
        <div className="container-custom">
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg prose-primary max-w-none">
              {formattedContent.map((paragraph, index) => {
                // Check if it's a heading
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-display font-bold text-dark-900 mt-12 mb-4">
                      {paragraph.replace('## ', '')}
                    </h2>
                  )
                }
                
                // Check if it's a bold section (starts with **)
                if (paragraph.startsWith('**') && paragraph.includes('**:')) {
                  const [boldPart, ...rest] = paragraph.split('**:')
                  const boldText = boldPart.replace('**', '')
                  return (
                    <p key={index} className="text-dark-700 leading-relaxed mb-6">
                      <strong className="text-dark-900 font-semibold">{boldText}:</strong>
                      {rest.join('**:')}
                    </p>
                  )
                }
                
                // Regular paragraph
                return (
                  <p key={index} className="text-dark-700 leading-relaxed mb-6">
                    {paragraph}
                  </p>
                )
              })}
            </div>

            {/* Author Bio */}
            <div className="mt-16 p-8 bg-dark-50 rounded-2xl border border-dark-100">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold text-xl">
                  CH
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-display font-bold text-dark-900 mb-2">
                    {post.author}
                  </h3>
                  <p className="text-dark-600 leading-relaxed">
                    Owner and lead contractor at CR Home Pros. With over 15 years of experience in home improvement 
                    and renovation projects throughout the DMV area, Carlos is dedicated to delivering quality 
                    workmanship and exceptional customer service.
                  </p>
                </div>
              </div>
            </div>

            {/* Post Navigation */}
            <div className="mt-16 pt-8 border-t border-dark-200">
              <div className="grid md:grid-cols-2 gap-6">
                {previousPost && (
                  <Link 
                    href={`/blog/${previousPost.slug}`}
                    className="group p-6 bg-dark-50 rounded-xl border border-dark-100 hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    <span className="text-sm text-dark-500 mb-2 block">Previous Post</span>
                    <h4 className="font-display font-semibold text-dark-900 group-hover:text-primary-700 transition-colors">
                      {previousPost.title}
                    </h4>
                  </Link>
                )}
                {nextPost && (
                  <Link 
                    href={`/blog/${nextPost.slug}`}
                    className="group p-6 bg-dark-50 rounded-xl border border-dark-100 hover:border-primary-300 hover:shadow-md transition-all md:text-right"
                  >
                    <span className="text-sm text-dark-500 mb-2 block">Next Post</span>
                    <h4 className="font-display font-semibold text-dark-900 group-hover:text-primary-700 transition-colors">
                      {nextPost.title}
                    </h4>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="section-padding bg-primary-800">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-primary-200 mb-8 text-lg">
              Let's discuss your home improvement goals and create a plan that works for you.
            </p>
            <Link href="/get-started" className="btn-gold inline-flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
