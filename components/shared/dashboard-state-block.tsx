"use client"

import { Button } from "@/components/ui/button"

type DashboardStateVariant = "loading" | "empty" | "error"

type DashboardStateBlockProps = {
  variant: DashboardStateVariant
  message: string
  retryLabel?: string
  onRetry?: () => void
}

export function DashboardStateBlock({ variant, message, retryLabel = "Retry", onRetry }: DashboardStateBlockProps) {
  if (variant === "error") {
    return (
      <div className="space-y-2 rounded-md border border-destructive/30 bg-destructive/5 p-3">
        <p className="text-sm text-destructive">{message}</p>
        {onRetry ? (
          <Button size="sm" variant="outline" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
      </div>
    )
  }

  return (
    <p className="rounded-md border border-dashed border-border/60 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
      {message}
    </p>
  )
}
