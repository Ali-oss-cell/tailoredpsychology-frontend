"use client"

import Link from "next/link"
import { VideoCamera } from "@phosphor-icons/react/dist/ssr"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PortalListRow } from "@/components/shared/portal-list-row"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { joinSessionHref } from "@/src/session/join-session"
import type { SessionSummary } from "@/src/sessions/api"

type TodayScheduleCardProps = {
  entries?: SessionSummary[]
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}

const JOIN_IMMINENT_MINUTES = 15

/** True when a session's join window is open (in progress or starting within 15 minutes). */
function isJoinable(entry: SessionSummary, nowMs: number): boolean {
  if (entry.status === "in_progress") return true
  if (entry.status !== "scheduled") return false
  const startMs = new Date(entry.scheduledStartAt).getTime()
  const endMs = new Date(entry.scheduledEndAt).getTime()
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return false
  if (nowMs >= startMs && nowMs <= endMs) return true
  const minutesToStart = (startMs - nowMs) / (60 * 1000)
  return minutesToStart >= 0 && minutesToStart <= JOIN_IMMINENT_MINUTES
}

export function TodayScheduleCard({ entries = [], loading = false, error = null, onRetry }: TodayScheduleCardProps) {
  const nowMs = Date.now()
  const nextUpId =
    entries.find((entry) => new Date(entry.scheduledStartAt).getTime() > nowMs)?.sessionId ?? entries[0]?.sessionId

  return (
    <Card className="dashboard-card interactive-lift md:col-span-7 rounded-2xl shadow-e1">
      <CardHeader className="pb-3">
        <p className="card-eyebrow">Today</p>
        <CardTitle className="font-heading text-lg font-semibold">Today&apos;s Schedule</CardTitle>
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
            const joinable = isJoinable(entry, nowMs)
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
                {joinable ? (
                  <Button asChild size="sm" className="press md:justify-self-end">
                    <Link href={joinSessionHref(entry.sessionId)}>
                      <VideoCamera size={14} />
                      Join now
                    </Link>
                  </Button>
                ) : (
                  <Link
                    href={`/psychologist/patients/${encodeURIComponent(entry.patientId)}`}
                    className="text-primary text-sm font-medium hover:underline md:text-right"
                  >
                    {isNextUp ? "Next up" : "Open"}
                  </Link>
                )}
              </PortalListRow>
            )
          })}
      </CardContent>
    </Card>
  )
}
