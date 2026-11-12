import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Award, Users, Heart, CheckCircle } from 'lucide-react'
import { COMPANY, SERVICE_AREAS } from '@/lib/constants'
import { resolveImageUrl } from '@/lib/resolve-images'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (params.locale === 'es') {
    return {
      title: 'Sobre Nosotros',
      description: `Conozca CR Home Pros: más de ${COMPANY.yearsInBusiness} años de trabajo confiable al servicio del área DMV. Conozca a nuestro equipo y nuestro compromiso con la calidad.`,
    }
  }
  return {
    title: 'About Us',
    description: `Learn about CR Home Pros - ${COMPANY.yearsInBusiness}+ years of trusted craftsmanship serving the DMV area. Meet our team and discover our commitment to quality.`,
  }
}

const milestones = [
  { year: '2004', event: 'Carlos begins his journey in construction and home improvement', eventEs: 'Carlos comienza su trayectoria en la construcción y el mejoramiento de viviendas' },
  { year: '2009', event: 'CR Home Pros officially established', eventEs: 'Se establece oficialmente CR Home Pros' },
  { year: '2012', event: 'Expanded team to handle larger renovation projects', eventEs: 'Ampliamos el equipo para asumir proyectos de remodelación más grandes' },
  { year: '2015', event: 'Earned MHIC License #05-132359 in Maryland', eventEs: 'Obtuvimos la Licencia MHIC #05-132359 en Maryland' },
  { year: '2018', event: 'Completed 250th project milestone', eventEs: 'Alcanzamos la meta de 250 proyectos completados' },
  { year: '2020', event: 'Adapted to serve clients safely during pandemic', eventEs: 'Nos adaptamos para atender a nuestros clientes de forma segura durante la pandemia' },
  { year: '2024', event: '500+ projects completed, rebranded as CR Home Pros', eventEs: 'Más de 500 proyectos completados; adoptamos el nombre CR Home Pros' },
]

const values = [
  {
    icon: Heart,
    title: 'Passion for Craft',
    titleEs: 'Pasión por el Oficio',
    description: 'We love what we do. Every nail, every tile, every detail matters to us.',
    descriptionEs: 'Amamos lo que hacemos. Cada clavo, cada azulejo y cada detalle nos importa.',
  },
  {
    icon: Shield,
    title: 'Integrity First',
    titleEs: 'Integridad Ante Todo',
    description: 'Honest pricing, transparent communication, and no surprises.',
    descriptionEs: 'Precios honestos, comunicación transparente y cero sorpresas.',
  },
  {
    icon: Users,
    title: 'Client Partnership',
    titleEs: 'Trabajo en Equipo con el Cliente',
    description: 'Your vision drives our work. We listen, collaborate, and deliver.',
    descriptionEs: 'Su visión guía nuestro trabajo. Escuchamos, colaboramos y cumplimos.',
  },
  {
    icon: Award,
    title: 'Excellence Always',
    titleEs: 'Excelencia Siempre',
    description: 'We never cut corners. Quality workmanship is our reputation.',
    descriptionEs: 'Nunca tomamos atajos. El trabajo de calidad es nuestra reputación.',
  },
]

export default function AboutPage({ params }: { params: { locale: string } }) {
  const es = params.locale === 'es'
  return (
    <>
      {/* Hero Section */}
      <section className="relative page-top pb-20 bg-dark-900 overflow-hidden">
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-gold-400 tracking-wider uppercase mb-4">
              {es ? 'Nuestra Historia' : 'Our Story'}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              {es ? 'Construyendo Sueños,' : 'Building Dreams,'}{' '}
              <span className="text-gold-400">
                {es ? 'Un Hogar a la Vez' : 'One Home at a Time'}
              </span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              {es ? (
                <>Por más de {COMPANY.yearsInBusiness} años, CR Home Pros ha convertido casas en los hogares soñados de familias en toda el área DMV. No somos solo contratistas: somos artesanos que se enorgullecen de cada proyecto.</>
              ) : (<>
              For over {COMPANY.yearsInBusiness} years, CR Home Pros has been transforming houses into 
              dream homes across the DMV area. We're not just contractors—we're craftsmen who take 
              pride in every project.
              </>)}
            </p>
          </div>
        </div>
      </section>

      {/* Carlos's Story */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-dark-100">
                <Image
                  src={resolveImageUrl("/images/team-carlos-04-portrait-blazer.jpg")}
                  alt={es ? 'Carlos Hernandez - Fundador' : "Carlos Hernandez - Founder"}
                  fill
                  className="object-cover object-[50%_20%]"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-dark-900">{COMPANY.license}</p>
                    <p className="text-sm text-dark-600">{es ? 'Contratista/Vendedor con Licencia' : 'Licensed Contractor/Salesman'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="inline-block text-sm font-semibold text-gold-900 tracking-wider uppercase mb-4">
                {es ? 'Conozca al Fundador' : 'Meet the Founder'}
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
                Carlos Hernandez
              </h2>
              <div className="space-y-4 text-dark-600 leading-relaxed">
                <p>
                  {es ? (
                <>Con más de dos décadas de experiencia directa en el mejoramiento de viviendas, Carlos Hernandez ha construido CR Home Pros sobre una base de confianza, calidad y atención personalizada. Lo que comenzó como una pasión por el oficio se ha convertido en una empresa de remodelación de servicio completo que trata cada hogar como si fuera el suyo.</>
              ) : (<>
              With over two decades of hands-on experience in home improvement, Carlos Hernandez 
                  has built CR Home Pros on a foundation of trust, quality, and personalized 
                  attention. What started as a passion for craftsmanship has grown into a full-service 
                  renovation company that treats every home like it's their own.
              </>)}
                </p>
                <p>
                  {es ? (
                <>Carlos y su equipo calificado se especializan en transformar espacios, desde remodelaciones completas de cocina hasta reparaciones de emergencia. Se han ganado una reputación en toda el área DMV por llegar a tiempo, comunicarse con claridad y entregar resultados que superan las expectativas.</>
              ) : (<>
              Carlos and his skilled team specialize in transforming spaces—from complete kitchen 
                  renovations to emergency repairs. They've earned a reputation throughout the DMV area 
                  for showing up on time, communicating clearly, and delivering results that exceed expectations.
              </>)}
                </p>
                <p className="italic border-l-4 border-gold-500 pl-4 py-2 bg-gold-50/50 rounded-r-lg">
                  {es ? (
                <>"Mi equipo y yo nos dedicamos a hacer realidad el potencial de su hogar, una mejora a la vez. Con pasión por el oficio y compromiso con la calidad, no solo remodelamos espacios: estamos aquí para ayudarle a construir el espacio soñado que siempre ha imaginado. Creemos juntos algo hermoso."</>
              ) : (<>
              "My team and I are dedicated to bringing your home's potential to life, one improvement 
                  at a time. With a passion for craftsmanship and a commitment to quality, we're not just 
                  renovating spaces—we're here to help you build the dream space you've always envisioned. 
                  Let's create something beautiful together."
              </>)}
                </p>
              </div>
              
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-dark-100">
                <div>
                  <p className="text-3xl font-bold text-primary-700">{COMPANY.yearsInBusiness}+</p>
                  <p className="text-sm text-dark-600">{es ? 'Años de Experiencia' : 'Years Experience'}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-700">500+</p>
                  <p className="text-sm text-dark-600">{es ? 'Proyectos Realizados' : 'Projects Done'}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-700">100%</p>
                  <p className="text-sm text-dark-600">{es ? 'Compromiso' : 'Commitment'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The crew */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="max-w-2xl mb-10">
            <span className="inline-block text-sm font-semibold text-gold-900 tracking-wider uppercase mb-4">
              {es ? 'El Equipo' : 'The Crew'}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-4">
              {es ? 'Carlos y su equipo en plena obra' : 'Carlos and his team on the job'}
            </h2>
            <p className="text-dark-600 leading-relaxed">
              {es ? 'El mismo equipo, trabajo tras trabajo, durante años.' : 'The same hands-on crew, job after job, for years.'}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { src: '/images/team-carlos-06-with-crew-member.jpg', alt: es ? 'Carlos con un miembro de su equipo en una obra' : 'Carlos with a member of his crew on a job' },
              { src: '/images/team-carlos-07-with-crew-member.jpg', alt: es ? 'Carlos con un miembro de su equipo en una habitación terminada' : 'Carlos with a member of his crew in a finished room' },
              { src: '/images/team-carlos-05-crew-drywall-job.jpg', alt: es ? 'Miembros del equipo de CR Home Pros en un trabajo de drywall' : 'CR Home Pros crew members on a drywall job' },
            ].map((photo) => (
              <div key={photo.src} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-dark-100">
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover object-top" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-gold-900 tracking-wider uppercase mb-4">
              {es ? 'Nuestros Valores' : 'Our Values'}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
              {es ? 'Lo Que Nos Define' : 'What We Stand For'}
            </h2>
            <p className="text-lg text-dark-600">
              {es ? 'No son solo palabras en una pared: guían cada decisión que tomamos y cada proyecto que aceptamos.' : 'These aren\'t just words on a wall—they guide every decision we make and every project we take on.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-8 border border-dark-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-display font-semibold text-dark-900 mb-3">
                  {es ? value.titleEs : value.title}
                </h3>
                <p className="text-dark-600">
                  {es ? value.descriptionEs : value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-gold-900 tracking-wider uppercase mb-4">
              {es ? 'Nuestra Trayectoria' : 'Our Journey'}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900">
              {es ? `Más de ${COMPANY.yearsInBusiness} Años de Crecimiento` : <>{COMPANY.yearsInBusiness}+ Years of Growth</>}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex gap-6 pb-8 last:pb-0">
                <div className="flex-shrink-0 w-20">
                  <span className="text-xl font-bold text-primary-700">{milestone.year}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-gold-500" />
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-dark-200 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <p className="text-dark-700">{es ? milestone.eventEs : milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section-padding bg-primary-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-gold-400 tracking-wider uppercase mb-4">
              {es ? 'Dónde Trabajamos' : 'Where We Work'}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              {es ? 'Orgullosos de Servir al Área DMV' : 'Proudly Serving the DMV'}
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {SERVICE_AREAS.map((area) => (
              <span
                key={area}
                className="px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect - FAQ Style */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-semibold text-gold-900 tracking-wider uppercase mb-4">
                {es ? 'Trabajar con Nosotros' : 'Working with Us'}
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900">
                {es ? 'Qué Puede Esperar' : 'What to Expect'}
              </h2>
            </div>

            <div className="space-y-8">
              <div className="border-l-4 border-primary-500 pl-6 py-2">
                <h3 className="text-xl font-display font-semibold text-dark-900 mb-3">
                  {es ? '¿Trabajan en casas habitadas?' : 'Do you work in occupied homes?'}
                </h3>
                <p className="text-dark-600 leading-relaxed">
                  {es ? (
                    <>¡Sí! Entendemos que usted tiene una vida que seguir. Respetamos su rutina diaria, mantenemos limpias las áreas de trabajo y reducimos las molestias al mínimo. Muchos de nuestros clientes siguen viviendo en su casa durante la remodelación.</>
                  ) : (<>
                  Yes! We understand you have a life to live. We respect your daily routine, 
                  keep our work areas clean, and minimize disruption. Many of our clients 
                  continue living in their homes during renovations.
                  </>)}
                </p>
              </div>

              <div className="border-l-4 border-primary-500 pl-6 py-2">
                <h3 className="text-xl font-display font-semibold text-dark-900 mb-3">
                  {es ? '¿Cuánto tiempo suelen tardar los proyectos?' : 'How long do projects typically take?'}
                </h3>
                <p className="text-dark-600 leading-relaxed">
                  {es ? (
                    <>Depende del alcance del proyecto. Una remodelación de baño puede tomar de 2 a 3 semanas, mientras que una cocina completa puede tomar de 4 a 6 semanas. Le entregamos un cronograma detallado desde el principio y le mantenemos informado del avance en cada etapa.</>
                  ) : (<>
                  Timeline depends on the project scope. A bathroom remodel might take 2-3 weeks, 
                  while a full kitchen could be 4-6 weeks. We provide detailed timelines upfront 
                  and keep you updated on progress every step of the way.
                  </>)}
                </p>
              </div>

              <div className="border-l-4 border-primary-500 pl-6 py-2">
                <h3 className="text-xl font-display font-semibold text-dark-900 mb-3">
                  {es ? '¿Qué pasa con los permisos y las inspecciones?' : 'What about permits and inspections?'}
                </h3>
                <p className="text-dark-600 leading-relaxed">
                  {es ? (
                    <>Nos encargamos de todo. Desde tramitar los permisos hasta programar las inspecciones, resolvemos el papeleo para que usted no tenga que hacerlo. Como contratistas con licencia en Maryland, garantizamos que todo el trabajo cumpla con los códigos de construcción.</>
                  ) : (<>
                  We handle everything. From pulling permits to scheduling inspections, 
                  we navigate the bureaucracy so you don&apos;t have to. As a licensed Maryland 
                  contractor, we ensure all work meets code requirements.
                  </>)}
                </p>
              </div>

              <div className="border-l-4 border-primary-500 pl-6 py-2">
                <h3 className="text-xl font-display font-semibold text-dark-900 mb-3">
                  {es ? '¿Cómo manejan los cambios durante el proyecto?' : 'How do you handle changes during the project?'}
                </h3>
                <p className="text-dark-600 leading-relaxed">
                  {es ? (
                    <>Lo entendemos: a veces, al ver cómo va tomando forma el espacio, usted quiere hacer ajustes. ¡Somos flexibles! Todo cambio se documenta por escrito con un precio claro antes de continuar. Nunca habrá cargos sorpresa.</>
                  ) : (<>
                  We get it—sometimes you see the space coming together and want to adjust. 
                  We&apos;re flexible! Any changes are documented in writing with clear pricing 
                  before we proceed. No surprise charges, ever.
                  </>)}
                </p>
              </div>

              <div className="border-l-4 border-primary-500 pl-6 py-2">
                <h3 className="text-xl font-display font-semibold text-dark-900 mb-3">
                  {es ? '¿Y si tengo preguntas durante el proyecto?' : 'What if I have questions during the project?'}
                </h3>
                <p className="text-dark-600 leading-relaxed">
                  {es ? (
                    <>Carlos y nuestros gerentes de proyecto están a solo una llamada o un mensaje de distancia. Le damos actualizaciones diarias y sus preguntas siempre son bienvenidas. Es su hogar: nunca debería quedarse sin saber lo que está pasando.</>
                  ) : (<>
                  Carlos and our project managers are just a call or text away. We provide 
                  daily updates and welcome your questions. This is your home—you should 
                  never feel in the dark about what&apos;s happening.
                  </>)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-6">
              {es ? '¿Listo para Comenzar su Proyecto?' : 'Ready to Start Your Project?'}
            </h2>
            <p className="text-lg text-dark-600 mb-8">
              {es ? 'Hablemos de su visión. Programe hoy una consulta gratis.' : 'Let\'s discuss your vision. Schedule a free consultation today.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started" className="btn-gold btn-lg">
                {es ? 'Solicitar un Estimado' : 'Request an Estimate'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/projects" className="btn-outline btn-lg">
                {es ? 'Ver Nuestros Trabajos' : 'View Our Work'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
