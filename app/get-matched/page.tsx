import { Suspense } from "react"

import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { PublicPageEnter } from "@/components/layout/public-page-enter"
import { PublicMarketingAmbient } from "@/components/marketing/public-marketing-ambient"
import { CtaStrip } from "@/components/marketing/cta-strip"
import { GetMatchedWizard } from "@/components/marketing/get-matched/get-matched-wizard"
import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import { Badge } from "@/components/ui/badge"
import { getMatchedQuizContent } from "@/content/get-matched-quiz"
import { getMatchedMetadata } from "@/content/marketing-metadata"

export const metadata = getMatchedMetadata

function GetMatchedIntro() {
  const hero = getMatchedQuizContent.hero
  return (
    <PageSection className="border-b border-border/60 py-10 md:py-12">
      <PageContainer>
        <div className="mx-auto max-w-2xl space-y-4 text-center md:text-left">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            {hero.eyebrow}
          </Badge>
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {hero.title} <span className="text-primary">{hero.titleAccent}</span>
          </h1>
          <p className="text-muted-foreground text-lg">{hero.description}</p>
        </div>
      </PageContainer>
    </PageSection>
  )
}

export default function GetMatchedPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="relative overflow-x-hidden">
        <PublicMarketingAmbient />
        <PublicPageEnter className="relative z-[1]">
        <ScrollReveal>
          <GetMatchedIntro />
        </ScrollReveal>
        <Suspense
          fallback={
            <PageContainer className="py-12">
              <p className="text-muted-foreground text-center text-sm">Loading quiz…</p>
            </PageContainer>
          }
        >
          <ScrollReveal delayMs={40}>
            <GetMatchedWizard />
          </ScrollReveal>
        </Suspense>
        <ScrollReveal delayMs={60}>
          <CtaStrip
            title="Prefer to talk through options?"
            description="Contact our team or explore services if you are not ready for the quiz yet."
            primaryHref="/contact"
            primaryLabel="Contact us"
            secondaryHref="/services"
            secondaryLabel="View services"
          />
        </ScrollReveal>
        </PublicPageEnter>
      </main>
      <PublicFooter />
    </div>
  )
}
