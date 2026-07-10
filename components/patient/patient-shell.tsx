"use client"

import * as React from "react"
import Link from "next/link"
import { CalendarPlus, SignOut } from "@phosphor-icons/react/dist/ssr"

import { LogoutLink } from "@/components/auth/logout-link"
import { ClinkLogo } from "@/components/brand/clink-logo"
import { ClinkSidebarBrand } from "@/components/brand/clink-sidebar-brand"
import { PatientHeaderScrollFx } from "@/components/patient/patient-header-scroll-fx"
import { PortalShellSearch } from "@/components/shared/portal-shell-search"
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
import { NavIcon } from "@/src/routes/nav-icons"
import { getShellNavItems } from "@/src/routes/nav-utils"
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

type PatientShellProps = {
  children: React.ReactNode
  activeRoute?: string
}

const navItems = getShellNavItems("patient")

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
                const tutorialAttr = item.tutorialId ? { "data-tutorial": item.tutorialId } : {}
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={item.key === activeRoute}>
                      <Link href={item.href} title={item.label} {...tutorialAttr}>
                        {item.icon ? <NavIcon icon={item.icon} /> : null}
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
                <PortalShellSearch
                  targetHref="/patient/appointments"
                  placeholder="Search appointments by clinician or type…"
                  data-tutorial="shell.header.search"
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
