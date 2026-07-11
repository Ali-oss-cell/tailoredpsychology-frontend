import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { Button } from "@/components/ui/button"
import type { HomeServiceCard } from "@/content/homepage"
import { cn } from "@/lib/utils"

type HomeServicesGridProps = {
  title: string
  description: string
  items: HomeServiceCard[]
}

/** Bento-style asymmetric grid (Stitch spec): first item as a large feature tile, rest as compact tiles. */
export function HomeServicesGrid({ title, description, items }: HomeServicesGridProps) {
  const [featured, ...rest] = items

  return (
    <PageSection id="services" className="scroll-mt-24 py-10 md:py-14 lg:py-16">
      <PageContainer className="space-y-6 md:space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-3 md:gap-4">
          <div className="max-w-2xl space-y-2 md:space-y-3">
            <h2 className="marketing-h2 text-balance">{title}</h2>
            <p className="marketing-body text-muted-foreground">{description}</p>
          </div>
          <Button asChild variant="link" className="h-auto shrink-0 p-0 text-base">
            <Link href="/conditions" className="inline-flex items-center gap-2 font-medium">
              View all services <ArrowRight size={16} aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-4">
          {featured ? (
            <article className="marketing-card group relative flex flex-col justify-end overflow-hidden p-4 sm:p-5 xl:col-span-1 xl:row-span-2 xl:min-h-0">
              <div
                aria-hidden
                className="from-primary/12 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent"
              />
              <div className="relative space-y-2">
                <h3 className="marketing-h3 text-balance">{featured.title}</h3>
                <p className="marketing-small line-clamp-3 max-w-sm leading-snug xl:line-clamp-4">
                  {featured.description}
                </p>
                <Link
                  href={`/conditions/${featured.slug}`}
                  className="text-primary-strong inline-flex items-center gap-2 text-sm font-semibold underline-offset-2 group-hover:underline"
                >
                  Learn more <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </article>
          ) : null}
          {rest.map((service, index) => {
            const isAccent = index === rest.length - 1 && rest.length % 2 === 1
            return (
              <article
                key={service.slug}
                className={cn(
                  "flex h-full flex-col rounded-2xl p-4 sm:p-5 shadow-e1",
                  isAccent
                    ? "bg-primary-strong text-primary-strong-foreground xl:col-span-2"
                    : "marketing-card",
                )}
              >
                <h3
                  className={cn(
                    "marketing-h3 mb-1.5 text-balance",
                    isAccent && "text-primary-strong-foreground",
                  )}
                >
                  {service.title}
                </h3>
                <p className="marketing-small mb-3 flex-1 line-clamp-2 leading-snug sm:line-clamp-3">
                  {service.description}
                </p>
                <Link
                  href={`/conditions/${service.slug}`}
                  className={cn(
                    "inline-flex items-center gap-2 text-sm font-semibold underline-offset-2 hover:underline",
                    isAccent ? "text-primary-strong-foreground" : "text-primary-strong",
                  )}
                >
                  Learn more <ArrowRight size={16} aria-hidden />
                </Link>
              </article>
            )
          })}
        </div>
      </PageContainer>
    </PageSection>
  )
}
