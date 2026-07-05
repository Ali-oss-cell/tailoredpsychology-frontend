"use client"

import type * as React from "react"
import Link from "next/link"
import {
  Buildings,
  CalendarDots,
  ChartBar,
  ClipboardText,
  CurrencyCircleDollar,
  Database,
  Gear,
  House,
  MagnifyingGlass,
  ShieldCheck,
  SignOut,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr"

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

type OpsRouteKey =
  | "manager-dashboard"
  | "manager-staff"
  | "manager-patients"
  | "manager-appointments"
  | "manager-billing"
  | "manager-referrals"
  | "manager-privacy-requests"
  | "manager-resources"
  | "admin-dashboard"
  | "admin-users"
  | "admin-appointments"
  | "admin-patients"
  | "admin-staff"
  | "admin-billing"
  | "admin-settings"
  | "admin-analytics"
  | "admin-audit-logs"
  | "admin-security-incidents"
  | "admin-data-deletion"
  | "admin-privacy-requests"
  | "admin-referrals"
  | "admin-resources"

type OpsShellProps = {
  children: React.ReactNode
  activeRoute: OpsRouteKey
}

type NavItem = {
  key: OpsRouteKey
  href: string
  label: string
  icon: React.ComponentType<{ size?: number }>
}

const managerNavItems: readonly NavItem[] = [
  { key: "manager-dashboard", href: "/manager/dashboard", label: "Manager Dashboard", icon: House },
  { key: "manager-staff", href: "/manager/staff", label: "Manager Staff", icon: UsersThree },
  { key: "manager-patients", href: "/manager/patients", label: "Manager Patients", icon: ClipboardText },
  { key: "manager-appointments", href: "/manager/appointments", label: "Manager Appointments", icon: CalendarDots },
  { key: "manager-billing", href: "/manager/billing", label: "Manager Billing", icon: CurrencyCircleDollar },
  { key: "manager-referrals", href: "/manager/referrals", label: "Manager Referrals", icon: MagnifyingGlass },
  { key: "manager-privacy-requests", href: "/manager/privacy-requests", label: "Privacy Requests", icon: ShieldCheck },
  { key: "manager-resources", href: "/manager/resources", label: "Manager Resources", icon: Database },
]

const adminNavItems: readonly NavItem[] = [
  { key: "admin-dashboard", href: "/admin/dashboard", label: "Admin Dashboard", icon: Buildings },
  { key: "admin-users", href: "/admin/users", label: "Admin Users", icon: UsersThree },
  { key: "admin-appointments", href: "/admin/appointments", label: "Admin Appointments", icon: CalendarDots },
  { key: "admin-patients", href: "/admin/patients", label: "Admin Patients", icon: ClipboardText },
  { key: "admin-staff", href: "/admin/staff", label: "Admin Staff", icon: UsersThree },
  { key: "admin-billing", href: "/admin/billing", label: "Admin Billing", icon: CurrencyCircleDollar },
  { key: "admin-settings", href: "/admin/settings", label: "Admin Settings", icon: Gear },
  { key: "admin-analytics", href: "/admin/analytics", label: "Admin Analytics", icon: ChartBar },
  { key: "admin-audit-logs", href: "/admin/audit-logs", label: "Admin Audit Logs", icon: ShieldCheck },
  { key: "admin-security-incidents", href: "/admin/security-incidents", label: "Security Incidents", icon: ShieldCheck },
  { key: "admin-data-deletion", href: "/admin/data-deletion", label: "Data Deletion", icon: Database },
  { key: "admin-privacy-requests", href: "/admin/privacy-requests", label: "Privacy Requests", icon: ShieldCheck },
  { key: "admin-referrals", href: "/admin/referrals", label: "Referrals", icon: MagnifyingGlass },
  { key: "admin-resources", href: "/admin/resources", label: "Admin Resources", icon: Database },
] as const

function isManagerRoute(route: OpsRouteKey): boolean {
  return route.startsWith("manager-")
}

export function OpsShell({ children, activeRoute }: OpsShellProps) {
  const managerMode = isManagerRoute(activeRoute)
  const navItems = managerMode ? managerNavItems : adminNavItems
  const opsDashboardHref = managerMode ? "/manager/dashboard" : "/admin/dashboard"
  return (
    <SidebarProvider defaultOpen={true} storageKey="clink-sidebar-ops">
      <div className="bg-background text-foreground flex h-screen w-full overflow-hidden">
        <Sidebar collapsible="icon" className={portalSidebarClassName}>
          <SidebarHeader className="group-data-[state=collapsed]/sidebar:mb-3">
            <ClinkSidebarBrand dashboardHref={opsDashboardHref} portalLabel="Operations Portal" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton asChild isActive={item.key === activeRoute}>
                      <Link href={item.href} title={item.label}>
                        <Icon size={18} />
                        <span className="group-data-[state=collapsed]/sidebar:sr-only">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="space-y-2 border-t border-border/60 pt-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              disabled
              title="Compliance mode is not enabled in this release."
            >
              <ShieldCheck size={16} />
              <span className="group-data-[state=collapsed]/sidebar:sr-only">Compliance Mode (coming soon)</span>
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
                  patientsHref={managerMode ? "/manager/patients" : "/admin/patients"}
                  placeholder="Search patients by name or ID…"
                />
              </div>
              <div className="flex items-center gap-2">
                <NotificationBell />
                <OpsHeaderAccountMenu mode={managerMode ? "manager" : "admin"} />
              </div>
            </div>
          </header>
          <PortalShellMain>{children}</PortalShellMain>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
