import type { PatientAppointmentSummary } from "@/src/patient/booking/api"

/** Patient-facing lifecycle bucket for appointments list (Wave 14). */
export type AppointmentLifecyclePhase = "scheduled" | "starting_soon" | "active_window" | "completed" | "did_not_occur"

export type AppointmentPhaseDisplay = {
  phase: AppointmentLifecyclePhase
  /** Short badge label */
  label: string
}

/**
 * Maps stored appointment status + time to a coarse lifecycle phase for UX badges.
 * Does not replace clinical billing status labels from the API.
 */
export function mapAppointmentPhase(
  row: PatientAppointmentSummary,
  bucket: "upcoming" | "past",
): AppointmentPhaseDisplay {
  if (row.status === "cancelled") {
    return { phase: "did_not_occur", label: "Cancelled" }
  }
  if (row.status === "no_show") {
    return { phase: "did_not_occur", label: "No-show" }
  }
  if (bucket === "past" || row.status === "completed") {
    return { phase: "completed", label: "Completed" }
  }

  const now = Date.now()
  const startMs = new Date(row.scheduledStartAt).getTime()
  const endMs = new Date(row.scheduledEndAt).getTime()

  if (row.status === "in_progress") {
    return { phase: "active_window", label: "In session" }
  }
  if (now >= startMs && now <= endMs) {
    return { phase: "active_window", label: "Join window" }
  }
  if (now < startMs) {
    const minutesToStart = (startMs - now) / (60 * 1000)
    if (minutesToStart <= 60 * 24) {
      return { phase: "starting_soon", label: "Starting soon" }
    }
    return { phase: "scheduled", label: "Scheduled" }
  }

  return { phase: "scheduled", label: row.statusLabel }
}
