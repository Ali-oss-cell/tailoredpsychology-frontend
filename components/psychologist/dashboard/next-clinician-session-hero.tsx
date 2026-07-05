"use client"

import Link from "next/link"
import { ChalkboardTeacher, User, VideoCamera } from "@phosphor-icons/react/dist/ssr"
import { useEffect, useState } from "react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { PsychologistNextSession } from "@/src/psychologist/dashboard/api"

const JOIN_IMMINENT_MINUTES = 15

/** True when clinician should see the hero Join CTA (in session or starting within 15 minutes). */
function isClinicianJoinImminent(row: PsychologistNextSession | null, nowMs = Date.now()): boolean {
  if (!row) return false
  if (row.status === "in_progress") return true

  const startMs = new Date(row.scheduledStartAt).getTime()
  const endMs = new Date(row.scheduledEndAt).getTime()
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return false

  if (nowMs >= startMs && nowMs <= endMs) return true

  const minutesToStart = (startMs - nowMs) / (60 * 1000)
  return minutesToStart >= 0 && minutesToStart <= JOIN_IMMINENT_MINUTES
}
import { joinSessionHref } from "@/src/session/join-session"

type NextClinicianSessionHeroProps = {
  session: PsychologistNextSession | null
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}

function formatSessionSchedule(startIso: string, endIso: string): { dateLabel: string; timeLabel: string } {
  const start = new Date(startIso)
  const end = new Date(endIso)
  const dateLabel = start.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
  const timeOpts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" }
  return {
    dateLabel,
    timeLabel: `${start.toLocaleTimeString(undefined, timeOpts)} – ${end.toLocaleTimeString(undefined, timeOpts)}`,
  }
}

function useCountdownLabel(startIso: string | undefined): string | null {
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    if (!startIso) return
    const timer = window.setInterval(() => setNowMs(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [startIso])

  if (!startIso) return null
  const deltaMs = new Date(startIso).getTime() - nowMs
  if (Number.isNaN(deltaMs) || deltaMs > 24 * 60 * 60 * 1000) return null
  if (deltaMs <= 0) return "Starting now"

  const totalMinutes = Math.round(deltaMs / 60_000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `Starts in ${minutes}m`
  return `Starts in ${hours}h ${minutes}m`
}

function statusChipClasses(status: PsychologistNextSession["status"]): string {
  if (status === "in_progress") return "bg-success/10 text-success border-success/25"
  if (status === "cancelled" || status === "no_show") return "bg-destructive/10 text-destructive border-destructive/25"
  return "bg-primary/10 text-primary border-primary/25"
}

export function NextClinicianSessionHero({
  session,
  loading = false,
  error = null,
  onRetry,
}: NextClinicianSessionHeroProps) {
  const countdown = useCountdownLabel(session?.scheduledStartAt)

  if (loading) {
    return (
      <Card className="min-h-[12rem] shadow-e2" aria-busy="true" aria-label="Loading next session">
        <CardContent className="space-y-5 pt-6">
          <Skeleton className="skeleton-shimmer h-4 w-28" />
          <Skeleton className="skeleton-shimmer h-7 w-64" />
          <Skeleton className="skeleton-shimmer h-10 w-40 rounded-md" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="min-h-[12rem] shadow-e2">
        <CardContent className="space-y-4 pt-6">
          <p className="card-eyebrow">Next session</p>
          <DashboardStateBlock variant="error" message={error} onRetry={onRetry} />
        </CardContent>
      </Card>
    )
  }

  if (!session) {
    return (
      <Card className="min-h-[12rem] shadow-e2">
        <CardContent className="flex flex-col items-start gap-4 pt-6">
          <p className="card-eyebrow">Next session</p>
          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">No upcoming sessions</h2>
            <p className="text-muted-foreground max-w-md text-sm">Your schedule is clear. Check the pre-session workspace when new appointments appear.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/psychologist/schedule">View schedule</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const { dateLabel, timeLabel } = formatSessionSchedule(session.scheduledStartAt, session.scheduledEndAt)
  const joinOpen = session.window.status === "open" || isClinicianJoinImminent(session)

  return (
    <Card className="min-h-[12rem] shadow-e2">
      <CardContent className="space-y-5 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="card-eyebrow">Next session</p>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
              statusChipClasses(session.status),
            )}
          >
            {session.status.replace(/_/g, " ")}
          </span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-semibold tracking-tight tabular-nums">{dateLabel}</h2>
            <p className="text-muted-foreground text-base tabular-nums">{timeLabel}</p>
            {countdown ? <p className="text-primary text-sm font-medium">{countdown}</p> : null}
          </div>
          <p className="inline-flex items-center gap-2 text-sm font-medium">
            <User size={16} className="text-muted-foreground" />
            {session.patientId}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
          {joinOpen ? (
            <Button asChild size="lg" className="press shadow-primary-glow">
              <Link href={joinSessionHref(session.sessionId)}>
                <VideoCamera size={18} weight="fill" />
                Join session
              </Link>
            </Button>
          ) : (
            <Button size="lg" disabled title="Join opens closer to session time">
              <ChalkboardTeacher size={18} />
              Join opens soon
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href={`/psychologist/patients/${encodeURIComponent(session.patientId)}`}>Open patient</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/psychologist/schedule">Full schedule</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
