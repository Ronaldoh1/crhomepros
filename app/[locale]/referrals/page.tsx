import { Metadata } from 'next'
import Link from 'next/link'
import { Gift, DollarSign, Users, ArrowRight, CheckCircle, Zap, Heart, Star, Phone } from 'lucide-react'
import { COMPANY } from '@/lib/constants'
import { formatPhoneLink } from '@/lib/utils'
import { ReferralForm } from '@/components/forms/ReferralForm'

export const metadata: Metadata = {
  title: 'Referral Program',
  description: 'Earn rewards for referring friends and family to CR Home Pros. Get $75-$750+ for every successful referral. Share the quality, share the rewards.',
}

const tiers = [
  {
    project: 'Starter Projects',
    range: 'Under $2,500',
    reward: '$75',
    examples: 'Minor repairs, touch-up painting, small fixes',
    rewardType: 'Gift Card',
  },
  {
    project: 'Small Projects',
    range: '$2,500 - $5,000',
    reward: '$100',
    examples: 'Painting, tile work, minor remodeling',
  },
  {
    project: 'Medium Projects',
    range: '$5,000 - $15,000',
    reward: '$250',
    examples: 'Bathroom remodel, deck installation, flooring',
  },
  {
    project: 'Large Projects',
    range: '$15,000 - $50,000',
    reward: '$500',
    examples: 'Kitchen remodel, basement finishing',
  },
  {
    project: 'Major Projects',
    range: '$50,000+',
    reward: '$750+',
    examples: 'Full renovations, additions',
    highlight: true,
  },
]

const howItWorks = [
  {
    step: 1,
    title: 'Share Our Info',
    description: 'Tell your friends, family, or neighbors about CR Home Pros. Share your unique referral link or just give them our number.',
    icon: Users,
  },
  {
    step: 2,
    title: 'They Get a Quote',
    description: 'Your referral contacts us and mentions your name. They receive a free consultation and estimate.',
    icon: Phone,
  },
  {
    step: 3,
    title: 'Project Completed',
    description: 'Once we complete their project, you earn your referral reward. It\'s that simple!',
    icon: CheckCircle,
  },
  {
    step: 4,
    title: 'Get Paid',
    description: 'Receive your reward via check, Venmo, Zelle, gift card, or credit toward your next project.',
    icon: DollarSign,
  },
]

const faqs = [
  {
    q: 'Who can participate in the referral program?',
    a: 'Anyone! You don\'t have to be a previous customer. Friends, family, real estate agents, property managers - everyone is welcome.',
  },
  {
    q: 'Is there a limit to how many people I can refer?',
    a: 'No limit! Refer as many people as you\'d like. Some of our top referrers earn thousands of dollars per year.',
  },
  {
    q: 'When do I receive my reward?',
    a: 'Rewards are paid within 7 days of project completion and final payment.',
  },
  {
    q: 'What if I refer someone for multiple projects?',
    a: 'You earn a reward for each project! If your referral comes back for a second project, you earn again.',
  },
  {
    q: 'Can I use my reward toward my own project?',
    a: 'Absolutely! Many clients use their referral credits to fund their next home improvement project with us.',
  },
]

export default function ReferralsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-dark-900 via-primary-900 to-dark-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/20 border border-gold-500/30 mb-6">
              <Gift className="w-5 h-5 text-gold-400" />
              <span className="text-gold-300 font-medium">Referral Program</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Share the Quality,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                Share the Rewards
              </span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-8">
              Know someone who needs home improvement? Refer them to CR Home Pros and earn up to 
              <span className="text-gold-400 font-bold"> $750+ </span> 
              for every completed project!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#refer-form" className="btn-gold btn-lg">
                Refer Someone Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a href="#how-it-works" className="btn-outline-white btn-lg">
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Reward Tiers */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-gold-600 tracking-wider uppercase mb-4">
              Reward Structure
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
              Earn More for Bigger Projects
            </h2>
            <p className="text-lg text-dark-500">
              The bigger the project your referral completes, the bigger your reward.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.project}
                className={`relative rounded-2xl p-6 border-2 transition-all ${
                  tier.highlight
                    ? 'bg-gradient-to-br from-gold-50 to-gold-100 border-gold-300 shadow-glow'
                    : 'bg-white border-dark-100 hover:border-primary-200 hover:shadow-lg'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold-500 rounded-full text-xs font-bold text-dark-900">
                    BEST VALUE
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-medium text-dark-500 mb-1">{tier.range}</p>
                  <h3 className="text-lg font-display font-semibold text-dark-900 mb-4">
                    {tier.project}
                  </h3>
                  <div className={`text-4xl font-bold mb-1 ${tier.highlight ? 'text-gold-600' : 'text-primary-700'}`}>
                    {tier.reward}
                  </div>
                  {tier.rewardType && (
                    <p className="text-xs font-semibold text-gold-600 mb-3">{tier.rewardType}</p>
                  )}
                  {!tier.rewardType && <div className="mb-3" />}
                  <p className="text-sm text-dark-500">
                    {tier.examples}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-dark-500">
              <Zap className="w-5 h-5 inline text-gold-500 mr-1" />
              <strong>Bonus:</strong> Refer 3+ people in a year and earn an extra $200!
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-gold-600 tracking-wider uppercase mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
              How It Works
            </h2>
            <p className="text-lg text-dark-500">
              Four easy steps to earning referral rewards.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step} className="relative">
                {/* Connector line (desktop) */}
                {step.step < 4 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-dark-200" />
                )}
                
                <div className="relative bg-white rounded-2xl p-6 border border-dark-100">
                  {/* Step number */}
                  <div className="w-12 h-12 rounded-full bg-primary-800 text-white flex items-center justify-center font-bold text-lg mb-4">
                    {step.step}
                  </div>
                  
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  
                  <h3 className="text-lg font-display font-semibold text-dark-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-dark-500 text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Form */}
      <section id="refer-form" className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-semibold text-gold-600 tracking-wider uppercase mb-4">
                Submit a Referral
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
                Refer Someone Now
              </h2>
              <p className="text-lg text-dark-500">
                Fill out the form below and we'll reach out to your referral within 24 hours.
              </p>
            </div>

            <div className="bg-dark-50 rounded-2xl p-8">
              <ReferralForm />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-primary-800">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">$50K+</div>
              <p className="text-primary-200">Paid in referral rewards</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <p className="text-primary-200">Happy referrers</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">7 Days</div>
              <p className="text-primary-200">Average payout time</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-semibold text-gold-600 tracking-wider uppercase mb-4">
                Questions?
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-dark-100">
                  <h3 className="font-semibold text-dark-900 mb-2">{faq.q}</h3>
                  <p className="text-dark-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-gradient-to-br from-gold-500 to-gold-600">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="w-12 h-12 text-dark-900/20 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
              Your Recommendation Matters
            </h2>
            <p className="text-lg text-dark-700 mb-8">
              When you refer someone to CR Home Pros, you're not just earning a reward—you're 
              helping a friend or neighbor get quality work they can trust.
            </p>
            <a href="#refer-form" className="btn bg-dark-900 text-white hover:bg-dark-800 btn-lg">
              Start Earning Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
