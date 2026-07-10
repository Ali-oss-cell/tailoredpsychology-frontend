"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { PsychologistShell } from "@/components/psychologist/psychologist-shell"

type PsychologistShellActiveRoute =
  | "dashboard"
  | "schedule"
  | "patients"
  | "messages"
  | "notes"
  | "profile"
  | "recordings"

function resolveActiveRoute(pathname: string): PsychologistShellActiveRoute {
  if (pathname.startsWith("/psychologist/schedule")) return "schedule"
  if (pathname.startsWith("/psychologist/patients")) return "patients"
  if (pathname.startsWith("/psychologist/messages")) return "messages"
  if (pathname.startsWith("/psychologist/notes")) return "notes"
  if (pathname.startsWith("/psychologist/profile")) return "profile"
  if (pathname.startsWith("/psychologist/recordings")) return "recordings"
  return "dashboard"
}

export function PsychologistShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activeRoute = React.useMemo(() => resolveActiveRoute(pathname), [pathname])

  return <PsychologistShell activeRoute={activeRoute}>{children}</PsychologistShell>
}
