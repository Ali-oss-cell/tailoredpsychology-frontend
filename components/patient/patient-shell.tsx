"use client"

import * as React from "react"
import Link from "next/link"
import {
  Books,
  CalendarDots,
  CalendarPlus,
  CreditCard,
  House,
  ShieldCheck,
  SignOut,
  Stethoscope,
  User,
} from "@phosphor-icons/react/dist/ssr"

import { LogoutLink } from "@/components/auth/logout-link"
import { ClinkLogo } from "@/components/brand/clink-logo"
import { ClinkSidebarBrand } from "@/components/brand/clink-sidebar-brand"
import { PatientHeaderScrollFx } from "@/components/patient/patient-header-scroll-fx"
import { portalHeaderClassName, portalInsetClassName, portalSidebarClassName, PortalShellMain } from "@/components/shared/portal-shell-chrome"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { PatientTutorialHelpButton } from "@/components/tutorials/patient-tutorial-help-button"
import { PatientHeaderProfile } from "./patient-header-profile"
import { FloatingChatWidget } from "@/components/session/floating-chat-widget"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { TUTORIAL_EXPAND_PATIENT_SIDEBAR } from "@/src/tutorials/events"

function PatientShellTutorialSidebarSync() {
  const { setOpen } = useSidebar()

  React.useEffect(() => {
    const expand = () => setOpen(true)
    window.addEventListener(TUTORIAL_EXPAND_PATIENT_SIDEBAR, expand)
    return () => window.removeEventListener(TUTORIAL_EXPAND_PATIENT_SIDEBAR, expand)
  }, [setOpen])

  return null
}

export type PatientShellActiveRoute =
  | "dashboard"
  | "appointments"
  | "invoices"
  | "resources"
  | "privacy-requests"
  | "account"
  | "onboarding"
  | "my-clinician"

type PatientShellProps = {
  children: React.ReactNode
  activeRoute?: PatientShellActiveRoute
}

const navItems = [
  { key: "dashboard" as const, href: "/patient/dashboard", label: "Dashboard", icon: House },
  { key: "appointments" as const, href: "/patient/appointments", label: "Appointments", icon: CalendarDots },
  { key: "my-clinician" as const, href: "/patient/my-clinician", label: "My clinician", icon: Stethoscope },
  { key: "invoices" as const, href: "/patient/invoices", label: "Billing", icon: CreditCard },
  { key: "resources" as const, href: "/patient/resources", label: "Resources", icon: Books },
  { key: "privacy-requests" as const, href: "/patient/data-requests", label: "Privacy Requests", icon: ShieldCheck },
  { key: "account" as const, href: "/patient/account", label: "Account", icon: User },
]

const navTutorial: Record<(typeof navItems)[number]["key"], string> = {
  dashboard: "shell.sidebar.dashboard",
  appointments: "shell.sidebar.appointments",
  "my-clinician": "shell.sidebar.my-clinician",
  invoices: "shell.sidebar.billing",
  resources: "shell.sidebar.resources",
  "privacy-requests": "shell.sidebar.privacy-requests",
  account: "shell.sidebar.account",
}

export function PatientShell({ children, activeRoute = "dashboard" }: PatientShellProps) {
  return (
    <SidebarProvider defaultOpen={true} storageKey="patient-sidebar-open">
      <div className="bg-background text-foreground flex h-screen w-full overflow-hidden">
        <PatientShellTutorialSidebarSync />
        <Sidebar collapsible="icon" className={portalSidebarClassName} data-tutorial="shell.sidebar">
          <SidebarHeader className="group-data-[state=collapsed]/sidebar:mb-3">
            <ClinkSidebarBrand dashboardHref="/patient/dashboard" portalLabel="Patient Portal" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon
                const tutorialId = navTutorial[item.key]
                const tutorialAttr = tutorialId ? { "data-tutorial": tutorialId } : {}
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={item.key === activeRoute}>
                      <Link href={item.href} title={item.label} {...tutorialAttr}>
                        <Icon size={18} />
                        <span className="group-data-[state=collapsed]/sidebar:sr-only">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              <SidebarMenuItem className="border-border/60 mt-3 border-t pt-3">
                <SidebarMenuButton
                  asChild
                  className="bg-primary/10 text-primary hover:bg-primary/15 font-medium"
                >
                  <Link href="/patient/book-appointment" title="Book New Appointment" data-tutorial="shell.sidebar.book-appointment">
                    <CalendarPlus size={18} weight="bold" />
                    <span className="group-data-[state=collapsed]/sidebar:sr-only">Book New Appointment</span>
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
          </SidebarContent>
        </Sidebar>

        <SidebarInset className={portalInsetClassName}>
          <header data-patient-header className={portalHeaderClassName} data-tutorial="shell.header">
            <PatientHeaderScrollFx />
            <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <SidebarTrigger variant="soft" className="hidden lg:inline-flex" />
                <Link href="/patient/dashboard" className="lg:hidden" aria-label="Tailored Psychology Patient home">
                  <ClinkLogo alt="" className="size-8" />
                </Link>
                <input
                  type="search"
                  placeholder="Search appointments, resources..."
                  data-tutorial="shell.header.search"
                  aria-label="Search appointments and resources"
                  className="bg-muted/60 border-border focus-visible:ring-ring hidden w-80 max-w-full rounded-full border px-4 py-2 text-sm outline-none focus-visible:ring-2 md:block"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  <div data-tutorial="shell.header.notifications">
                    <NotificationBell />
                  </div>
                  <PatientTutorialHelpButton />
                </div>
                <div data-tutorial="shell.header.profile">
                  <PatientHeaderProfile />
                </div>
              </div>
            </div>
          </header>
          <PortalShellMain tutorialId="shell.main">{children}</PortalShellMain>
        </SidebarInset>
        <FloatingChatWidget role="patient" />
      </div>
    </SidebarProvider>
  )
}
