import Image from "next/image"

import { cn } from "@/lib/utils"

/** Square brand mark — all surfaces use this asset for consistency. */
export const CLINK_LOGO_ICON_SRC = "/assets/logo-icon.png" as const

type ClinkLogoProps = {
  className?: string
  priority?: boolean
  /** Use `""` when the mark sits inside a control that already has an accessible name. */
  alt?: string
}

export function ClinkLogo({ className, priority, alt }: ClinkLogoProps) {
  return (
    <Image
      src={CLINK_LOGO_ICON_SRC}
      alt={alt ?? "Tailored Psychology"}
      width={48}
      height={48}
      className={cn("object-contain", className)}
      priority={priority}
    />
  )
}
