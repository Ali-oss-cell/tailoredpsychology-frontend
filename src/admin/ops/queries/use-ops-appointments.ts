"use client"

import { useQuery } from "@tanstack/react-query"

import { getAdminOpsAppointments } from "@/src/admin/ops/api"
import { opsQueryKeys, opsQueryStaleTime } from "@/src/admin/ops/queries/keys"

export function useOpsAppointments() {
  return useQuery({
    queryKey: opsQueryKeys.appointments,
    queryFn: getAdminOpsAppointments,
    staleTime: opsQueryStaleTime.list,
  })
}
