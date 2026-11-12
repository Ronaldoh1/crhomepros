import { Metadata } from 'next'
import Link from 'next/link'
import { Gift, DollarSign, Users, ArrowRight, CheckCircle, Zap, Heart, Star, Phone } from 'lucide-react'
import { COMPANY } from '@/lib/constants'
import { formatPhoneLink } from '@/lib/utils'
import { ReferralForm } from '@/components/forms/ReferralForm'

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (params?.locale === 'es') {
    return {
      title: 'Programa de Referidos',
      description: 'Gane recompensas por recomendar a amigos y familiares a CR Home Pros. Reciba de $75 a $750+ por cada referido exitoso. Comparta la calidad, comparta las recompensas.',
    }
  }
  return {
    title: 'Referral Program',
    description: 'Earn rewards for referring friends and family to CR Home Pros. Get $75-$750+ for every successful referral. Share the quality, share the rewards.',
  }
}

type Tier = {
  project: string
  range: string
  reward: string
  examples: string
  rewardType?: string
  highlight?: boolean
}

const tiersEn: Tier[] = [
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

const tiersEs: Tier[] = [
  {
    project: 'Proyectos Iniciales',
    range: 'Menos de $2,500',
    reward: '$75',
    examples: 'Reparaciones menores, retoques de pintura, arreglos pequeños',
    rewardType: 'Tarjeta de Regalo',
  },
  {
    project: 'Proyectos Pequeños',
    range: '$2,500 - $5,000',
    reward: '$100',
    examples: 'Pintura, trabajos de azulejos, remodelaciones menores',
  },
  {
    project: 'Proyectos Medianos',
    range: '$5,000 - $15,000',
    reward: '$250',
    examples: 'Remodelación de baño, instalación de deck, pisos',
  },
  {
    project: 'Proyectos Grandes',
    range: '$15,000 - $50,000',
    reward: '$500',
    examples: 'Remodelación de cocina, terminación de sótano',
  },
  {
    project: 'Proyectos Mayores',
    range: '$50,000+',
    reward: '$750+',
    examples: 'Renovaciones completas, ampliaciones',
    highlight: true,
  },
]

const stepIcons = [Users, Phone, CheckCircle, DollarSign]

const howItWorksEn = [
  {
    title: 'Share Our Info',
    description: 'Tell your friends, family, or neighbors about CR Home Pros. Share your unique referral link or just give them our number.',
  },
  {
    title: 'They Get a Quote',
    description: 'Your referral contacts us and mentions your name. They receive a free consultation and estimate.',
  },
  {
    title: 'Project Completed',
    description: 'Once we complete their project, you earn your referral reward. It\'s that simple!',
  },
  {
    title: 'Get Paid',
    description: 'Receive your reward via check, Venmo, Zelle, gift card, or credit toward your next project.',
  },
]

const howItWorksEs = [
  {
    title: 'Comparta Nuestra Información',
    description: 'Hábleles de CR Home Pros a sus amigos, familiares o vecinos. Comparta su enlace de referido único o simplemente deles nuestro número.',
  },
  {
    title: 'Reciben un Presupuesto',
    description: 'Su referido se comunica con nosotros y menciona su nombre. Recibe una consulta y un presupuesto gratis.',
  },
  {
    title: 'Proyecto Terminado',
    description: 'Una vez que terminemos su proyecto, usted gana su recompensa por referido. ¡Así de fácil!',
  },
  {
    title: 'Reciba su Pago',
    description: 'Reciba su recompensa por cheque, Venmo, Zelle, tarjeta de regalo o como crédito para su próximo proyecto.',
  },
]

const faqsEn = [
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

const faqsEs = [
  {
    q: '¿Quién puede participar en el programa de referidos?',
    a: '¡Cualquier persona! No necesita haber sido cliente antes. Amigos, familiares, agentes de bienes raíces, administradores de propiedades: todos son bienvenidos.',
  },
  {
    q: '¿Hay un límite de personas que puedo referir?',
    a: '¡No hay límite! Refiera a todas las personas que desee. Algunos de nuestros mejores referidores ganan miles de dólares al año.',
  },
  {
    q: '¿Cuándo recibo mi recompensa?',
    a: 'Las recompensas se pagan dentro de los 7 días posteriores a la terminación del proyecto y al pago final.',
  },
  {
    q: '¿Qué pasa si refiero a alguien para varios proyectos?',
    a: '¡Usted gana una recompensa por cada proyecto! Si su referido regresa para un segundo proyecto, usted vuelve a ganar.',
  },
  {
    q: '¿Puedo usar mi recompensa para mi propio proyecto?',
    a: '¡Por supuesto! Muchos clientes usan sus créditos por referidos para financiar su próximo proyecto de mejoras del hogar con nosotros.',
  },
]

const copy = {
  en: {
    badge: 'Referral Program',
    heroTitle: 'Share the Quality,',
    heroHighlight: 'Share the Rewards',
    heroTextBefore: 'Know someone who needs home improvement? Refer them to CR Home Pros and earn up to ',
    heroTextAfter: 'for every completed project!',
    referNow: 'Refer Someone Now',
    howItWorks: 'How It Works',
    rewardStructure: 'Reward Structure',
    tiersTitle: 'Earn More for Bigger Projects',
    tiersText: 'The bigger the project your referral completes, the bigger your reward.',
    bestValue: 'BEST VALUE',
    bonusLabel: 'Bonus:',
    bonusText: 'Refer 3+ people in a year and earn an extra $200!',
    simpleProcess: 'Simple Process',
    stepsText: 'Four easy steps to earning referral rewards.',
    submitReferral: 'Submit a Referral',
    formText: "Fill out the form below and we'll reach out to your referral within 24 hours.",
    statPaid: 'Paid in referral rewards',
    statReferrers: 'Happy referrers',
    statDaysValue: '7 Days',
    statDays: 'Average payout time',
    questions: 'Questions?',
    faqTitle: 'Frequently Asked Questions',
    ctaTitle: 'Your Recommendation Matters',
    ctaText: "When you refer someone to CR Home Pros, you're not just earning a reward—you're helping a friend or neighbor get quality work they can trust.",
    ctaButton: 'Start Earning Today',
  },
  es: {
    badge: 'Programa de Referidos',
    heroTitle: 'Comparta la Calidad,',
    heroHighlight: 'Comparta las Recompensas',
    heroTextBefore: '¿Conoce a alguien que necesite mejoras en su hogar? Refiéralo a CR Home Pros y gane hasta ',
    heroTextAfter: 'por cada proyecto terminado.',
    referNow: 'Referir a Alguien Ahora',
    howItWorks: 'Cómo Funciona',
    rewardStructure: 'Estructura de Recompensas',
    tiersTitle: 'Gane Más con Proyectos Más Grandes',
    tiersText: 'Mientras más grande sea el proyecto que complete su referido, mayor será su recompensa.',
    bestValue: 'MEJOR VALOR',
    bonusLabel: 'Bono:',
    bonusText: '¡Refiera a 3 o más personas en un año y gane $200 adicionales!',
    simpleProcess: 'Proceso Sencillo',
    stepsText: 'Cuatro pasos sencillos para ganar recompensas por referidos.',
    submitReferral: 'Envíe un Referido',
    formText: 'Complete el siguiente formulario y nos comunicaremos con su referido dentro de 24 horas.',
    statPaid: 'Pagados en recompensas por referidos',
    statReferrers: 'Referidores satisfechos',
    statDaysValue: '7 Días',
    statDays: 'Tiempo promedio de pago',
    questions: '¿Preguntas?',
    faqTitle: 'Preguntas Frecuentes',
    ctaTitle: 'Su Recomendación Importa',
    ctaText: 'Cuando refiere a alguien a CR Home Pros, no solo gana una recompensa: también ayuda a un amigo o vecino a obtener un trabajo de calidad en el que puede confiar.',
    ctaButton: 'Empiece a Ganar Hoy',
  },
}

export default function ReferralsPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale === 'es' ? 'es' : 'en'
  const t = copy[locale]
  const tiers = locale === 'es' ? tiersEs : tiersEn
  const howItWorks = (locale === 'es' ? howItWorksEs : howItWorksEn).map((s, i) => ({
    ...s,
    step: i + 1,
    icon: stepIcons[i],
  }))
  const faqs = locale === 'es' ? faqsEs : faqsEn

  return (
    <>
      {/* Hero */}
      <section className="relative page-top pb-20 bg-dark-900 overflow-hidden">
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/20 border border-gold-500/30 mb-6">
              <Gift className="w-5 h-5 text-gold-400" />
              <span className="text-gold-300 font-medium">{t.badge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              {t.heroTitle}{' '}
              <span className="text-gold-400">
                {t.heroHighlight}
              </span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              {t.heroTextBefore}
              <span className="text-gold-400 font-bold"> $750+ </span>
              {t.heroTextAfter}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#refer-form" className="btn-gold btn-lg">
                {t.referNow}
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a href="#how-it-works" className="btn-outline-white btn-lg">
                {t.howItWorks}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Reward Tiers */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-gold-900 tracking-wider uppercase mb-4">
              {t.rewardStructure}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
              {t.tiersTitle}
            </h2>
            <p className="text-lg text-dark-600">
              {t.tiersText}
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
                    {t.bestValue}
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-medium text-dark-600 mb-1">{tier.range}</p>
                  <h3 className="text-lg font-display font-semibold text-dark-900 mb-4">
                    {tier.project}
                  </h3>
                  <div className={`text-4xl font-bold mb-1 ${tier.highlight ? 'text-gold-900' : 'text-primary-700'}`}>
                    {tier.reward}
                  </div>
                  {tier.rewardType && (
                    <p className="text-xs font-semibold text-gold-900 mb-3">{tier.rewardType}</p>
                  )}
                  {!tier.rewardType && <div className="mb-3" />}
                  <p className="text-sm text-dark-600">
                    {tier.examples}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-dark-600">
              <Zap className="w-5 h-5 inline text-gold-500 mr-1" />
              <strong>{t.bonusLabel}</strong> {t.bonusText}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-gold-900 tracking-wider uppercase mb-4">
              {t.simpleProcess}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
              {t.howItWorks}
            </h2>
            <p className="text-lg text-dark-600">
              {t.stepsText}
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
                  <p className="text-dark-600 text-sm">
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
              <span className="inline-block text-sm font-semibold text-gold-900 tracking-wider uppercase mb-4">
                {t.submitReferral}
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
                {t.referNow}
              </h2>
              <p className="text-lg text-dark-600">
                {t.formText}
              </p>
            </div>

            <div className="bg-dark-50 rounded-2xl p-8">
              <ReferralForm locale={locale} />
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
              <p className="text-primary-200">{t.statPaid}</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <p className="text-primary-200">{t.statReferrers}</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{t.statDaysValue}</div>
              <p className="text-primary-200">{t.statDays}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-semibold text-gold-900 tracking-wider uppercase mb-4">
                {t.questions}
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900">
                {t.faqTitle}
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-dark-100">
                  <h3 className="font-semibold text-dark-900 mb-2">{faq.q}</h3>
                  <p className="text-dark-600">{faq.a}</p>
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
              {t.ctaTitle}
            </h2>
            <p className="text-lg text-dark-700 mb-8">
              {t.ctaText}
            </p>
            <a href="#refer-form" className="btn bg-dark-900 text-white hover:bg-dark-800 btn-lg">
              {t.ctaButton}
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
