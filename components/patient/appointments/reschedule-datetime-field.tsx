"use client"

import * as React from "react"
import { Clock } from "@phosphor-icons/react"

import { CompactDatePicker, dateKey as toYmdKey } from "@/components/patient/booking/compact-date-picker"
import { RESCHEDULE_MAX_DAYS, RESCHEDULE_MIN_LEAD_MS } from "@/src/patient/booking/reschedule-policy"

const MINUTE_STEPS = [0, 15, 30, 45] as const

function pad2(n: number): string {
  return `${n}`.padStart(2, "0")
}

function parseDatetimeLocal(value: string): { dateKey: string; hour: number; minute: number } | null {
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/.exec(value.trim())
  if (!m) return null
  const hour = Number(m[2])
  const minute = Number(m[3])
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null
  return { dateKey: m[1], hour, minute }
}

function combineDatetimeLocal(dateKey: string, hour: number, minute: number): string {
  return `${dateKey}T${pad2(hour)}:${pad2(minute)}`
}

function snapTimeUp(hour: number, minute: number): [number, number] {
  const total = hour * 60 + minute
  const snapped = Math.ceil(total / 15) * 15
  if (snapped >= 24 * 60) return [23, 45]
  const nh = Math.floor(snapped / 60)
  const nm = snapped % 60
  return [nh, nm]
}

function minAllowedMsForDate(dayKey: string, now: Date): number {
  const today = toYmdKey(now)
  if (dayKey < today) return Number.POSITIVE_INFINITY
  if (dayKey > today) return new Date(`${dayKey}T00:00:00`).getTime()
  return now.getTime() + RESCHEDULE_MIN_LEAD_MS
}

function timeAllowed(dayKey: string, hour: number, minute: number, now: Date): boolean {
  const t = new Date(`${dayKey}T${pad2(hour)}:${pad2(minute)}:00`).getTime()
  if (Number.isNaN(t)) return false
  return t >= minAllowedMsForDate(dayKey, now)
}

function firstAllowedQuarter(dayKey: string, now: Date): [number, number] | null {
  for (let h = 0; h < 24; h += 1) {
    for (const m of MINUTE_STEPS) {
      if (timeAllowed(dayKey, h, m, now)) return [h, m]
    }
  }
  return null
}

function nextDateKey(dk: string): string {
  const d = new Date(`${dk}T12:00:00`)
  d.setDate(d.getDate() + 1)
  return toYmdKey(d)
}

function formatHourLabel(h: number): string {
  if (h === 0) return "12 AM"
  if (h < 12) return `${h} AM`
  if (h === 12) return "12 PM"
  return `${h - 12} PM`
}

const rowClass =
  "border-border/70 grid gap-2 rounded-xl border border-border/60 bg-muted/20 p-3 sm:grid-cols-[1fr_auto] sm:items-end"

const selectClass =
  "border-border focus-visible:ring-ring bg-background h-9 w-full rounded-md border px-2 text-sm outline-none transition-colors focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60"

export type RescheduleDatetimeFieldProps = {
  id?: string
  value: string
  onChange: (datetimeLocal: string) => void
  disabled?: boolean
}

export function RescheduleDatetimeField({ id, value, onChange, disabled }: RescheduleDatetimeFieldProps) {
  const [now, setNow] = React.useState(() => new Date())
  React.useEffect(() => {
    const idTimer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(idTimer)
  }, [])

  const todayKey = toYmdKey(now)
  const maxDateKey = React.useMemo(() => {
    const d = new Date(now)
    d.setDate(d.getDate() + RESCHEDULE_MAX_DAYS)
    return toYmdKey(d)
  }, [now])

  const syncFromParts = React.useCallback(
    (dk: string, h: number, mi: number) => {
      let ndk = dk
      let nh = h
      let nmi = mi
      if (!(MINUTE_STEPS as readonly number[]).includes(nmi)) {
        ;[nh, nmi] = snapTimeUp(nh, nmi)
      }
      for (let tries = 0; tries < 400; tries += 1) {
        if (ndk > maxDateKey) {
          const slot = firstAllowedQuarter(maxDateKey, now)
          if (slot) {
            onChange(combineDatetimeLocal(maxDateKey, slot[0], slot[1]))
            return
          }
          onChange(combineDatetimeLocal(maxDateKey, 23, 45))
          return
        }
        if (timeAllowed(ndk, nh, nmi, now)) {
          onChange(combineDatetimeLocal(ndk, nh, nmi))
          return
        }
        const slot = firstAllowedQuarter(ndk, now)
        if (slot) {
          onChange(combineDatetimeLocal(ndk, slot[0], slot[1]))
          return
        }
        ndk = nextDateKey(ndk)
        nh = 9
        nmi = 0
      }
    },
    [maxDateKey, onChange, now],
  )

  React.useLayoutEffect(() => {
    const p = parseDatetimeLocal(value)
    if (!p) return
    let nh = p.hour
    let nm = p.minute
    if (!(MINUTE_STEPS as readonly number[]).includes(nm)) {
      ;[nh, nm] = snapTimeUp(p.hour, p.minute)
    }
    if (!timeAllowed(p.dateKey, nh, nm, now)) {
      syncFromParts(p.dateKey, nh, nm)
      return
    }
    const candidate = combineDatetimeLocal(p.dateKey, nh, nm)
    if (candidate !== value) {
      onChange(candidate)
    }
  }, [value, now, onChange, syncFromParts])

  const parsed = parseDatetimeLocal(value)
  const datePart = parsed?.dateKey ?? todayKey
  const hour = parsed?.hour ?? 12
  const minute = parsed?.minute ?? 0

  const hours = React.useMemo(() => Array.from({ length: 24 }, (_, i) => i), [])
  const displaySummary = value
    ? (() => {
        const d = new Date(value)
        return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })
      })()
    : ""

  return (
    <div className="space-y-2">
      <div className={rowClass}>
        <CompactDatePicker
          id={id ? `${id}-date` : undefined}
          label="New date"
          value={datePart}
          onChange={(dk) => syncFromParts(dk, hour, minute)}
          disabled={disabled}
          minDate={todayKey}
          maxDate={maxDateKey}
          capAtToday={false}
        />
        <div className="space-y-1">
          <span className="text-sm font-medium">Time</span>
          <div className="flex gap-2">
            <select
              aria-label="Hour"
              className={selectClass}
              disabled={disabled}
              value={hour}
              onChange={(e) => {
                const h = Number(e.target.value)
                syncFromParts(datePart, h, minute)
              }}
            >
              {hours.map((h) => {
                const allowed = MINUTE_STEPS.some((m) => timeAllowed(datePart, h, m, now))
                return (
                  <option key={h} value={h} disabled={!allowed}>
                    {formatHourLabel(h)}
                  </option>
                )
              })}
            </select>
            <select
              aria-label="Minutes"
              className={`${selectClass} max-w-[4.5rem]`}
              disabled={disabled}
              value={minute}
              onChange={(e) => {
                const mi = Number(e.target.value)
                syncFromParts(datePart, hour, mi)
              }}
            >
              {MINUTE_STEPS.map((m) => (
                <option key={m} value={m} disabled={!timeAllowed(datePart, hour, m, now)}>
                  {pad2(m)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {displaySummary ? (
        <p className="text-muted-foreground flex items-center gap-2 text-xs">
          <Clock size={14} className="shrink-0 opacity-80" aria-hidden />
          <span>
            Selected: <span className="font-medium text-foreground">{displaySummary}</span>
          </span>
        </p>
      ) : null}
    </div>
  )
}
