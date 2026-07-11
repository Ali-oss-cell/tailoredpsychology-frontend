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
    <PageSection id="services" className="scroll-mt-24">
      <PageContainer className="space-y-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl space-y-3">
            <h2 className="marketing-h2 text-balance">{title}</h2>
            <p className="marketing-body text-muted-foreground">{description}</p>
          </div>
          <Button asChild variant="link" className="h-auto shrink-0 p-0 text-base">
            <Link href="/conditions" className="inline-flex items-center gap-2 font-medium">
              View all services <ArrowRight size={16} aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured ? (
            <article className="marketing-card interactive-lift group relative flex min-h-[16rem] flex-col justify-end overflow-hidden p-7 md:row-span-2 md:min-h-[26rem] xl:col-span-1">
              <div
                aria-hidden
                className="from-primary/12 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent"
              />
              <div className="relative space-y-3">
                <h3 className="marketing-h3 text-balance">{featured.title}</h3>
                <p className="marketing-small max-w-sm leading-relaxed">{featured.description}</p>
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
                  "interactive-lift flex h-full flex-col rounded-2xl p-6 shadow-e1",
                  isAccent
                    ? "bg-primary-strong text-primary-foreground xl:col-span-2"
                    : "marketing-card",
                )}
              >
                <h3 className={cn("marketing-h3 mb-2", isAccent && "text-primary-foreground")}>{service.title}</h3>
                <p className={cn("marketing-small mb-5 flex-1", isAccent && "text-primary-foreground/85")}>
                  {service.description}
                </p>
                <Link
                  href={`/conditions/${service.slug}`}
                  className={cn(
                    "inline-flex items-center gap-2 text-sm font-semibold underline-offset-2 hover:underline",
                    isAccent ? "text-primary-foreground" : "text-primary-strong",
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
