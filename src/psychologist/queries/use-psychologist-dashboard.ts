"use client"

import { useQuery } from "@tanstack/react-query"

import { getPsychologistDashboard } from "@/src/psychologist/dashboard/api"
import { psychologistQueryKeys, psychologistQueryStaleTime } from "@/src/psychologist/queries/keys"

export function usePsychologistDashboard() {
  return useQuery({
    queryKey: psychologistQueryKeys.dashboard,
    queryFn: getPsychologistDashboard,
    staleTime: psychologistQueryStaleTime.dashboard,
  })
}
