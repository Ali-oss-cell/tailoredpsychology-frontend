"use client"

import type * as React from "react"
import Link from "next/link"
import { CalendarDots, House, NotePencil, SignOut, UsersThree, UserCircleGear, VideoCamera } from "@phosphor-icons/react/dist/ssr"

import { LogoutLink } from "@/components/auth/logout-link"
import { ClinkLogo } from "@/components/brand/clink-logo"
import { ClinkSidebarBrand } from "@/components/brand/clink-sidebar-brand"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { PsychologistHeaderAccountMenu } from "@/components/psychologist/psychologist-header-account-menu"
import { PsychologistJoinNextSession } from "@/components/psychologist/psychologist-join-next-session"
import { FloatingChatWidget } from "@/components/session/floating-chat-widget"
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

type PsychologistShellProps = {
  children: React.ReactNode
  activeRoute?:
    | "dashboard"
    | "schedule"
    | "patients"
    | "notes"
    | "profile"
    | "recordings"
}

const navItems = [
  { key: "dashboard", href: "/psychologist/dashboard", label: "Dashboard", icon: House },
  { key: "schedule", href: "/psychologist/schedule", label: "Schedule", icon: CalendarDots },
  { key: "patients", href: "/psychologist/patients", label: "Patients", icon: UsersThree },
  { key: "notes", href: "/psychologist/notes", label: "Notes", icon: NotePencil },
  { key: "profile", href: "/psychologist/profile", label: "Profile", icon: UserCircleGear },
  { key: "recordings", href: "/psychologist/recordings", label: "Recordings", icon: VideoCamera },
]

export function PsychologistShell({
  children,
  activeRoute = "dashboard",
}: PsychologistShellProps) {
  return (
    <SidebarProvider defaultOpen={false} storageKey="clink-sidebar-psychologist">
      <div className="bg-background text-foreground flex min-h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="mb-3 flex justify-end group-data-[state=collapsed]/sidebar:justify-center">
              <SidebarTrigger variant="minimal" />
            </div>
            <ClinkSidebarBrand dashboardHref="/psychologist/dashboard" portalLabel="Psychologist Portal" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.href}>
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
            <PsychologistJoinNextSession />
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
              <div className="flex items-center gap-3">
                <Link href="/psychologist/dashboard" className="lg:hidden" aria-label="Tailored Psychology Psychologist home">
                  <ClinkLogo alt="" className="size-8" />
                </Link>
                <input
                  type="text"
                  placeholder="Search patients, notes, sessions..."
                  className="bg-muted/60 border-border focus-visible:ring-ring hidden w-80 rounded-full border px-4 py-2 text-sm outline-none focus-visible:ring-2 md:block"
                />
              </div>
              <div className="flex items-center gap-2">
                <NotificationBell />
                <PsychologistHeaderAccountMenu />
              </div>
            </div>
          </header>
          <main className="p-4 md:p-6 lg:p-8">{children}</main>
        </SidebarInset>
        <FloatingChatWidget role="psychologist" />
      </div>
    </SidebarProvider>
  )
}
