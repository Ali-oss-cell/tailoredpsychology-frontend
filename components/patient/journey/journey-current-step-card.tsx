"use client"

import Link from "next/link"
import {
  CalendarPlus,
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

function sessionStatusTitle(session: PatientNextSession | null): string {
  if (session?.status === "in_progress") return "Session in progress"
  if (session?.window.status === "open") return "Ready to join"
  if (session && isJoinImminent(session)) return "Your session is almost here"
  if (session) return "Upcoming session"
  return "Ready when you are"
}

function stepTitle(step: PatientJourneyStep | null, session: PatientNextSession | null): string {
  if (session) {
    if (session.status === "in_progress" || session.window.status === "open" || isJoinImminent(session)) {
      return sessionStatusTitle(session)
    }
    return "Upcoming session"
  }
  if (step) return guideFor(step.key)?.timelineLabel ?? step.label
  return "Ready when you are"
}

function statusLine(step: PatientJourneyStep | null, session: PatientNextSession | null): string {
  if (session) {
    if (session.status === "in_progress" || session.window.status === "open") {
      return "You can join now. Testing your camera and mic is optional prep."
    }
    if (isJoinImminent(session)) {
      return "Get comfortable — join opens soon. Device checks are optional and won't block you."
    }
    const date = formatDateAu(session.scheduledStartAt)
    const time = formatTimeAu(session.scheduledStartAt)
    return `${date} at ${time} · ${session.clinicianName} · Telehealth`
  }
  const guide = step ? guideFor(step.key) : null
  if (step?.status === "pending") return guide?.whenPending ?? "Complete this step when you're ready."
  return guide?.whenDone ?? "We'll guide you through each step."
}

function isSessionHero(session: PatientNextSession | null): boolean {
  if (!session) return false
  return session.status === "in_progress" || session.window.status === "open" || isJoinImminent(session)
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
  const hero = isSessionHero(nextSession)
  const cta =
    step?.status === "pending" && step ? resolveJourneyCta(step, { pathname, nextSession }) : null

  if (loading) {
    return (
      <Card className="dashboard-card rounded-2xl shadow-e1" aria-busy="true" aria-label="Loading your next step">
        <CardContent className="space-y-4 p-6">
          <Skeleton className="skeleton-shimmer h-4 w-28" />
          <Skeleton className="skeleton-shimmer h-8 w-64" />
          <Skeleton className="skeleton-shimmer h-11 w-40 rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="dashboard-card rounded-2xl shadow-e1">
        <CardContent className="space-y-4 p-6">
          <DashboardStateBlock variant="error" message={error} onRetry={onRetry} />
        </CardContent>
      </Card>
    )
  }

  if (!step && !nextSession) {
    return (
      <Card className="dashboard-card rounded-2xl shadow-e1">
        <CardContent className="p-6" data-tutorial="patient.dashboard.hero-book">
          <EmptyState
            className="items-start border-none bg-transparent px-0 py-0 text-left"
            title="Ready when you are"
            description="You have no upcoming sessions. Book your next visit whenever it feels right."
            icon={<CalendarPlus size={24} weight="duotone" />}
            action={<EmptyStateAction href="/patient/book-appointment" label="Book appointment" />}
          />
        </CardContent>
      </Card>
    )
  }

  const title = stepTitle(step, nextSession)
  const status = statusLine(step, nextSession)

  return (
    <Card
      className={cn(
        "dashboard-card overflow-hidden rounded-2xl shadow-e1",
        hero && "border-primary/30 bg-gradient-to-br from-primary/[0.08] via-card to-card",
      )}
      data-tutorial="patient.dashboard.current-step"
    >
      <CardContent className="space-y-4 p-5 md:p-6">
        <div className="space-y-1.5">
          <h2 className="font-heading text-lg font-semibold tracking-tight md:text-xl">{title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{status}</p>
          {countdown ? <p className="text-primary text-sm font-medium">{countdown}</p> : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center" data-tutorial="patient.dashboard.join-session">
          {joinOpen && nextSession ? (
            <Button
              asChild
              size="lg"
              className={cn(
                "press w-full rounded-full sm:w-auto",
                nextSession.window.status === "open" && "join-live-pulse shadow-primary-glow",
              )}
              data-tutorial="patient.dashboard.hero-join"
            >
              <Link href={joinSessionHref(nextSession.appointmentId)}>
                <VideoCamera size={20} />
                Join session
              </Link>
            </Button>
          ) : null}

          {!joinOpen && !hero && cta ? (
            <Button asChild size="lg" className="press w-full rounded-full sm:w-auto">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          ) : null}

          {nextSession ? (
            <div className="flex flex-wrap gap-2">
              {joinOpen || hero ? (
                <Button asChild variant="outline" size="sm" className="press rounded-full">
                  <Link href="/patient/video-setup" data-tutorial="patient.dashboard.video-setup-link">
                    <Microphone size={16} />
                    Test camera &amp; mic
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="outline" size="sm" className="press rounded-full">
                <Link href="/patient/appointments">View appointment</Link>
              </Button>
              {!joinOpen && !hero ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="press rounded-full"
                  aria-expanded={showManage}
                  onClick={() => setShowManage((open) => !open)}
                >
                  {showManage ? "Close" : "Manage"}
                </Button>
              ) : null}
            </div>
          ) : null}

          {nextSession && !joinOpen && !hero ? (
            <p className="text-muted-foreground w-full text-xs">
              <MapPin size={12} className="mr-1 inline" aria-hidden />
              Join opens 15 minutes before your session starts.
            </p>
          ) : null}
        </div>

        {showManage && nextSession ? (
          <div className="border-border/60 border-t pt-4">
            <AppointmentManagePanel appointmentId={nextSession.appointmentId} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
