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

export type OpsRouteKey =
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

export type ManagerOpsRouteKey = Extract<OpsRouteKey, `manager-${string}`>
export type AdminOpsRouteKey = Extract<OpsRouteKey, `admin-${string}`>

const managerRoutePrefixes: readonly { prefix: string; key: ManagerOpsRouteKey }[] = [
  { prefix: "/manager/staff", key: "manager-staff" },
  { prefix: "/manager/patients", key: "manager-patients" },
  { prefix: "/manager/appointments", key: "manager-appointments" },
  { prefix: "/manager/billing", key: "manager-billing" },
  { prefix: "/manager/referrals", key: "manager-referrals" },
  { prefix: "/manager/privacy-requests", key: "manager-privacy-requests" },
  { prefix: "/manager/resources", key: "manager-resources" },
] as const

const adminRoutePrefixes: readonly { prefix: string; key: AdminOpsRouteKey }[] = [
  { prefix: "/admin/users", key: "admin-users" },
  { prefix: "/admin/appointments", key: "admin-appointments" },
  { prefix: "/admin/patients", key: "admin-patients" },
  { prefix: "/admin/staff", key: "admin-staff" },
  { prefix: "/admin/billing", key: "admin-billing" },
  { prefix: "/admin/settings", key: "admin-settings" },
  { prefix: "/admin/analytics", key: "admin-analytics" },
  { prefix: "/admin/audit-logs", key: "admin-audit-logs" },
  { prefix: "/admin/security-incidents", key: "admin-security-incidents" },
  { prefix: "/admin/data-deletion", key: "admin-data-deletion" },
  { prefix: "/admin/privacy-requests", key: "admin-privacy-requests" },
  { prefix: "/admin/referrals", key: "admin-referrals" },
  { prefix: "/admin/resources", key: "admin-resources" },
] as const

export function resolveManagerActiveRoute(pathname: string): ManagerOpsRouteKey {
  for (const entry of managerRoutePrefixes) {
    if (pathname.startsWith(entry.prefix)) return entry.key
  }
  return "manager-dashboard"
}

export function resolveAdminActiveRoute(pathname: string): AdminOpsRouteKey {
  for (const entry of adminRoutePrefixes) {
    if (pathname.startsWith(entry.prefix)) return entry.key
  }
  return "admin-dashboard"
}

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

function opsSearchTarget(activeRoute: OpsRouteKey, managerMode: boolean): string {
  const prefix = managerMode ? "/manager" : "/admin"
  if (activeRoute === "admin-users") return "/admin/users"
  if (activeRoute.endsWith("-staff")) return `${prefix}/staff`
  if (activeRoute.endsWith("-appointments")) return `${prefix}/appointments`
  if (activeRoute.endsWith("-resources")) return `${prefix}/resources`
  return `${prefix}/patients`
}

function opsSearchPlaceholder(activeRoute: OpsRouteKey): string {
  if (activeRoute === "admin-users") return "Search psychologist users by name or email…"
  if (activeRoute.endsWith("-staff")) return "Search staff by name, email, or user ID…"
  if (activeRoute.endsWith("-appointments")) return "Search appointments by patient, clinician, or ID…"
  if (activeRoute.endsWith("-resources")) return "Search resources by title, owner, or ID…"
  return "Search patients by name or ID…"
}

function opsComplianceHref(managerMode: boolean): string {
  return managerMode ? "/manager/privacy-requests" : "/admin/audit-logs"
}

export function OpsShell({ children, activeRoute }: OpsShellProps) {
  const managerMode = isManagerRoute(activeRoute)
  const navItems = managerMode ? managerNavItems : adminNavItems
  const opsDashboardHref = managerMode ? "/manager/dashboard" : "/admin/dashboard"
  const searchTarget = opsSearchTarget(activeRoute, managerMode)
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
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <Link href={opsComplianceHref(managerMode)} title="Open compliance tools">
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
