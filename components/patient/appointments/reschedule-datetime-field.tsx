"use client"

import * as React from "react"
import { Clock } from "@phosphor-icons/react"

import { CompactDatePicker, dateKey as toYmdKey } from "@/components/patient/booking/compact-date-picker"
import {
  NATIVE_DATETIME_MINUTE_STEPS,
  combineDatetimeLocal,
  formatHourLabel,
  nativeDatetimeRowClassName,
  nativeDatetimeSelectClassName,
  nextDateKey,
  pad2,
  parseDatetimeLocal,
  snapTimeUp,
} from "@/components/shared/native-datetime-picker"
import { australianEasternTimezoneLabel } from "@/src/lib/format-au"
import { RESCHEDULE_MAX_DAYS, RESCHEDULE_MIN_LEAD_MS } from "@/src/patient/booking/reschedule-policy"

const MINUTE_STEPS = NATIVE_DATETIME_MINUTE_STEPS

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
      <div className={nativeDatetimeRowClassName}>
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
              className={nativeDatetimeSelectClassName}
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
              className={`${nativeDatetimeSelectClassName} max-w-[4.5rem]`}
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
            <span className="text-muted-foreground"> · {australianEasternTimezoneLabel(value ? new Date(value) : new Date())}</span>
          </span>
        </p>
      ) : null}
    </div>
  )
}
