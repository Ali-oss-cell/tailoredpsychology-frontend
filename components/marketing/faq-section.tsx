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
    <PageSection id="faq" className="scroll-mt-24 bg-marketing-canvas">
      <PageContainer className="space-y-10">
        <div className="max-w-2xl space-y-3">
          <h2 className="marketing-h2 text-balance">{title}</h2>
          <p className="marketing-small">
            Tap a question to expand the answer — everything here is general guidance, not personal
            medical advice.
          </p>
        </div>
        <div
          className="mx-auto max-w-3xl space-y-3"
          role="region"
          aria-label="Frequently asked questions"
        >
          {items.map((item) => (
            <details
              key={item.question}
              className="marketing-card group open:border-primary/20 open:shadow-e2"
            >
              <summary
                className={cn(
                  "flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5",
                  "[&::-webkit-details-marker]:hidden",
                )}
                aria-expanded={undefined}
              >
                <span className="marketing-body text-base font-medium md:text-lg">{item.question}</span>
                <CaretDown
                  className="text-muted-foreground shrink-0 transition-transform duration-200 group-open:rotate-180"
                  size={20}
                  aria-hidden
                />
              </summary>
              <div className="text-muted-foreground border-border/60 border-t px-5 pb-5 md:px-6 md:pb-6">
                <p className="marketing-small pt-4">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </PageContainer>
    </PageSection>
  )
}
