import Image from "next/image"
import Link from "next/link"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { HomeWhyChooseItem } from "@/content/homepage"
import { cn } from "@/lib/utils"

type WhyChooseUsSectionProps = {
  title: string
  description: string
  items: HomeWhyChooseItem[]
}

export function WhyChooseUsSection({ title, description, items }: WhyChooseUsSectionProps) {
  return (
    <PageSection id="why-us" className="scroll-mt-24 bg-marketing-canvas">
      <PageContainer className="space-y-12 md:space-y-16">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="marketing-h2 text-balance">{title}</h2>
          <p className="marketing-body text-muted-foreground text-balance">{description}</p>
        </div>
        <div className="space-y-16 md:space-y-20">
          {items.map((item, index) => {
            const imageOnLeft = index % 2 === 1
            return (
              <div
                key={item.title}
                className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14"
              >
                <div
                  className={cn(
                    "space-y-5",
                    imageOnLeft ? "order-2 lg:order-2" : "order-2 lg:order-1",
                  )}
                >
                  <Badge variant="outline" className="font-medium">
                    {item.eyebrow}
                  </Badge>
                  <h3 className="marketing-h2 text-balance">{item.title}</h3>
                  <p className="marketing-body text-muted-foreground">{item.description}</p>
                  {index === 0 ? (
                    <Button asChild variant="outline" className="marketing-cta">
                      <Link href="/trust">How we earn trust</Link>
                    </Button>
                  ) : null}
                </div>
                <div
                  className={cn(
                    imageOnLeft ? "order-1 lg:order-1" : "order-1 lg:order-2",
                  )}
                >
                  <div className="marketing-card overflow-hidden">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      width={900}
                      height={650}
                      className="aspect-[16/11] h-auto w-full object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </PageContainer>
    </PageSection>
  )
}
