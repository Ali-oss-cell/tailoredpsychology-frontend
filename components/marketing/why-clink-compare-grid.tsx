import { CheckCircle, MinusCircle } from "@phosphor-icons/react/dist/ssr"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { cn } from "@/lib/utils"

export type WhyClinkCompareItem = {
  heading: string
  brand: string
  standard: string
}

type WhyClinkCompareGridProps = {
  items: WhyClinkCompareItem[]
}

export function WhyClinkCompareGrid({ items }: WhyClinkCompareGridProps) {
  return (
    <PageSection className="bg-surface-2/35 dark:bg-surface-2/25">
      <PageContainer className="space-y-8">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance md:text-3xl">
            Capability comparison
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            Each row contrasts how Tailored Psychology is designed to operate versus common limitations in category-level telehealth
            offerings—hover a card on desktop to lift the frame slightly.
          </p>
        </div>
        <div className="grid gap-4 md:gap-5">
          {items.map((item) => (
            <article
              key={item.heading}
              className={cn(
                "border-border/70 from-card to-card/80 group rounded-2xl border bg-gradient-to-br p-4 shadow-sm",
                "transition duration-300 ease-out md:p-5",
                "hover:border-primary/25 hover:shadow-md motion-reduce:transition-none",
              )}
            >
              <h3 className="font-heading text-lg font-semibold tracking-tight">{item.heading}</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
                <div className="border-primary/15 bg-primary/[0.06] flex gap-3 rounded-xl border p-3 md:p-4">
                  <span className="text-primary mt-0.5 shrink-0">
                    <CheckCircle size={22} weight="duotone" aria-hidden />
                  </span>
                  <div>
                    <p className="text-primary text-xs font-semibold uppercase tracking-wide">Tailored Psychology</p>
                    <p className="text-foreground mt-1 text-sm leading-relaxed">{item.brand}</p>
                  </div>
                </div>
                <div className="bg-muted/50 flex gap-3 rounded-xl border border-border/60 p-3 md:p-4">
                  <span className="text-muted-foreground mt-0.5 shrink-0">
                    <MinusCircle size={22} weight="duotone" aria-hidden />
                  </span>
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                      Typical category pattern
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{item.standard}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </PageContainer>
    </PageSection>
  )
}
