const MINUTE_IN_MS = 60 * 1000
const HOUR_IN_MS = 60 * MINUTE_IN_MS
const DAY_IN_MS = 24 * HOUR_IN_MS

function pluralize(value: number, unit: string): string {
  return `${value} ${unit}${value === 1 ? "" : "s"} ago`
}

export function formatRelativeTimestamp(isoTimestamp: string): string {
  const timestamp = new Date(isoTimestamp).getTime()
  if (Number.isNaN(timestamp)) return "unknown"

  const diffMs = Math.max(0, Date.now() - timestamp)
  if (diffMs < MINUTE_IN_MS) return "just now"
  if (diffMs < HOUR_IN_MS) return pluralize(Math.floor(diffMs / MINUTE_IN_MS), "min")
  if (diffMs < DAY_IN_MS) return pluralize(Math.floor(diffMs / HOUR_IN_MS), "hr")
  return pluralize(Math.floor(diffMs / DAY_IN_MS), "day")
}
