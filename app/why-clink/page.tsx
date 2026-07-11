import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { PublicPageEnter } from "@/components/layout/public-page-enter"
import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import { PublicMarketingAmbient } from "@/components/marketing/public-marketing-ambient"
import { CtaStrip } from "@/components/marketing/cta-strip"
import { FaqSection } from "@/components/marketing/faq-section"
import { PageHero } from "@/components/marketing/page-hero"
import { WhyClinkCompareGrid } from "@/components/marketing/why-clink-compare-grid"
import {
  whyClinkComparisons,
  whyClinkCta,
  whyClinkDisclaimer,
  whyClinkFaq,
  whyClinkHero,
} from "@/content/pages/why-clink-public"

export default function WhyClinkPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicHeader />
      <main className="relative overflow-x-clip">
        <PublicMarketingAmbient />
        <PublicPageEnter className="relative z-[1]">
          <PageHero {...whyClinkHero} />
          <ScrollReveal>
          <WhyClinkCompareGrid items={whyClinkComparisons} />
          </ScrollReveal>
          <ScrollReveal delayMs={40}>
          <PageSection className="py-10 md:py-12">
            <PageContainer>
              <p className="text-muted-foreground border-primary/20 bg-primary/[0.04] rounded-2xl border px-4 py-4 text-sm leading-relaxed md:px-6">
                {whyClinkDisclaimer}
              </p>
            </PageContainer>
          </PageSection>
          </ScrollReveal>
          <ScrollReveal>
          <CtaStrip {...whyClinkCta} />
          </ScrollReveal>
          <ScrollReveal delayMs={40}>
          <FaqSection title={whyClinkFaq.title} items={whyClinkFaq.items} />
          </ScrollReveal>
        </PublicPageEnter>
      </main>
      <PublicFooter />
    </div>
  )
}
