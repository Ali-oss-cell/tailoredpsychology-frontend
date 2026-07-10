import { CalendarBlank } from "@phosphor-icons/react"

import { formatDateAu, getAustralianEasternTzAbbreviation } from "@/src/lib/format-au"

type BookingAppointmentSummaryChipProps = {
  clinicianName: string
  dateIso: string
  timeLabel: string
}

export function BookingAppointmentSummaryChip({
  clinicianName,
  dateIso,
  timeLabel,
}: BookingAppointmentSummaryChipProps) {
  return (
    <div
      className="border-primary/30 bg-background/95 fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-lg items-center gap-3 rounded-full border px-4 py-2.5 shadow-e2 backdrop-blur-sm md:inset-x-auto md:right-6 md:left-auto"
      role="status"
      aria-live="polite"
      aria-label="Your selected appointment"
    >
      <CalendarBlank size={18} className="text-primary shrink-0" aria-hidden />
      <p className="min-w-0 truncate text-xs sm:text-sm">
        <span className="font-medium">{clinicianName}</span>
        <span className="text-muted-foreground">
          {" "}
          · {formatDateAu(`${dateIso}T12:00:00`)} · {timeLabel} ({getAustralianEasternTzAbbreviation(`${dateIso}T12:00:00`)})
        </span>
      </p>
    </div>
  )
}
