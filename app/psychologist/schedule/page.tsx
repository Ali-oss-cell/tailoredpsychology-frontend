"use client"

import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"

import { PsychologistDayScheduleView } from "@/components/psychologist/schedule/psychologist-day-schedule-view"
import { PsychologistPortalPage } from "@/components/psychologist/psychologist-portal-page"
import { Button } from "@/components/ui/button"
import { psychologistScheduleContent } from "@/content/psychologist-schedule"
import { psychologistQueryKeys } from "@/src/psychologist/queries/keys"
import { usePsychologistId } from "@/src/psychologist/queries/use-current-user"
import { usePsychologistSessions } from "@/src/psychologist/queries/use-psychologist-sessions"
import { filterSessionsScheduledOnDay } from "@/src/psychologist/session-filters"

export default function PsychologistSchedulePage() {
  const queryClient = useQueryClient()
  const psychologistId = usePsychologistId()
  const sessionsQuery = usePsychologistSessions(psychologistId)
  const [selectedDay, setSelectedDay] = React.useState(() => new Date())

  const dayEntries = React.useMemo(
    () =>
      filterSessionsScheduledOnDay(sessionsQuery.data ?? [], selectedDay).sort(
        (a, b) => new Date(a.scheduledStartAt).getTime() - new Date(b.scheduledStartAt).getTime(),
      ),
    [selectedDay, sessionsQuery.data],
  )

  const refresh = () => {
    if (!psychologistId) return
    void queryClient.invalidateQueries({ queryKey: psychologistQueryKeys.sessions(psychologistId) })
  }

  const loading = sessionsQuery.isLoading
  const error = sessionsQuery.isError ? "Could not load schedule." : null
  const lastUpdated = sessionsQuery.dataUpdatedAt ? new Date(sessionsQuery.dataUpdatedAt) : null

  return (
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
          <Button type="button" variant="outline" size="sm" onClick={refresh} disabled={loading || !psychologistId}>
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
        onRetry={refresh}
      />
    </PsychologistPortalPage>
  )
}
