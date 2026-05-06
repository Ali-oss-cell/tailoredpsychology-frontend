"use client"

import { getPsychologistSessions } from "@/src/sessions/api"

import { getPsychologistPatientContext, getPsychologistWorkspace } from "./workspace/api"

export type NoteSessionChoice = {
  patientId: string
  sessionId: string
  label: string
}

async function resolvePatientDisplayNames(
  psychologistId: string,
  patientIds: string[],
): Promise<Map<string, string>> {
  const unique = [...new Set(patientIds)]
  const entries = await Promise.all(
    unique.map(async (patientId) => {
      try {
        const ctx = await getPsychologistPatientContext(psychologistId, patientId)
        return [patientId, ctx.patientDisplayName.trim() || patientId] as const
      } catch {
        return [patientId, patientId] as const
      }
    }),
  )
  return new Map(entries)
}

/** Prefer pre-session workspace rows (upcoming caseload); otherwise fall back to all clinician sessions. */
export async function getNoteSessionChoices(psychologistId: string): Promise<NoteSessionChoice[]> {
  const workspace = await getPsychologistWorkspace(psychologistId, { sortBy: "startsAt", sortOrder: "asc" })
  if (workspace.items.length > 0) {
    const displayByPatient = await resolvePatientDisplayNames(
      psychologistId,
      workspace.items.map((item) => item.patientId),
    )
    return workspace.items.map((item) => {
      const name = displayByPatient.get(item.patientId) ?? item.patientId
      return {
        patientId: item.patientId,
        sessionId: item.appointmentId,
        label: `${name} · ${new Date(item.startsAt).toLocaleString()}`,
      }
    })
  }
  const sessions = await getPsychologistSessions(psychologistId)
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.scheduledStartAt).getTime() - new Date(b.scheduledStartAt).getTime(),
  )
  const displayByPatient = await resolvePatientDisplayNames(
    psychologistId,
    sorted.map((session) => session.patientId),
  )
  return sorted.map((session) => {
    const name = displayByPatient.get(session.patientId) ?? session.patientId
    return {
      patientId: session.patientId,
      sessionId: session.sessionId,
      label: `${name} · ${new Date(session.scheduledStartAt).toLocaleString()} (${session.status})`,
    }
  })
}
