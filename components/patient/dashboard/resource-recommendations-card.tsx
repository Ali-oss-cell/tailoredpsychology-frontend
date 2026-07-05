"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ResourceItem = {
  title: string
  meta: string
  description: string
  imageSrc: string
  href?: string
}

type ResourceRecommendationsCardProps = {
  items: ResourceItem[]
}

export function ResourceRecommendationsCard({ items }: ResourceRecommendationsCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="card-eyebrow">For you</p>
          <h3 className="font-heading text-lg font-semibold tracking-tight md:text-xl">Recommended</h3>
        </div>
        <Link
          href="/patient/resources"
          className="text-primary inline-flex items-center gap-1 text-xs font-medium underline-offset-2 hover:underline"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.length === 0 ? <DashboardStateBlock variant="empty" message="No recommendations yet." /> : null}
        {items.map((item) => {
          const href = item.href ?? "/patient/resources"
          return (
            <Link key={item.title} href={href} className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Card
                className={cn(
                  "interactive-lift overflow-hidden border-border/60 p-0 shadow-e1",
                  "gap-0 transition-[box-shadow,border-color] duration-250 group-hover:border-primary/20",
                )}
              >
                <div className="flex min-h-0 flex-col sm:flex-row sm:items-stretch">
                  <div className="border-border/50 relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b sm:aspect-auto sm:min-h-[5.75rem] sm:w-32 sm:border-b-0 sm:border-r">
                    <Image
                      src={item.imageSrc}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 8rem"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-1 px-3.5 py-3 sm:px-4 sm:py-2.5">
                    <p className="text-primary text-[11px] font-medium tracking-wide uppercase">{item.meta}</p>
                    <p className="font-heading line-clamp-2 text-[0.95rem] leading-snug font-semibold tracking-tight">
                      {item.title}
                    </p>
                    <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
