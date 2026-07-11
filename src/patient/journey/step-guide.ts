import type * as React from "react"
import {
  CalendarCheck,
  CheckCircle,
  ClipboardText,
  CurrencyCircleDollar,
  PaperPlaneTilt,
  PlayCircle,
  SealCheck,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr"

import type { PatientNextSession } from "@/src/patient/dashboard/api"
import type { PatientJourneyStep } from "@/src/patient/journey/api"
import { formatDateAu, formatDateTimeAu, formatTimeAu } from "@/src/lib/format-au"

export const STEP_ORDER = [
  "intake_started",
  "intake_submitted",
  "booking_requested",
  "booking_confirmed",
  "session_started",
  "session_completed",
  "session_no_show",
  "invoice_downloaded",
] as const

export type OrderedJourneyKey = (typeof STEP_ORDER)[number]

export type JourneyStepGuide = {
  shortLabel: string
  /** Human-readable label for the timeline rail. */
  timelineLabel: string
  meaning: string
  whenPending: string
  whenDone: string
  icon: React.ElementType
  upcomingHint?: string
}

export type JourneyStepVisualState = "done" | "current" | "upcoming" | "problem" | "waiting" | "cancelled"

export const STEP_GUIDE: Record<OrderedJourneyKey, JourneyStepGuide> = {
  intake_started: {
    shortLabel: "Intake",
    timelineLabel: "Intake complete",
    meaning: "You began the telehealth intake inside booking — identity, Medicare path, and consents.",
    whenPending: "Open booking and continue where you left off; progress saves as you go.",
    whenDone: "Logged when you first opened the intake flow.",
    icon: ClipboardText,
  },
  intake_submitted: {
    shortLabel: "Submitted",
    timelineLabel: "Intake submitted",
    meaning: "Your intake answers were sent to the clinic for triage and matching.",
    whenPending: "Finish required fields and submit from the last step of booking intake.",
    whenDone: "The clinic can review your details and propose a clinician.",
    icon: PaperPlaneTilt,
  },
  booking_requested: {
    shortLabel: "Requested",
    timelineLabel: "Clinician assigned",
    meaning: "You asked for a session slot; the clinic is matching you to a clinician.",
    whenPending: "After intake is submitted, pick a time in booking so this step can complete.",
    whenDone: "A booking request is on file for scheduling.",
    icon: CalendarCheck,
  },
  booking_confirmed: {
    shortLabel: "Confirmed",
    timelineLabel: "Appointment confirmed",
    meaning: "An appointment time is locked in — you will see it under Appointments.",
    whenPending: "Wait for confirmation from the clinic, or finish any follow-up booking steps they request.",
    whenDone: "Your visit is scheduled; reminders may follow by notification.",
    icon: SealCheck,
  },
  session_started: {
    shortLabel: "Session",
    timelineLabel: "Session",
    meaning: "You joined the telehealth session (or the session officially opened).",
    whenPending: "On the day of care, join from the dashboard when your session window opens.",
    whenDone: "Session start was recorded for your record.",
    icon: PlayCircle,
  },
  session_completed: {
    shortLabel: "Completed",
    timelineLabel: "Follow-up",
    meaning: "The visit finished normally and notes can flow into your ongoing care.",
    upcomingHint: "After your session",
    whenPending: "After your appointment, this updates when the session is marked complete.",
    whenDone: "This visit is closed out as completed.",
    icon: CheckCircle,
  },
  session_no_show: {
    shortLabel: "No-show",
    timelineLabel: "Session missed",
    meaning: "The session time passed without a completed join — clinics use this for follow-up.",
    whenPending: "Only appears if a no-show is recorded instead of a completed visit.",
    whenDone: "A no-show was logged; contact the clinic if this was a mistake.",
    icon: WarningCircle,
  },
  invoice_downloaded: {
    shortLabel: "Invoice",
    timelineLabel: "Invoice",
    meaning: "You retrieved a tax invoice or receipt from Billing for your records.",
    upcomingHint: "After your session",
    whenPending: "After a visit, open Billing and download your invoice when it is available.",
    whenDone: "A portal invoice download was recorded.",
    icon: CurrencyCircleDollar,
  },
}

export function normalizeKey(key: string): OrderedJourneyKey | null {
  return (STEP_ORDER as readonly string[]).includes(key) ? (key as OrderedJourneyKey) : null
}

export function guideFor(key: string): JourneyStepGuide | null {
  const normalized = normalizeKey(key)
  return normalized ? STEP_GUIDE[normalized] : null
}

export function sortSteps(steps: PatientJourneyStep[]): PatientJourneyStep[] {
  const order = new Map(STEP_ORDER.map((key, index) => [key, index]))
  return [...steps].sort(
    (a, b) => (order.get(a.key as OrderedJourneyKey) ?? 99) - (order.get(b.key as OrderedJourneyKey) ?? 99),
  )
}

/**
 * `session_no_show` is an exception branch, not a goal. Showing it as a
 * "waiting" milestone confuses patients — only surface it once recorded.
 */
export function visibleSteps(steps: PatientJourneyStep[]): PatientJourneyStep[] {
  return sortSteps(steps).filter((step) => step.key !== "session_no_show" || step.status === "done")
}

export function deriveHeadline(sorted: PatientJourneyStep[]): { title: string; subtitle: string; pct: number } {
  const done = sorted.filter((step) => step.status === "done").length
  const total = sorted.length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const next = sorted.find((step) => step.status === "pending")
  if (!next) {
    return {
      title: "All milestones recorded so far",
      subtitle: "New booking or session events will add the next line when they happen.",
      pct: 100,
    }
  }
  const guide = guideFor(next.key)
  return {
    title: `Focus: ${next.label}`,
    subtitle: guide?.whenPending ?? "Complete earlier steps when you are ready.",
    pct,
  }
}

export function ctaForStep(step: PatientJourneyStep): { label: string; href: string } | null {
  if (step.status !== "pending") return null
  const key = normalizeKey(step.key)
  if (!key) return null
  switch (key) {
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

export function formatWhen(iso: string | undefined): string {
  if (!iso) return "Not yet recorded"
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "Not yet recorded"
  return date.toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })
}

/** Pending steps should not show "Not yet recorded" — return null instead. */
export function formatStepTimestamp(step: PatientJourneyStep): string | null {
  if (step.status !== "done" || !step.occurredAt) return null
  return formatWhen(step.occurredAt)
}

/** True when every visible milestone is recorded (UX-M3). */
export function isJourneyComplete(steps: PatientJourneyStep[]): boolean {
  const visible = visibleSteps(steps)
  return visible.length > 0 && visible.every((step) => step.status === "done")
}

export function stepVisualState(step: PatientJourneyStep, isCurrent: boolean): JourneyStepVisualState {
  if (step.key === "session_no_show" && step.status === "done") return "problem"
  if (step.status === "done") return "done"
  if (isCurrent) return "current"
  if (step.key === "booking_requested" && step.status === "pending") return "waiting"
  return "upcoming"
}

export function timelineLabelFor(
  step: PatientJourneyStep,
  isCurrent: boolean,
  nextSession?: PatientNextSession | null,
): string {
  const guide = guideFor(step.key)
  if (!guide) return step.label

  if (isCurrent && nextSession && (step.key === "session_started" || step.key === "booking_confirmed")) {
    const start = new Date(nextSession.scheduledStartAt)
    const now = new Date()
    const dayDelta = Math.round((start.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) / 86_400_000)
    if (dayDelta === 0) return "Session today"
    if (dayDelta === 1) return "Session tomorrow"
  }

  return guide.timelineLabel
}

export function formatTimelineDate(
  step: PatientJourneyStep,
  isCurrent: boolean,
  nextSession?: PatientNextSession | null,
): string | null {
  if (step.status === "done" && step.occurredAt) {
    return formatDateAu(step.occurredAt)
  }

  if (isCurrent && nextSession && (step.key === "session_started" || step.key === "booking_confirmed")) {
    const start = new Date(nextSession.scheduledStartAt)
    const now = new Date()
    const dayDelta = Math.round((start.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) / 86_400_000)
    if (dayDelta === 0) return "Today"
    if (dayDelta === 1) return "Tomorrow"
    return formatDateAu(nextSession.scheduledStartAt)
  }

  return null
}

export function formatTimelineTime(
  step: PatientJourneyStep,
  isCurrent: boolean,
  nextSession?: PatientNextSession | null,
): string | null {
  if (isCurrent && nextSession && (step.key === "session_started" || step.key === "booking_confirmed")) {
    return formatTimeAu(nextSession.scheduledStartAt)
  }
  if (step.status === "done" && step.occurredAt) {
    return formatTimeAu(step.occurredAt)
  }
  return null
}

export function upcomingMilestones(steps: PatientJourneyStep[]): PatientJourneyStep[] {
  const visible = visibleSteps(steps)
  const currentIndex = visible.findIndex((step) => step.status === "pending")
  if (currentIndex === -1) return []
  return visible.slice(currentIndex + 1)
}

export function deriveMotivationCopy(steps: PatientJourneyStep[]): { title: string; body: string } {
  const visible = visibleSteps(steps)
  const pendingCount = visible.filter((step) => step.status === "pending").length

  if (pendingCount === 0) {
    return {
      title: "Everything is on track.",
      body: "All milestones are recorded. New bookings or sessions will update your journey.",
    }
  }

  if (pendingCount <= 2) {
    return {
      title: "You're almost ready.",
      body: `Only ${pendingCount} step${pendingCount === 1 ? "" : "s"} remain before completing your care journey.`,
    }
  }

  return {
    title: "Everything is on track.",
    body: "We'll notify you when your next action is available.",
  }
}

function relativeSessionPhrase(startIso: string, nowMs = Date.now()): string | null {
  const startMs = new Date(startIso).getTime()
  if (Number.isNaN(startMs)) return null
  const deltaMs = startMs - nowMs
  if (deltaMs <= 0) return "now"
  const totalMinutes = Math.round(deltaMs / 60_000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours < 24) {
    if (hours === 0) return `in ${minutes} minute${minutes === 1 ? "" : "s"}`
    return `in ${hours} hour${hours === 1 ? "" : "s"}${minutes > 0 ? ` ${minutes}m` : ""}`
  }
  const days = Math.round(deltaMs / 86_400_000)
  if (days === 1) return "tomorrow"
  return `on ${formatDateAu(startIso)}`
}

export function estimatedNextMilestoneLine(
  steps: PatientJourneyStep[],
  nextSession?: PatientNextSession | null,
): string | null {
  const next = visibleSteps(steps).find((step) => step.status === "pending")
  if (!next) return null

  if (
    nextSession &&
    (next.key === "session_started" || next.key === "booking_confirmed")
  ) {
    const relative = relativeSessionPhrase(nextSession.scheduledStartAt)
    const time = formatTimeAu(nextSession.scheduledStartAt)
    if (relative === "tomorrow") {
      return `Your online session begins tomorrow at ${time}.`
    }
    if (relative === "now") {
      return "Your online session is ready to join."
    }
    if (relative?.startsWith("in ")) {
      return `Your online session begins ${relative} at ${time}.`
    }
    if (relative?.startsWith("on ")) {
      return `Your online session begins ${relative} at ${time}.`
    }
  }

  const guide = guideFor(next.key)
  return guide ? `Estimated next milestone: ${guide.timelineLabel}.` : null
}

export function detailLinkForStep(key: string): { label: string; href: string } | null {
  const normalized = normalizeKey(key)
  if (!normalized) return null
  switch (normalized) {
    case "intake_started":
    case "intake_submitted":
      return { label: "View details", href: "/patient/book-appointment" }
    case "booking_requested":
      return { label: "View clinician", href: "/patient/my-clinician" }
    case "booking_confirmed":
    case "session_started":
    case "session_completed":
      return { label: "View appointment", href: "/patient/appointments" }
    case "invoice_downloaded":
      return { label: "View invoice", href: "/patient/invoices" }
    default:
      return null
  }
}
