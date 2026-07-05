import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { CtaStrip } from "@/components/marketing/cta-strip"
import { FaqSection } from "@/components/marketing/faq-section"
import { HeroSection } from "@/components/marketing/hero-section"
import { HomeClinicTeamBand } from "@/components/marketing/home-clinic-team-band"
import { HomeMomentsRow } from "@/components/marketing/home-moments-row"
import { HomeProcessSection } from "@/components/marketing/home-process-section"
import { HomepageObserver } from "@/components/marketing/homepage-observer"
import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import { ServicesPreview } from "@/components/marketing/services-preview"
import { SplitFeatureSection } from "@/components/marketing/split-feature-section"
import { TelehealthRebatesBand } from "@/components/marketing/telehealth-rebates-band"
import { TrustStats } from "@/components/marketing/trust-stats"
import { homepageContent } from "@/content/homepage"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HomepageObserver />
      <PublicHeader />
      <main>
        <HeroSection {...homepageContent.hero} />
        <ScrollReveal>
          <TrustStats stats={homepageContent.trustStats} />
        </ScrollReveal>
        <ScrollReveal delayMs={60}>
          <SplitFeatureSection {...homepageContent.wellbeingIntro} />
        </ScrollReveal>
        <ScrollReveal delayMs={80}>
          <SplitFeatureSection {...homepageContent.guidedCare} />
        </ScrollReveal>
        <ScrollReveal>
          <ServicesPreview
            title={homepageContent.servicesPreview.title}
            description={homepageContent.servicesPreview.description}
            services={homepageContent.servicesPreview.items}
          />
        </ScrollReveal>
        <ScrollReveal>
          <SplitFeatureSection {...homepageContent.trustConnection} />
        </ScrollReveal>
        <ScrollReveal>
          <HomeProcessSection {...homepageContent.carePath} />
        </ScrollReveal>
        <ScrollReveal>
          <TelehealthRebatesBand
            title={homepageContent.telehealthBand.title}
            description={homepageContent.telehealthBand.description}
            items={homepageContent.telehealthBand.items}
          />
        </ScrollReveal>
        <ScrollReveal>
          <SplitFeatureSection {...homepageContent.teamSnapshot} />
        </ScrollReveal>
        <ScrollReveal>
          <HomeMomentsRow
            title={homepageContent.moments.title}
            description={homepageContent.moments.description}
            moments={homepageContent.moments.items}
          />
        </ScrollReveal>
        <ScrollReveal>
          <HomeClinicTeamBand {...homepageContent.clinicalBand} />
        </ScrollReveal>
        <ScrollReveal>
          <FaqSection title={homepageContent.faq.title} items={homepageContent.faq.items} />
        </ScrollReveal>
        <ScrollReveal>
          <CtaStrip {...homepageContent.ctaStrip} />
        </ScrollReveal>
      </main>
      <PublicFooter />
    </div>
  )
}
