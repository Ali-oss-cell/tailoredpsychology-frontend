import {
  Brain,
  GlobeHemisphereWest,
  Lightning,
  Lock,
  ShieldCheck,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import type { HomeTrustBarItem } from "@/content/homepage"
import { cn } from "@/lib/utils"

type HomeTrustStripProps = {
  items: HomeTrustBarItem[]
  className?: string
}

const iconMap = {
  evidence: Brain,
  licensed: ShieldCheck,
  video: VideoCamera,
  matching: Lightning,
  australia: GlobeHemisphereWest,
  privacy: Lock,
} as const

export function HomeTrustStrip({ items, className }: HomeTrustStripProps) {
  return (
    <section
      className={cn("border-border/50 border-y bg-card/80 py-8 md:py-10", className)}
      aria-label="Why patients trust Tailored Psychology"
    >
      <PageContainer>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {items.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <li key={item.title}>
                <article className="marketing-card interactive-lift h-full p-4 md:p-5">
                  <span className="bg-primary/10 text-primary mb-3 flex h-10 w-10 items-center justify-center rounded-xl">
                    <Icon size={22} weight="duotone" aria-hidden />
                  </span>
                  <h3 className="text-sm font-semibold leading-snug md:text-base">{item.title}</h3>
                  <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed md:text-sm">
                    {item.description}
                  </p>
                </article>
              </li>
            )
          })}
        </ul>
      </PageContainer>
    </section>
  )
}
