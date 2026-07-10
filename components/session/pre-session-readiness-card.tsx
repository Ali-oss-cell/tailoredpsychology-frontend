"use client"

import * as React from "react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAppointmentReadiness, saveAppointmentReadiness, type TelehealthReadinessResponse } from "@/src/patient/booking/api"
import { runBrowserTelehealthChecks } from "@/src/session/browser-telehealth-checks"
import { formatRelativeTimestamp } from "@/src/shared/relative-time"

type PreSessionReadinessCardProps = {
  appointmentId: string
  onReadinessChange?: (data: TelehealthReadinessResponse | null) => void
  rerunSignal?: number
}

export function PreSessionReadinessCard({ appointmentId, onReadinessChange, rerunSignal }: PreSessionReadinessCardProps) {
  const [data, setData] = React.useState<TelehealthReadinessResponse | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [isRunningChecks, setIsRunningChecks] = React.useState(false)
  const lastHandledRerunSignalRef = React.useRef<number>(0)

  const mergeChecks = React.useCallback(
    async (serverReadiness: TelehealthReadinessResponse): Promise<TelehealthReadinessResponse> => {
      const browserChecks = await runBrowserTelehealthChecks()
      const checks = serverReadiness.checks.map((check) => {
        if (check.key === "session_window") return check
        return {
          ...check,
          status: browserChecks[check.key].status,
          message: browserChecks[check.key].message,
        }
      })
      const overallStatus = checks.every((check) => check.status === "pass") ? "ready" : "attention"
      return { ...serverReadiness, checks, overallStatus, updatedAt: new Date().toISOString() }
    },
    [],
  )

  const runChecksNow = React.useCallback(async () => {
    if (!data) return
    setIsRunningChecks(true)
    setError(null)
    try {
      const merged = await mergeChecks(data)
      const persisted = await saveAppointmentReadiness(appointmentId, {
        overallStatus: merged.overallStatus,
        checks: merged.checks,
      })
      setData(persisted)
      onReadinessChange?.(persisted)
    } catch {
      setError("We couldn't complete that action. Try again.")
    } finally {
      setIsRunningChecks(false)
    }
  }, [data, mergeChecks, appointmentId, onReadinessChange])

  const statusBadgeClass = (status: "pass" | "review") =>
    status === "pass"
      ? "rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success"
      : "rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[11px] font-medium text-warning"

  const loadReadiness = React.useCallback(() => {
    let cancelled = false
    void getAppointmentReadiness(appointmentId)
      .then((next) => mergeChecks(next))
      .then((next) => {
        if (!cancelled) {
          setData(next)
          setError(null)
          onReadinessChange?.(next)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setData(null)
          setError("We couldn't load this section. Try again.")
          onReadinessChange?.(null)
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [appointmentId, mergeChecks, onReadinessChange])

  React.useEffect(() => {
    loadReadiness()
  }, [loadReadiness])

  React.useEffect(() => {
    if (rerunSignal === undefined || rerunSignal <= 0 || isRunningChecks || !data) return
    if (lastHandledRerunSignalRef.current === rerunSignal) return
    lastHandledRerunSignalRef.current = rerunSignal
    void runChecksNow()
  }, [rerunSignal, isRunningChecks, data, runChecksNow])

  const retryLoadReadiness = () => {
    setIsLoading(true)
    setError(null)
    loadReadiness()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Telehealth readiness</CardTitle>
        <CardDescription>Quick pre-session checks for smoother video care</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
        {!isLoading && error ? <DashboardStateBlock variant="error" message={error} onRetry={retryLoadReadiness} /> : null}
        {!isLoading && !error && !data ? <DashboardStateBlock variant="empty" message="No data yet." /> : null}
        {!isLoading && !error && data ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">{data.guidance}</p>
              <Button size="sm" variant="outline" onClick={() => void runChecksNow()} disabled={isRunningChecks}>
                {isRunningChecks ? "Running checks..." : "Run checks now"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground" title={new Date(data.updatedAt).toLocaleString()}>
              Last checked: {formatRelativeTimestamp(data.updatedAt)}
            </p>
            <div className="space-y-2">
              {data.checks.map((check) => (
                <article key={check.key} className="rounded-md border border-border/60 px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium capitalize">{check.key.replaceAll("_", " ")}</p>
                    <span className={statusBadgeClass(check.status)}>{check.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{check.message}</p>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
