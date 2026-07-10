"use client"

import * as React from "react"
import { CheckCircle, WarningCircle } from "@phosphor-icons/react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Button } from "@/components/ui/button"
import { getAppointmentReadiness, saveAppointmentReadiness, type TelehealthReadinessResponse } from "@/src/patient/booking/api"
import { runBrowserTelehealthChecks } from "@/src/session/browser-telehealth-checks"
import { formatRelativeTimestamp } from "@/src/shared/relative-time"
import { cn } from "@/lib/utils"

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
      ? "rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-[11px] font-medium text-success"
      : "rounded-full border border-warning/30 bg-warning/10 px-2.5 py-0.5 text-[11px] font-medium text-warning"

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
    <section className="dashboard-card rounded-dashboard-card overflow-hidden">
      <header className="border-border/50 space-y-1 border-b px-5 py-4 md:px-6">
        <h2 className="font-heading text-lg font-semibold tracking-tight">Telehealth readiness</h2>
        <p className="text-muted-foreground text-sm">Quick pre-session checks for smoother video care</p>
      </header>
      <div className="space-y-4 px-5 py-5 md:px-6">
        {isLoading ? <DashboardStateBlock variant="loading" message="Loading readiness checks…" /> : null}
        {!isLoading && error ? (
          <DashboardStateBlock variant="error" message={error} onRetry={retryLoadReadiness} />
        ) : null}
        {!isLoading && !error && !data ? <DashboardStateBlock variant="empty" message="No data yet." /> : null}
        {!isLoading && !error && data ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-muted-foreground text-sm leading-relaxed">{data.guidance}</p>
              <Button
                size="default"
                variant="outline"
                className="h-11 rounded-xl"
                onClick={() => void runChecksNow()}
                disabled={isRunningChecks}
              >
                {isRunningChecks ? "Running checks…" : "Run checks now"}
              </Button>
            </div>
            <p className="text-muted-foreground text-xs" title={new Date(data.updatedAt).toLocaleString()}>
              Last checked: {formatRelativeTimestamp(data.updatedAt)}
            </p>
            <ul className="space-y-2" aria-label="Readiness checklist">
              {data.checks.map((check) => (
                <li
                  key={check.key}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-sm",
                    check.status === "pass"
                      ? "border-success/25 bg-success/5"
                      : "border-warning/30 bg-warning/5",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex items-center gap-2 font-medium capitalize">
                      {check.status === "pass" ? (
                        <CheckCircle size={16} className="text-success shrink-0" aria-hidden />
                      ) : (
                        <WarningCircle size={16} className="text-warning shrink-0" aria-hidden />
                      )}
                      {check.key.replaceAll("_", " ")}
                    </p>
                    <span className={statusBadgeClass(check.status)}>{check.status}</span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{check.message}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}
