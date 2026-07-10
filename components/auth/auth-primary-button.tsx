import type * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AuthPrimaryButtonProps = React.ComponentProps<typeof Button>

export function AuthPrimaryButton({ className, ...props }: AuthPrimaryButtonProps) {
  return (
    <Button
      className={cn("h-12 w-full rounded-xl text-base font-semibold", className)}
      {...props}
    />
  )
}
