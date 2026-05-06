import { ChartLineUp, ShieldCheck } from "@phosphor-icons/react/dist/ssr"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import type { TrustMetric } from "@/content/public-trust-metrics"

type TrustMetricsSectionProps = {
  metrics: TrustMetric[]
}

export function TrustMetricsSection({ metrics }: TrustMetricsSectionProps) {
  return (
    <PageSection>
      <PageContainer className="space-y-8">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance md:text-3xl">
            Operational trust metrics
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            Snapshot figures for transparency—always read the source line and updated date on each card.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="border-border/70 from-card to-muted/15 group rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition duration-300 hover:border-primary/20 hover:shadow-md motion-reduce:transition-none"
            >
              <div className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <ChartLineUp size={22} weight="duotone" aria-hidden />
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">{metric.label}</p>
                  <p className="text-primary font-heading text-2xl font-semibold tracking-tight md:text-3xl">
                    {metric.value}
                  </p>
                  {metric.caption ? (
                    <p className="text-muted-foreground text-sm leading-relaxed">{metric.caption}</p>
                  ) : null}
                  <p className="text-muted-foreground pt-1 text-xs">Source: {metric.source}</p>
                  <p className="text-muted-foreground text-xs">Updated: {metric.updatedAt}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </PageContainer>
    </PageSection>
  )
}

type TrustPrivacySectionProps = {
  items: string[]
}

export function TrustPrivacySection({ items }: TrustPrivacySectionProps) {
  return (
    <PageSection muted className="bg-surface-2/55 dark:bg-surface-2/45">
      <PageContainer className="space-y-8">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance md:text-3xl">
            Privacy and compliance controls
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            A non-exhaustive list of implemented control themes—your clinician remains responsible for clinical decisions.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="border-border/70 flex gap-3 rounded-xl border bg-card/80 p-4 text-sm leading-relaxed shadow-sm"
            >
              <ShieldCheck className="text-primary mt-0.5 shrink-0" size={22} weight="duotone" aria-hidden />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </PageContainer>
    </PageSection>
  )
}
