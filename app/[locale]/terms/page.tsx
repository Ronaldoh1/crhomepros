import { Metadata } from 'next'
import { COMPANY } from '@/lib/constants'

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (params?.locale === 'es') {
    return {
      title: 'Términos de Servicio',
      description: 'Términos de servicio de CR Home Pros. Términos y condiciones para el uso de nuestro sitio web y nuestros servicios.',
    }
  }
  return {
    title: 'Terms of Service',
    description: 'CR Home Pros terms of service. Terms and conditions for using our website and services.',
  }
}

function TermsEs() {
  return (
    <div className="page-top pb-20">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-2">Términos de Servicio</h1>
        <p className="text-dark-600 mb-10">Última actualización: 12 de febrero de 2026</p>

        <div className="prose prose-lg max-w-none text-dark-700 space-y-8">
          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">1. Acerca de Nuestros Servicios</h2>
            <p>CR Home Pros es un nombre comercial de C &amp; R General Services Inc, un contratista de mejoras del hogar con licencia que opera en el área del Distrito de Columbia, Maryland y Virginia (DMV). Contamos con las licencias de la Comisión de Mejoras del Hogar de Maryland (Maryland Home Improvement Commission) #05-132359 y #109350.</p>
            <p>Nuestro sitio web ofrece información sobre nuestros servicios y le permite solicitar presupuestos, enviar reseñas y referir a otras personas a nuestros servicios.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">2. Presupuestos y Precios</h2>
            <p>Todos los presupuestos proporcionados a través de nuestro sitio web, nuestra herramienta de estimación de costos o nuestra guía de precios son rangos aproximados basados en alcances típicos de proyectos. Los costos reales del proyecto dependen de condiciones específicas, los materiales seleccionados, la complejidad del proyecto y otros factores que solo pueden determinarse mediante una consulta en persona.</p>
            <p>Los presupuestos en línea no son cotizaciones vinculantes. Se proporcionará un presupuesto formal por escrito después de una evaluación en el sitio. El precio final se acuerda en un contrato separado antes de que comience el trabajo.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">3. Acuerdos de Proyecto</h2>
            <p>Todos los proyectos de mejoras del hogar se rigen por un contrato escrito separado entre C &amp; R General Services Inc y el propietario de la vivienda. Ese contrato establece el alcance específico del trabajo, los materiales, el cronograma, el calendario de pagos y los términos de la garantía. Los términos de este sitio web no reemplazan ni modifican ningún contrato de proyecto.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">4. Reseñas y Contenido de los Usuarios</h2>
            <p>Las reseñas enviadas a través de nuestro sitio web están sujetas a moderación. Nos reservamos el derecho de no publicar reseñas que contengan lenguaje inapropiado, información falsa o contenido no relacionado con nuestros servicios. Las reseñas publicadas pueden mostrarse en nuestro sitio web y en nuestros materiales de marketing.</p>
            <p>Al enviar una reseña, usted confirma que su experiencia es auténtica y nos otorga permiso para mostrar su reseña con su nombre de pila y su ubicación general.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">5. Programa de Referidos</h2>
            <p>Nuestro programa de referidos recompensa a los clientes existentes que refieren nuevos clientes. Las recompensas por referidos se pagan después de que el proyecto referido se haya completado y pagado en su totalidad. Los montos específicos de las recompensas y los métodos de pago se detallan en nuestra página de referidos. CR Home Pros se reserva el derecho de modificar o suspender el programa de referidos en cualquier momento.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">6. Financiamiento</h2>
            <p>Las opciones de financiamiento mencionadas en nuestro sitio web, incluida la modalidad de compre ahora y pague después de Klarna, son proporcionadas por servicios financieros de terceros. La aprobación, los términos y las condiciones son determinados por dichos proveedores. CR Home Pros no garantiza la aprobación del financiamiento.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">7. Reclamaciones de Seguro</h2>
            <p>Trabajamos con los propietarios de viviendas y sus compañías de seguros para facilitar proyectos de mejoras del hogar cubiertos por reclamaciones de seguro. No somos una compañía de seguros y no tomamos determinaciones sobre la cobertura. El propietario de la vivienda es, en última instancia, responsable de la comunicación con su aseguradora y de cualquier deducible o costo no cubierto.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">8. Uso del Sitio Web</h2>
            <p>Este sitio web se proporciona con fines informativos. Hacemos esfuerzos razonables para mantener la información precisa y actualizada, pero no garantizamos que todo el contenido esté vigente o libre de errores. Las fotos de nuestro sitio web muestran proyectos reales terminados, salvo que se indique lo contrario.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">9. Limitación de Responsabilidad</h2>
            <p>CR Home Pros no es responsable de ningún daño que surja del uso que usted haga de este sitio web. Nuestra responsabilidad en relación con cualquier proyecto de mejoras del hogar se rige por los términos del contrato de proyecto correspondiente y por la ley aplicable de Maryland, Virginia o DC.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">10. Contacto</h2>
            <p>Si tiene preguntas sobre estos términos, comuníquese con nosotros en:</p>
            <p>
              <strong>C &amp; R General Services Inc (CR Home Pros)</strong><br />
              Correo electrónico: {COMPANY.email}<br />
              Teléfono: {COMPANY.phoneFormatted}<br />
              Ubicación: Hyattsville, MD
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default function TermsPage({ params }: { params: { locale: string } }) {
  if (params?.locale === 'es') return <TermsEs />
  return (
    <div className="page-top pb-20">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-2">Terms of Service</h1>
        <p className="text-dark-600 mb-10">Last updated: February 12, 2026</p>

        <div className="prose prose-lg max-w-none text-dark-700 space-y-8">
          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">1. About Our Services</h2>
            <p>CR Home Pros is a trade name of C &amp; R General Services Inc, a licensed home improvement contractor operating in the District of Columbia, Maryland, and Virginia (DMV) area. We hold Maryland Home Improvement Commission licenses #05-132359 and #109350.</p>
            <p>Our website provides information about our services, allows you to request estimates, submit reviews, and refer others to our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">2. Estimates and Pricing</h2>
            <p>All estimates provided through our website, cost estimator tool, or pricing guide are approximate ranges based on typical project scopes. Actual project costs depend on specific conditions, materials selected, project complexity, and other factors that can only be determined through an in-person consultation.</p>
            <p>Online estimates are not binding quotes. A formal written estimate will be provided after an on-site assessment. Final pricing is agreed upon in a separate contract before work begins.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">3. Project Agreements</h2>
            <p>All home improvement projects are governed by a separate written contract between C &amp; R General Services Inc and the homeowner. That contract outlines the specific scope of work, materials, timeline, payment schedule, and warranty terms. The terms on this website do not replace or modify any project contract.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">4. Reviews and User Content</h2>
            <p>Reviews submitted through our website are subject to moderation. We reserve the right to not publish reviews that contain inappropriate language, false information, or content unrelated to our services. Published reviews may be displayed on our website and marketing materials.</p>
            <p>By submitting a review, you confirm that your experience is genuine and that you give us permission to display your review with your first name and general location.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">5. Referral Program</h2>
            <p>Our referral program rewards existing customers who refer new clients. Referral rewards are paid after the referred project is completed and paid in full. Specific reward amounts and payment methods are outlined on our referrals page. CR Home Pros reserves the right to modify or discontinue the referral program at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">6. Financing</h2>
            <p>Financing options mentioned on our website, including Klarna buy-now-pay-later, are provided by third-party financial services. Approval, terms, and conditions are determined by those providers. CR Home Pros does not guarantee financing approval.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">7. Insurance Claims</h2>
            <p>We work with homeowners and their insurance companies to facilitate home improvement projects covered by insurance claims. We are not an insurance company and do not make coverage determinations. The homeowner is ultimately responsible for communication with their insurer and any deductibles or uncovered costs.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">8. Website Use</h2>
            <p>This website is provided for informational purposes. We make reasonable efforts to keep information accurate and up to date, but we do not guarantee that all content is current or error-free. Photos on our website depict actual completed projects unless otherwise noted.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">9. Limitation of Liability</h2>
            <p>CR Home Pros is not liable for any damages arising from your use of this website. Our liability for any home improvement project is governed by the terms of the applicable project contract and applicable Maryland, Virginia, or DC law.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">10. Contact</h2>
            <p>For questions about these terms, contact us at:</p>
            <p>
              <strong>C &amp; R General Services Inc (CR Home Pros)</strong><br />
              Email: {COMPANY.email}<br />
              Phone: {COMPANY.phoneFormatted}<br />
              Location: Hyattsville, MD
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
