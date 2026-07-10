"use client"

import type * as React from "react"
import Link from "next/link"
import { ShieldCheck, SignOut } from "@phosphor-icons/react/dist/ssr"

import { LogoutLink } from "@/components/auth/logout-link"
import { ClinkLogo } from "@/components/brand/clink-logo"
import { ClinkSidebarBrand } from "@/components/brand/clink-sidebar-brand"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { OpsHeaderAccountMenu } from "@/components/ops/ops-header-account-menu"
import { PortalShellSearch } from "@/components/shared/portal-shell-search"
import {
  portalHeaderClassName,
  portalInsetClassName,
  portalSidebarClassName,
  PortalShellMain,
} from "@/components/shared/portal-shell-chrome"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { NavIcon } from "@/src/routes/nav-icons"
import {
  getShellNavItems,
  opsComplianceHref,
  opsSearchPlaceholder,
  opsSearchTarget,
  resolveOpsNavKey,
} from "@/src/routes/nav-utils"

export type OpsRouteKey = string

export function resolveManagerActiveRoute(pathname: string): OpsRouteKey {
  return resolveOpsNavKey(pathname, "manager")
}

export function resolveAdminActiveRoute(pathname: string): OpsRouteKey {
  return resolveOpsNavKey(pathname, "admin")
}

type OpsShellProps = {
  children: React.ReactNode
  activeRoute: OpsRouteKey
}

function isManagerRoute(route: OpsRouteKey): boolean {
  return route.startsWith("manager-")
}

export function OpsShell({ children, activeRoute }: OpsShellProps) {
  const managerMode = isManagerRoute(activeRoute)
  const opsMode = managerMode ? "manager" : "admin"
  const navItems = getShellNavItems("ops", opsMode)
  const opsDashboardHref = managerMode ? "/manager/dashboard" : "/admin/dashboard"
  const searchTarget = opsSearchTarget(activeRoute, opsMode)

  return (
    <SidebarProvider defaultOpen={true} storageKey="clink-sidebar-ops">
      <div className="bg-background text-foreground flex h-screen w-full overflow-hidden">
        <Sidebar collapsible="icon" className={portalSidebarClassName}>
          <SidebarHeader className="group-data-[state=collapsed]/sidebar:mb-3">
            <ClinkSidebarBrand dashboardHref={opsDashboardHref} portalLabel="Operations Portal" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton asChild isActive={item.key === activeRoute}>
                    <Link href={item.href} title={item.label}>
                      {item.icon ? <NavIcon icon={item.icon} /> : null}
                      <span className="group-data-[state=collapsed]/sidebar:sr-only">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="space-y-2 border-t border-border/60 pt-4">
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <Link href={opsComplianceHref(opsMode)} title="Open compliance tools">
                <ShieldCheck size={16} />
                <span className="group-data-[state=collapsed]/sidebar:sr-only">Compliance tools</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start gap-2">
              <LogoutLink>
                <SignOut size={16} />
                <span className="group-data-[state=collapsed]/sidebar:sr-only">Logout</span>
              </LogoutLink>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className={portalInsetClassName}>
          <header className={portalHeaderClassName}>
            <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <SidebarTrigger variant="soft" className="hidden lg:inline-flex" />
                <Link href={opsDashboardHref} className="flex items-center gap-2 lg:hidden" aria-label="Tailored Psychology Operations home">
                  <ClinkLogo alt="" className="size-8" />
                  <span className="text-muted-foreground text-sm font-semibold tracking-tight">Ops</span>
                </Link>
                <PortalShellSearch
                  targetHref={searchTarget}
                  placeholder={opsSearchPlaceholder(activeRoute)}
                />
              </div>
              <div className="flex items-center gap-2">
                <NotificationBell />
                <OpsHeaderAccountMenu mode={opsMode} />
              </div>
            </div>
          </header>
          <PortalShellMain>{children}</PortalShellMain>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
