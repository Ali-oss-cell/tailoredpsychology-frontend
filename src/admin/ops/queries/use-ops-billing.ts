"use client"

import { useQuery } from "@tanstack/react-query"

import { getAdminOpsBilling } from "@/src/admin/ops/api"
import { opsQueryKeys, opsQueryStaleTime } from "@/src/admin/ops/queries/keys"

export function useOpsBilling() {
  return useQuery({
    queryKey: opsQueryKeys.billing,
    queryFn: getAdminOpsBilling,
    staleTime: opsQueryStaleTime.billing,
  })
}
