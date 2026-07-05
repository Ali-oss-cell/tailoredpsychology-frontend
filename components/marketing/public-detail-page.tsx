import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicPageEnter } from "@/components/layout/public-page-enter"
import { PublicMarketingAmbient } from "@/components/marketing/public-marketing-ambient"
import { CtaStrip } from "@/components/marketing/cta-strip"
import { FaqSection } from "@/components/marketing/faq-section"
import { ListSection } from "@/components/marketing/list-section"
import { PageHero } from "@/components/marketing/page-hero"
import { BrandMarkBand } from "@/components/marketing/brand-mark-band"
import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import { SplitFeatureSection } from "@/components/marketing/split-feature-section"
import type { PublicDetailPageContent } from "@/content/pages/types"
import type { ReactNode } from "react"

const defaultCta = {
  title: "Ready to take the next step?",
  description: "Book a consultation or speak with our team to choose the best pathway.",
  primaryHref: "/get-matched",
  primaryLabel: "Get Matched",
  secondaryHref: "/contact",
  secondaryLabel: "Contact Us",
} as const

type PublicDetailPageProps = {
  content: PublicDetailPageContent
  afterHeroSlot?: ReactNode
}

export function PublicDetailPage({ content, afterHeroSlot }: PublicDetailPageProps) {
  const cta = content.cta ?? defaultCta

  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicHeader />
      <main className="relative overflow-x-hidden">
        <PublicMarketingAmbient />
        <PublicPageEnter className="relative z-[1]">
        <PageHero
          eyebrow={content.hero.eyebrow}
          title={content.hero.title}
          description={content.hero.description}
          kicker={content.hero.kicker}
          actions={content.hero.actions}
        />
        {afterHeroSlot}
        <ScrollReveal delayMs={40}>
          <SplitFeatureSection {...content.split} />
        </ScrollReveal>
        <ScrollReveal delayMs={60}>
          <ListSection
            title={content.highlights.title}
            items={content.highlights.items}
            muted={content.highlights.muted}
          />
        </ScrollReveal>
        {content.brandBand ? (
          <ScrollReveal delayMs={80}>
            <BrandMarkBand
              title={content.brandBand.title}
              body={content.brandBand.body}
              imageSrc={content.brandBand.imageSrc}
              imageAlt={content.brandBand.imageAlt}
              layout={content.brandBand.layout}
            />
          </ScrollReveal>
        ) : null}
        <ScrollReveal>
          <FaqSection title={content.faq.title} items={content.faq.items} />
        </ScrollReveal>
        <ScrollReveal delayMs={40}>
          <CtaStrip {...cta} />
        </ScrollReveal>
        </PublicPageEnter>
      </main>
      <PublicFooter />
    </div>
  )
}
