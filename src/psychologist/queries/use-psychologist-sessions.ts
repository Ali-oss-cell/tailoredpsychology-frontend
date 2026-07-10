"use client"

import { useQuery } from "@tanstack/react-query"

import { psychologistQueryKeys, psychologistQueryStaleTime } from "@/src/psychologist/queries/keys"
import { getPsychologistSessions } from "@/src/sessions/api"

export function usePsychologistSessions(psychologistId?: string) {
  return useQuery({
    queryKey: psychologistQueryKeys.sessions(psychologistId),
    queryFn: () => getPsychologistSessions(psychologistId!),
    enabled: Boolean(psychologistId),
    staleTime: psychologistQueryStaleTime.sessions,
  })
}
