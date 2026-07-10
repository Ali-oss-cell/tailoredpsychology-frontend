"use client"

import { useQuery } from "@tanstack/react-query"

import { psychologistQueryKeys, psychologistQueryStaleTime } from "@/src/psychologist/queries/keys"
import { getPsychologistWorkspace, type PsychologistWorkspaceQuery } from "@/src/psychologist/workspace/api"

export function usePsychologistWorkspace(psychologistId?: string, query?: PsychologistWorkspaceQuery) {
  return useQuery({
    queryKey: psychologistQueryKeys.workspace(psychologistId, query),
    queryFn: () => getPsychologistWorkspace(psychologistId!, query),
    enabled: Boolean(psychologistId),
    staleTime: psychologistQueryStaleTime.workspace,
  })
}
