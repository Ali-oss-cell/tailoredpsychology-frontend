import { formatDateTimeAu } from "@/src/lib/format-au"
import type { SessionVideoItem } from "@/src/psychologist/videos/api"

export function formatRecordingSessionLabel(
  recording: SessionVideoItem,
  clinicianNamesById?: Record<string, string>,
): string {
  const clinicianName = clinicianNamesById?.[recording.clinicianId]
  const dateLabel = formatDateTimeAu(recording.sessionDate)
  if (clinicianName) {
    return `Session with ${clinicianName} · ${dateLabel}`
  }
  return `Session · ${dateLabel}`
}

/** Clinician-facing recording row title (patient name + session time). */
export function formatClinicianRecordingLabel(
  recording: SessionVideoItem,
  patientNamesById?: Record<string, string> | Map<string, string>,
): string {
  const dateLabel = formatDateTimeAu(recording.sessionDate)
  const patientName =
    patientNamesById instanceof Map
      ? patientNamesById.get(recording.patientId)
      : patientNamesById?.[recording.patientId]
  if (patientName) {
    return `${patientName} · ${dateLabel}`
  }
  return `Session · ${dateLabel}`
}

export type RecordingPolicyStatus = SessionVideoItem["policyStatus"]

const POLICY_STATUS_LABELS: Record<RecordingPolicyStatus, string> = {
  active: "Available",
  hold: "On hold",
  purge_pending: "Scheduled for removal",
}

export function formatRecordingPolicyStatus(status: RecordingPolicyStatus): string {
  return POLICY_STATUS_LABELS[status] ?? status.replaceAll("_", " ")
}

export function recordingPolicyBadgeClassName(status: RecordingPolicyStatus): string {
  if (status === "active") {
    return "border-success/30 bg-success/10 text-success"
  }
  if (status === "hold") {
    return "border-warning/35 bg-warning/10 text-warning"
  }
  return "border-border/70 bg-muted text-muted-foreground"
}
