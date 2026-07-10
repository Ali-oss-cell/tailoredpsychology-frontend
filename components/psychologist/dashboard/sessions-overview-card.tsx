"use client"

import { CalendarBlank } from "@phosphor-icons/react/dist/ssr"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PortalMetricTile } from "@/components/shared/portal-list-row"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PsychologistDashboardSnapshot } from "@/src/psychologist/dashboard/api"

type SessionsOverviewCardProps = {
  stats?: PsychologistDashboardSnapshot["sessions"]
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}

export function SessionsOverviewCard({ stats, loading = false, error = null, onRetry }: SessionsOverviewCardProps) {
  const items = stats
    ? [
        { label: "Total sessions", value: stats.totalCount },
        { label: "Today", value: stats.todayCount },
        { label: "Upcoming", value: stats.upcomingCount },
        { label: "Completed", value: stats.completedCount },
      ]
    : []

  return (
    <Card className="dashboard-card interactive-lift md:col-span-8">
      <CardHeader className="pb-3">
        <p className="card-eyebrow">Overview</p>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarBlank size={18} />
          Session metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? <DashboardStateBlock variant="loading" message="Loading metrics..." /> : null}
        {!loading && error ? <DashboardStateBlock variant="error" message={error} onRetry={onRetry} /> : null}
        {!loading && !error
          ? items.map((item) => <PortalMetricTile key={item.label} label={item.label} value={item.value} />)
          : null}
      </CardContent>
    </Card>
  )
}
