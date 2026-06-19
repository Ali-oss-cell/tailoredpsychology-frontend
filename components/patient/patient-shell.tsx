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
  useSidebar,
} from "@/components/ui/sidebar"
import { TUTORIAL_EXPAND_PATIENT_SIDEBAR } from "@/src/tutorials/events"

function PatientShellTutorialSidebarSync() {
  const { setOpen } = useSidebar()

  React.useEffect(() => {
    const expand = () => {
      setOpen(true)
    }
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
  /** When locked, main does not scroll — child pages own internal scroll regions (e.g. booking wizard). */
  mainLayout?: "scroll" | "locked"
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

export function PatientShell({
  children,
  activeRoute = "dashboard",
  mainLayout = "scroll",
}: PatientShellProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="bg-background text-foreground flex h-screen w-full overflow-hidden">
        <PatientShellTutorialSidebarSync />
        <Sidebar
          collapsible="none"
          className="fixed inset-y-0 left-0 z-30 h-screen w-64 overflow-y-auto transition-none"
          data-tutorial="shell.sidebar"
        >
          <SidebarHeader>
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
                      <Link href={item.href} {...tutorialAttr}>
                        <Icon size={18} />
                        <span>{item.label}</span>
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
                  <Link href="/patient/book-appointment" data-tutorial="shell.sidebar.book-appointment">
                    <CalendarPlus size={18} weight="bold" />
                    <span>Book New Appointment</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <LogoutLink className="flex w-full items-center gap-3">
                    <SignOut size={18} />
                    <span>Logout</span>
                  </LogoutLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden lg:ml-64">
          <header
            className="bg-background/95 border-border/70 z-20 shrink-0 border-b backdrop-blur"
            data-tutorial="shell.header"
          >
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-3">
                <Link href="/patient/dashboard" className="lg:hidden" aria-label="Tailored Psychology Patient home">
                  <ClinkLogo alt="" className="size-8" />
                </Link>
                <input
                  type="text"
                  placeholder="Search appointments, resources..."
                  data-tutorial="shell.header.search"
                  className="bg-muted/60 border-border focus-visible:ring-ring hidden w-80 rounded-full border px-4 py-2 text-sm outline-none focus-visible:ring-2 md:block"
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
          <main
            className={
              mainLayout === "locked"
                ? "flex min-h-0 flex-1 flex-col overflow-hidden p-4 md:p-5 lg:p-6"
                : "flex-1 overflow-y-auto scroll-smooth p-4 md:p-6 lg:p-8"
            }
            data-tutorial="shell.main"
          >
            {children}
          </main>
        </SidebarInset>
        <FloatingChatWidget role="patient" />
      </div>
    </SidebarProvider>
  )
}
