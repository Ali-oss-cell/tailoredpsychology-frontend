"use client"

import { ArrowsClockwise, WifiSlash } from "@phosphor-icons/react/dist/ssr"
import * as React from "react"

import { subscribeSocketDegraded } from "@/src/session/resilient-socket"

/**
 * Subtle banner when live updates are reconnecting after a network change.
 * Does not block the portal — queries retry in the background.
 */
export function PortalNetworkBanner() {
  const [degraded, setDegraded] = React.useState(false)
  const [dismissed, setDismissed] = React.useState(false)

  React.useEffect(() => subscribeSocketDegraded(setDegraded), [])

  React.useEffect(() => {
    if (!degraded) setDismissed(false)
  }, [degraded])

  if (!degraded || dismissed) return null

  return (
    <div
      role="status"
      className="border-warning/30 bg-warning/10 text-foreground flex items-center justify-between gap-3 border-b px-4 py-2 text-sm"
    >
      <div className="flex min-w-0 items-center gap-2">
        <WifiSlash className="text-warning shrink-0" size={18} aria-hidden />
        <p className="leading-snug">
          Reconnecting live updates… Your dashboard will refresh automatically.
        </p>
      </div>
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground inline-flex shrink-0 items-center gap-1 text-xs font-medium"
        onClick={() => setDismissed(true)}
      >
        <ArrowsClockwise size={14} aria-hidden />
        Dismiss
      </button>
    </div>
  )
}
