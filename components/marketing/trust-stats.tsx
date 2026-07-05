"use client"

import * as React from "react"

import { PageContainer } from "@/components/layout/page-container"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type TrustStat = {
  value: string
  label: string
  /** Numeric target for count-up (e.g. 4.9 from "4.9/5"). Omit to show static value. */
  countUp?: number
  suffix?: string
}

type TrustStatsProps = {
  stats: TrustStat[]
  className?: string
}

function parseCountTarget(value: string): { target: number; suffix: string } | null {
  const match = /^([\d.]+)(.*)$/.exec(value.trim())
  if (!match) return null
  const target = Number.parseFloat(match[1])
  if (Number.isNaN(target)) return null
  return { target, suffix: match[2] ?? "" }
}

function useCountUp(target: number, active: boolean, durationMs = 900): number {
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!active) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setCurrent(target)
      return
    }

    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - (1 - t) ** 3
      setCurrent(target * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, target, durationMs])

  return current
}

function TrustStatValue({ stat, active }: { stat: TrustStat; active: boolean }) {
  const parsed = stat.countUp !== undefined ? { target: stat.countUp, suffix: stat.suffix ?? "" } : parseCountTarget(stat.value)
  const animated = useCountUp(parsed?.target ?? 0, active && parsed !== null)
  const decimals = parsed && !Number.isInteger(parsed.target) ? 1 : 0

  if (!parsed) {
    return <p className="font-heading text-2xl font-semibold tracking-tight tabular-nums md:text-3xl">{stat.value}</p>
  }

  const display = decimals > 0 ? animated.toFixed(decimals) : Math.round(animated).toString()
  return (
    <p className="font-heading text-2xl font-semibold tracking-tight tabular-nums md:text-3xl">
      {display}
      {parsed.suffix}
    </p>
  )
}

export function TrustStats({ stats, className }: TrustStatsProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <PageContainer className={cn("pb-4", className)}>
      <div ref={ref} className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="interactive-lift border-border/60 bg-surface-1 shadow-e1 dark:bg-surface-2">
            <CardContent className="space-y-1 p-5">
              <TrustStatValue stat={stat} active={active} />
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}
