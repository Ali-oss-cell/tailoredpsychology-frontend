import * as React from "react"

import { cn } from "@/lib/utils"

type PageSectionProps = React.ComponentProps<"section"> & {
  muted?: boolean
}

export function PageSection({
  className,
  muted = false,
  ...props
}: PageSectionProps) {
  return (
    <section
      className={cn(
        "py-14 md:py-20",
        muted && "bg-surface-2/55 dark:bg-surface-2/45",
        className,
      )}
      {...props}
    />
  )
}
