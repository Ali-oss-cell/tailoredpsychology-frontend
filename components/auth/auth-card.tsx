import type * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <Card className={cn("surface-glass interactive-lift border-border/70 shadow-e1", className)}>
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="font-heading text-2xl">{title}</CardTitle>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
        {footer ? <div className="border-border/60 border-t pt-4">{footer}</div> : null}
      </CardContent>
    </Card>
  )
}
