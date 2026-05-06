"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/src/auth/current-user"
import { getPsychologistSessions } from "@/src/sessions/api"
export function SessionsOverviewCard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionCount, setSessionCount] = useState(0)
  const [upcomingCount, setUpcomingCount] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const user = await getCurrentUser()
        if (user.role !== "psychologist") {
          if (!cancelled) setError("Sign in as a psychologist to view session metrics.")
          return
        }
        const rows = await getPsychologistSessions(user.id)
        if (cancelled) return
        const now = Date.now()
        setSessionCount(rows.length)
        setUpcomingCount(rows.filter((row) => new Date(row.scheduledStartAt).getTime() >= now).length)
        setCompletedCount(rows.filter((row) => row.status === "completed").length)
        setError(null)
      } catch {
        if (!cancelled) setError("Could not load session metrics.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const items = useMemo(
    () => [
      { label: "Total sessions", value: String(sessionCount) },
      { label: "Upcoming", value: String(upcomingCount) },
      { label: "Completed", value: String(completedCount) },
    ],
    [sessionCount, upcomingCount, completedCount],
  )

  return (
    <Card className="md:col-span-8">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarBlank size={18} />
          Today&apos;s Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
        {!loading && error ? <DashboardStateBlock variant="error" message={error} /> : null}
        {!loading && !error
          ? items.map((item) => (
              <div key={item.label} className="bg-muted/40 rounded-lg border border-border/60 p-3">
                <p className="text-muted-foreground text-xs">{item.label}</p>
                <p className="font-heading mt-1 text-xl font-semibold">{item.value}</p>
              </div>
            ))
          : null}
      </CardContent>
    </Card>
  )
}
