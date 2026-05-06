import { CaretDown } from "@phosphor-icons/react/dist/ssr"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { cn } from "@/lib/utils"

type FaqItem = {
  question: string
  answer: string
}

type FaqSectionProps = {
  title: string
  items: FaqItem[]
}

export function FaqSection({ title, items }: FaqSectionProps) {
  return (
    <PageSection>
      <PageContainer className="space-y-8">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance md:text-3xl">{title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            Tap a question to expand the answer — everything here is general guidance, not personal medical advice.
          </p>
        </div>
        <div className="mx-auto max-w-3xl space-y-3">
          {items.map((item) => (
            <details
              key={item.question}
              className="group border-border/70 bg-card open:ring-primary/8 rounded-xl border shadow-sm open:shadow-md open:ring-2"
            >
              <summary
                className={cn(
                  "flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 text-left text-base font-medium md:px-5 md:py-4",
                  "[&::-webkit-details-marker]:hidden",
                )}
              >
                <span className="pr-2">{item.question}</span>
                <CaretDown
                  className="text-muted-foreground shrink-0 transition-transform duration-200 group-open:rotate-180"
                  size={20}
                  aria-hidden
                />
              </summary>
              <div className="text-muted-foreground border-border/60 border-t px-4 pb-4 pt-0 text-sm leading-relaxed md:px-5 md:pb-5">
                <p className="pt-3">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </PageContainer>
    </PageSection>
  )
}
