"use client"

import { useQuery } from "@tanstack/react-query"

import { getAdminOpsStaff } from "@/src/admin/ops/api"
import { opsQueryKeys, opsQueryStaleTime } from "@/src/admin/ops/queries/keys"

export function useOpsStaff() {
  return useQuery({
    queryKey: opsQueryKeys.staff,
    queryFn: getAdminOpsStaff,
    staleTime: opsQueryStaleTime.list,
  })
}
