import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { CtaStrip } from "@/components/marketing/cta-strip"
import { FaqSection } from "@/components/marketing/faq-section"
import { HeroSection } from "@/components/marketing/hero-section"
import { HomeClinicTeamBand } from "@/components/marketing/home-clinic-team-band"
import { HomeMomentsRow } from "@/components/marketing/home-moments-row"
import { HomeProcessSection } from "@/components/marketing/home-process-section"
import { HomepageObserver } from "@/components/marketing/homepage-observer"
import { ScrollSection } from "@/components/marketing/scroll-section"
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
        <ScrollSection variant="cards">
          <TrustStats stats={homepageContent.trustStats} />
        </ScrollSection>
        <ScrollSection variant="split">
          <SplitFeatureSection {...homepageContent.wellbeingIntro} />
        </ScrollSection>
        <ScrollSection variant="split">
          <SplitFeatureSection {...homepageContent.guidedCare} />
        </ScrollSection>
        <ScrollSection variant="cards">
          <ServicesPreview
            title={homepageContent.servicesPreview.title}
            description={homepageContent.servicesPreview.description}
            services={homepageContent.servicesPreview.items}
          />
        </ScrollSection>
        <ScrollSection variant="split">
          <SplitFeatureSection {...homepageContent.trustConnection} />
        </ScrollSection>
        <ScrollSection variant="process">
          <HomeProcessSection {...homepageContent.carePath} />
        </ScrollSection>
        <ScrollSection variant="band">
          <TelehealthRebatesBand
            title={homepageContent.telehealthBand.title}
            description={homepageContent.telehealthBand.description}
            items={homepageContent.telehealthBand.items}
          />
        </ScrollSection>
        <ScrollSection variant="split">
          <SplitFeatureSection {...homepageContent.teamSnapshot} />
        </ScrollSection>
        <ScrollSection variant="cards">
          <HomeMomentsRow
            title={homepageContent.moments.title}
            description={homepageContent.moments.description}
            moments={homepageContent.moments.items}
          />
        </ScrollSection>
        <ScrollSection variant="rise-scale">
          <HomeClinicTeamBand {...homepageContent.clinicalBand} />
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
