import Image from "next/image"
import Link from "next/link"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SplitFeatureSectionProps = {
  eyebrow?: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  imageOnLeft?: boolean
  action?: { href: string; label: string }
}

export function SplitFeatureSection({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  imageOnLeft = false,
  action,
}: SplitFeatureSectionProps) {
  return (
    <PageSection>
      <PageContainer>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div
            className={cn(
              "space-y-5 rounded-2xl border border-border/60 bg-muted/15 p-6 shadow-sm md:p-8",
              imageOnLeft ? "order-1" : "order-2 lg:order-1",
            )}
          >
            {eyebrow ? (
              <Badge variant="outline" className="font-medium">
                {eyebrow}
              </Badge>
            ) : null}
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance md:text-3xl">{title}</h2>
            <p className="text-muted-foreground text-base leading-relaxed md:text-lg">{description}</p>
            {action ? (
              <div className="pt-1">
                <Button asChild variant="default">
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              </div>
            ) : null}
          </div>
          <div className={imageOnLeft ? "order-2 lg:order-1" : "order-1 lg:order-2"}>
            <div
              className="ring-primary/10 relative overflow-hidden rounded-2xl border border-border/70 shadow-lg ring-2 transition duration-300 ease-out motion-reduce:transition-none md:hover:shadow-xl md:hover:ring-primary/25"
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={900}
                height={650}
                className="aspect-[16/11] h-auto w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </PageContainer>
    </PageSection>
  )
}
