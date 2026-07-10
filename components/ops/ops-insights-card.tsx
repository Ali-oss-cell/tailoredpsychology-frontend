"use client"

import * as React from "react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getOpsInsights, type OpsInsights } from "@/src/ops/insights/api"

export function OpsInsightsCard() {
  const [insights, setInsights] = React.useState<OpsInsights | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const loadInsights = React.useCallback(() => {
    let cancelled = false
    void getOpsInsights()
      .then((next) => {
        if (!cancelled) setInsights(next)
      })
      .catch(() => {
        if (!cancelled) {
          setInsights(null)
          setError("We couldn't load this section. Try again.")
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])
  React.useEffect(() => {
    loadInsights()
  }, [loadInsights])

  const retryLoadInsights = () => {
    setIsLoading(true)
    setError(null)
    loadInsights()
  }

  return (
    <Card className="dashboard-card interactive-lift">
      <CardHeader>
        <CardTitle>Ops insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
        {!isLoading && error ? <DashboardStateBlock variant="error" message={error} onRetry={retryLoadInsights} /> : null}
        {!isLoading && !error && !insights ? <DashboardStateBlock variant="empty" message="No data yet." /> : null}
        {!isLoading && !error && insights ? (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <p>Queue total: {insights.queueTotal}</p>
            <p>Urgent risk: {insights.urgentRiskCount}</p>
            <p>Stale queue: {insights.staleQueueCount}</p>
            <p>Requested: {insights.bookingRequestedCount}</p>
            <p>Confirmed: {insights.bookingConfirmedCount}</p>
            <p>No-show: {insights.sessionNoShowCount}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
