import Link from "next/link"
import Image from "next/image"
import type { CSSProperties } from "react"
import {
  Certificate,
  GlobeHemisphereWest,
  Lock,
  Stethoscope,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { HomeHeroStat, HomeTrustIndicator } from "@/content/homepage"
import { cn } from "@/lib/utils"

type HeroAction = {
  href: string
  label: string
}

type HeroSectionProps = {
  badge: string
  title: string
  titleAccent: string
  description: string
  primaryAction: HeroAction
  secondaryAction: HeroAction
  tertiaryAction: HeroAction
  trustIndicators: HomeTrustIndicator[]
  floatingStats: HomeHeroStat[]
  imageAlt: string
  imageSrc?: string
}

const trustIconMap = {
  medicare: Stethoscope,
  ahpra: Certificate,
  telehealth: VideoCamera,
  australia: GlobeHemisphereWest,
  privacy: Lock,
} as const

function HeroTitle({ title, titleAccent }: { title: string; titleAccent: string }) {
  const words = `${title} `.split(/\s+/).filter(Boolean)
  return (
    <h1 className="marketing-h1 text-balance">
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="hero-word"
          style={{ "--word-index": index } as CSSProperties}
        >
          {word}{" "}
        </span>
      ))}
      <span
        className="hero-word text-primary"
        style={{ "--word-index": words.length } as CSSProperties}
      >
        {titleAccent}
      </span>
    </h1>
  )
}

export function HeroSection({
  badge,
  title,
  titleAccent,
  description,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  trustIndicators,
  floatingStats,
  imageAlt,
  imageSrc,
}: HeroSectionProps) {
  return (
    <PageSection
      data-scroll-hero
      className="relative overflow-hidden bg-marketing-canvas py-16 md:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent" />
      <PageContainer className="relative grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="space-y-7" data-hero-copy>
          <Badge
            data-hero-enter
            variant="secondary"
            className="rounded-full border border-primary/15 bg-primary/8 px-3.5 py-1 text-sm font-medium text-primary"
          >
            {badge}
          </Badge>
          <HeroTitle title={title} titleAccent={titleAccent} />
          <p data-hero-enter className="marketing-body text-muted-foreground max-w-xl text-balance">
            {description}
          </p>
          <div data-hero-enter className="flex flex-wrap items-center gap-3">
            <Button asChild className="marketing-cta press shadow-primary-glow">
              <Link href={primaryAction.href}>{primaryAction.label}</Link>
            </Button>
            <Button asChild variant="outline" className="marketing-cta press">
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
            <Button asChild variant="ghost" className="marketing-cta press text-primary">
              <Link href={tertiaryAction.href}>{tertiaryAction.label}</Link>
            </Button>
          </div>
          <ul
            data-hero-enter
            className="grid gap-3 pt-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
            aria-label="Care quality indicators"
          >
            {trustIndicators.map((item) => {
              const Icon = trustIconMap[item.icon]
              return (
                <li key={item.label} className="flex items-center gap-2.5">
                  <span className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <Icon size={18} weight="duotone" aria-hidden />
                  </span>
                  <span className="text-sm font-medium leading-snug">{item.label}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="relative" data-hero-panel>
          <div className="hero-media-settle overflow-hidden rounded-3xl border border-border/60 bg-card shadow-e3">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={960}
                height={720}
                className="aspect-[4/3] h-auto w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="bg-brand-gradient flex aspect-[4/3] items-end p-8">
                <p className="text-primary-foreground/90 max-w-sm text-sm leading-relaxed">
                  Calm, evidence-based psychology care designed for clarity, trust, and measurable
                  progress.
                </p>
              </div>
            )}
          </div>
          {floatingStats.length > 0 ? (
            <div
              className="pointer-events-none absolute inset-0 hidden md:block"
              aria-hidden
            >
              {floatingStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "marketing-card absolute max-w-[11rem] px-4 py-3",
                    index === 0 && "-left-4 top-8 lg:-left-8",
                    index === 1 && "-right-2 bottom-24 lg:-right-6",
                    index === 2 && "bottom-4 left-8 lg:left-4",
                  )}
                >
                  <p className="text-primary font-heading text-xl font-semibold tabular-nums">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium leading-snug">{stat.label}</p>
                  {stat.disclaimer ? (
                    <p className="text-muted-foreground mt-0.5 text-[0.65rem] leading-tight">
                      {stat.disclaimer}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </PageContainer>
    </PageSection>
  )
}
