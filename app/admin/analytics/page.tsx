"use client"

import * as React from "react"

import { OpsShell } from "@/components/ops/ops-shell"
import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { opsPagesContent } from "@/content/ops-pages"
import { getAdminAnalyticsSummary, type AdminAnalyticsSummary } from "@/src/admin/ops/api"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = React.useState<AdminAnalyticsSummary | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    void getAdminAnalyticsSummary()
      .then((data) => {
        if (cancelled) return
        setSummary(data)
        setError(null)
      })
      .catch(() => {
        if (cancelled) return
        setError("Could not load analytics summary.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <OpsShell activeRoute="admin-analytics">
      <OpsPortalPage eyebrow="Administration"
        title={opsPagesContent.adminAnalytics.title} description={opsPagesContent.adminAnalytics.description}>
        {loading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
        {error ? <DashboardStateBlock variant="error" message={error} /> : null}
        {!loading && !error && summary ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Analytics events" value={`${summary.totalAnalyticsEvents}`} />
            <MetricCard label="Audit events" value={`${summary.totalAuditEvents}`} />
            <MetricCard label="Booking requested" value={`${summary.bookingRequested}`} />
            <MetricCard label="Join failures" value={`${summary.joinFailures}`} />
          </div>
        ) : null}
      </OpsPortalPage>
    </OpsShell>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}
