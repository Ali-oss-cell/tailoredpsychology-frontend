import type { ClinicianAvailabilityResponse } from "@/src/patient/booking/api"

export function monthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function shiftMonth(date: Date, offset: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1)
}

export function dateKey(date: Date): string {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, "0")
  const d = `${date.getDate()}`.padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function monthLabel(date: Date): string {
  return date.toLocaleDateString("en-AU", { month: "long", year: "numeric" })
}

export function monthGridDays(currentMonth: Date): Date[] {
  const first = monthStart(currentMonth)
  const startWeekday = first.getDay()
  const gridStart = new Date(first)
  gridStart.setDate(first.getDate() - startWeekday)

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart)
    day.setDate(gridStart.getDate() + index)
    return day
  })
}

export function monthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export function formatTimeLabel(time24h: string): string {
  const [hourPart, minutePart] = time24h.split(":")
  const hour = Number(hourPart)
  const minute = Number(minutePart)
  const suffix = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12}:${`${minute}`.padStart(2, "0")} ${suffix}`
}

function formatDateTimeLabel(dateIso: string, time24h: string): string {
  const date = new Date(`${dateIso}T${time24h}:00`)
  if (Number.isNaN(date.getTime())) {
    return "No current slots"
  }
  return date.toLocaleString("en-AU", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function findNextAvailableLabel(
  payload: ClinicianAvailabilityResponse[],
  clinicianId?: string,
): string {
  let next: { date: string; time: string } | null = null
  for (const clinician of payload) {
    if (clinicianId && clinician.clinicianId !== clinicianId) {
      continue
    }
    for (const slot of clinician.slots) {
      if (!slot.available) continue
      if (!next) {
        next = { date: slot.date, time: slot.startTime }
        continue
      }
      const candidate = new Date(`${slot.date}T${slot.startTime}:00`).getTime()
      const current = new Date(`${next.date}T${next.time}:00`).getTime()
      if (!Number.isNaN(candidate) && candidate < current) {
        next = { date: slot.date, time: slot.startTime }
      }
    }
  }
  return next ? formatDateTimeLabel(next.date, next.time) : "No current slots"
}

export function toScheduleByDate(payload: ClinicianAvailabilityResponse[]) {
  const mapped: Record<string, { id: string; label: string; clinicianId: string }[]> = {}
  for (const clinician of payload) {
    for (const slot of clinician.slots) {
      if (!slot.available) {
        continue
      }
      mapped[slot.date] ??= []
      mapped[slot.date].push({
        id: slot.slotId,
        label: formatTimeLabel(slot.startTime),
        clinicianId: clinician.clinicianId,
      })
    }
  }
  return mapped
}

export type ClinicianOption = {
  id: string
  name: string
  specialty: string
  nextAvailable: string
  profileImageUrl?: string
  bio?: string
}
