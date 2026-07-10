"use client"

import Link from "next/link"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PortalListRow } from "@/components/shared/portal-list-row"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SessionSummary } from "@/src/sessions/api"

type TodayScheduleCardProps = {
  entries?: SessionSummary[]
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}

export function TodayScheduleCard({ entries = [], loading = false, error = null, onRetry }: TodayScheduleCardProps) {
  const nowMs = Date.now()
  const nextUpId =
    entries.find((entry) => new Date(entry.scheduledStartAt).getTime() > nowMs)?.sessionId ?? entries[0]?.sessionId

  return (
    <Card className="dashboard-card interactive-lift md:col-span-7">
      <CardHeader className="pb-3">
        <p className="card-eyebrow">Today</p>
        <CardTitle className="text-lg">Schedule timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? <DashboardStateBlock variant="loading" message="Loading schedule..." /> : null}
        {error ? <DashboardStateBlock variant="error" message={error} onRetry={onRetry} /> : null}
        {!loading && !error && entries.length === 0 ? (
          <DashboardStateBlock variant="empty" message="No sessions scheduled for today." />
        ) : null}
        {!loading &&
          !error &&
          entries.map((entry) => {
            const isNextUp = entry.sessionId === nextUpId
            return (
              <PortalListRow
                key={entry.sessionId}
                highlight={isNextUp}
                className="md:grid-cols-[minmax(0,1fr)_auto_auto]"
              >
                <div>
                  <p className="text-sm font-medium">{entry.patientId}</p>
                  <p className="text-muted-foreground text-xs capitalize">{entry.status.replace(/_/g, " ")}</p>
                </div>
                <p className="text-sm tabular-nums md:text-right">
                  {new Date(entry.scheduledStartAt).toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
                <Link
                  href={`/psychologist/patients/${encodeURIComponent(entry.patientId)}`}
                  className="text-primary text-sm font-medium hover:underline md:text-right"
                >
                  {isNextUp ? "Next up" : "Open"}
                </Link>
              </PortalListRow>
            )
          })}
      </CardContent>
    </Card>
  )
}
