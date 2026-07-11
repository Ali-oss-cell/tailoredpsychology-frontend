import type { PatientNextSession } from "@/src/patient/dashboard/api"

function formatIcsUtc(iso: string): string {
  const date = new Date(iso)
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z")
}

function escapeIcsText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n")
}

export function buildAppointmentIcs(session: PatientNextSession): string {
  const uid = `${session.appointmentId}@tailoredpsychology`
  const now = formatIcsUtc(new Date().toISOString())
  const start = formatIcsUtc(session.scheduledStartAt)
  const end = formatIcsUtc(session.scheduledEndAt)
  const summary = escapeIcsText(`Telehealth session with ${session.clinicianName}`)
  const description = escapeIcsText(
    `${session.sessionTypeLabel} via Tailored Psychology telehealth. Join from your dashboard 15 minutes before the session.`,
  )

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tailored Psychology//Patient Portal//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    "LOCATION:Telehealth",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
}

export function downloadAppointmentIcs(session: PatientNextSession): void {
  const ics = buildAppointmentIcs(session)
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = `appointment-${session.appointmentId}.ics`
  anchor.click()
  URL.revokeObjectURL(url)
}
