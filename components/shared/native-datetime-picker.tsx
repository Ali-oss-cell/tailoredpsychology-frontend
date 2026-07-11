/** Shared date/time selection utilities and native `<select>` styling for portal forms. */

export const NATIVE_DATETIME_MINUTE_STEPS = [0, 15, 30, 45] as const

export const nativeDatetimeSelectClassName =
  "border-border focus-visible:ring-ring bg-background h-9 w-full rounded-md border px-2 text-sm outline-none transition-colors focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60"

export const nativeDatetimeRowClassName =
  "border-border/70 grid gap-2 rounded-xl border border-border/60 bg-muted/20 p-3 sm:grid-cols-[1fr_auto] sm:items-end"

export function dateKeyFromDate(date: Date): string {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, "0")
  const d = `${date.getDate()}`.padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function pad2(n: number): string {
  return `${n}`.padStart(2, "0")
}

export function formatHourLabel(h: number): string {
  if (h === 0) return "12 AM"
  if (h < 12) return `${h} AM`
  if (h === 12) return "12 PM"
  return `${h - 12} PM`
}

export function parseDatetimeLocal(value: string): { dateKey: string; hour: number; minute: number } | null {
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/.exec(value.trim())
  if (!m) return null
  const hour = Number(m[2])
  const minute = Number(m[3])
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null
  return { dateKey: m[1], hour, minute }
}

export function combineDatetimeLocal(dateKey: string, hour: number, minute: number): string {
  return `${dateKey}T${pad2(hour)}:${pad2(minute)}`
}

export function snapTimeUp(hour: number, minute: number): [number, number] {
  const total = hour * 60 + minute
  const snapped = Math.ceil(total / 15) * 15
  if (snapped >= 24 * 60) return [23, 45]
  const nh = Math.floor(snapped / 60)
  const nm = snapped % 60
  return [nh, nm]
}

export function nextDateKey(dk: string): string {
  const d = new Date(`${dk}T12:00:00`)
  d.setDate(d.getDate() + 1)
  return dateKeyFromDate(d)
}
