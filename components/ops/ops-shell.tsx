"use client"

import type * as React from "react"
import Link from "next/link"
import { Question, ShieldCheck, SignOut } from "@phosphor-icons/react/dist/ssr"

import { LogoutLink } from "@/components/auth/logout-link"
import { ClinkLogo } from "@/components/brand/clink-logo"
import { ClinkSidebarBrand } from "@/components/brand/clink-sidebar-brand"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { OpsHeaderAccountMenu } from "@/components/ops/ops-header-account-menu"
import { PortalHeaderScrollFx } from "@/components/shared/portal-header-scroll-fx"
import { PortalShellSearch } from "@/components/shared/portal-shell-search"
import {
  portalHeaderClassName,
  portalInsetClassName,
  portalOpsMainClassName,
  portalOpsSidebarClassName,
  PortalShellMain,
} from "@/components/shared/portal-shell-chrome"
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
  SidebarMobileRouteDismiss,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
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
  const complianceHref = opsComplianceHref(opsMode)

  return (
    <SidebarProvider defaultOpen={true} storageKey="clink-sidebar-ops">
      <div className="bg-dashboard text-foreground flex h-screen w-full overflow-hidden">
        <SidebarMobileRouteDismiss />
        <Sidebar
          collapsible="icon"
          mobileTitle="Operations navigation"
          className={cn(portalOpsSidebarClassName, "group/ops-sidebar")}
          data-ops-sidebar
        >
          <SidebarHeader className="group-data-[state=collapsed]/sidebar:mb-3">
            <ClinkSidebarBrand
              dashboardHref={opsDashboardHref}
              portalLabel="Operations Portal"
              variant="inverse"
            />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="space-y-1.5">
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
          <SidebarFooter className="mt-auto space-y-2 border-t border-[var(--sidebar-ops-border)] pt-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="justify-center py-2.5 hover:bg-transparent"
                  data-ops-sidebar-cta
                >
                  <Link href={complianceHref} title="Open compliance tools">
                    <ShieldCheck size={18} weight="bold" />
                    <span className="group-data-[state=collapsed]/sidebar:sr-only">Compliance tools</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/contact" title="Support">
                    <Question size={18} />
                    <span className="group-data-[state=collapsed]/sidebar:sr-only">Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <LogoutLink className="flex w-full items-center gap-3">
                    <SignOut size={18} />
                    <span className="group-data-[state=collapsed]/sidebar:sr-only">Logout</span>
                  </LogoutLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className={portalInsetClassName}>
          <header data-ops-header className={portalHeaderClassName}>
            <PortalHeaderScrollFx headerSelector="[data-ops-header]" />
            <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <SidebarTrigger variant="soft" className="inline-flex shrink-0" />
                <Link href={opsDashboardHref} className="flex shrink-0 items-center gap-2 lg:hidden" aria-label="Tailored Psychology Operations home">
                  <ClinkLogo alt="" className="size-8" />
                  <span className="text-muted-foreground text-sm font-semibold tracking-tight">Ops</span>
                </Link>
                <PortalShellSearch
                  targetHref={searchTarget}
                  placeholder={opsSearchPlaceholder(activeRoute)}
                  className="min-w-0 flex-1 md:block"
                />
              </div>
              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                <NotificationBell />
                <OpsHeaderAccountMenu mode={opsMode} />
              </div>
            </div>
          </header>
          <PortalShellMain className={portalOpsMainClassName}>{children}</PortalShellMain>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
