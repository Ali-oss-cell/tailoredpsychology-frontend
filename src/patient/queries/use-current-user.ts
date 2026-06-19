"use client"

import { useQuery } from "@tanstack/react-query"

import { getCurrentUser } from "@/src/auth/current-user"
import { patientQueryKeys, patientQueryStaleTime } from "@/src/patient/queries/keys"

export function useCurrentUser() {
  return useQuery({
    queryKey: patientQueryKeys.currentUser,
    queryFn: getCurrentUser,
    staleTime: patientQueryStaleTime.currentUser,
  })
}

export function usePatientId(): string | undefined {
  const { data } = useCurrentUser()
  return data?.role === "patient" ? data.id : undefined
}
