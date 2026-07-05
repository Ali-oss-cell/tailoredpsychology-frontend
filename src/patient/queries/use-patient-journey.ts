"use client"

import { useQuery } from "@tanstack/react-query"

import { getPatientJourneyTimeline } from "@/src/patient/journey/api"
import { patientQueryKeys, patientQueryStaleTime } from "@/src/patient/queries/keys"
import { usePatientId } from "@/src/patient/queries/use-current-user"

export function usePatientJourney() {
  const patientId = usePatientId()

  return useQuery({
    queryKey: patientQueryKeys.journey,
    queryFn: () => getPatientJourneyTimeline(patientId!),
    enabled: Boolean(patientId),
    staleTime: patientQueryStaleTime.journey,
  })
}
