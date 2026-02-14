import { Hero } from '@/components/sections/Hero'
import { ServicesPreview } from '@/components/sections/ServicesPreview'
import { ProjectHighlight } from '@/components/sections/ProjectHighlight'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { MeetCarlos } from '@/components/sections/MeetCarlos'
import { HowWeWork } from '@/components/sections/HowWeWork'
import { Stats } from '@/components/sections/Stats'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { PaymentOptions } from '@/components/sections/PaymentOptions'
import { Testimonials } from '@/components/sections/Testimonials'
import { FAQSection } from '@/components/sections/FAQSection'
import { CallToAction } from '@/components/sections/CallToAction'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesPreview />
      <ProjectHighlight />
      <FeaturedProjects />
      <MeetCarlos />
      <HowWeWork />
      <Stats />
      <WhyChooseUs />
      <PaymentOptions />
      <Testimonials />
      <FAQSection />
      <CallToAction />
    </>
  )
}
