import Link from "next/link"

import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicPageEnter } from "@/components/layout/public-page-enter"
import { PublicMarketingAmbient } from "@/components/marketing/public-marketing-ambient"
import { CtaStrip } from "@/components/marketing/cta-strip"
import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import { conditionPages } from "@/content/conditions"
import { cn } from "@/lib/utils"

export default function ConditionsIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="relative overflow-x-hidden">
        <PublicMarketingAmbient />
        <PublicPageEnter className="relative z-[1] mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 md:px-6">
        <section className="space-y-3">
          <p className="card-eyebrow">Conditions</p>
          <h1 className="font-heading text-3xl font-semibold md:text-4xl">Condition-specific support pathways</h1>
          <p className="text-muted-foreground">
            Explore care pathways and start intake with the context that matters to your goals.
          </p>
        </section>
        <section className="grid gap-3 md:grid-cols-2">
            {conditionPages.map((item) => (
              <article
                key={item.slug}
                className={cn(
                  "rounded-md border border-border/70 bg-card p-4 shadow-e1 transition-colors",
                  "hover:border-primary/30",
                )}
              >
                <h2 className="font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
                <Link href={`/conditions/${item.slug}`} className="mt-3 inline-block text-sm font-medium text-primary">
                  View pathway
                </Link>
              </article>
            ))}
          </section>
        <ScrollReveal delayMs={60}>
          <CtaStrip
            title="Not sure which pathway fits?"
            description="Take the match quiz or book a consultation — we will help you choose the right next step."
            primaryHref="/get-matched"
            primaryLabel="Get matched"
            secondaryHref="/contact"
            secondaryLabel="Contact us"
          />
        </ScrollReveal>
        </PublicPageEnter>
      </main>
      <PublicFooter />
    </div>
  )
}
