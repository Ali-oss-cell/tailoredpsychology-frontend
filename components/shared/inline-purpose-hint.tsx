import * as React from "react"

import { cn } from "@/lib/utils"

type InlinePurposeHintProps = {
  children: React.ReactNode
  className?: string
  id?: string
}

/** One-line context for why we collect information (Wave 14 — minimum necessary copy). */
export function InlinePurposeHint({ children, className, id }: InlinePurposeHintProps) {
  return (
    <p id={id} className={cn("text-muted-foreground text-xs leading-relaxed", className)}>
      {children}
    </p>
  )
}
