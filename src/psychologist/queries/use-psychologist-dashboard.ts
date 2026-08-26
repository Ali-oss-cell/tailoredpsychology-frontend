"use client"

import { useQuery } from "@tanstack/react-query"

import { getPsychologistDashboard, type PsychologistDashboardSnapshot } from "@/src/psychologist/dashboard/api"
import { psychologistQueryKeys, psychologistQueryStaleTime } from "@/src/psychologist/queries/keys"
import { resolvePatientDisplayNames } from "@/src/psychologist/resolve-patient-display-names"

export type PsychologistDashboardViewModel = PsychologistDashboardSnapshot & {
  patientNamesById: Record<string, string>
}

export function usePsychologistDashboard() {
  return useQuery({
    queryKey: psychologistQueryKeys.dashboard,
    queryFn: async (): Promise<PsychologistDashboardViewModel> => {
      const snapshot = await getPsychologistDashboard()
      const patientIds = [
        ...snapshot.todaySchedule.map((row) => row.patientId),
        ...(snapshot.nextSession ? [snapshot.nextSession.patientId] : []),
      ]
      const names = await resolvePatientDisplayNames(snapshot.user.userId, patientIds)
      return {
        ...snapshot,
        patientNamesById: Object.fromEntries(names),
      }
    },
    staleTime: psychologistQueryStaleTime.dashboard,
  })
}
