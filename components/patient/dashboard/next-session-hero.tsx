"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarPlus, Lightbulb, Microphone, VideoCamera } from "@phosphor-icons/react/dist/ssr"
import { useEffect, useState } from "react"

import { AppointmentManagePanel } from "@/components/patient/appointments/appointment-manage-panel"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { EmptyState, EmptyStateAction } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { PatientNextSession } from "@/src/patient/dashboard/api"
import { isJoinImminent } from "@/src/patient/dashboard/join-cta"
import { guideFor } from "@/src/patient/journey/step-guide"
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
  const dateLabel = start.toLocaleDateString("en-AU", { weekday: "long", month: "long", day: "numeric" })
  const timeOpts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" }
  return {
    dateLabel,
    timeLabel: `${start.toLocaleTimeString("en-AU", timeOpts)} – ${end.toLocaleTimeString("en-AU", timeOpts)}`,
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

function statusChipClasses(status: PatientNextSession["status"]): string {
  if (status === "in_progress") return "bg-success/10 text-success border-success/25"
  if (status === "cancelled" || status === "no_show") return "bg-destructive/10 text-destructive border-destructive/25"
  return "bg-primary/10 text-primary border-primary/25"
}

function sessionTitle(session: PatientNextSession): string {
  if (session.status === "in_progress") return "Session started"
  if (session.window.status === "open" || isJoinImminent(session)) return "Session ready"
  return "Upcoming session"
}

function sessionDescription(session: PatientNextSession): string {
  if (session.status === "in_progress") {
    return "You joined the telehealth session (or the session officially opened)."
  }
  const guide = guideFor("session_started")
  return guide?.meaning ?? "Your next telehealth visit is scheduled."
}

function whatToDoHint(session: PatientNextSession): string {
  const guide = guideFor("session_started")
  if (session.status === "in_progress" || session.window.status === "open" || isJoinImminent(session)) {
    return guide?.whenPending ?? "Join from the dashboard when your session window opens."
  }
  return "On the day of care, join from the dashboard when your session window opens."
}

/**
 * Hero card for the active or next session — primary dashboard action surface.
 */
export function NextSessionHero({ session, loading = false, error = null, onRetry }: NextSessionHeroProps) {
  const [showManage, setShowManage] = useState(false)
  const countdown = useCountdownLabel(session?.scheduledStartAt)

  if (loading) {
    return (
      <Card className="dashboard-card min-h-[13rem] rounded-2xl shadow-e2" aria-busy="true" aria-label="Loading your next session">
        <CardContent className="space-y-5 p-6">
          <Skeleton className="skeleton-shimmer h-4 w-28" />
          <div className="space-y-2">
            <Skeleton className="skeleton-shimmer h-8 w-64" />
            <Skeleton className="skeleton-shimmer h-5 w-44" />
          </div>
          <Skeleton className="skeleton-shimmer h-12 w-44 rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="dashboard-card min-h-[13rem] rounded-2xl shadow-e2">
        <CardContent className="space-y-4 p-6">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Current step</p>
          <DashboardStateBlock variant="error" message={error} onRetry={onRetry} />
        </CardContent>
      </Card>
    )
  }

  if (!session) {
    return (
      <Card className="dashboard-card interactive-lift min-h-[13rem] rounded-2xl shadow-e2">
        <CardContent className="space-y-4 p-6">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Current step</p>
          <div data-tutorial="patient.dashboard.hero-book">
            <EmptyState
              className="items-start border-none bg-transparent px-0 py-0 text-left"
              title="Ready when you are"
              description="You have no upcoming sessions. Book your next visit whenever it feels right."
              icon={<CalendarPlus size={24} weight="duotone" />}
              action={<EmptyStateAction href="/patient/book-appointment" label="Book appointment" />}
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  const { dateLabel, timeLabel } = formatSessionSchedule(session.scheduledStartAt, session.scheduledEndAt)
  const joinOpen = session.window.status === "open" || isJoinImminent(session)
  const statusLabel = session.status === "in_progress" ? "In progress" : session.statusLabel

  return (
    <Card className="dashboard-card interactive-lift overflow-hidden rounded-2xl shadow-e2">
      <CardContent className="p-0">
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8 lg:p-8">
          <div className="min-w-0 space-y-4">
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Current step</p>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-2xl font-semibold tracking-tight">{sessionTitle(session)}</h2>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                    statusChipClasses(session.status),
                  )}
                >
                  {statusLabel}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed md:text-base">{sessionDescription(session)}</p>
            </div>

            <div className="bg-muted/40 flex gap-3 rounded-xl border border-border/50 p-3">
              <Lightbulb className="text-primary mt-0.5 shrink-0" size={18} weight="duotone" aria-hidden />
              <div className="min-w-0 space-y-0.5">
                <p className="text-foreground text-sm font-medium">What to do</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{whatToDoHint(session)}</p>
              </div>
            </div>

            <div className="text-muted-foreground space-y-0.5 text-sm">
              <p className="text-foreground font-medium tabular-nums">{dateLabel}</p>
              <p className="tabular-nums">{timeLabel}</p>
              <p>{session.clinicianName} · {session.sessionTypeLabel}</p>
              {countdown ? <p className="text-primary font-medium">{countdown}</p> : null}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 lg:items-end">
            <div className="relative hidden h-32 w-40 sm:block" aria-hidden>
              <Image src="/assets/telehealth-session.svg" alt="" fill className="object-contain" />
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto" data-tutorial="patient.dashboard.join-session">
              {joinOpen ? (
                <div data-tutorial="patient.dashboard.hero-join">
                  <Button
                    asChild
                    size="lg"
                    className={cn(
                      "press h-12 min-w-[11rem] rounded-xl px-6 text-base shadow-primary-glow",
                      session.window.status === "open" && "join-live-pulse",
                    )}
                  >
                    <Link href={joinSessionHref(session.appointmentId)}>
                      <VideoCamera size={20} />
                      Join session
                    </Link>
                  </Button>
                </div>
              ) : null}
              <Link
                href="/patient/dashboard"
                className="text-primary inline-flex items-center justify-center gap-1 text-sm font-medium underline-offset-2 hover:underline"
              >
                Go to dashboard <ArrowRight size={14} aria-hidden />
              </Link>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button asChild variant="outline" size="sm" className="press">
                  <Link href="/patient/video-setup" data-tutorial="patient.dashboard.video-setup-link">
                    <Microphone size={16} />
                    Test camera &amp; mic
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="press"
                  aria-expanded={showManage}
                  onClick={() => setShowManage((open) => !open)}
                >
                  {showManage ? "Close manage" : "Manage"}
                </Button>
              </div>
              {!joinOpen ? (
                <p className="text-muted-foreground text-center text-xs lg:text-right">
                  Join opens 15 minutes before your session starts.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {showManage ? (
          <div className="border-border/60 border-t px-6 pb-6 lg:px-8">
            <AppointmentManagePanel appointmentId={session.appointmentId} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
