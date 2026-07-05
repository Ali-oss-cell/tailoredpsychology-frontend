import type * as React from "react"

import { PortalPageHeader } from "@/components/shared/portal-page-header"
import { cn } from "@/lib/utils"

type PsychologistPortalPageProps = {
  title: string
  description: string
  eyebrow?: string
  children: React.ReactNode
  className?: string
  tutorialId?: string
  actions?: React.ReactNode
}

export function PsychologistPortalPage({
  title,
  description,
  eyebrow,
  children,
  className,
  tutorialId,
  actions,
}: PsychologistPortalPageProps) {
  return (
    <section className={cn("space-y-6", className)} data-tutorial={tutorialId}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PortalPageHeader title={title} description={description} eyebrow={eyebrow} />
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  )
}
