import type * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type EmptyStateProps = {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "dashboard-card flex flex-col items-center justify-center rounded-dashboard-card border border-dashed px-6 py-10 text-center",
        className,
      )}
    >
      {icon ? <div className="text-muted-foreground mb-3">{icon}</div> : null}
      <p className="font-heading text-base font-semibold">{title}</p>
      {description ? <p className="text-muted-foreground mt-1 max-w-md text-sm">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

type EmptyStateActionProps = {
  href?: string
  label: string
  onClick?: () => void
}

export function EmptyStateAction({ href, label, onClick }: EmptyStateActionProps) {
  if (href) {
    return (
      <Button asChild size="sm">
        <a href={href}>{label}</a>
      </Button>
    )
  }
  return (
    <Button size="sm" type="button" onClick={onClick}>
      {label}
    </Button>
  )
}
