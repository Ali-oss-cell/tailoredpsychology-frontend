import type * as React from "react"

import { cn } from "@/lib/utils"

type WhatHappensNextProps = {
  title?: string
  children: React.ReactNode
  className?: string
}

export function WhatHappensNext({
  title = "What happens next",
  children,
  className,
}: WhatHappensNextProps) {
  return (
    <aside
      className={cn(
        "border-info/30 bg-info/5 rounded-xl border px-4 py-3 text-sm",
        className,
      )}
      aria-label={title}
    >
      <p className="text-foreground mb-1 font-medium">{title}</p>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </aside>
  )
}
