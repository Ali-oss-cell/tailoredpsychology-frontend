"use client"

import Link from "next/link"
import { VideoCamera } from "@phosphor-icons/react/dist/ssr"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PortalListRow } from "@/components/shared/portal-list-row"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatTimeAu } from "@/src/lib/format-au"
import { formatSessionStatusLabel } from "@/src/psychologist/labels"
import { patientDisplayName } from "@/src/psychologist/resolve-patient-display-names"
import { joinSessionHref } from "@/src/session/join-session"
import type { SessionSummary } from "@/src/sessions/api"
import { useClientNow } from "@/src/shared/use-client-now"

type TodayScheduleCardProps = {
  entries?: SessionSummary[]
  patientNamesById?: Record<string, string>
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

export function TodayScheduleCard({
  entries = [],
  patientNamesById,
  loading = false,
  error = null,
  onRetry,
}: TodayScheduleCardProps) {
  const nowMs = useClientNow(30_000)
  const nextUpId =
    nowMs == null
      ? entries[0]?.sessionId
      : (entries.find((entry) => new Date(entry.scheduledStartAt).getTime() > nowMs)?.sessionId ??
        entries[0]?.sessionId)

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
            const joinable = nowMs != null && isJoinable(entry, nowMs)
            return (
              <PortalListRow
                key={entry.sessionId}
                highlight={isNextUp}
                className="md:grid-cols-[minmax(0,1fr)_auto_auto]"
              >
                <div>
                  <p className="text-sm font-medium">{patientDisplayName(patientNamesById, entry.patientId)}</p>
                  <p className="text-muted-foreground text-xs">{formatSessionStatusLabel(entry.status)}</p>
                </div>
                <p className="text-sm tabular-nums md:text-right">{formatTimeAu(entry.scheduledStartAt)}</p>
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
