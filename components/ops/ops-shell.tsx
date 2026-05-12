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
  const navItems = isManagerRoute(activeRoute) ? managerNavItems : adminNavItems
  const opsDashboardHref = isManagerRoute(activeRoute) ? "/manager/dashboard" : "/admin/dashboard"
  return (
    <SidebarProvider defaultOpen={false} storageKey="clink-sidebar-ops">
      <div className="bg-background text-foreground flex min-h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="mb-3 flex justify-end group-data-[state=collapsed]/sidebar:justify-center">
              <SidebarTrigger />
            </div>
            <ClinkSidebarBrand dashboardHref={opsDashboardHref} portalLabel="Operations Portal" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton asChild isActive={item.key === activeRoute}>
                      <Link href={item.href}>
                        <Icon size={18} />
                        <span className="group-data-[state=collapsed]/sidebar:hidden">{item.label}</span>
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
              <span className="group-data-[state=collapsed]/sidebar:hidden">Compliance Mode (coming soon)</span>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start gap-2">
              <LogoutLink>
                <SignOut size={16} />
                <span className="group-data-[state=collapsed]/sidebar:hidden">Logout</span>
              </LogoutLink>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="bg-background/95 border-border/70 sticky top-0 z-20 border-b backdrop-blur">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
              <Link href={opsDashboardHref} className="flex items-center gap-2 lg:hidden" aria-label="Tailored Psychology Operations home">
                <ClinkLogo alt="" className="size-8" />
                <span className="text-muted-foreground text-sm font-semibold tracking-tight">Ops</span>
              </Link>
              <input
                type="text"
                placeholder="Search (coming soon)"
                readOnly
                title="Global admin search is not enabled in this release."
                className="bg-muted/60 border-border focus-visible:ring-ring hidden w-96 cursor-not-allowed rounded-full border px-4 py-2 text-sm opacity-70 outline-none focus-visible:ring-2 md:block"
              />
              <div className="flex items-center gap-2">
                <NotificationBell />
                <div className="bg-primary/20 text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold">
                  OP
                </div>
              </div>
            </div>
          </header>
          <main className="p-4 md:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
