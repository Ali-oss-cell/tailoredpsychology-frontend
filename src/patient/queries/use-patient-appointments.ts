"use client"

import { useQuery } from "@tanstack/react-query"

import { getPatientAppointments } from "@/src/patient/booking/api"
import { patientQueryKeys, patientQueryStaleTime } from "@/src/patient/queries/keys"
import { usePatientId } from "@/src/patient/queries/use-current-user"

export function usePatientAppointments() {
  const patientId = usePatientId()

  return useQuery({
    queryKey: patientQueryKeys.appointments(patientId),
    queryFn: () => getPatientAppointments(patientId!),
    enabled: Boolean(patientId),
    staleTime: patientQueryStaleTime.appointments,
  })
}
