"use client"

import Link from "next/link"

import { ClinkLogo } from "@/components/brand/clink-logo"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type ClinkSidebarBrandProps = {
  dashboardHref: string
  portalLabel: string
}

export function ClinkSidebarBrand({ dashboardHref, portalLabel }: ClinkSidebarBrandProps) {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <div className={cn("mb-6", collapsed && "text-center")}>
      <Link
        href={dashboardHref}
        className={cn(
          "inline-flex focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          collapsed && "mx-auto justify-center",
        )}
        aria-label={`Tailored Psychology ${portalLabel} home`}
      >
        <ClinkLogo
          alt=""
          className={cn("object-contain", collapsed ? "size-9" : "size-11")}
          priority
        />
      </Link>
      {!collapsed ? <p className="text-muted-foreground mt-2 text-xs">{portalLabel}</p> : null}
    </div>
  )
}
