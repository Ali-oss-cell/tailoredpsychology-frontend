import type * as React from "react"

import { cn } from "@/lib/utils"

type AuthCardProps = {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <article
      className={cn(
        "rounded-dashboard-card border-border/60 bg-card shadow-e1 border p-6 md:p-8",
        className,
      )}
    >
      <header className="space-y-2 text-center">
        <h1 className="font-heading text-[1.75rem] leading-tight font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-base leading-relaxed">{description}</p>
      </header>
      <div className="mt-8 space-y-6">{children}</div>
      {footer ? <div className="border-border/50 mt-6 border-t pt-5">{footer}</div> : null}
    </article>
  )
}
