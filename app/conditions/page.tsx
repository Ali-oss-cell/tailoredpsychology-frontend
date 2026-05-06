import Link from "next/link"

import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicPageEnter } from "@/components/layout/public-page-enter"
import { conditionPages } from "@/content/conditions"

export default function ConditionsIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 md:px-6">
        <PublicPageEnter className="flex flex-col gap-8">
        <section className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Conditions</p>
          <h1 className="text-3xl font-semibold md:text-4xl">Condition-specific support pathways</h1>
          <p className="text-muted-foreground">
            Explore care pathways and start intake with the context that matters to your goals.
          </p>
        </section>
        <section className="grid gap-3 md:grid-cols-2">
          {conditionPages.map((item) => (
            <article key={item.slug} className="rounded-md border border-border/70 p-4">
              <h2 className="font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
              <Link href={`/conditions/${item.slug}`} className="mt-3 inline-block text-sm font-medium text-primary">
                View pathway
              </Link>
            </article>
          ))}
        </section>
        </PublicPageEnter>
      </main>
      <PublicFooter />
    </div>
  )
}
