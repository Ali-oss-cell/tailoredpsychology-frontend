import type { SessionSummary } from "@/src/sessions/api"

/** Sessions whose scheduled start falls on the same local calendar day as `nowMs`. */
export function filterSessionsScheduledToday(sessions: SessionSummary[], nowMs: number = Date.now()): SessionSummary[] {
  const start = new Date(nowMs)
  start.setHours(0, 0, 0, 0)
  const end = new Date(nowMs)
  end.setHours(23, 59, 59, 999)
  return sessions.filter((session) => {
    const when = new Date(session.scheduledStartAt).getTime()
    return when >= start.getTime() && when <= end.getTime()
  })
}
