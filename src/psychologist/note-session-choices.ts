import { formatDateTimeAu } from "@/src/lib/format-au"
import { resolvePatientDisplayNames } from "@/src/psychologist/resolve-patient-display-names"
import { getPsychologistSessions } from "@/src/sessions/api"

import { getPsychologistWorkspace } from "./workspace/api"

export type NoteSessionChoice = {
  patientId: string
  sessionId: string
  label: string
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
        label: `${name} · ${formatDateTimeAu(item.startsAt)}`,
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
      label: `${name} · ${formatDateTimeAu(session.scheduledStartAt)} (${session.status})`,
    }
  })
}
