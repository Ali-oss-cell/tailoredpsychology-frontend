import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { Button } from "@/components/ui/button"
import type { HomeServiceCard } from "@/content/homepage"

type HomeServicesGridProps = {
  title: string
  description: string
  items: HomeServiceCard[]
}

export function HomeServicesGrid({ title, description, items }: HomeServicesGridProps) {
  return (
    <PageSection id="services" className="scroll-mt-24">
      <PageContainer className="space-y-10">
        <div className="max-w-2xl space-y-3">
          <h2 className="marketing-h2 text-balance">{title}</h2>
          <p className="marketing-body text-muted-foreground">{description}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((service) => (
            <article key={service.slug} className="marketing-card interactive-lift flex h-full flex-col p-6">
              <h3 className="marketing-h3 mb-2">{service.title}</h3>
              <p className="marketing-small mb-5 flex-1">{service.description}</p>
              <Button asChild variant="link" className="h-auto justify-start p-0 text-base">
                <Link
                  href={`/conditions/${service.slug}`}
                  className="inline-flex items-center gap-2 font-medium"
                >
                  Learn more <ArrowRight size={16} aria-hidden />
                </Link>
              </Button>
            </article>
          ))}
        </div>
        <div className="pt-2">
          <Button asChild variant="outline" className="marketing-cta">
            <Link href="/conditions">View all conditions</Link>
          </Button>
        </div>
      </PageContainer>
    </PageSection>
  )
}
