"use client"

import * as React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSessionDetail, type SessionDetail } from "@/src/sessions/api"

function formatCountdown(msUntilStart: number): string {
  if (msUntilStart <= 0) return "Session start time has passed — use Join when your clinician opens the window."
  const totalSec = Math.floor(msUntilStart / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}h ${m}m until scheduled start`
  if (m > 0) return `${m}m ${s}s until scheduled start`
  return `${s}s until scheduled start`
}

type VideoSessionSessionBannerProps = {
  appointmentId: string
}

export function VideoSessionSessionBanner({ appointmentId }: VideoSessionSessionBannerProps) {
  const [detail, setDetail] = React.useState<SessionDetail | null>(null)
  const [, setTick] = React.useState(0)

  React.useEffect(() => {
    let cancelled = false
    void getSessionDetail(appointmentId).then((d) => {
      if (!cancelled) setDetail(d)
    })
    return () => {
      cancelled = true
    }
  }, [appointmentId])

  React.useEffect(() => {
    const reduced =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const ms = reduced ? 60_000 : 1000
    const id = window.setInterval(() => setTick((t) => t + 1), ms)
    return () => window.clearInterval(id)
  }, [])

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const startMs = detail ? new Date(detail.scheduledStartAt).getTime() : null
  const countdown =
    startMs !== null ? formatCountdown(startMs - Date.now()) : detail ? "Starting soon" : "Loading schedule…"

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Your session</CardTitle>
        <CardDescription>
          Scheduled start:{" "}
          {detail
            ? `${new Date(detail.scheduledStartAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })} (${tz})`
            : "—"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground text-xs" aria-live="polite">
          {countdown}
        </p>
        <details className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs">
          <summary className="cursor-pointer font-medium text-foreground">Connection tips</summary>
          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1">
            <li>Use a stable Wi‑Fi or wired connection where possible.</li>
            <li>Allow camera and microphone when your browser prompts.</li>
            <li>Find a private space; headphones reduce echo for others.</li>
          </ul>
        </details>
        <p className="text-xs">
          <a
            href="mailto:support@clink.test"
            className="text-primary font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Need help?
          </a>{" "}
          <span className="text-muted-foreground">For emergencies call 000 — this inbox is not monitored for crises.</span>
        </p>
      </CardContent>
    </Card>
  )
}
