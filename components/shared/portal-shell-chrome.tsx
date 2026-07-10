import type * as React from "react"

import { cn } from "@/lib/utils"

export const portalSidebarClassName =
  "fixed inset-y-0 left-0 z-30 flex h-screen flex-col overflow-y-auto border-r border-border/70 bg-surface-2/80 backdrop-blur-sm transition-[width] duration-200 lg:flex"

export const portalPatientSidebarClassName =
  "fixed inset-y-0 left-0 z-30 flex h-screen flex-col overflow-y-auto border-r transition-[width] duration-200 lg:flex backdrop-blur-none"

export const portalInsetClassName =
  "flex h-screen min-w-0 flex-1 flex-col overflow-hidden transition-[margin] duration-200 ml-64 group-data-[state=collapsed]/sidebar-wrapper:lg:ml-[4.5rem]"

export const portalHeaderClassName =
  "border-border/70 sticky top-0 z-20 shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"

export const portalPatientMainClassName = "bg-dashboard"

type PortalShellMainProps = {
  children: React.ReactNode
  className?: string
  tutorialId?: string
}

export function PortalShellMain({ children, className, tutorialId }: PortalShellMainProps) {
  return (
    <main
      className={cn("flex-1 overflow-y-auto scroll-smooth p-4 md:p-6 lg:p-8", className)}
      data-tutorial={tutorialId}
    >
      <div className="mx-auto w-full max-w-[1200px]">{children}</div>
    </main>
  )
}
