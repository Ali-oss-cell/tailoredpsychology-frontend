"use client"

import { useQuery } from "@tanstack/react-query"

import { getCurrentUser } from "@/src/auth/current-user"
import { psychologistQueryKeys, psychologistQueryStaleTime } from "@/src/psychologist/queries/keys"

export function usePsychologistCurrentUser() {
  return useQuery({
    queryKey: psychologistQueryKeys.currentUser,
    queryFn: getCurrentUser,
    staleTime: psychologistQueryStaleTime.currentUser,
  })
}

export function usePsychologistId(): string | undefined {
  const { data } = usePsychologistCurrentUser()
  return data?.role === "psychologist" ? data.id : undefined
}
