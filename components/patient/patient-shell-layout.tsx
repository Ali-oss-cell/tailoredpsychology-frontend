"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { PatientShell } from "@/components/patient/patient-shell"
import { usePatientPortalRealtime } from "@/src/patient/realtime/use-patient-portal-realtime"
import { resolvePatientNavKey } from "@/src/routes/nav-utils"

export function PatientShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activeRoute = React.useMemo(() => resolvePatientNavKey(pathname), [pathname])
  usePatientPortalRealtime()

  return <PatientShell activeRoute={activeRoute}>{children}</PatientShell>
}
