"use client"

import * as React from "react"

/**
 * Returns `null` during SSR / first paint, then a live clock after mount.
 * Use for UI that depends on wall-clock time so server HTML matches the initial client render.
 */
export function useClientNow(intervalMs = 30_000): number | null {
  const [nowMs, setNowMs] = React.useState<number | null>(null)

  React.useEffect(() => {
    setNowMs(Date.now())
    if (intervalMs <= 0) return
    const timer = window.setInterval(() => setNowMs(Date.now()), intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])

  return nowMs
}

/** True after the component has mounted on the client. */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}
