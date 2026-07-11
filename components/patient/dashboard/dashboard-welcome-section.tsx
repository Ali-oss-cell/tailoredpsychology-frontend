"use client"

import { Skeleton } from "@/components/ui/skeleton"

type DashboardWelcomeSectionProps = {
  firstName: string | null
  loading?: boolean
}

function timeAwareGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function DashboardWelcomeSection({ firstName, loading = false }: DashboardWelcomeSectionProps) {
  const greeting = timeAwareGreeting()
  const name = firstName ?? "there"

  return (
    <header className="min-w-0">
      {loading ? (
        <Skeleton className="skeleton-shimmer h-9 w-56 max-w-full" aria-label="Loading greeting" />
      ) : (
        <h1 className="font-heading text-2xl font-semibold leading-tight tracking-tight md:text-[1.75rem]">
          {greeting}, {name}
        </h1>
      )}
    </header>
  )
}
