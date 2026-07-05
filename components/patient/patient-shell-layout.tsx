"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { PatientShell, type PatientShellActiveRoute } from "@/components/patient/patient-shell"
import { usePatientPortalRealtime } from "@/src/patient/realtime/use-patient-portal-realtime"

function resolveActiveRoute(pathname: string): PatientShellActiveRoute {
  if (pathname.startsWith("/patient/my-clinician")) {
    return "my-clinician"
  }
  if (pathname.startsWith("/patient/invoices")) {
    return "invoices"
  }
  if (pathname.startsWith("/patient/resources") || pathname.startsWith("/patient/recordings")) {
    return "resources"
  }
  if (pathname.startsWith("/patient/data-requests")) {
    return "privacy-requests"
  }
  if (pathname.startsWith("/patient/account")) {
    return "account"
  }
  if (pathname.startsWith("/patient/onboarding")) {
    return "onboarding"
  }
  if (
    pathname.startsWith("/patient/appointments") ||
    pathname.startsWith("/patient/book-appointment")
  ) {
    return "appointments"
  }
  return "dashboard"
}

export function PatientShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activeRoute = React.useMemo(() => resolveActiveRoute(pathname), [pathname])
  usePatientPortalRealtime()

  return <PatientShell activeRoute={activeRoute}>{children}</PatientShell>
}
