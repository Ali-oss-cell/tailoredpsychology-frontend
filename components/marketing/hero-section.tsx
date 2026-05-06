import Link from "next/link"
import Image from "next/image"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type HeroAction = {
  href: string
  label: string
  variant?: "default" | "outline" | "ghost" | "secondary"
}

type HeroSectionProps = {
  badge: string
  title: string
  titleAccent: string
  description: string
  primaryAction: HeroAction
  secondaryAction: HeroAction
  imageAlt: string
  imageSrc?: string
}

export function HeroSection({
  badge,
  title,
  titleAccent,
  description,
  primaryAction,
  secondaryAction,
  imageAlt,
  imageSrc,
}: HeroSectionProps) {
  return (
    <PageSection className="relative overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface-2/65 to-transparent dark:from-surface-2/35" />
      <PageContainer className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            {badge}
          </Badge>
          <h1 className="font-heading text-4xl leading-tight font-bold tracking-tight md:text-5xl">
            {title} <span className="text-primary">{titleAccent}</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg">{description}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href={primaryAction.href}>{primaryAction.label}</Link>
            </Button>
            <Button asChild size="lg" variant={secondaryAction.variant ?? "outline"}>
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          </div>
        </div>
        <div
          data-hero-panel
          className="bg-surface-2 dark:bg-surface-3 overflow-hidden rounded-3xl border border-border/70 will-change-transform"
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={900}
              height={700}
              className="h-[420px] w-full object-cover"
            />
          ) : (
            <div className="bg-brand-gradient flex h-[420px] items-end p-8">
              <p className="text-primary-foreground/90 max-w-sm text-sm">
                Calm, evidence-based psychology care designed for clarity, trust, and
                measurable progress.
              </p>
            </div>
          )}
        </div>
      </PageContainer>
    </PageSection>
  )
}
