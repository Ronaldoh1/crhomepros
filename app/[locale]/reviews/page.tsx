import { Metadata } from 'next'
import Link from 'next/link'
import { Star, Quote, MapPin, ArrowRight, CheckCircle, FileText } from 'lucide-react'
import { TESTIMONIALS, COMPANY } from '@/lib/constants'
import { RECOMMENDATION_LETTERS } from '@/lib/recommendations-data'
import { cn, getInitials } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Customer Reviews',
  description: `Read what our customers say about CR Home Pros. ${COMPANY.projectsCompleted} satisfied customers across DC, Maryland & Virginia.`,
}

// Extended testimonials with more detail
const allReviews = [
  ...TESTIMONIALS,
  {
    id: 7,
    name: 'Patricia M.',
    location: 'Chevy Chase, MD',
    rating: 5,
    text: 'We hired CR for a complete bathroom renovation and couldn\'t be happier. Carlos and his team were professional, punctual, and the quality of work exceeded our expectations. The attention to detail was remarkable.',
    service: 'Bathroom Renovation',
  },
  {
    id: 8,
    name: 'David K.',
    location: 'Arlington, VA',
    rating: 5,
    text: 'After getting quotes from several contractors, we chose CR because of their transparent pricing and professionalism. They delivered exactly what they promised, on time and on budget. Will definitely use them again.',
    service: 'Kitchen Remodel',
  },
  {
    id: 9,
    name: 'Maria S.',
    location: 'College Park, MD',
    rating: 5,
    text: 'Excelente trabajo! Carlos habla español lo cual fue muy útil para comunicarnos. The roof replacement was done quickly and professionally. They cleaned up everything when finished. Highly recommend!',
    service: 'Roofing',
  },
]

const stats = [
  { value: '500+', label: 'Happy Clients' },
  { value: '4.9', label: 'Average Rating' },
  { value: '98%', label: 'Would Recommend' },
  { value: '15+', label: 'Years of Reviews' },
]

export default function ReviewsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-dark-900 via-primary-900 to-dark-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-gold-400 tracking-wider uppercase mb-4">
              Testimonials
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              What Our Clients{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                Say About Us
              </span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Don't take our word for it—read real reviews from homeowners across the DMV who've 
              experienced the CR Home Pros difference.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-white border-b border-dark-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-700">{stat.value}</div>
                <div className="text-dark-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl border border-dark-100 p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                    {getInitials(review.name)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-900">{review.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-dark-500">
                      <MapPin className="w-3 h-3" />
                      {review.location}
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-5 h-5',
                        i < review.rating
                          ? 'text-gold-400 fill-gold-400'
                          : 'text-dark-200'
                      )}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-dark-600 mb-4 leading-relaxed">
                  "{review.text.length > 200 ? review.text.slice(0, 200) + '...' : review.text}"
                </p>

                {/* Service Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-3 py-1 bg-primary-50 text-primary-700 rounded-full">
                    {review.service}
                  </span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Letters of Recommendation */}
      <section className="section-padding bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-gold-400 tracking-wider uppercase mb-3">
              Letters of Recommendation
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              In Their Own Words
            </h2>
            <p className="text-lg text-primary-200 max-w-xl mx-auto">
              Real letters from real clients who trusted us with their homes.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-8">
            {RECOMMENDATION_LETTERS.map((letter) => (
              <div
                key={letter.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              >
                <Quote className="w-10 h-10 text-gold-400 mb-4 opacity-60" />
                <blockquote className="text-lg text-white/90 leading-relaxed mb-4 italic">
                  &ldquo;{letter.fullText}&rdquo;
                </blockquote>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-display font-semibold text-white">{letter.author}</p>
                    <p className="text-sm text-primary-300">{letter.service}</p>
                  </div>
                  {letter.pdfPath && (
                    <a
                      href={letter.pdfPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      View Original Letter
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* External Reviews */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-dark-900 mb-4">
              Find Us On
            </h2>
            <p className="text-lg text-dark-500">
              See what our clients are saying across the web.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Google Reviews */}
            <a
              href="https://g.page/crhomepros"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 rounded-2xl border-2 border-dark-100 bg-white hover:border-blue-300 hover:shadow-lg transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-display font-semibold text-dark-900 group-hover:text-blue-600 transition-colors">
                  Google Reviews
                </h3>
                <p className="text-sm text-dark-500">Read reviews on Google</p>
              </div>
              <ArrowRight className="w-5 h-5 text-dark-300 ml-auto group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Yelp Reviews */}
            <a
              href="https://biz.yelp.com/biz_info/-Py44m6S_fcOmE3RLTY31A"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 rounded-2xl border-2 border-dark-100 bg-white hover:border-red-300 hover:shadow-lg transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#D32323">
                  <path d="M20.16 12.594l-4.995 1.433c-.96.276-1.74-.8-1.176-1.63l2.986-4.378c.283-.415.89-.326 1.04.152l1.36 4.32c.112.355-.135.678-.394.678l-.82-.575zM12.596 20.16l1.433-4.995c.276-.96-.8-1.74-1.63-1.176l-4.378 2.986c-.415.283-.326.89.152 1.04l4.32 1.36c.12.04.24-.01.3-.06l-.197-1.155zM3.84 11.406l4.995-1.433c.96-.276 1.74.8 1.176 1.63L7.025 15.98c-.283.415-.89.326-1.04-.152l-1.36-4.32c-.15-.48.135-.78.395-.78l.82.678zM11.404 3.84l-1.433 4.995c-.276.96.8 1.74 1.63 1.176l4.378-2.986c.415-.283.326-.89-.152-1.04l-4.32-1.36c-.12-.04-.24.01-.3.06l.197 1.155z"/>
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-display font-semibold text-dark-900 group-hover:text-red-600 transition-colors">
                  Yelp Reviews
                </h3>
                <p className="text-sm text-dark-500">Read reviews on Yelp</p>
              </div>
              <ArrowRight className="w-5 h-5 text-dark-300 ml-auto group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Video Testimonials Placeholder */}
          {/*
          <div className="mt-16 max-w-3xl mx-auto">
            <h3 className="text-2xl font-display font-bold text-dark-900 text-center mb-8">
              Video Testimonials
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-video rounded-2xl overflow-hidden bg-dark-100">
                <iframe width="100%" height="100%" src="https://www.youtube.com/embed/VIDEO_ID_EN" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden bg-dark-100">
                <iframe width="100%" height="100%" src="https://www.youtube.com/embed/VIDEO_ID_ES" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            </div>
          </div>
          */}
        </div>
      </section>

      {/* Submit Review CTA */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="w-12 h-12 text-dark-200 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
              Had a Great Experience?
            </h2>
            <p className="text-lg text-dark-500 mb-8">
              We'd love to hear about your project! Share your experience and help other homeowners 
              find quality contractors they can trust.
            </p>
            <Link href="/reviews/submit" className="btn-primary btn-lg">
              Leave a Review
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-800">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Join Our Happy Clients?
            </h2>
            <p className="text-primary-200 text-lg mb-8">
              Get a free estimate and see why hundreds of homeowners trust CR Home Pros.
            </p>
            <Link href="/get-started" className="btn-gold btn-lg">
              Get Free Estimate
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
