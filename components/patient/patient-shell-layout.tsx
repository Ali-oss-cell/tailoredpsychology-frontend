"use client"

import { useQueryClient } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import * as React from "react"

import { PortalNetworkBanner } from "@/components/patient/portal-network-banner"
import { PatientShell } from "@/components/patient/patient-shell"
import { getPatientAppointments } from "@/src/patient/booking/api"
import { patientQueryKeys, patientQueryStaleTime } from "@/src/patient/queries/keys"
import { usePatientId } from "@/src/patient/queries/use-current-user"
import { usePatientPortalRealtime } from "@/src/patient/realtime/use-patient-portal-realtime"
import { resolvePatientNavKey } from "@/src/routes/nav-utils"

const PREFETCH_ROUTES: Record<string, () => string> = {
  dashboard: () => "/patient/appointments",
  appointments: () => "/patient/dashboard",
  invoices: () => "/patient/dashboard",
}

export function PatientShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activeRoute = React.useMemo(() => resolvePatientNavKey(pathname), [pathname])
  const queryClient = useQueryClient()
  const patientId = usePatientId()
  usePatientPortalRealtime()

  React.useEffect(() => {
    if (!patientId) return
    void queryClient.prefetchQuery({
      queryKey: patientQueryKeys.appointments(patientId),
      queryFn: () => getPatientAppointments(patientId),
      staleTime: patientQueryStaleTime.appointments,
    })
  }, [patientId, queryClient])

  React.useEffect(() => {
    const target = PREFETCH_ROUTES[activeRoute]?.()
    if (!target || typeof window === "undefined") return
    const link = document.createElement("link")
    link.rel = "prefetch"
    link.href = target
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [activeRoute])

  return (
    <>
      <PortalNetworkBanner />
      <PatientShell activeRoute={activeRoute}>{children}</PatientShell>
    </>
  )
}
