import { Metadata } from 'next'
import { COMPANY } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'CR Home Pros terms of service. Terms and conditions for using our website and services.',
}

export default function TermsPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-2">Terms of Service</h1>
        <p className="text-dark-400 mb-10">Last updated: February 12, 2026</p>

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
