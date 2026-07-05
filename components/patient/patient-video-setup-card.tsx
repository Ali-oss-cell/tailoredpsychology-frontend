"use client"

import * as React from "react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type BrowserTelehealthCheckKey,
  type BrowserTelehealthCheckRow,
  runBrowserTelehealthChecks,
} from "@/src/session/browser-telehealth-checks"

const DISPLAY_ORDER: BrowserTelehealthCheckKey[] = ["camera", "microphone", "network"]

function statusBadgeClass(status: "pass" | "review"): string {
  return status === "pass"
    ? "rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
    : "rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700"
}

/**
 * Standalone mic/camera/network check for patients (Wave 17). No appointment APIs.
 */
export function PatientVideoSetupCard() {
  const [rows, setRows] = React.useState<Record<BrowserTelehealthCheckKey, BrowserTelehealthCheckRow> | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isRunning, setIsRunning] = React.useState(false)

  const run = React.useCallback(async () => {
    setIsRunning(true)
    setError(null)
    try {
      const next = await runBrowserTelehealthChecks()
      setRows(next)
    } catch {
      setError("Checks could not complete. Try again.")
    } finally {
      setIsRunning(false)
    }
  }, [])

  React.useEffect(() => {
    void run()
  }, [run])

  return (
    <Card className="interactive-lift">
      <CardHeader className="pb-3">
        <p className="card-eyebrow">Device check</p>
        <CardTitle>Video setup check</CardTitle>
        <CardDescription>
          Test your camera, microphone, and a quick network hint. Nothing is recorded; we only request permission
          long enough to verify access, then stop your tracks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {error ? <DashboardStateBlock variant="error" message={error} onRetry={() => void run()} /> : null}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Run again after changing devices, browsers, or VPN. For the real join flow, open your appointment when it is
            time.
          </p>
          <Button size="sm" variant="outline" onClick={() => void run()} disabled={isRunning}>
            {isRunning ? "Running checks..." : "Run checks again"}
          </Button>
        </div>
        {!rows ? (
          <DashboardStateBlock variant="loading" message="Running first checks…" />
        ) : (
          <div className="space-y-2">
            {DISPLAY_ORDER.map((key) => {
              const check = rows[key]
              return (
                <article key={key} className="rounded-md border border-border/60 px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium capitalize">{key}</p>
                    <span className={statusBadgeClass(check.status)}>{check.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{check.message}</p>
                </article>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
