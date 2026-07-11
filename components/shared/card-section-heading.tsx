import type * as React from "react"

import { cn } from "@/lib/utils"

type CardSectionHeadingProps = {
  /** Use h2 for card sections; h3 for nested subsections within a card. */
  level?: 2 | 3
  children: React.ReactNode
  className?: string
  id?: string
}

/** Visually matches `.card-eyebrow` but exposes a real heading for screen readers. */
export function CardSectionHeading({ level = 2, children, className, id }: CardSectionHeadingProps) {
  const Tag = level === 3 ? "h3" : "h2"
  return (
    <Tag id={id} className={cn("card-eyebrow", className)}>
      {children}
    </Tag>
  )
}
