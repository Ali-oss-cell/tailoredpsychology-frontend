import type * as React from "react"

import { cn } from "@/lib/utils"

type DashboardPageHeaderProps = {
  title: string
  description?: string
  eyebrow?: string
  actions?: React.ReactNode
  className?: string
  titleClassName?: string
}

export function DashboardPageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
  titleClassName,
}: DashboardPageHeaderProps) {
  return (
    <header
      className={cn(
        "dashboard-section flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-2">
        {eyebrow ? <p className="card-eyebrow">{eyebrow}</p> : null}
        <h1
          className={cn(
            "font-heading text-2xl font-semibold tracking-tight md:text-[2rem] md:leading-tight",
            titleClassName,
          )}
        >
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed md:text-base">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  )
}
