"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarBlank } from "@phosphor-icons/react/dist/ssr"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { PatientNextSession } from "@/src/patient/dashboard/api"
import type { PatientPortalMode } from "@/src/patient/journey/step-guide"

type DashboardWelcomeSectionProps = {
  firstName: string | null
  loading?: boolean
  nextSession: PatientNextSession | null
  portalMode?: PatientPortalMode
}

function timeAwareGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function formatNextSessionLabel(session: PatientNextSession): string {
  const start = new Date(session.scheduledStartAt)
  if (Number.isNaN(start.getTime())) return "Upcoming session"
  return start.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function DashboardWelcomeSection({
  firstName,
  loading = false,
  nextSession,
  portalMode = "first-time",
}: DashboardWelcomeSectionProps) {
  const greeting = timeAwareGreeting()
  const name = firstName ?? "there"
  const subtitle =
    portalMode === "first-time"
      ? "Let's get started — we'll guide you through intake, booking, and your first session."
      : nextSession
        ? "Here's what's next in your care and your upcoming session."
        : "Here's your health journey overview and quick actions."

  return (
    <header className="dashboard-section flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="relative min-w-0 flex-1 space-y-2">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-4 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl"
        />
        {loading ? (
          <>
            <Skeleton className="skeleton-shimmer h-10 w-72 max-w-full" aria-label="Loading greeting" />
            <Skeleton className="skeleton-shimmer h-5 w-96 max-w-full" />
          </>
        ) : (
          <>
            <h1 className="font-heading text-[2rem] font-semibold leading-tight tracking-tight">
              {greeting}, {name} 👋
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed md:text-base">
              {subtitle}
            </p>
          </>
        )}
      </div>

      <div
        className={cn(
          "dashboard-card interactive-lift shrink-0 rounded-2xl border border-border/50 bg-card p-5 shadow-e1",
          "w-full lg:w-[17.5rem]",
        )}
        aria-label="Next appointment"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Next appointment</p>
            {loading ? (
              <Skeleton className="skeleton-shimmer h-5 w-36" />
            ) : nextSession ? (
              <>
                <p className="text-foreground text-sm font-semibold leading-snug">{formatNextSessionLabel(nextSession)}</p>
                <p className="text-muted-foreground text-xs">{nextSession.clinicianName}</p>
                <Link
                  href="/patient/appointments"
                  className="text-primary mt-1 inline-flex items-center gap-1 text-sm font-medium underline-offset-2 hover:underline"
                >
                  View details <ArrowRight size={14} aria-hidden />
                </Link>
              </>
            ) : (
              <>
                <p className="text-foreground text-sm font-medium">No upcoming appointment</p>
                <Link
                  href="/patient/book-appointment"
                  className="text-primary mt-1 inline-flex items-center gap-1 text-sm font-medium underline-offset-2 hover:underline"
                  data-tutorial="patient.dashboard.hero-book"
                >
                  Book now <ArrowRight size={14} aria-hidden />
                </Link>
              </>
            )}
          </div>
          <div className="relative hidden h-14 w-14 shrink-0 sm:block" aria-hidden>
            <Image src="/assets/clinic-room.svg" alt="" fill className="object-contain opacity-90" />
          </div>
        </div>
        {!loading && !nextSession ? (
          <CalendarBlank className="text-primary/40 mt-3 sm:hidden" size={28} aria-hidden />
        ) : null}
      </div>
    </header>
  )
}
