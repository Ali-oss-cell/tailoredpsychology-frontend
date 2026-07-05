import Link from "next/link"
import { notFound } from "next/navigation"

import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicPageEnter } from "@/components/layout/public-page-enter"
import { PublicMarketingAmbient } from "@/components/marketing/public-marketing-ambient"
import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import { PublicCtaLink } from "@/components/public/public-cta-link"
import { getConditionBySlug } from "@/content/conditions"
import { cn } from "@/lib/utils"

type ConditionPageProps = {
  params: Promise<{ slug: string }>
}

export default async function ConditionPage({ params }: ConditionPageProps) {
  const { slug } = await params
  const content = getConditionBySlug(slug)
  if (!content) {
    notFound()
  }

  const bookingHref = `/appointments/book-appointment?source=condition&condition=${encodeURIComponent(content.slug)}`
  const matchedHref = `/get-matched?source=condition&condition=${encodeURIComponent(content.slug)}`

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="relative overflow-x-hidden">
        <PublicMarketingAmbient />
        <PublicPageEnter className="relative z-[1] mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 md:px-6">
          <Link href="/conditions" className="text-primary text-sm font-medium hover:underline">
            ← All condition pathways
          </Link>
          <section className="space-y-3">
            <p className="card-eyebrow">Condition pathway</p>
            <h1 className="font-heading text-3xl font-semibold md:text-4xl">{content.title}</h1>
            <p className="text-muted-foreground text-base leading-relaxed">{content.summary}</p>
          </section>

          <ScrollReveal>
            <section
              className={cn(
                "interactive-lift rounded-2xl border border-border/70 bg-card p-5 shadow-e1 md:p-6",
              )}
            >
              <h2 className="text-lg font-semibold">When to seek support</h2>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {content.whenToSeekSupport.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </ScrollReveal>

          <ScrollReveal delayMs={40}>
            <section className="interactive-lift rounded-2xl border border-border/70 bg-card p-5 shadow-e1 md:p-6">
              <h2 className="text-lg font-semibold">How Tailored Psychology supports this pathway</h2>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {content.tailoredApproach.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </ScrollReveal>

          <ScrollReveal delayMs={60}>
            <section className="interactive-lift rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 shadow-e1 md:p-6">
              <h2 className="text-lg font-semibold">Next step</h2>
              <p className="mt-2 text-sm text-muted-foreground">{content.nextStep}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <PublicCtaLink
                  href={matchedHref}
                  label="Get matched"
                  eventName="condition_cta_click"
                  metadata={{ condition: content.slug, target: "get-matched" }}
                  className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                />
                <PublicCtaLink
                  href={bookingHref}
                  label="Start booking"
                  eventName="condition_cta_click"
                  metadata={{ condition: content.slug, target: "book-appointment" }}
                  className="inline-flex rounded-md border border-border px-4 py-2 text-sm font-medium"
                />
              </div>
            </section>
          </ScrollReveal>
        </PublicPageEnter>
      </main>
      <PublicFooter />
    </div>
  )
}
