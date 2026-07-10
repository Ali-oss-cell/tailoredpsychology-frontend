"use client"

import * as React from "react"
import { Clock, WifiHigh } from "@phosphor-icons/react"

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
    <section className="dashboard-card rounded-dashboard-card border-primary/20 from-primary/5 to-card bg-gradient-to-br p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-primary text-xs font-semibold tracking-wide uppercase">Your session</p>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            {detail?.sessionTypeLabel ?? "Telehealth appointment"}
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <Clock size={16} className="text-primary shrink-0" aria-hidden />
            Scheduled start:{" "}
            {detail
              ? `${new Date(detail.scheduledStartAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })} (${tz})`
              : "—"}
          </p>
          <p className="text-foreground text-sm font-medium" aria-live="polite">
            {countdown}
          </p>
        </div>
        <details className="dashboard-card rounded-dashboard-card border-border/60 bg-card/80 min-w-[14rem] px-4 py-3 text-sm">
          <summary className="flex cursor-pointer items-center gap-2 font-medium">
            <WifiHigh size={16} className="text-primary" aria-hidden />
            Connection tips
          </summary>
          <ul className="text-muted-foreground mt-3 list-inside list-disc space-y-1.5 text-xs leading-relaxed">
            <li>Use a stable Wi‑Fi or wired connection where possible.</li>
            <li>Allow camera and microphone when your browser prompts.</li>
            <li>Find a private space; headphones reduce echo for others.</li>
          </ul>
        </details>
      </div>
      <p className="text-muted-foreground mt-4 text-xs">
        <a
          href="mailto:support@clink.test"
          className="text-primary focus-visible:ring-ring rounded-sm font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
        >
          Need help?
        </a>{" "}
        For emergencies call 000 — this inbox is not monitored for crises.
      </p>
    </section>
  )
}
