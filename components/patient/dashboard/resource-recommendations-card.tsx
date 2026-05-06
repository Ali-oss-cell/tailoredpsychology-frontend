import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Card, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ResourceItem = {
  title: string
  meta: string
  description: string
  imageSrc: string
}

type ResourceRecommendationsCardProps = {
  items: ResourceItem[]
}

export function ResourceRecommendationsCard({
  items,
}: ResourceRecommendationsCardProps) {
  return (
    <div className="md:col-span-8 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recommended for You</h3>
        <Link href="/patient/resources" className="text-primary inline-flex items-center gap-1 text-sm font-medium">
          View all <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.length === 0 ? <DashboardStateBlock variant="empty" message="No recommendations yet." /> : null}
        {items.map((item) => (
          <Card
            key={item.title}
            className={cn(
              "group overflow-hidden p-0 shadow-sm transition-shadow duration-200",
              "gap-0 hover:border-primary/25 hover:shadow-md",
            )}
          >
            <div className="flex min-h-0 flex-col sm:flex-row sm:items-stretch">
              <div className="border-border/50 relative aspect-[2.1/1] w-full shrink-0 border-b sm:aspect-auto sm:min-h-[5.75rem] sm:w-32 sm:self-stretch sm:border-b-0 sm:border-r">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 8rem"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-1 px-3.5 py-3 sm:px-4 sm:py-2.5">
                <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">{item.meta}</p>
                <CardTitle className="font-heading line-clamp-2 text-[0.95rem] leading-snug font-semibold tracking-tight">
                  {item.title}
                </CardTitle>
                <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">{item.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
