"use client"

import * as React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { PsychologistDayScheduleView } from "@/components/psychologist/schedule/psychologist-day-schedule-view"
import { PsychologistPortalPage } from "@/components/psychologist/psychologist-portal-page"
import { Button } from "@/components/ui/button"
import { formatTimeAu } from "@/src/lib/format-au"
import { psychologistScheduleContent } from "@/content/psychologist-schedule"
import { psychologistQueryKeys } from "@/src/psychologist/queries/keys"
import { usePsychologistId } from "@/src/psychologist/queries/use-current-user"
import { usePsychologistSessions } from "@/src/psychologist/queries/use-psychologist-sessions"
import { resolvePatientDisplayNames } from "@/src/psychologist/resolve-patient-display-names"
import { filterSessionsScheduledOnDay } from "@/src/psychologist/session-filters"
import { useHasMounted } from "@/src/shared/use-client-now"

export default function PsychologistSchedulePage() {
  const queryClient = useQueryClient()
  const psychologistId = usePsychologistId()
  const sessionsQuery = usePsychologistSessions(psychologistId)
  const mounted = useHasMounted()
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null)

  React.useEffect(() => {
    if (mounted && selectedDay == null) {
      setSelectedDay(new Date())
    }
  }, [mounted, selectedDay])

  const dayEntries = React.useMemo(
    () =>
      selectedDay
        ? filterSessionsScheduledOnDay(sessionsQuery.data ?? [], selectedDay).sort(
            (a, b) => new Date(a.scheduledStartAt).getTime() - new Date(b.scheduledStartAt).getTime(),
          )
        : [],
    [selectedDay, sessionsQuery.data],
  )

  const dayPatientIds = React.useMemo(
    () => [...new Set(dayEntries.map((entry) => entry.patientId))].sort(),
    [dayEntries],
  )

  const namesQuery = useQuery({
    queryKey: [...psychologistQueryKeys.sessions(psychologistId), "patient-names", dayPatientIds],
    queryFn: async () => {
      const names = await resolvePatientDisplayNames(psychologistId!, dayPatientIds)
      return Object.fromEntries(names)
    },
    enabled: Boolean(psychologistId) && dayPatientIds.length > 0,
    staleTime: 60_000,
  })

  const refresh = () => {
    if (!psychologistId) return
    void queryClient.invalidateQueries({ queryKey: psychologistQueryKeys.sessions(psychologistId) })
  }

  const loading = sessionsQuery.isLoading || !selectedDay
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
              Updated {formatTimeAu(lastUpdated, { second: "2-digit" })}
            </span>
          ) : null}
          <Button type="button" variant="outline" size="sm" onClick={refresh} disabled={loading || !psychologistId}>
            {loading ? "Refreshing…" : "Refresh"}
          </Button>
        </>
      }
    >
      {selectedDay ? (
        <PsychologistDayScheduleView
          entries={dayEntries}
          patientNamesById={namesQuery.data}
          selectedDay={selectedDay}
          onSelectedDayChange={setSelectedDay}
          loading={sessionsQuery.isLoading}
          error={error}
          onRetry={refresh}
        />
      ) : (
        <p className="text-muted-foreground text-sm">Loading schedule…</p>
      )}
    </PsychologistPortalPage>
  )
}
