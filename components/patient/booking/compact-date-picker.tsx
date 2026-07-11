"use client"

import * as React from "react"
import { CalendarBlank, CaretLeft, CaretRight } from "@phosphor-icons/react"

import { dateKeyFromDate } from "@/components/shared/native-datetime-picker"

function monthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function shiftMonth(date: Date, offset: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1)
}

export function dateKey(date: Date): string {
  return dateKeyFromDate(date)
}

function monthGridDays(currentMonth: Date): Date[] {
  const first = monthStart(currentMonth)
  const startWeekday = first.getDay()
  const gridStart = new Date(first)
  gridStart.setDate(first.getDate() - startWeekday)
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart)
    day.setDate(gridStart.getDate() + index)
    return day
  })
}

function monthIndex(d: Date): number {
  return d.getFullYear() * 12 + d.getMonth()
}

function isDateAllowed(key: string, min?: string, max?: string): boolean {
  if (min && key < min) return false
  if (max && key > max) return false
  return true
}

const triggerClass =
  "bg-background text-foreground border-border focus-visible:ring-ring flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60"

export type CompactDatePickerProps = {
  id?: string
  label: string
  value: string
  onChange: (isoDate: string) => void
  disabled?: boolean
  error?: string
  required?: boolean
  /** ISO yyyy-mm-dd lower bound */
  minDate?: string
  /** ISO yyyy-mm-dd upper bound; ignored when capAtToday is false unless set explicitly */
  maxDate?: string
  /** When true (default), cannot pick a date after today unless maxDate overrides */
  capAtToday?: boolean
}

export function CompactDatePicker({
  id,
  label,
  value,
  onChange,
  disabled,
  error,
  required,
  minDate = "1900-01-01",
  maxDate: maxDateProp,
  capAtToday = true,
}: CompactDatePickerProps) {
  const todayKey = dateKey(new Date())
  const effectiveMax = capAtToday ? (maxDateProp ?? todayKey) : maxDateProp
  const effectiveMin = minDate

  const maxNavIdx = effectiveMax
    ? monthIndex(monthStart(new Date(Number(effectiveMax.slice(0, 4)), Number(effectiveMax.slice(5, 7)) - 1, 1)))
    : monthIndex(monthStart(new Date(2100, 11, 1)))
  const minNavIdx = effectiveMin
    ? monthIndex(monthStart(new Date(Number(effectiveMin.slice(0, 4)), Number(effectiveMin.slice(5, 7)) - 1, 1)))
    : monthIndex(monthStart(new Date(1900, 0, 1)))

  const containerRef = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false)

  const initialView = React.useCallback(() => {
    if (value) {
      const p = value.split("-")
      const y = Number(p[0])
      const mo = Number(p[1])
      if (Number.isFinite(y) && Number.isFinite(mo)) {
        return monthStart(new Date(y, mo - 1, 1))
      }
    }
    if (effectiveMax) {
      const p = effectiveMax.split("-")
      return monthStart(new Date(Number(p[0]), Number(p[1]) - 1, 1))
    }
    return monthStart(new Date())
  }, [value, effectiveMax])

  const [viewMonth, setViewMonth] = React.useState<Date>(initialView)

  React.useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setViewMonth(initialView())
    }
  }, [open, initialView])

  React.useEffect(() => {
    if (!open) return
    const onDocMouseDown = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener("mousedown", onDocMouseDown)
    return () => document.removeEventListener("mousedown", onDocMouseDown)
  }, [open])

  const canPrev = monthIndex(viewMonth) > minNavIdx
  const canNext = monthIndex(viewMonth) < maxNavIdx

  const yearTop = effectiveMax ? Number(effectiveMax.slice(0, 4)) : new Date().getFullYear()
  const yearBottom = effectiveMin ? Number(effectiveMin.slice(0, 4)) : yearTop - 120
  const years = React.useMemo(() => {
    const list: number[] = []
    for (let y = yearTop; y >= yearBottom; y--) list.push(y)
    return list
  }, [yearTop, yearBottom])

  const displayText = value
    ? new Date(`${value}T12:00:00`).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })
    : "Select date"

  const monthDays = monthGridDays(viewMonth)

  const onPickDay = React.useCallback(
    (key: string) => {
      if (!isDateAllowed(key, effectiveMin, effectiveMax)) return
      onChange(key)
      setOpen(false)
    },
    [effectiveMin, effectiveMax, onChange],
  )

  return (
    <div className="relative space-y-2" ref={containerRef}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? (
          <span className="text-destructive ml-0.5" aria-hidden>
            *
          </span>
        ) : null}
      </label>
      <button
        id={id}
        type="button"
        disabled={disabled}
        className={`${triggerClass}${error ? " border-destructive/60" : ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => {
          if (!disabled) setOpen((o) => !o)
        }}
      >
        <span className="flex min-w-0 items-center gap-2">
          <CalendarBlank size={18} className="text-muted-foreground shrink-0 opacity-90" aria-hidden />
          <span className={value ? "truncate text-foreground" : "truncate text-muted-foreground"}>{displayText}</span>
        </span>
        <CaretRight className="text-muted-foreground shrink-0 -rotate-90" size={14} weight="bold" aria-hidden />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label={label}
          className="border-border/70 bg-background absolute left-0 z-50 mt-1 w-[min(100%,17.5rem)] rounded-xl border border-border/60 bg-muted/25 p-2.5 shadow-lg"
        >
          <select
            className="border-border focus-visible:ring-ring mb-1.5 w-full rounded-md border bg-background px-2 py-1.5 text-xs outline-none focus-visible:ring-2"
            value={viewMonth.getFullYear()}
            onChange={(e) => {
              const y = Number(e.target.value)
              setViewMonth(monthStart(new Date(y, viewMonth.getMonth(), 1)))
            }}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <div className="mb-1.5 flex items-center justify-between gap-1">
            <button
              type="button"
              disabled={!canPrev}
              onClick={() => canPrev && setViewMonth((m) => shiftMonth(m, -1))}
              className="rounded-md border border-border/70 p-1.5 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous month"
            >
              <CaretLeft size={14} />
            </button>
            <p className="font-heading text-center text-xs font-semibold tracking-tight">
              {viewMonth.toLocaleDateString("en-AU", { month: "long" })}
            </p>
            <button
              type="button"
              disabled={!canNext}
              onClick={() => canNext && setViewMonth((m) => shiftMonth(m, 1))}
              className="rounded-md border border-border/70 p-1.5 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next month"
            >
              <CaretRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 pb-1 text-center text-[10px] font-medium text-muted-foreground">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="py-0.5">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {monthDays.map((day) => {
              const key = dateKey(day)
              const inViewMonth = day.getMonth() === viewMonth.getMonth()
              const allowed = isDateAllowed(key, effectiveMin, effectiveMax)
              const selected = value === key
              return (
                <button
                  key={`${key}-${day.getTime()}`}
                  type="button"
                  disabled={!allowed}
                  onClick={() => onPickDay(key)}
                  className={`flex h-7 w-full items-center justify-center rounded-md text-[11px] font-medium transition-colors ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : allowed
                        ? "border border-border/70 bg-background hover:bg-muted"
                        : "cursor-not-allowed text-muted-foreground/40"
                  } ${!inViewMonth ? "opacity-40" : ""}`}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
