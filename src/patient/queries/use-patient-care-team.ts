"use client"

import { useQuery } from "@tanstack/react-query"

import { getMyCareTeam } from "@/src/patient/care-team/api"
import { patientQueryKeys, patientQueryStaleTime } from "@/src/patient/queries/keys"
import { usePatientId } from "@/src/patient/queries/use-current-user"

export function usePatientCareTeam() {
  const patientId = usePatientId()

  return useQuery({
    queryKey: patientQueryKeys.careTeam,
    queryFn: () => getMyCareTeam(),
    enabled: Boolean(patientId),
    staleTime: patientQueryStaleTime.careTeam,
  })
}
