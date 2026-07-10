"use client"

import * as React from "react"

import { PsychologistDayScheduleView } from "@/components/psychologist/schedule/psychologist-day-schedule-view"
import { PsychologistPortalPage } from "@/components/psychologist/psychologist-portal-page"
import { PsychologistShell } from "@/components/psychologist/psychologist-shell"
import { Button } from "@/components/ui/button"
import { psychologistScheduleContent } from "@/content/psychologist-schedule"
import { getCurrentUser } from "@/src/auth/current-user"
import { filterSessionsScheduledOnDay } from "@/src/psychologist/session-filters"
import { getPsychologistSessions, type SessionSummary } from "@/src/sessions/api"

export default function PsychologistSchedulePage() {
  const [allSessions, setAllSessions] = React.useState<SessionSummary[]>([])
  const [selectedDay, setSelectedDay] = React.useState(() => new Date())
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const user = await getCurrentUser()
      const sessions = await getPsychologistSessions(user.id)
      setAllSessions(sessions)
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

  const dayEntries = React.useMemo(
    () =>
      filterSessionsScheduledOnDay(allSessions, selectedDay).sort(
        (a, b) => new Date(a.scheduledStartAt).getTime() - new Date(b.scheduledStartAt).getTime(),
      ),
    [allSessions, selectedDay],
  )

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
        <PsychologistDayScheduleView
          entries={dayEntries}
          selectedDay={selectedDay}
          onSelectedDayChange={setSelectedDay}
          loading={loading}
          error={error}
          onRetry={() => void load()}
        />
      </PsychologistPortalPage>
    </PsychologistShell>
  )
}
