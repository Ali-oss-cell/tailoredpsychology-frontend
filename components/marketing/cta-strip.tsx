import Link from "next/link"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { Button } from "@/components/ui/button"

export type CtaStripProps = {
  title: string
  description: string
  primaryHref: string
  primaryLabel: string
  secondaryHref: string
  secondaryLabel: string
}

export function CtaStrip({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: CtaStripProps) {
  return (
    <PageSection className="pb-16 md:pb-24">
      <PageContainer>
        <div className="from-primary/[0.07] relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br via-muted/20 to-background p-6 shadow-sm md:p-10">
          <div
            className="pointer-events-none absolute -right-20 top-0 h-48 w-48 rounded-full bg-primary/[0.06] blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="max-w-2xl space-y-3">
              <h2 className="marketing-h2 text-balance">{title}</h2>
              <p className="marketing-body text-muted-foreground leading-relaxed">{description}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild className="marketing-cta shadow-primary-glow">
                <Link href={primaryHref}>{primaryLabel}</Link>
              </Button>
              <Button asChild variant="outline" className="marketing-cta border-border/80 bg-background/80 backdrop-blur-sm">
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </PageSection>
  )
}
