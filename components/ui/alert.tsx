import * as React from "react"

import { cn } from "@/lib/utils"

export type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "success" | "warning" | "destructive" | "info"
}

const variantClass: Record<NonNullable<AlertProps["variant"]>, string> = {
  default: "border-border bg-muted/30 text-foreground",
  success: "border-success bg-success/10 text-foreground",
  warning: "border-warning bg-warning/10 text-foreground",
  destructive: "border-destructive/40 bg-destructive/10 text-destructive",
  info: "border-info/30 bg-info/5 text-foreground",
}

export function Alert({ className, variant = "default", ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn("rounded-lg border px-4 py-3 text-sm leading-relaxed", variantClass[variant], className)}
      {...props}
    />
  )
}
