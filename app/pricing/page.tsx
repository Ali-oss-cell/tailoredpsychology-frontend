import { Clock, CurrencyCircleDollar } from "@phosphor-icons/react/dist/ssr"

import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { PublicPageEnter } from "@/components/layout/public-page-enter"
import { PublicMarketingAmbient } from "@/components/marketing/public-marketing-ambient"
import { CtaStrip } from "@/components/marketing/cta-strip"
import { FaqSection } from "@/components/marketing/faq-section"
import { PageHero } from "@/components/marketing/page-hero"
import { PricingRelatedStrip } from "@/components/marketing/pricing-related-strip"
import { publicPricing } from "@/content/public-pricing"
import { pricingCta, pricingFaq, pricingHero } from "@/content/pages/pricing-public"
import { cn } from "@/lib/utils"

function formatAud(value: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(value)
}

export default function PricingPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicHeader />
      <main className="relative overflow-x-hidden">
        <PublicMarketingAmbient />
        <PublicPageEnter className="relative z-[1]">
          <PageHero {...pricingHero} />
          <PageSection>
            <PageContainer className="space-y-8">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">Session fees</h2>
                <p className="text-muted-foreground text-xs">Last updated: {publicPricing.updatedAt}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {publicPricing.items.map((item) => (
                  <article
                    key={item.service}
                    className={cn(
                      "border-border/70 flex flex-col rounded-2xl border bg-card/90 p-5 shadow-sm",
                      "transition duration-300 hover:border-primary/20 hover:shadow-md motion-reduce:transition-none",
                    )}
                  >
                    <div className="text-primary mb-3 flex items-center gap-2">
                      <Clock size={22} weight="duotone" aria-hidden />
                      <span className="text-xs font-semibold uppercase tracking-wide">Session</span>
                    </div>
                    <p className="font-heading text-lg font-semibold leading-snug">{item.service}</p>
                    <p className="text-primary mt-2 text-xl font-semibold tabular-nums">{formatAud(item.feeAud)}</p>
                    <p className="text-muted-foreground mt-1 text-sm">{item.durationMins} minutes</p>
                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{item.notes}</p>
                  </article>
                ))}
              </div>
            </PageContainer>
          </PageSection>
          <PageSection muted className="bg-surface-2/55 dark:bg-surface-2/45">
            <PageContainer className="space-y-8">
              <div className="max-w-2xl space-y-2">
                <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">Medicare gap examples</h2>
                <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                  Three illustrative scenarios—your gap depends on your clinician, plan, and Services Australia rules.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {publicPricing.gapExamples.map((example) => (
                  <article
                    key={example.label}
                    className={cn(
                      "border-border/70 rounded-2xl border bg-gradient-to-b from-card to-muted/20 p-5 shadow-sm",
                      "transition duration-300 hover:border-primary/25 hover:shadow-md motion-reduce:transition-none",
                    )}
                  >
                    <div className="text-primary mb-3 flex items-center gap-2">
                      <CurrencyCircleDollar size={24} weight="duotone" aria-hidden />
                    </div>
                    <p className="font-heading text-base font-semibold leading-snug">{example.label}</p>
                    <dl className="text-muted-foreground mt-4 space-y-1.5 text-sm">
                      <div className="flex justify-between gap-2">
                        <dt>Session fee</dt>
                        <dd className="tabular-nums text-foreground">{formatAud(example.sessionFeeAud)}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt>Est. rebate</dt>
                        <dd className="tabular-nums text-foreground">{formatAud(example.medicareRebateAud)}</dd>
                      </div>
                      <div className="border-border/60 flex justify-between gap-2 border-t pt-2 font-medium text-foreground">
                        <dt>Est. gap</dt>
                        <dd className="text-primary tabular-nums">{formatAud(example.estimatedGapAud)}</dd>
                      </div>
                    </dl>
                    <p className="text-muted-foreground mt-3 text-xs leading-relaxed">{example.assumptions}</p>
                  </article>
                ))}
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">{publicPricing.medicareDisclaimer}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{publicPricing.assumptions}</p>
            </PageContainer>
          </PageSection>
          <PricingRelatedStrip />
          <CtaStrip {...pricingCta} />
          <FaqSection title={pricingFaq.title} items={pricingFaq.items} />
        </PublicPageEnter>
      </main>
      <PublicFooter />
    </div>
  )
}
