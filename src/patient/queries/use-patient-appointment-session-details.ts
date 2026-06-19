"use client"

import { useQuery } from "@tanstack/react-query"

import { patientQueryKeys, patientQueryStaleTime } from "@/src/patient/queries/keys"
import { usePatientId } from "@/src/patient/queries/use-current-user"
import { getPatientSessions, getSessionDetail, type SessionDetail } from "@/src/sessions/api"

export function usePatientAppointmentSessionDetails() {
  const patientId = usePatientId()

  return useQuery({
    queryKey: patientQueryKeys.appointmentSessionDetails(patientId),
    queryFn: async (): Promise<Record<string, SessionDetail | null>> => {
      const sessions = await getPatientSessions(patientId!)
      const details = await Promise.all(sessions.slice(0, 6).map((session) => getSessionDetail(session.sessionId)))
      return Object.fromEntries(details.map((detail) => [detail.sessionId, detail]))
    },
    enabled: Boolean(patientId),
    staleTime: patientQueryStaleTime.appointmentSessionDetails,
  })
}
