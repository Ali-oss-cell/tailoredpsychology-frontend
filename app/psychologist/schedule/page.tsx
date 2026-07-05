"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PsychologistPortalPage } from "@/components/psychologist/psychologist-portal-page"
import { PsychologistShell } from "@/components/psychologist/psychologist-shell"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PortalListRow } from "@/components/shared/portal-list-row"
import { psychologistScheduleContent } from "@/content/psychologist-schedule"
import { getCurrentUser } from "@/src/auth/current-user"
import { filterSessionsScheduledToday } from "@/src/psychologist/session-filters"
import { getPsychologistSessions, type SessionSummary } from "@/src/sessions/api"

export default function PsychologistSchedulePage() {
  const [entries, setEntries] = React.useState<SessionSummary[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const user = await getCurrentUser()
      const sessions = await getPsychologistSessions(user.id)
      const today = filterSessionsScheduledToday(sessions).sort(
        (a, b) => new Date(a.scheduledStartAt).getTime() - new Date(b.scheduledStartAt).getTime(),
      )
      setEntries(today)
      setLastUpdated(new Date())
      setError(null)
    } catch {
      setError("Could not load schedule.")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void load()
  }, [load])

  const nowMs = Date.now()
  const nextUpId =
    entries.find((e) => new Date(e.scheduledStartAt).getTime() > nowMs)?.sessionId ?? entries[0]?.sessionId

  return (
    <PsychologistShell activeRoute="schedule">
      <PsychologistPortalPage
        title={psychologistScheduleContent.header.title}
        description={psychologistScheduleContent.header.description}
        eyebrow="Schedule"
        tutorialId="psychologist.page.schedule"
        actions={
          <>
            {lastUpdated ? (
              <span className="text-muted-foreground text-xs">
                Updated {lastUpdated.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" })}
              </span>
            ) : null}
            <Button type="button" variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
              {loading ? "Refreshing…" : "Refresh"}
            </Button>
          </>
        }
      >
        <Card className="interactive-lift">
          <CardHeader className="pb-3">
            <p className="card-eyebrow">Today</p>
            <CardTitle className="text-lg">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? <DashboardStateBlock variant="loading" message="Loading schedule..." /> : null}
            {error ? <DashboardStateBlock variant="error" message={error} onRetry={() => void load()} /> : null}
            {!loading && !error && entries.length === 0 ? (
              <DashboardStateBlock variant="empty" message="No schedule entries for today." />
            ) : null}
            {!loading &&
              !error &&
              entries.map((entry) => {
                const isNextUp = entry.sessionId === nextUpId
                return (
                  <PortalListRow
                    key={entry.sessionId}
                    highlight={isNextUp}
                    className="md:grid-cols-[minmax(0,1fr)_auto_auto_auto]"
                  >
                    <p className="text-sm font-medium tabular-nums">
                      {new Date(entry.scheduledStartAt).toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm">{entry.patientId}</p>
                    <p className="text-muted-foreground text-sm capitalize">{entry.status.replace(/_/g, " ")}</p>
                    <p className="text-primary text-sm font-medium">{isNextUp ? "Next up" : "Scheduled"}</p>
                  </PortalListRow>
                )
              })}
          </CardContent>
        </Card>
      </PsychologistPortalPage>
    </PsychologistShell>
  )
}
