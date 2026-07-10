"use client"

import { useQuery } from "@tanstack/react-query"

import { getAdminOpsPatients } from "@/src/admin/ops/api"
import { opsQueryKeys, opsQueryStaleTime } from "@/src/admin/ops/queries/keys"

export function useOpsPatients() {
  return useQuery({
    queryKey: opsQueryKeys.patients,
    queryFn: getAdminOpsPatients,
    staleTime: opsQueryStaleTime.list,
  })
}
