"use client"

import * as React from "react"
import Link from "next/link"
import { CalendarBlank, SignOut } from "@phosphor-icons/react/dist/ssr"

import { LogoutLink } from "@/components/auth/logout-link"
import { ClinkLogo } from "@/components/brand/clink-logo"
import { ClinkSidebarBrand } from "@/components/brand/clink-sidebar-brand"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { PsychologistHeaderAccountMenu } from "@/components/psychologist/psychologist-header-account-menu"
import { PsychologistJoinNextSession } from "@/components/psychologist/psychologist-join-next-session"
import { FloatingChatWidget } from "@/components/session/floating-chat-widget"
import { PortalHeaderScrollFx } from "@/components/shared/portal-header-scroll-fx"
import { PortalShellSearch } from "@/components/shared/portal-shell-search"
import {
  portalHeaderClassName,
  portalInsetClassName,
  portalPsychologistMainClassName,
  portalPsychologistSidebarClassName,
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
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { NavIcon } from "@/src/routes/nav-icons"
import { getShellNavItems } from "@/src/routes/nav-utils"

type PsychologistShellProps = {
  children: React.ReactNode
  activeRoute?: string
}

const navItems = getShellNavItems("psychologist")

export function PsychologistShell({
  children,
  activeRoute = "dashboard",
}: PsychologistShellProps) {
  return (
    <SidebarProvider defaultOpen={true} storageKey="clink-sidebar-psychologist">
      <div className="bg-dashboard text-foreground flex h-screen w-full overflow-hidden">
        <Sidebar
          collapsible="icon"
          className={cn(portalPsychologistSidebarClassName, "group/psychologist-sidebar")}
          data-psychologist-sidebar
        >
          <SidebarHeader className="group-data-[state=collapsed]/sidebar:mb-3">
            <ClinkSidebarBrand
              dashboardHref="/psychologist/dashboard"
              portalLabel="Psychologist Portal"
              variant="inverse"
            />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="space-y-1.5">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
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
          <SidebarFooter className="mt-auto space-y-2 border-t border-[var(--sidebar-psychologist-border)] pt-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="justify-center py-2.5 hover:bg-transparent"
                  data-psychologist-sidebar-cta
                >
                  <Link href="/psychologist/schedule" title="View schedule">
                    <CalendarBlank size={18} weight="bold" />
                    <span className="group-data-[state=collapsed]/sidebar:sr-only">View schedule</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <PsychologistJoinNextSession />
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
          <header data-psychologist-header className={portalHeaderClassName}>
            <PortalHeaderScrollFx headerSelector="[data-psychologist-header]" />
            <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <SidebarTrigger variant="soft" className="hidden shrink-0 lg:inline-flex" />
                <Link href="/psychologist/dashboard" className="shrink-0 lg:hidden" aria-label="Tailored Psychology Psychologist home">
                  <ClinkLogo alt="" className="size-8" />
                </Link>
                <PortalShellSearch
                  patientsHref="/psychologist/patients"
                  placeholder="Search patients by name or ID…"
                  className="min-w-0 flex-1 md:block"
                />
              </div>
              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                <NotificationBell />
                <PsychologistHeaderAccountMenu />
              </div>
            </div>
          </header>
          <PortalShellMain className={portalPsychologistMainClassName}>{children}</PortalShellMain>
        </SidebarInset>
        <FloatingChatWidget role="psychologist" />
      </div>
    </SidebarProvider>
  )
}
