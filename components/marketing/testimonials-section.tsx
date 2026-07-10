import { Quotes } from "@phosphor-icons/react/dist/ssr"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import type { HomeTestimonial } from "@/content/homepage"

type TestimonialsSectionProps = {
  title: string
  description: string
  disclaimer: string
  items: HomeTestimonial[]
}

export function TestimonialsSection({
  title,
  description,
  disclaimer,
  items,
}: TestimonialsSectionProps) {
  return (
    <PageSection id="testimonials" className="scroll-mt-24">
      <PageContainer className="space-y-10">
        <div className="max-w-2xl space-y-3">
          <h2 className="marketing-h2 text-balance">{title}</h2>
          <p className="marketing-body text-muted-foreground">{description}</p>
          <p className="marketing-small italic">{disclaimer}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <figure key={item.name + item.context} className="marketing-card interactive-lift flex h-full flex-col p-6 md:p-7">
              <Quotes
                className="text-primary/70 mb-4"
                size={28}
                weight="duotone"
                aria-hidden
              />
              <blockquote className="marketing-body text-foreground flex-1 text-balance">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="border-border/60 mt-5 border-t pt-4">
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground text-sm">{item.context}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </PageContainer>
    </PageSection>
  )
}
