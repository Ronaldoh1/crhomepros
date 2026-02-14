import { Metadata } from 'next'
import { COMPANY } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'CR Home Pros privacy policy. How we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-2">Privacy Policy</h1>
        <p className="text-dark-400 mb-10">Last updated: February 12, 2026</p>

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
