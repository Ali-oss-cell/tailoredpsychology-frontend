"use client"

import Link from "next/link"
import { CalendarPlus, Microphone, User, VideoCamera } from "@phosphor-icons/react/dist/ssr"
import { useEffect, useState } from "react"

import { AppointmentManagePanel } from "@/components/patient/appointments/appointment-manage-panel"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { PatientNextSession } from "@/src/patient/dashboard/api"
import { isJoinImminent } from "@/src/patient/dashboard/join-cta"
import { joinSessionHref } from "@/src/session/join-session"

type NextSessionHeroProps = {
  session: PatientNextSession | null
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

/** "Starts in 3h 24m" under 24h out; null otherwise. Ticks every 30s. */
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

function statusChipClasses(status: PatientNextSession["status"]): string {
  if (status === "in_progress") return "bg-success/10 text-success border-success/25"
  if (status === "cancelled" || status === "no_show") return "bg-destructive/10 text-destructive border-destructive/25"
  return "bg-primary/10 text-primary border-primary/25"
}

/**
 * Merged hero: replaces the old floating hero CTA + separate upcoming-session
 * card. One surface owns the "what happens next" moment — session details,
 * live countdown, join CTA (window-aware), and manage actions.
 */
export function NextSessionHero({ session, loading = false, error = null, onRetry }: NextSessionHeroProps) {
  const [showManage, setShowManage] = useState(false)
  const countdown = useCountdownLabel(session?.scheduledStartAt)

  if (loading) {
    return (
      <Card className="min-h-[13rem] shadow-e2" aria-busy="true" aria-label="Loading your next session">
        <CardContent className="space-y-5 pt-6">
          <Skeleton className="skeleton-shimmer h-4 w-28" />
          <div className="space-y-2">
            <Skeleton className="skeleton-shimmer h-7 w-64" />
            <Skeleton className="skeleton-shimmer h-5 w-44" />
          </div>
          <div className="flex gap-2 border-t border-border/60 pt-4">
            <Skeleton className="skeleton-shimmer h-10 w-44 rounded-md" />
            <Skeleton className="skeleton-shimmer h-10 w-28 rounded-md" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="min-h-[13rem] shadow-e2">
        <CardContent className="space-y-4 pt-6">
          <p className="card-eyebrow">Next session</p>
          <DashboardStateBlock variant="error" message={error} onRetry={onRetry} />
        </CardContent>
      </Card>
    )
  }

  if (!session) {
    return (
      <Card className="min-h-[13rem] shadow-e2">
        <CardContent className="flex flex-col items-start gap-4 pt-6">
          <p className="card-eyebrow">Next session</p>
          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">Ready when you are</h2>
            <p className="text-muted-foreground max-w-md text-sm">
              You have no upcoming sessions. Take the next step in your care whenever it feels right.
            </p>
          </div>
          <div data-tutorial="patient.dashboard.hero-book">
            <Button asChild size="lg" className="press">
              <Link href="/patient/book-appointment">
                <CalendarPlus size={18} />
                Book New Session
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { dateLabel, timeLabel } = formatSessionSchedule(session.scheduledStartAt, session.scheduledEndAt)
  const joinOpen = session.window.status === "open" || isJoinImminent(session)

  return (
    <Card className="min-h-[13rem] shadow-e2">
      <CardContent className="space-y-5 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="card-eyebrow">Next session</p>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
              statusChipClasses(session.status),
            )}
          >
            {session.status === "in_progress" ? "In session" : session.statusLabel}
          </span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-semibold tracking-tight tabular-nums">{dateLabel}</h2>
            <p className="text-muted-foreground text-base tabular-nums">{timeLabel}</p>
            {countdown ? <p className="text-primary text-sm font-medium">{countdown}</p> : null}
          </div>
          <div className="space-y-1 text-right">
            <p className="inline-flex items-center gap-2 text-sm font-medium">
              <User size={16} className="text-muted-foreground" />
              {session.clinicianName}
            </p>
            <p className="text-muted-foreground text-sm">{session.sessionTypeLabel}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-4" data-tutorial="patient.dashboard.join-session">
          {joinOpen ? (
            <div data-tutorial="patient.dashboard.hero-join">
              <Button asChild size="lg" className={cn("press shadow-primary-glow", session.window.status === "open" && "join-live-pulse")}>
                <Link href={joinSessionHref(session.appointmentId)}>
                  <VideoCamera size={18} />
                  Join Video Session
                </Link>
              </Button>
            </div>
          ) : null}
          <Button asChild variant="outline" size="default" className="press">
            <Link href="/patient/video-setup" data-tutorial="patient.dashboard.video-setup-link">
              <Microphone size={16} />
              Test camera &amp; mic
            </Link>
          </Button>
          <Button
            variant="outline"
            className="press"
            aria-expanded={showManage}
            onClick={() => setShowManage((open) => !open)}
          >
            {showManage ? "Close Manage" : "Manage"}
          </Button>
          {!joinOpen ? (
            <p className="text-muted-foreground w-full text-xs sm:w-auto">
              Join opens 15 minutes before your session starts.
            </p>
          ) : null}
        </div>

        {showManage ? <AppointmentManagePanel appointmentId={session.appointmentId} /> : null}
      </CardContent>
    </Card>
  )
}
