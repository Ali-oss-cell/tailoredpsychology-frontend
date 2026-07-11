"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import * as React from "react"

import { getPatientJourneyTimeline } from "@/src/patient/journey/api"
import type { PatientDashboardSnapshot } from "@/src/patient/dashboard/api"
import { patientQueryKeys, patientQueryStaleTime } from "@/src/patient/queries/keys"
import { usePatientId } from "@/src/patient/queries/use-current-user"

export function usePatientJourney() {
  const patientId = usePatientId()
  const queryClient = useQueryClient()

  React.useEffect(() => {
    if (!patientId) return
    const dashboard = queryClient.getQueryData<PatientDashboardSnapshot>(patientQueryKeys.dashboard)
    if (!dashboard?.journey || dashboard.journey.patientId !== patientId) return
    const existing = queryClient.getQueryData(patientQueryKeys.journey)
    if (!existing) {
      queryClient.setQueryData(patientQueryKeys.journey, dashboard.journey)
    }
  }, [patientId, queryClient])

  return useQuery({
    queryKey: patientQueryKeys.journey,
    queryFn: () => getPatientJourneyTimeline(patientId!),
    enabled: Boolean(patientId),
    staleTime: patientQueryStaleTime.journey,
    placeholderData: () => {
      const dashboard = queryClient.getQueryData<PatientDashboardSnapshot>(patientQueryKeys.dashboard)
      if (dashboard?.journey && dashboard.journey.patientId === patientId) {
        return dashboard.journey
      }
      return undefined
    },
  })
}
