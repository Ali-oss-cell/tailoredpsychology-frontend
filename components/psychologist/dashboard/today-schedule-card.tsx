"use client"

import * as React from "react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/src/auth/current-user"
import { filterSessionsScheduledToday } from "@/src/psychologist/session-filters"
import { getPsychologistSessions, type SessionSummary } from "@/src/sessions/api"

export function TodayScheduleCard() {
  const [entries, setEntries] = React.useState<SessionSummary[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const user = await getCurrentUser()
        const sessions = await getPsychologistSessions(user.id)
        const today = filterSessionsScheduledToday(sessions)
        if (!cancelled) {
          setEntries(today)
          setError(null)
        }
      } catch {
        if (!cancelled) setError("Could not load today's schedule.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Card className="md:col-span-7">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Schedule Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
        {error ? <DashboardStateBlock variant="error" message={error} /> : null}
        {!loading && !error && entries.length === 0 ? <DashboardStateBlock variant="empty" message="No schedule items yet." /> : null}
        {entries.map((entry) => (
          <div
            key={entry.sessionId}
            className="bg-muted/40 flex items-center justify-between rounded-lg border border-border/60 p-3"
          >
            <div>
              <p className="text-sm font-medium">{entry.patientId}</p>
              <p className="text-muted-foreground text-xs">{entry.status}</p>
            </div>
            <p className="text-sm">{new Date(entry.scheduledStartAt).toLocaleTimeString()}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
