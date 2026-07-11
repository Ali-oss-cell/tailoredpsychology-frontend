import type * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AuthPrimaryButtonProps = React.ComponentProps<typeof Button>

export function AuthPrimaryButton({ className, size = "xl", ...props }: AuthPrimaryButtonProps) {
  return (
    <Button
      size={size}
      className={cn("w-full font-semibold", className)}
      {...props}
    />
  )
}
