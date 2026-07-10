"use client"

import Link from "next/link"

import { ClinkLogo } from "@/components/brand/clink-logo"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type ClinkSidebarBrandProps = {
  dashboardHref: string
  portalLabel: string
  /** Use on dark sidebars (patient portal). */
  variant?: "default" | "inverse"
}

export function ClinkSidebarBrand({ dashboardHref, portalLabel, variant = "default" }: ClinkSidebarBrandProps) {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const inverse = variant === "inverse"

  return (
    <div className={cn("mb-6", collapsed && "text-center")}>
      <Link
        href={dashboardHref}
        className={cn(
          "inline-flex focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          collapsed && "mx-auto justify-center",
          inverse && "focus-visible:ring-offset-[var(--sidebar-patient)]",
        )}
        aria-label={`Tailored Psychology ${portalLabel} home`}
      >
        <ClinkLogo
          alt=""
          className={cn("object-contain", collapsed ? "size-9" : "size-11", inverse && "brightness-0 invert")}
          priority
        />
      </Link>
      {!collapsed ? (
        <p className={cn("mt-2 text-xs", inverse ? "text-sidebar-patient-foreground/80" : "text-muted-foreground")}>
          {portalLabel}
        </p>
      ) : null}
    </div>
  )
}
