"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { PsychologistShell } from "@/components/psychologist/psychologist-shell"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
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
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <PatientPageHeader
            title={psychologistScheduleContent.header.title}
            description={psychologistScheduleContent.header.description}
          />
          <div className="flex flex-wrap items-center gap-2">
            {lastUpdated ? (
              <span className="text-muted-foreground text-xs">
                Updated {lastUpdated.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" })}
              </span>
            ) : null}
            <Button type="button" variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
              {loading ? "Refreshing…" : "Refresh"}
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Today&apos;s Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? <DashboardStateBlock variant="loading" message="Loading schedule..." /> : null}
            {error ? <DashboardStateBlock variant="error" message={error} /> : null}
            {!loading && !error && entries.length === 0 ? (
              <DashboardStateBlock variant="empty" message="No schedule entries." />
            ) : null}
            {!loading &&
              !error &&
              entries.map((entry) => {
                const isNextUp = entry.sessionId === nextUpId
                return (
                  <div
                    key={entry.sessionId}
                    className={`bg-muted/40 border-border/60 grid grid-cols-2 gap-2 rounded-lg border p-3 md:grid-cols-5 ${
                      isNextUp ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20" : ""
                    }`}
                  >
                    <p className="text-sm font-medium">{new Date(entry.scheduledStartAt).toLocaleTimeString()}</p>
                    <p className="text-sm">{entry.patientId}</p>
                    <p className="text-muted-foreground text-sm">{entry.status}</p>
                    <p className="text-sm">{entry.clinicianId}</p>
                    <p className="text-primary text-sm font-medium">{isNextUp ? "Next up" : "Scheduled"}</p>
                  </div>
                )
              })}
          </CardContent>
        </Card>
      </section>
    </PsychologistShell>
  )
}
