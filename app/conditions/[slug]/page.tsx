import { notFound } from "next/navigation"

import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicPageEnter } from "@/components/layout/public-page-enter"
import { PublicCtaLink } from "@/components/public/public-cta-link"
import { getConditionBySlug } from "@/content/conditions"

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
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 md:px-6">
        <PublicPageEnter className="flex flex-col gap-8">
        <section className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Condition pathway</p>
          <h1 className="text-3xl font-semibold md:text-4xl">{content.title}</h1>
          <p className="text-muted-foreground">{content.summary}</p>
        </section>

        <section className="rounded-md border border-border/70 p-4">
          <h2 className="text-lg font-semibold">When to seek support</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {content.whenToSeekSupport.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-md border border-border/70 p-4">
          <h2 className="text-lg font-semibold">How Clink supports this pathway</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {content.clinkApproach.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-md border border-border/70 p-4">
          <h2 className="text-lg font-semibold">Next step</h2>
          <p className="mt-2 text-sm text-muted-foreground">{content.nextStep}</p>
          <div className="mt-3 flex flex-wrap gap-3">
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
        </PublicPageEnter>
      </main>
      <PublicFooter />
    </div>
  )
}
