import Link from "next/link"

import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { CtaStrip } from "@/components/marketing/cta-strip"
import { FaqSection } from "@/components/marketing/faq-section"
import { FeaturedPsychologistsSection } from "@/components/marketing/featured-psychologists-section"
import { HeroSection } from "@/components/marketing/hero-section"
import { HomeCareJourneyStepsSection } from "@/components/marketing/home-care-journey-steps-section"
import { HomeCertificationStrip } from "@/components/marketing/home-certification-strip"
import { HomeHowItWorksSection } from "@/components/marketing/home-how-it-works-section"
import { HomeServicesGrid } from "@/components/marketing/home-services-grid"
import { HomeTrustStrip } from "@/components/marketing/home-trust-strip"
import { HomepageObserver } from "@/components/marketing/homepage-observer"
import { HomepageSectionObserver } from "@/components/marketing/homepage-section-observer"
import { ScrollSection } from "@/components/marketing/scroll-section"
import { TestimonialsSection } from "@/components/marketing/testimonials-section"
import { WhyChooseUsSection } from "@/components/marketing/why-choose-us-section"
import { homepageContent, homepageFeaturedClinicians } from "@/content/homepage"
import { homeMetadata } from "@/content/marketing-metadata"

export const metadata = homeMetadata

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HomepageObserver />
      <HomepageSectionObserver />
      <PublicHeader />
      <main>
        <HeroSection {...homepageContent.hero} />
        <HomeCertificationStrip items={homepageContent.certificationBadges} />
        <HomeTrustStrip items={homepageContent.trustBar} />
        <ScrollSection variant="process">
          <HomeCareJourneyStepsSection {...homepageContent.careJourneySteps} />
        </ScrollSection>
        <ScrollSection variant="process">
          <HomeHowItWorksSection {...homepageContent.howItWorks} />
        </ScrollSection>
        <ScrollSection variant="cards">
          <HomeServicesGrid {...homepageContent.services} />
        </ScrollSection>
        <ScrollSection variant="cards">
          <FeaturedPsychologistsSection
            {...homepageContent.featuredPsychologists}
            clinicians={homepageFeaturedClinicians}
          />
        </ScrollSection>
        <ScrollSection variant="split">
          <WhyChooseUsSection {...homepageContent.whyChooseUs} />
        </ScrollSection>
        <ScrollSection variant="cards">
          <TestimonialsSection {...homepageContent.testimonials} />
        </ScrollSection>
        <ScrollSection variant="faq">
          <FaqSection title={homepageContent.faq.title} items={homepageContent.faq.items} />
        </ScrollSection>
        <ScrollSection variant="rise-scale">
          <CtaStrip {...homepageContent.ctaStrip} />
        </ScrollSection>
      </main>
      <PublicFooter />
    </div>
  )
}
