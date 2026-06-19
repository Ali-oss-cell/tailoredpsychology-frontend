import type { PatientAppointmentSummary } from "@/src/patient/booking/api"

const JOIN_IMMINENT_MINUTES = 15

export function pickNextUpcoming(upcoming: PatientAppointmentSummary[]): PatientAppointmentSummary | null {
  if (upcoming.length === 0) return null
  const now = Date.now()
  return upcoming.find((a) => new Date(a.scheduledStartAt).getTime() > now) ?? upcoming[0]
}

/** True when patient should see the hero Join CTA (in session or starting within 15 minutes). */
export function isJoinImminent(row: PatientAppointmentSummary | null, nowMs = Date.now()): boolean {
  if (!row) return false
  if (row.status === "in_progress") return true

  const startMs = new Date(row.scheduledStartAt).getTime()
  const endMs = new Date(row.scheduledEndAt).getTime()
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return false

  if (nowMs >= startMs && nowMs <= endMs) return true

  const minutesToStart = (startMs - nowMs) / (60 * 1000)
  return minutesToStart >= 0 && minutesToStart <= JOIN_IMMINENT_MINUTES
}

export function shouldShowBookHero(row: PatientAppointmentSummary | null): boolean {
  return row === null
}
