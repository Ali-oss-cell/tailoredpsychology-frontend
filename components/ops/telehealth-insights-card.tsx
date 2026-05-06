"use client"

import * as React from "react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTelehealthInsights, type TelehealthInsights } from "@/src/ops/insights/api"

export function TelehealthInsightsCard() {
  const [insights, setInsights] = React.useState<TelehealthInsights | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [windowFilter, setWindowFilter] = React.useState<"all" | "24h" | "7d">("all")

  const loadInsights = React.useCallback(() => {
    let cancelled = false
    void getTelehealthInsights()
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
    <Card>
      <CardHeader>
        <CardTitle>Telehealth insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
        {!isLoading && error ? <DashboardStateBlock variant="error" message={error} onRetry={retryLoadInsights} /> : null}
        {!isLoading && !error && !insights ? <DashboardStateBlock variant="empty" message="No data yet." /> : null}
        {!isLoading && !error && insights ? (
          <div className="space-y-3 text-xs">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setWindowFilter("all")}
                className={`rounded-md border px-2 py-1 ${windowFilter === "all" ? "border-primary bg-primary/10" : "border-border"}`}
              >
                All time
              </button>
              <button
                type="button"
                onClick={() => setWindowFilter("24h")}
                className={`rounded-md border px-2 py-1 ${windowFilter === "24h" ? "border-primary bg-primary/10" : "border-border"}`}
              >
                Last 24h
              </button>
              <button
                type="button"
                onClick={() => setWindowFilter("7d")}
                className={`rounded-md border px-2 py-1 ${windowFilter === "7d" ? "border-primary bg-primary/10" : "border-border"}`}
              >
                Last 7d
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(() => {
                const selected =
                  windowFilter === "all" ? insights : windowFilter === "24h" ? insights.last24h : insights.last7d
                return (
                  <>
                    <p>Join attempts: {selected.totalJoinAttempts}</p>
                    <p>Warned joins: {selected.warnedJoinCount}</p>
                    <p>Warn rate: {selected.warnedJoinRate}%</p>
                    <p>Failed joins: {selected.failedJoinCount}</p>
                    <p>Late joins: {selected.lateJoinCount}</p>
                    <p>Recovery rate: {selected.recoveryRate}%</p>
                  </>
                )
              })()}
            </div>
            <div className="rounded-md border border-border/60 p-2">
              <p className="font-medium">Last 24h</p>
              <p className="text-muted-foreground">
                Attempts {insights.last24h.totalJoinAttempts}, warn {insights.last24h.warnedJoinRate}%, fail{" "}
                {insights.last24h.failedJoinCount}
              </p>
            </div>
            <div className="rounded-md border border-border/60 p-2">
              <p className="font-medium">Last 7d</p>
              <p className="text-muted-foreground">
                Attempts {insights.last7d.totalJoinAttempts}, warn {insights.last7d.warnedJoinRate}%, fail{" "}
                {insights.last7d.failedJoinCount}
              </p>
            </div>
            <div className="rounded-md border border-border/60 p-2">
              <p className="font-medium">Clinician breakdown</p>
              {insights.clinicianBreakdown.length === 0 ? (
                <p className="text-muted-foreground">No clinician data yet.</p>
              ) : (
                <div className="space-y-1 text-muted-foreground">
                  {insights.clinicianBreakdown.slice(0, 3).map((row) => (
                    <p key={row.clinicianId}>
                      {row.clinicianId}: {row.totalJoinAttempts} attempts, warn {row.warnedJoinRate}%, recovery{" "}
                      {row.recoveryRate}%
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
