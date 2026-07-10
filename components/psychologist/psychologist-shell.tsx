"use client"

import type * as React from "react"
import Link from "next/link"
import { SignOut } from "@phosphor-icons/react/dist/ssr"

import { LogoutLink } from "@/components/auth/logout-link"
import { ClinkLogo } from "@/components/brand/clink-logo"
import { ClinkSidebarBrand } from "@/components/brand/clink-sidebar-brand"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { PsychologistHeaderAccountMenu } from "@/components/psychologist/psychologist-header-account-menu"
import { PsychologistJoinNextSession } from "@/components/psychologist/psychologist-join-next-session"
import { FloatingChatWidget } from "@/components/session/floating-chat-widget"
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
      <div className="bg-background text-foreground flex h-screen w-full overflow-hidden">
        <Sidebar collapsible="icon" className={portalSidebarClassName}>
          <SidebarHeader className="group-data-[state=collapsed]/sidebar:mb-3">
            <ClinkSidebarBrand dashboardHref="/psychologist/dashboard" portalLabel="Psychologist Portal" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
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
          <SidebarFooter className="space-y-2 border-t border-border/60 pt-4">
            <PsychologistJoinNextSession />
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
                <Link href="/psychologist/dashboard" className="lg:hidden" aria-label="Tailored Psychology Psychologist home">
                  <ClinkLogo alt="" className="size-8" />
                </Link>
                <PortalShellSearch patientsHref="/psychologist/patients" placeholder="Search patients by name or ID…" />
              </div>
              <div className="flex items-center gap-2">
                <NotificationBell />
                <PsychologistHeaderAccountMenu />
              </div>
            </div>
          </header>
          <PortalShellMain>{children}</PortalShellMain>
        </SidebarInset>
        <FloatingChatWidget role="psychologist" />
      </div>
    </SidebarProvider>
  )
}
