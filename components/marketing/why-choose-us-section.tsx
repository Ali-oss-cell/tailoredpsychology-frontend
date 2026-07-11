import Image from "next/image"
import Link from "next/link"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { HomeWhyChooseItem } from "@/content/homepage"

type WhyChooseUsSectionProps = {
  title: string
  description: string
  items: HomeWhyChooseItem[]
}

export function WhyChooseUsSection({ title, description, items }: WhyChooseUsSectionProps) {
  return (
    <PageSection id="why-us" className="scroll-mt-24 bg-marketing-canvas py-10 md:py-14 lg:py-16">
      <PageContainer className="space-y-6 md:space-y-8">
        <div className="mx-auto max-w-2xl space-y-2 text-center md:space-y-3">
          <h2 className="marketing-h2 text-balance">{title}</h2>
          <p className="marketing-body text-muted-foreground text-balance">{description}</p>
        </div>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-4">
          {items.map((item, index) => (
            <article key={item.title} className="marketing-card flex h-full flex-col overflow-hidden">
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                width={900}
                height={650}
                className="aspect-[16/9] h-auto w-full object-cover sm:aspect-[16/10] lg:aspect-[5/3]"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                loading="lazy"
              />
              <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
                <Badge variant="outline" className="w-fit font-medium">
                  {item.eyebrow}
                </Badge>
                <h3 className="marketing-h3 text-balance">{item.title}</h3>
                <p className="marketing-small text-muted-foreground line-clamp-3 flex-1 leading-snug xl:line-clamp-4">
                  {item.description}
                </p>
                {index === 0 ? (
                  <Button asChild variant="outline" className="marketing-cta mt-1 w-fit">
                    <Link href="/trust">How we earn trust</Link>
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </PageContainer>
    </PageSection>
  )
}
