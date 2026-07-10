"use client"

import { useQuery } from "@tanstack/react-query"

import { psychologistQueryKeys, psychologistQueryStaleTime } from "@/src/psychologist/queries/keys"
import { getPsychologistPatientContext, getPsychologistWorkspace } from "@/src/psychologist/workspace/api"
import { getPsychologistSessions } from "@/src/sessions/api"

export type PsychologistCaseloadRow = {
  id: string
  name: string
  nextSession: string
  nextSessionMs: number
  status: string
  needsPrep: boolean
  firstVisitLikely: boolean
}

async function loadCaseload(psychologistId: string): Promise<PsychologistCaseloadRow[]> {
  const [workspace, allSessions] = await Promise.all([
    getPsychologistWorkspace(psychologistId),
    getPsychologistSessions(psychologistId).catch(() => []),
  ])
  const uniquePatientIds = [...new Set(workspace.items.map((item) => item.patientId))]
  const contexts = await Promise.all(
    uniquePatientIds.map(async (patientId) => getPsychologistPatientContext(psychologistId, patientId).catch(() => null)),
  )
  const byPatient = new Map(
    contexts.filter((ctx): ctx is NonNullable<typeof ctx> => Boolean(ctx)).map((ctx) => [ctx.patientId, ctx]),
  )

  const mapped: PsychologistCaseloadRow[] = uniquePatientIds.map((patientId) => {
    const patientWorkspaceItems = workspace.items.filter((item) => item.patientId === patientId)
    const nextItem = [...patientWorkspaceItems].sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    )[0]
    const context = byPatient.get(patientId)
    const needsPrep = patientWorkspaceItems.some((item) => item.actions.length > 0)
    const sessionsForPatient = allSessions.filter((s) => s.patientId === patientId)
    const completedCount = sessionsForPatient.filter((s) => s.status === "completed").length
    const firstVisitLikely = completedCount === 0
    const nextSessionMs = nextItem ? new Date(nextItem.startsAt).getTime() : Number.POSITIVE_INFINITY
    return {
      id: patientId,
      name: context?.patientDisplayName ?? patientId,
      nextSession: nextItem ? new Date(nextItem.startsAt).toLocaleString() : "No upcoming sessions",
      nextSessionMs,
      status: context?.riskLevel ?? "unknown",
      needsPrep,
      firstVisitLikely,
    }
  })

  mapped.sort((a, b) => {
    if (a.needsPrep !== b.needsPrep) return a.needsPrep ? -1 : 1
    if (a.firstVisitLikely !== b.firstVisitLikely) return a.firstVisitLikely ? -1 : 1
    return a.nextSessionMs - b.nextSessionMs
  })

  return mapped
}

export function usePsychologistCaseload(psychologistId?: string) {
  return useQuery({
    queryKey: psychologistQueryKeys.caseload(psychologistId),
    queryFn: () => loadCaseload(psychologistId!),
    enabled: Boolean(psychologistId),
    staleTime: psychologistQueryStaleTime.caseload,
  })
}
