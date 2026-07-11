import { Certificate, Lock, ShieldCheck, Stethoscope } from "@phosphor-icons/react/dist/ssr"

import { PageContainer } from "@/components/layout/page-container"
import type { HomeCertificationBadge } from "@/content/homepage"
import { cn } from "@/lib/utils"

type HomeCertificationStripProps = {
  items: HomeCertificationBadge[]
  className?: string
}

const iconMap = {
  aapi: Certificate,
  medicare: Stethoscope,
  ahpra: ShieldCheck,
  iso27001: Lock,
} as const

/**
 * Compact certification/registration badge row (Stitch trust-bar spec).
 * Claims not yet cleared by counsel render as muted "pending review" chips —
 * see docs/LEGAL_SIGNOFF_TRACKER.md.
 */
export function HomeCertificationStrip({ items, className }: HomeCertificationStripProps) {
  return (
    <div className={cn("border-border/50 border-b bg-card/60 py-5", className)}>
      <PageContainer>
        <ul
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          aria-label="Certifications and registrations"
        >
          {items.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <li key={item.label} className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    item.pendingReview ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary-strong",
                  )}
                >
                  <Icon size={18} weight="duotone" aria-hidden />
                </span>
                <span className="flex flex-col leading-tight">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      item.pendingReview ? "text-muted-foreground" : "text-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                  {item.pendingReview ? (
                    <span className="text-muted-foreground text-[0.65rem] leading-tight">Pending legal review</span>
                  ) : null}
                </span>
              </li>
            )
          })}
        </ul>
      </PageContainer>
    </div>
  )
}
