import { Metadata } from 'next'
import { COMPANY } from '@/lib/constants'

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (params?.locale === 'es') {
    return {
      title: 'Política de Privacidad',
      description: 'Política de privacidad de CR Home Pros. Cómo recopilamos, usamos y protegemos su información personal.',
    }
  }
  return {
    title: 'Privacy Policy',
    description: 'CR Home Pros privacy policy. How we collect, use, and protect your personal information.',
  }
}

function PrivacyPolicyEs() {
  return (
    <div className="page-top pb-20">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-2">Política de Privacidad</h1>
        <p className="text-dark-600 mb-10">Última actualización: 12 de febrero de 2026</p>

        <div className="prose prose-lg max-w-none text-dark-700 space-y-8">
          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">1. Información que Recopilamos</h2>
            <p>Cuando usted utiliza nuestro sitio web, se comunica con nosotros o solicita un presupuesto, podemos recopilar la siguiente información:</p>
            <p><strong>Información de Contacto:</strong> Nombre, dirección de correo electrónico, número de teléfono y dirección postal que usted proporciona al completar formularios, solicitar presupuestos o comunicarse con nosotros.</p>
            <p><strong>Información del Proyecto:</strong> Detalles sobre su proyecto de mejoras del hogar, incluidos el tipo de servicio, el rango de presupuesto, el cronograma y la descripción del proyecto.</p>
            <p><strong>Datos de Uso:</strong> Utilizamos Google Analytics para recopilar datos anonimizados sobre cómo los visitantes interactúan con nuestro sitio web, incluidas las páginas visitadas, el tiempo de permanencia y la información del dispositivo. Estos datos no lo identifican a usted personalmente.</p>
            <p><strong>Fotos:</strong> Si usted envía fotos de proyectos a través de nuestros formularios o herramientas de administración, esas imágenes se almacenan de forma segura en Firebase Storage.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">2. Cómo Usamos su Información</h2>
            <p>Utilizamos la información que recopilamos para:</p>
            <p>Responder a sus consultas y proporcionar presupuestos para proyectos de mejoras del hogar. Programar consultas y coordinar los detalles del proyecto. Enviar actualizaciones del proyecto y comunicarnos sobre los trabajos en curso. Mejorar nuestro sitio web y nuestros servicios según la forma en que los visitantes usan el sitio. Procesar las recompensas de nuestro programa de referidos.</p>
            <p>No vendemos, alquilamos ni compartimos su información personal con terceros con fines de marketing.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">3. Almacenamiento y Seguridad de los Datos</h2>
            <p>Su información se almacena de forma segura mediante los servicios de Google Firebase (base de datos Firestore y Firebase Storage). Implementamos medidas de seguridad estándar de la industria para proteger sus datos, incluidas conexiones cifradas (HTTPS), autenticación segura para el acceso administrativo y controles de acceso sobre los datos almacenados.</p>
            <p>Aunque tomamos precauciones razonables para proteger su información, ningún método de transmisión por internet es completamente seguro.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">4. Servicios de Terceros</h2>
            <p>Nuestro sitio web utiliza los siguientes servicios de terceros:</p>
            <p><strong>Google Firebase:</strong> Para almacenamiento de datos, alojamiento de imágenes y análisis. Sujeto a la política de privacidad de Google.</p>
            <p><strong>Google Analytics:</strong> Para estadísticas anónimas de uso del sitio web.</p>
            <p><strong>Vercel:</strong> Para el alojamiento del sitio web. Sujeto a la política de privacidad de Vercel.</p>
            <p><strong>Klarna:</strong> Si usted elige la opción de compre ahora y pague después. Sujeto a la política de privacidad de Klarna.</p>
            <p>No nos integramos con redes publicitarias ni vendemos datos a anunciantes.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">5. Cookies</h2>
            <p>Nuestro sitio web utiliza cookies esenciales para su funcionamiento básico y cookies de análisis a través de Google Analytics. Usted puede desactivar las cookies en la configuración de su navegador, aunque esto puede afectar algunas funciones del sitio web.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">6. Sus Derechos</h2>
            <p>Usted tiene derecho a solicitar acceso a la información personal que tenemos sobre usted, solicitar la corrección de información inexacta, solicitar la eliminación de su información y optar por no recibir ninguna comunicación de nuestra parte. Para ejercer estos derechos, comuníquese con nosotros en {COMPANY.email} o llame al {COMPANY.phoneFormatted}.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">7. Privacidad de los Menores</h2>
            <p>Nuestro sitio web no está dirigido a menores de 13 años. No recopilamos a sabiendas información personal de menores.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">8. Cambios a esta Política</h2>
            <p>Podemos actualizar esta política de privacidad periódicamente. Los cambios se publicarán en esta página con una fecha de revisión actualizada.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">9. Contáctenos</h2>
            <p>Si tiene preguntas sobre esta política de privacidad, comuníquese con nosotros en:</p>
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

export default function PrivacyPolicyPage({ params }: { params: { locale: string } }) {
  if (params?.locale === 'es') return <PrivacyPolicyEs />
  return (
    <div className="page-top pb-20">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-2">Privacy Policy</h1>
        <p className="text-dark-600 mb-10">Last updated: February 12, 2026</p>

        <div className="prose prose-lg max-w-none text-dark-700 space-y-8">
          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">1. Information We Collect</h2>
            <p>When you use our website, contact us, or request a quote, we may collect the following information:</p>
            <p><strong>Contact Information:</strong> Name, email address, phone number, and mailing address that you provide when filling out forms, requesting estimates, or contacting us.</p>
            <p><strong>Project Information:</strong> Details about your home improvement project, including service type, budget range, timeline, and project description.</p>
            <p><strong>Usage Data:</strong> We use Google Analytics to collect anonymized data about how visitors interact with our website, including pages visited, time spent, and device information. This data does not personally identify you.</p>
            <p><strong>Photos:</strong> If you submit project photos through our forms or admin tools, those images are stored securely on Firebase Storage.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <p>Respond to your inquiries and provide estimates for home improvement projects. Schedule consultations and coordinate project details. Send project updates and communicate about ongoing work. Improve our website and services based on how visitors use the site. Process referral rewards for our referral program.</p>
            <p>We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">3. Data Storage and Security</h2>
            <p>Your information is stored securely using Google Firebase services (Firestore database and Firebase Storage). We implement industry-standard security measures to protect your data, including encrypted connections (HTTPS), secure authentication for admin access, and access controls on stored data.</p>
            <p>While we take reasonable precautions to protect your information, no method of transmission over the internet is completely secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">4. Third-Party Services</h2>
            <p>Our website uses the following third-party services:</p>
            <p><strong>Google Firebase:</strong> For data storage, image hosting, and analytics. Subject to Google&apos;s privacy policy.</p>
            <p><strong>Google Analytics:</strong> For anonymous website usage statistics.</p>
            <p><strong>Vercel:</strong> For website hosting. Subject to Vercel&apos;s privacy policy.</p>
            <p><strong>Klarna:</strong> If you choose the buy-now-pay-later option. Subject to Klarna&apos;s privacy policy.</p>
            <p>We do not integrate with advertising networks or sell data to advertisers.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">5. Cookies</h2>
            <p>Our website uses essential cookies for basic functionality and analytics cookies through Google Analytics. You can disable cookies in your browser settings, though this may affect some website features.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">6. Your Rights</h2>
            <p>You have the right to request access to the personal information we hold about you, request correction of inaccurate information, request deletion of your information, and opt out of any communications from us. To exercise these rights, contact us at {COMPANY.email} or call {COMPANY.phoneFormatted}.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">7. Children&apos;s Privacy</h2>
            <p>Our website is not directed to children under 13. We do not knowingly collect personal information from children.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">8. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-dark-900 mt-8 mb-3">9. Contact Us</h2>
            <p>If you have questions about this privacy policy, contact us at:</p>
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
