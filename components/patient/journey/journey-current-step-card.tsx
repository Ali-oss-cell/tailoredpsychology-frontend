"use client"

import Image from "next/image"
import Link from "next/link"
import {
  CalendarPlus,
  Lightbulb,
  MapPin,
  Microphone,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { AppointmentManagePanel } from "@/components/patient/appointments/appointment-manage-panel"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { EmptyState, EmptyStateAction } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { formatDateAu, formatTimeAu } from "@/src/lib/format-au"
import type { PatientNextSession } from "@/src/patient/dashboard/api"
import { isJoinImminent } from "@/src/patient/dashboard/join-cta"
import { downloadAppointmentIcs } from "@/src/patient/journey/calendar-ics"
import { guideFor, resolveJourneyCta } from "@/src/patient/journey/step-guide"
import type { PatientJourneyStep } from "@/src/patient/journey/api"
import { joinSessionHref } from "@/src/session/join-session"

export type JourneyCurrentStepCardProps = {
  step: PatientJourneyStep | null
  nextSession: PatientNextSession | null
  loading?: boolean
  error?: string | null
  onRetry?: () => void
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
  if (hours === 0) return `Join in ${minutes}m`
  return `Join in ${hours}h ${minutes}m`
}

function sessionAwareTitle(step: PatientJourneyStep | null, session: PatientNextSession | null): string {
  if (session?.status === "in_progress") return "Session started"
  if (session && (session.window.status === "open" || isJoinImminent(session))) return "Session ready"
  if (session) return "Upcoming session"
  if (step) return step.label
  return "Ready when you are"
}

function reassuranceCopy(step: PatientJourneyStep | null, session: PatientNextSession | null): string {
  if (session && (!step || step.key === "booking_confirmed" || step.key === "session_started")) {
    if (session.status === "in_progress" || session.window.status === "open") {
      return "Your telehealth visit is ready."
    }
    return "Your appointment is locked in."
  }
  const guide = step ? guideFor(step.key) : null
  return guide?.meaning ?? "We'll guide you through each step."
}

function whatToDoHint(step: PatientJourneyStep | null, session: PatientNextSession | null): string {
  const guide = guideFor(step?.key ?? "session_started")
  if (session && (session.status === "in_progress" || session.window.status === "open" || isJoinImminent(session))) {
    return guide?.whenPending ?? "Join from the dashboard when your session window opens."
  }
  if (step?.status === "pending") {
    return guide?.whenPending ?? "Complete earlier steps when you are ready."
  }
  return guide?.whenDone ?? "This milestone is recorded."
}

export function JourneyCurrentStepCard({
  step,
  nextSession,
  loading = false,
  error = null,
  onRetry,
}: JourneyCurrentStepCardProps) {
  const pathname = usePathname()
  const [showManage, setShowManage] = useState(false)
  const countdown = useCountdownLabel(nextSession?.scheduledStartAt)
  const joinOpen = Boolean(nextSession && (nextSession.window.status === "open" || isJoinImminent(nextSession)))
  const cta =
    step?.status === "pending" && step
      ? resolveJourneyCta(step, { pathname, nextSession })
      : null

  if (loading) {
    return (
      <Card
        className="dashboard-card min-h-[13rem] rounded-2xl shadow-e2"
        aria-busy="true"
        aria-label="Loading your next session"
      >
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

  if (!step && !nextSession) {
    return (
      <Card className="dashboard-card min-h-[13rem] rounded-2xl shadow-e2">
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

  const title = sessionAwareTitle(step, nextSession)
  const showSessionBlock = Boolean(
    nextSession && (!step || step.key === "booking_confirmed" || step.key === "session_started"),
  )

  return (
    <Card
      className="dashboard-card overflow-hidden rounded-2xl border-primary/30 shadow-e2"
      data-tutorial="patient.dashboard.current-step"
    >
      <CardContent className="p-0">
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8 lg:p-8">
          <div className="min-w-0 space-y-4">
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Current step</p>
              <h2 className="font-heading text-2xl font-semibold tracking-tight">{title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                {reassuranceCopy(step, nextSession)}
              </p>
            </div>

            {showSessionBlock && nextSession ? (
              <div className="bg-muted/40 space-y-3 rounded-xl border border-border/50 p-4">
                <p className="text-foreground text-sm font-medium">Next action</p>
                <div className="text-foreground space-y-0.5 text-sm">
                  <p className="font-medium tabular-nums">{formatDateAu(nextSession.scheduledStartAt)}</p>
                  <p className="tabular-nums">
                    {formatTimeAu(nextSession.scheduledStartAt)} – {formatTimeAu(nextSession.scheduledEndAt)}
                  </p>
                  <p>{nextSession.clinicianName}</p>
                  <p className="text-muted-foreground inline-flex items-center gap-1.5">
                    <MapPin size={14} aria-hidden />
                    Telehealth
                  </p>
                  {countdown ? <p className="text-primary font-medium">{countdown}</p> : null}
                </div>
              </div>
            ) : null}

            <div className="bg-muted/40 flex gap-3 rounded-xl border border-border/50 p-3">
              <Lightbulb className="text-primary mt-0.5 shrink-0" size={18} weight="duotone" aria-hidden />
              <div className="min-w-0 space-y-0.5">
                <p className="text-foreground text-sm font-medium">What to do</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{whatToDoHint(step, nextSession)}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 lg:items-end">
            <div className="relative hidden h-32 w-40 sm:block" aria-hidden>
              <Image src="/assets/telehealth-session.svg" alt="" fill className="object-contain" />
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto" data-tutorial="patient.dashboard.join-session">
              {joinOpen && nextSession ? (
                <div data-tutorial="patient.dashboard.hero-join">
                  <Button
                    asChild
                    size="lg"
                    className={cn(
                      "press min-w-[11rem] shadow-primary-glow",
                      nextSession.window.status === "open" && "join-live-pulse",
                    )}
                  >
                    <Link href={joinSessionHref(nextSession.appointmentId)}>
                      <VideoCamera size={20} />
                      Join session
                    </Link>
                  </Button>
                </div>
              ) : null}

              {nextSession ? (
                <>
                  <Button asChild variant="outline" size="sm" className="press w-full sm:w-auto">
                    <Link href="/patient/appointments">View appointment</Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="press w-full sm:w-auto"
                    onClick={() => downloadAppointmentIcs(nextSession)}
                  >
                    <CalendarPlus size={16} />
                    Add to calendar
                  </Button>
                </>
              ) : cta ? (
                <Button asChild size="sm" className="press w-full sm:w-auto">
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              ) : null}

              {nextSession ? (
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
              ) : null}

              {nextSession && !joinOpen ? (
                <p className="text-muted-foreground text-center text-xs lg:text-right">
                  Join opens 15 minutes before your session starts.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {showManage && nextSession ? (
          <div className="border-border/60 border-t px-6 pb-6 lg:px-8">
            <AppointmentManagePanel appointmentId={nextSession.appointmentId} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
