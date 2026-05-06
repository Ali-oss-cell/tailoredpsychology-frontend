import Link from "next/link"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { PublicHeroAction } from "@/content/pages/types"

type PageHeroProps = {
  eyebrow?: string
  title: string
  description: string
  kicker?: string
  actions?: PublicHeroAction[]
}

export function PageHero({ eyebrow, title, description, kicker, actions }: PageHeroProps) {
  return (
    <PageSection className="relative overflow-hidden border-b border-border/50 py-12 md:py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,hsl(var(--primary)/0.14),transparent_55%)]"
        aria-hidden
      />
      <PageContainer className="relative space-y-5">
        {eyebrow ? (
          <Badge variant="secondary" className="border-primary/15 bg-primary/5 text-primary font-medium">
            {eyebrow}
          </Badge>
        ) : null}
        <div className="max-w-3xl space-y-4">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl lg:text-[2.5rem] lg:leading-tight">
            {title}
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed md:text-lg">{description}</p>
          {kicker ? (
            <p className="text-foreground/85 max-w-2xl border-l-2 border-primary/40 pl-4 text-sm font-medium leading-relaxed md:text-base">
              {kicker}
            </p>
          ) : null}
        </div>
        {actions && actions.length > 0 ? (
          <div className="flex flex-wrap gap-3 pt-1">
            {actions.map((a) => (
              <Button key={a.href + a.label} asChild variant={a.variant === "outline" ? "outline" : "default"} size="lg">
                <Link href={a.href}>{a.label}</Link>
              </Button>
            ))}
          </div>
        ) : null}
      </PageContainer>
    </PageSection>
  )
}
