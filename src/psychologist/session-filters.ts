import type { SessionSummary } from "@/src/sessions/api"

function startOfLocalDay(ms: number): Date {
  const start = new Date(ms)
  start.setHours(0, 0, 0, 0)
  return start
}

function endOfLocalDay(ms: number): Date {
  const end = new Date(ms)
  end.setHours(23, 59, 59, 999)
  return end
}

export function sameLocalDay(left: Date | number, right: Date | number): boolean {
  const a = new Date(left)
  const b = new Date(right)
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/** Sessions whose scheduled start falls on the same local calendar day as `day`. */
export function filterSessionsScheduledOnDay(
  sessions: SessionSummary[],
  day: Date | number,
): SessionSummary[] {
  const anchor = new Date(day)
  const start = startOfLocalDay(anchor.getTime())
  const end = endOfLocalDay(anchor.getTime())
  return sessions.filter((session) => {
    const when = new Date(session.scheduledStartAt).getTime()
    return when >= start.getTime() && when <= end.getTime()
  })
}

/** Sessions whose scheduled start falls on the same local calendar day as `nowMs`. */
export function filterSessionsScheduledToday(sessions: SessionSummary[], nowMs: number = Date.now()): SessionSummary[] {
  return filterSessionsScheduledOnDay(sessions, nowMs)
}
