"use client"

import Link from "next/link"
import {
  CalendarCheck,
  CaretLeft,
  CaretRight,
  CheckCircle,
  ClipboardText,
  MapTrifold,
  PaperPlaneTilt,
  PlayCircle,
  SealCheck,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr"
import * as React from "react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/src/auth/current-user"
import { getPatientJourneyTimeline, type PatientJourneyStep } from "@/src/patient/journey/api"

const STEP_ORDER = [
  "intake_started",
  "intake_submitted",
  "booking_requested",
  "booking_confirmed",
  "session_started",
  "session_completed",
  "session_no_show",
] as const

type OrderedJourneyKey = (typeof STEP_ORDER)[number]

const STEP_GUIDE: Record<
  OrderedJourneyKey,
  {
    meaning: string
    whenPending: string
    whenDone: string
    icon: React.ElementType
  }
> = {
  intake_started: {
    meaning: "You began the telehealth intake inside booking — identity, Medicare path, and consents.",
    whenPending: "Open booking and continue where you left off; progress saves as you go.",
    whenDone: "Logged when you first opened the intake flow.",
    icon: ClipboardText,
  },
  intake_submitted: {
    meaning: "Your intake answers were sent to the clinic for triage and matching.",
    whenPending: "Finish required fields and submit from the last step of booking intake.",
    whenDone: "The clinic can review your details and propose a clinician.",
    icon: PaperPlaneTilt,
  },
  booking_requested: {
    meaning: "You asked for a session slot; the clinic is matching you to a clinician.",
    whenPending: "After intake is submitted, pick a time in booking so this step can complete.",
    whenDone: "A booking request is on file for scheduling.",
    icon: CalendarCheck,
  },
  booking_confirmed: {
    meaning: "An appointment time is locked in — you will see it under Appointments.",
    whenPending: "Wait for confirmation from the clinic, or finish any follow-up booking steps they request.",
    whenDone: "Your visit is scheduled; reminders may follow by notification.",
    icon: SealCheck,
  },
  session_started: {
    meaning: "You joined the telehealth session (or the session officially opened).",
    whenPending: "On the day of care, join from the dashboard when your session window opens.",
    whenDone: "Session start was recorded for your record.",
    icon: PlayCircle,
  },
  session_completed: {
    meaning: "The visit finished normally and notes can flow into your ongoing care.",
    whenPending: "After your appointment, this updates when the session is marked complete.",
    whenDone: "This visit is closed out as completed.",
    icon: CheckCircle,
  },
  session_no_show: {
    meaning: "The session time passed without a completed join — clinics use this for follow-up.",
    whenPending: "Only appears if a no-show is recorded instead of a completed visit.",
    whenDone: "A no-show was logged; contact the clinic if this was a mistake.",
    icon: WarningCircle,
  },
}

function normalizeKey(key: string): OrderedJourneyKey | null {
  return (STEP_ORDER as readonly string[]).includes(key) ? (key as OrderedJourneyKey) : null
}

function guideFor(key: string) {
  const k = normalizeKey(key)
  return k ? STEP_GUIDE[k] : null
}

function sortSteps(steps: PatientJourneyStep[]): PatientJourneyStep[] {
  const order = new Map(STEP_ORDER.map((k, i) => [k, i]))
  return [...steps].sort((a, b) => (order.get(a.key as OrderedJourneyKey) ?? 99) - (order.get(b.key as OrderedJourneyKey) ?? 99))
}

function deriveHeadline(sorted: PatientJourneyStep[]): { title: string; subtitle: string; pct: number } {
  const done = sorted.filter((s) => s.status === "done").length
  const total = sorted.length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const next = sorted.find((s) => s.status === "pending")
  if (!next) {
    return {
      title: "All milestones recorded so far",
      subtitle: "New booking or session events will add the next line when they happen.",
      pct: 100,
    }
  }
  const g = guideFor(next.key)
  return {
    title: `Focus: ${next.label}`,
    subtitle: g?.whenPending ?? "Complete earlier steps when you are ready.",
    pct,
  }
}

function ctaForStep(step: PatientJourneyStep): { label: string; href: string } | null {
  if (step.status !== "pending") return null
  const k = normalizeKey(step.key)
  if (!k) return null
  switch (k) {
    case "intake_started":
    case "intake_submitted":
      return { label: "Open booking intake", href: "/patient/book-appointment" }
    case "booking_requested":
    case "booking_confirmed":
      return { label: "View appointments", href: "/patient/appointments" }
    case "session_started":
    case "session_completed":
      return { label: "Go to dashboard", href: "/patient/dashboard" }
    case "session_no_show":
      return { label: "Contact clinic", href: "/patient/dashboard" }
    default:
      return null
  }
}

function formatWhen(iso: string | undefined): string {
  if (!iso) return "Not yet recorded"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "Not yet recorded"
  return d.toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export function PatientJourneyTimelineCard() {
  const [steps, setSteps] = React.useState<PatientJourneyStep[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [loadVersion, setLoadVersion] = React.useState(0)
  const [activeIndex, setActiveIndex] = React.useState(0)

  React.useEffect(() => {
    let cancelled = false
    const id = window.setTimeout(() => {
      setIsLoading(true)
      setError(null)
      void getCurrentUser()
        .then((user) => getPatientJourneyTimeline(user.id))
        .then((timeline) => {
          if (cancelled) return
          const sorted = sortSteps(timeline.steps)
          setSteps(sorted)
          const pendingIdx = sorted.findIndex((s) => s.status === "pending")
          setActiveIndex(pendingIdx === -1 ? 0 : pendingIdx)
        })
        .catch(() => {
          if (!cancelled) {
            setSteps([])
            setError("We couldn't load this section. Try again.")
          }
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false)
        })
    }, 0)
    return () => {
      cancelled = true
      window.clearTimeout(id)
    }
  }, [loadVersion])

  const retryLoadTimeline = () => {
    setLoadVersion((n) => n + 1)
  }

  const sorted = steps
  const { title: summaryTitle, subtitle: summarySubtitle, pct } = deriveHeadline(sorted)
  const doneCount = sorted.filter((s) => s.status === "done").length
  const nextPending = sorted.find((s) => s.status === "pending")
  const safeIndex = sorted.length === 0 ? 0 : Math.min(Math.max(activeIndex, 0), sorted.length - 1)
  const step = sorted[safeIndex]
  const isDone = step?.status === "done"
  const isNextPending = Boolean(step && nextPending?.key === step.key)
  const g = step ? guideFor(step.key) : null
  const Icon = g?.icon ?? ClipboardText
  const cta = step ? ctaForStep(step) : null
  const showCta = Boolean(cta && isNextPending)

  return (
    <Card className="md:col-span-12 overflow-hidden border-border/70">
      <CardHeader className="border-border/60 space-y-3 border-b bg-muted/15 pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="font-heading text-lg tracking-tight md:text-xl">Journey timeline</CardTitle>
              <Badge variant="outline" className="font-normal">
                One step at a time
              </Badge>
            </div>
            <CardDescription className="text-muted-foreground max-w-2xl text-xs leading-relaxed md:text-sm">
              Milestones from your booking and visits. Use the dots or arrows to review another step — only one detail
              card is shown so it stays easy to read.
            </CardDescription>
          </div>
          <div className="text-muted-foreground hidden items-center gap-1.5 text-xs sm:flex sm:max-w-[11rem] sm:text-right">
            <MapTrifold className="text-primary shrink-0" size={18} aria-hidden />
            <span>Intake → booking → visit</span>
          </div>
        </div>

        {!isLoading && !error && sorted.length > 0 ? (
          <div className="space-y-2 pt-0.5">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div className="min-w-0">
                <p className="text-foreground text-sm font-medium leading-snug">{summaryTitle}</p>
                <p className="text-muted-foreground mt-0.5 max-w-xl text-xs leading-relaxed md:text-sm">{summarySubtitle}</p>
              </div>
              <p className="text-muted-foreground shrink-0 text-xs font-medium tabular-nums">
                {doneCount}/{sorted.length}
              </p>
            </div>
            <div
              className="bg-muted h-1.5 w-full overflow-hidden rounded-full"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Milestones recorded"
            >
              <div
                className="from-primary to-primary/70 h-full rounded-full bg-gradient-to-r transition-[width] duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {isLoading ? <DashboardStateBlock variant="loading" message="Loading journey…" /> : null}
        {!isLoading && error ? <DashboardStateBlock variant="error" message={error} onRetry={retryLoadTimeline} /> : null}
        {!isLoading && !error && sorted.length === 0 ? <DashboardStateBlock variant="empty" message="No journey data yet." /> : null}

        {!isLoading && !error && sorted.length > 0 && step ? (
          <div className="space-y-4">
            <div
              className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
              role="tablist"
              aria-label="Journey steps"
            >
              {sorted.map((s, index) => {
                const done = s.status === "done"
                const active = index === safeIndex
                const upcoming = s.status === "pending" && nextPending?.key === s.key
                return (
                  <button
                    key={s.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`${s.label}, ${done ? "recorded" : upcoming ? "in progress" : "waiting"}`}
                    className={cn(
                      "h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active ? "bg-primary w-8" : done ? "w-2.5 bg-emerald-500/70 hover:bg-emerald-500" : "bg-muted-foreground/25 w-2.5 hover:bg-muted-foreground/40",
                      upcoming && !active && "ring-1 ring-primary/40",
                    )}
                    onClick={() => setActiveIndex(index)}
                  />
                )
              })}
            </div>

            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1"
                disabled={safeIndex <= 0}
                onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              >
                <CaretLeft size={16} aria-hidden />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              <p className="text-muted-foreground text-center text-xs font-medium tabular-nums sm:text-sm">
                Step {safeIndex + 1} of {sorted.length}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1"
                disabled={safeIndex >= sorted.length - 1}
                onClick={() => setActiveIndex((i) => Math.min(sorted.length - 1, i + 1))}
              >
                <span className="hidden sm:inline">Next</span>
                <CaretRight size={16} aria-hidden />
              </Button>
            </div>

            <div
              className={cn(
                "rounded-xl border p-4 md:p-5",
                isNextPending
                  ? "border-primary/35 bg-primary/5 shadow-sm"
                  : isDone
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-border/70 bg-card",
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 shadow-sm",
                      isDone
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : isNextPending
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/80 bg-muted/50 text-muted-foreground",
                    )}
                  >
                    <Icon size={22} weight={isDone ? "fill" : "duotone"} className="shrink-0" aria-hidden />
                  </div>
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-base font-semibold tracking-tight md:text-lg">{step.label}</h3>
                      {isDone ? (
                        <Badge className="border-emerald-600/20 bg-emerald-600/15 text-emerald-800 dark:text-emerald-100">
                          Recorded
                        </Badge>
                      ) : isNextPending ? (
                        <Badge variant="default">In progress</Badge>
                      ) : (
                        <Badge variant="secondary">Waiting</Badge>
                      )}
                    </div>
                    {g?.meaning ? <p className="text-muted-foreground text-sm leading-relaxed">{g.meaning}</p> : null}
                    <p className="text-foreground text-sm leading-relaxed">
                      <span className="font-medium">{isDone ? "What we logged: " : "What to do: "}</span>
                      {isDone ? (g?.whenDone ?? "Completed.") : (g?.whenPending ?? "Complete earlier steps first.")}
                    </p>
                    <p className="text-muted-foreground text-xs tabular-nums">
                      <span className="font-medium text-foreground/80">Timestamp: </span>
                      {formatWhen(step.occurredAt)}
                    </p>
                  </div>
                </div>
                {showCta && cta ? (
                  <Button asChild size="sm" className="w-full shrink-0 gap-1 sm:w-auto sm:self-center">
                    <Link href={cta.href}>{cta.label}</Link>
                  </Button>
                ) : null}
              </div>
            </div>

            <p className="text-muted-foreground text-center text-[11px] leading-relaxed md:text-xs">
              Stuck? Finish the action in booking or appointments, then refresh the page — the server adds the next
              milestone when it is logged.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
