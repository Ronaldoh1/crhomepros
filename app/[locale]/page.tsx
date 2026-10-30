import {
  HomeHero,
  TrustStrip,
  ServiceCards,
  ProjectCards,
  BeforeAfterShowcase,
  HowItWorks,
  ReviewCards,
  ServiceAreas,
  ClosingCTA,
} from '@/components/home/HomeSections'
import { FAQSection } from '@/components/sections/FAQSection'

// Homepage order follows the website spec §7:
// hero → trust → services → projects → before/after → how it works →
// reviews → service areas → FAQ → closing CTA (footer comes from the layout)
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <TrustStrip />
      <ServiceCards />
      <ProjectCards />
      <BeforeAfterShowcase />
      <HowItWorks />
      <ReviewCards />
      <ServiceAreas />
      <FAQSection id="faq" limit={6} tinted />
      <ClosingCTA />
    </>
  )
}
