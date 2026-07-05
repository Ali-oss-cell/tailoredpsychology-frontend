"use client"

import { useQuery } from "@tanstack/react-query"

import { getPatientDashboard } from "@/src/patient/dashboard/api"
import { patientQueryKeys, patientQueryStaleTime } from "@/src/patient/queries/keys"
import { usePatientId } from "@/src/patient/queries/use-current-user"

/**
 * Consolidated dashboard state: next session (+ join window), journey,
 * and billing snapshot in a single request. Replaces the previous
 * three-query waterfall on the dashboard page.
 */
export function usePatientDashboard() {
  const patientId = usePatientId()

  return useQuery({
    queryKey: patientQueryKeys.dashboard,
    queryFn: getPatientDashboard,
    enabled: Boolean(patientId),
    staleTime: patientQueryStaleTime.dashboard,
  })
}
