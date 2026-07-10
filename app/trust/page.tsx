import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicPageEnter } from "@/components/layout/public-page-enter"
import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import { PublicMarketingAmbient } from "@/components/marketing/public-marketing-ambient"
import { CtaStrip } from "@/components/marketing/cta-strip"
import { PageHero } from "@/components/marketing/page-hero"
import { TrustMetricsSection, TrustPrivacySection } from "@/components/marketing/trust-metrics-section"
import { privacyControls, publicTrustMetrics } from "@/content/public-trust-metrics"
import { trustCta, trustHero } from "@/content/pages/trust-public"
import { trustMetadata } from "@/content/marketing-metadata"

export const metadata = trustMetadata

export default function TrustPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicHeader />
      <main className="relative overflow-x-hidden">
        <PublicMarketingAmbient />
        <PublicPageEnter className="relative z-[1]">
          <PageHero {...trustHero} />
          <ScrollReveal>
          <TrustMetricsSection metrics={publicTrustMetrics} />
          </ScrollReveal>
          <ScrollReveal delayMs={40}>
          <TrustPrivacySection items={privacyControls} />
          </ScrollReveal>
          <ScrollReveal>
          <CtaStrip {...trustCta} />
          </ScrollReveal>
        </PublicPageEnter>
      </main>
      <PublicFooter />
    </div>
  )
}
