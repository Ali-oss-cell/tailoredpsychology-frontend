"use client"

import { Skeleton } from "@/components/ui/skeleton"
import type { PatientPortalMode } from "@/src/patient/journey/step-guide"

type DashboardWelcomeSectionProps = {
  firstName: string | null
  loading?: boolean
  portalMode?: PatientPortalMode
}

function timeAwareGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function DashboardWelcomeSection({
  firstName,
  loading = false,
  portalMode = "first-time",
}: DashboardWelcomeSectionProps) {
  const greeting = timeAwareGreeting()
  const name = firstName ?? "there"
  const subtitle =
    portalMode === "first-time"
      ? "We'll guide you through each step."
      : null

  return (
    <header className="dashboard-section min-w-0 space-y-1">
      {loading ? (
        <>
          <Skeleton className="skeleton-shimmer h-10 w-72 max-w-full" aria-label="Loading greeting" />
          <Skeleton className="skeleton-shimmer h-5 w-64 max-w-full" />
        </>
      ) : (
        <>
          <h1 className="font-heading text-[2rem] font-semibold leading-tight tracking-tight">
            {greeting}, {name}
          </h1>
          {subtitle ? (
            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed md:text-base">{subtitle}</p>
          ) : null}
        </>
      )}
    </header>
  )
}
