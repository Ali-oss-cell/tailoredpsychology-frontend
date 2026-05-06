/** Shared patient-facing appointment row labels (matches appointments list). */
export function formatSessionRange(startIso: string, endIso: string): { date: string; time: string } {
  const start = new Date(startIso)
  const end = new Date(endIso)
  const date = start.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
  const time = `${start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} – ${end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`
  return { date, time }
}
