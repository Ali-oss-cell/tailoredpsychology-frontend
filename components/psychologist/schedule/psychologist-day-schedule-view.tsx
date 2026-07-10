"use client"

import Link from "next/link"
import * as React from "react"
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { formatTimeAu } from "@/src/lib/format-au"
import { cn } from "@/lib/utils"
import { sameLocalDay } from "@/src/psychologist/session-filters"
import { joinSessionHref } from "@/src/session/join-session"
import type { SessionSummary } from "@/src/sessions/api"

const DAY_START_HOUR = 7
const DAY_END_HOUR = 20
const HOUR_HEIGHT_PX = 56

type PsychologistDayScheduleViewProps = {
  entries: SessionSummary[]
  selectedDay: Date
  onSelectedDayChange: (day: Date) => void
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}

function startOfWeekMonday(day: Date): Date {
  const date = new Date(day)
  const weekday = date.getDay()
  const offset = weekday === 0 ? -6 : 1 - weekday
  date.setDate(date.getDate() + offset)
  date.setHours(0, 0, 0, 0)
  return date
}

function addDays(day: Date, offset: number): Date {
  const next = new Date(day)
  next.setDate(next.getDate() + offset)
  return next
}

function formatDayKey(day: Date): string {
  return day.toLocaleDateString("en-AU", { weekday: "short" })
}

function formatDayNumber(day: Date): string {
  return `${day.getDate()}`
}

function formatSelectedDate(day: Date): string {
  return day.toLocaleDateString("en-AU", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function minutesFromDayStart(date: Date, dayStartHour: number): number {
  return (date.getHours() - dayStartHour) * 60 + date.getMinutes()
}

function sessionBlockStyle(startIso: string, endIso: string): { top: number; height: number } {
  const start = new Date(startIso)
  const end = new Date(endIso)
  const dayMinutes = (DAY_END_HOUR - DAY_START_HOUR) * 60
  const startMin = Math.max(0, minutesFromDayStart(start, DAY_START_HOUR))
  const endMin = Math.min(dayMinutes, Math.max(startMin + 15, minutesFromDayStart(end, DAY_START_HOUR)))
  const top = (startMin / 60) * HOUR_HEIGHT_PX
  const height = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT_PX, 44)
  return { top, height }
}

function statusBadgeVariant(
  status: SessionSummary["status"],
): "default" | "secondary" | "outline" {
  if (status === "in_progress") return "default"
  if (status === "completed" || status === "cancelled" || status === "no_show") return "secondary"
  return "outline"
}

function sessionBlockClass(status: SessionSummary["status"]): string {
  if (status === "in_progress") return "border-primary bg-primary/15 ring-1 ring-primary/25"
  if (status === "completed") return "border-border/70 bg-muted/50"
  if (status === "cancelled" || status === "no_show") return "border-border/60 bg-muted/30 opacity-70"
  return "border-primary/35 bg-primary/8 hover:bg-primary/12"
}

function formatTimeRange(startIso: string, endIso: string): string {
  return `${formatTimeAu(startIso)} – ${formatTimeAu(endIso)}`
}

function canJoinSession(status: SessionSummary["status"]): boolean {
  return status === "scheduled" || status === "in_progress"
}

export function PsychologistDayScheduleView({
  entries,
  selectedDay,
  onSelectedDayChange,
  loading = false,
  error = null,
  onRetry,
}: PsychologistDayScheduleViewProps) {
  const [nowMs, setNowMs] = React.useState(() => Date.now())
  const weekStart = startOfWeekMonday(selectedDay)
  const weekDays = React.useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)), [weekStart])
  const hours = React.useMemo(
    () => Array.from({ length: DAY_END_HOUR - DAY_START_HOUR + 1 }, (_, index) => DAY_START_HOUR + index),
    [],
  )
  const gridHeight = (DAY_END_HOUR - DAY_START_HOUR) * HOUR_HEIGHT_PX
  const isToday = sameLocalDay(selectedDay, nowMs)
  const dayStartMs = React.useMemo(() => {
    const day = new Date(selectedDay)
    day.setHours(DAY_START_HOUR, 0, 0, 0)
    return day.getTime()
  }, [selectedDay])
  const dayEndMs = React.useMemo(() => {
    const day = new Date(selectedDay)
    day.setHours(DAY_END_HOUR, 0, 0, 0)
    return day.getTime()
  }, [selectedDay])
  const nowTop =
    isToday && nowMs >= dayStartMs && nowMs <= dayEndMs
      ? (minutesFromDayStart(new Date(nowMs), DAY_START_HOUR) / 60) * HOUR_HEIGHT_PX
      : null

  React.useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  const sortedEntries = React.useMemo(
    () => [...entries].sort((a, b) => new Date(a.scheduledStartAt).getTime() - new Date(b.scheduledStartAt).getTime()),
    [entries],
  )

  const nextUpId =
    sortedEntries.find((entry) => new Date(entry.scheduledStartAt).getTime() > nowMs)?.sessionId ??
    sortedEntries[0]?.sessionId

  return (
    <div className="space-y-4">
      <Card className="interactive-lift">
        <CardHeader className="space-y-4 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="card-eyebrow">Calendar</p>
              <CardTitle className="text-lg">{formatSelectedDate(selectedDay)}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Previous day"
                onClick={() => onSelectedDayChange(addDays(selectedDay, -1))}
              >
                <CaretLeft size={16} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onSelectedDayChange(new Date())}
                disabled={isToday}
              >
                Today
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Next day"
                onClick={() => onSelectedDayChange(addDays(selectedDay, 1))}
              >
                <CaretRight size={16} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const active = sameLocalDay(day, selectedDay)
              const today = sameLocalDay(day, nowMs)
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => onSelectedDayChange(day)}
                  className={cn(
                    "rounded-xl border px-2 py-2 text-center transition-colors",
                    active
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40",
                  )}
                >
                  <p className="text-[10px] font-medium uppercase tracking-wide">{formatDayKey(day)}</p>
                  <p className={cn("mt-1 text-lg font-semibold tabular-nums", today && !active && "text-primary")}>
                    {formatDayNumber(day)}
                  </p>
                </button>
              )
            })}
          </div>
        </CardHeader>

        <CardContent>
          {loading ? <DashboardStateBlock variant="loading" message="Loading schedule..." /> : null}
          {error ? <DashboardStateBlock variant="error" message={error} onRetry={onRetry} /> : null}
          {!loading && !error ? (
            <div className="border-border/60 overflow-hidden rounded-xl border">
              <div className="bg-muted/30 border-border/60 grid grid-cols-[4.5rem_minmax(0,1fr)] border-b px-3 py-2 text-xs font-medium uppercase tracking-wide">
                <span>Time</span>
                <span>Sessions</span>
              </div>

              <div className="grid grid-cols-[4.5rem_minmax(0,1fr)]">
                <div className="border-border/60 border-r">
                  {hours.slice(0, -1).map((hour) => (
                    <div
                      key={hour}
                      className="text-muted-foreground border-border/40 flex items-start border-b px-2 pt-1 text-[11px] tabular-nums"
                      style={{ height: HOUR_HEIGHT_PX }}
                    >
                      {formatTimeAu(new Date(2000, 0, 1, hour))}
                    </div>
                  ))}
                </div>

                <div className="relative bg-background" style={{ height: gridHeight }}>
                  {hours.slice(0, -1).map((hour) => (
                    <div
                      key={hour}
                      className="border-border/40 pointer-events-none absolute inset-x-0 border-b border-dashed"
                      style={{ top: (hour - DAY_START_HOUR) * HOUR_HEIGHT_PX, height: HOUR_HEIGHT_PX }}
                    />
                  ))}

                  {nowTop !== null ? (
                    <div className="pointer-events-none absolute inset-x-0 z-20" style={{ top: nowTop }}>
                      <div className="bg-primary absolute -left-1 h-2.5 w-2.5 -translate-y-1/2 rounded-full" />
                      <div className="bg-primary h-0.5 w-full" />
                    </div>
                  ) : null}

                  {sortedEntries.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <DashboardStateBlock variant="empty" message="No sessions scheduled for this day." />
                    </div>
                  ) : null}

                  {sortedEntries.map((entry) => {
                    const { top, height } = sessionBlockStyle(entry.scheduledStartAt, entry.scheduledEndAt)
                    const isNextUp = entry.sessionId === nextUpId
                    return (
                      <div
                        key={entry.sessionId}
                        className={cn(
                          "absolute inset-x-2 z-10 overflow-hidden rounded-lg border p-2 shadow-sm transition-colors",
                          sessionBlockClass(entry.status),
                          isNextUp && "ring-2 ring-primary/30",
                        )}
                        style={{ top, height }}
                      >
                        <div className="flex h-full flex-col justify-between gap-1">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{entry.patientId}</p>
                            <p className="text-muted-foreground truncate text-[11px] tabular-nums">
                              {formatTimeRange(entry.scheduledStartAt, entry.scheduledEndAt)}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge variant={statusBadgeVariant(entry.status)} className="text-[10px]">
                              {entry.status.replace(/_/g, " ")}
                            </Badge>
                            {isNextUp ? (
                              <Badge variant="default" className="text-[10px]">
                                Next up
                              </Badge>
                            ) : null}
                          </div>
                          <div className="flex flex-wrap gap-2 text-[11px] font-medium">
                            <Link
                              href={`/psychologist/patients/${encodeURIComponent(entry.patientId)}`}
                              className="text-primary hover:underline"
                            >
                              Patient
                            </Link>
                            {canJoinSession(entry.status) ? (
                              <Link href={joinSessionHref(entry.sessionId)} className="text-primary hover:underline">
                                Join
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {!loading && !error && sortedEntries.length > 0 ? (
        <Card className="interactive-lift">
          <CardHeader className="pb-3">
            <p className="card-eyebrow">Agenda</p>
            <CardTitle className="text-lg">Session list</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sortedEntries.map((entry) => (
              <div
                key={`agenda-${entry.sessionId}`}
                className="bg-muted/30 border-border/50 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{entry.patientId}</p>
                  <p className="text-muted-foreground text-xs tabular-nums">
                    {formatTimeRange(entry.scheduledStartAt, entry.scheduledEndAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusBadgeVariant(entry.status)}>{entry.status.replace(/_/g, " ")}</Badge>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/psychologist/patients/${encodeURIComponent(entry.patientId)}`}>Open</Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
