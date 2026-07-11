"use client"

import * as React from "react"
import Link from "next/link"
import { CalendarPlus, Gear, Question, SignOut } from "@phosphor-icons/react/dist/ssr"

import { LogoutLink } from "@/components/auth/logout-link"
import { ClinkLogo } from "@/components/brand/clink-logo"
import { ClinkSidebarBrand } from "@/components/brand/clink-sidebar-brand"
import { PatientHeaderScrollFx } from "@/components/patient/patient-header-scroll-fx"
import { PortalShellSearch } from "@/components/shared/portal-shell-search"
import {
  portalHeaderClassName,
  portalPatientInsetClassName,
  portalPatientMainClassName,
  portalPatientSidebarClassName,
  PortalShellMain,
} from "@/components/shared/portal-shell-chrome"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { PatientTutorialHelpButton } from "@/components/tutorials/patient-tutorial-help-button"
import { PatientHeaderProfile } from "./patient-header-profile"
import { FloatingChatWidget } from "@/components/session/floating-chat-widget"
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
import { getShellNavItems } from "@/src/routes/nav-utils"

type PatientShellProps = {
  children: React.ReactNode
  activeRoute?: string
  mainClassName?: string
  mainContentClassName?: string
}

const navItems = getShellNavItems("patient")

export function PatientShell({
  children,
  activeRoute = "dashboard",
  mainClassName,
  mainContentClassName,
}: PatientShellProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="bg-dashboard text-foreground flex h-screen w-full overflow-hidden">
        <SidebarMobileRouteDismiss />
        <Sidebar
          collapsible="none"
          mobileTitle="Patient navigation"
          className={cn(portalPatientSidebarClassName, "group/patient-sidebar")}
          data-patient-sidebar
          data-tutorial="shell.sidebar"
        >
          <SidebarHeader>
            <ClinkSidebarBrand
              dashboardHref="/patient/dashboard"
              portalLabel="Patient Portal"
              variant="inverse"
            />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="space-y-1.5">
              {navItems.map((item) => {
                const tutorialAttr = item.tutorialId ? { "data-tutorial": item.tutorialId } : {}
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={item.key === activeRoute}>
                      <Link href={item.href} title={item.label} {...tutorialAttr}>
                        {item.icon ? <NavIcon icon={item.icon} /> : null}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="mt-auto space-y-2 border-t border-[var(--sidebar-patient-border)] pt-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="justify-center py-2.5 hover:bg-transparent"
                  data-patient-sidebar-cta
                >
                  <Link
                    href="/patient/book-appointment"
                    title="Book Appointment"
                    data-tutorial="shell.sidebar.book-appointment"
                  >
                    <CalendarPlus size={18} weight="bold" />
                    <span>Book Appointment</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/patient/account" title="Settings">
                    <Gear size={18} />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/contact" title="Support">
                    <Question size={18} />
                    <span>Support</span>
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
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className={portalPatientInsetClassName}>
          <header data-patient-header className={portalHeaderClassName} data-tutorial="shell.header">
            <PatientHeaderScrollFx />
            <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <SidebarTrigger variant="soft" className="inline-flex shrink-0 lg:hidden" />
                <Link href="/patient/dashboard" className="shrink-0 lg:hidden" aria-label="Tailored Psychology Patient home">
                  <ClinkLogo alt="" className="size-8" />
                </Link>
                <PortalShellSearch
                  targetHref="/patient/appointments"
                  placeholder="Search appointments, clinicians, or help…"
                  data-tutorial="shell.header.search"
                  className="min-w-0 flex-1 md:block"
                />
              </div>
              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
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
          <PortalShellMain
            tutorialId="shell.main"
            className={cn(portalPatientMainClassName, mainClassName)}
            contentClassName={mainContentClassName}
          >
            {children}
          </PortalShellMain>
        </SidebarInset>
        <FloatingChatWidget role="patient" />
      </div>
    </SidebarProvider>
  )
}
