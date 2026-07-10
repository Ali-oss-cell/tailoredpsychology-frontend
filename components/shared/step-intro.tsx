import type * as React from "react"

import { cn } from "@/lib/utils"

type StepIntroProps = {
  title: string
  description?: string
  eyebrow?: string
  className?: string
  children?: React.ReactNode
}

export function StepIntro({ title, description, eyebrow, className, children }: StepIntroProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {eyebrow ? <p className="text-primary text-xs font-semibold tracking-wide uppercase">{eyebrow}</p> : null}
      <h2 className="font-heading text-lg font-semibold tracking-tight">{title}</h2>
      {description ? <p className="text-muted-foreground text-sm leading-relaxed">{description}</p> : null}
      {children}
    </div>
  )
}
