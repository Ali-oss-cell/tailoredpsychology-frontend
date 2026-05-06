"use client"

import { useEffect, useMemo, useState } from "react"

import { RescheduleDatetimeField } from "@/components/patient/appointments/reschedule-datetime-field"
import { Button } from "@/components/ui/button"
import { getAppointmentDetails, postManageAppointment, type AppointmentDetailsResponse } from "@/src/patient/booking/api"
import { RESCHEDULE_LOCK_BEFORE_START_MS, RESCHEDULE_RULE_LINES } from "@/src/patient/booking/reschedule-policy"

type AppointmentManagePanelProps = {
  appointmentId: string
  onAppointmentUpdated?: () => void
}

export function AppointmentManagePanel({ appointmentId, onAppointmentUpdated }: AppointmentManagePanelProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [details, setDetails] = useState<AppointmentDetailsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rescheduleAt, setRescheduleAt] = useState("")

  const canManage = useMemo(() => details?.canManage ?? true, [details])

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const rescheduleLockedOnline = useMemo(() => {
    if (!details?.scheduledStartAt) return false
    const startMs = new Date(details.scheduledStartAt).getTime()
    // eslint-disable-next-line react-hooks/purity
    return startMs - Date.now() < RESCHEDULE_LOCK_BEFORE_START_MS
  }, [details?.scheduledStartAt])

  function toLocalInputValue(iso: string): string {
    const date = new Date(iso)
    const offsetMs = date.getTimezoneOffset() * 60_000
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
  }

  async function loadDetails(): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const next = await getAppointmentDetails(appointmentId)
      setDetails(next)
      setRescheduleAt(toLocalInputValue(next.scheduledStartAt))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load appointment details.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per appointmentId
  }, [appointmentId])

  async function handleCancel(): Promise<void> {
    setIsSubmitting(true)
    setError(null)
    try {
      const next = await postManageAppointment(appointmentId, { action: "cancel" })
      setDetails(next)
      onAppointmentUpdated?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel appointment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleReschedule(): Promise<void> {
    if (!rescheduleAt || rescheduleLockedOnline) return
    setIsSubmitting(true)
    setError(null)
    try {
      const next = await postManageAppointment(appointmentId, {
        action: "reschedule",
        scheduledStartAt: new Date(rescheduleAt).toISOString(),
      })
      setDetails(next)
      setRescheduleAt(toLocalInputValue(next.scheduledStartAt))
      onAppointmentUpdated?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reschedule appointment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-3 rounded-md border border-border/60 bg-muted/30 p-3 text-sm">
      {isLoading ? <p className="text-muted-foreground">Loading appointment details...</p> : null}
      {details ? (
        <>
          <p className="text-muted-foreground">
            Current status: <span className="font-medium text-foreground">{details.status}</span>
          </p>
          <p className="text-muted-foreground">
            Scheduled start:{" "}
            <span className="font-medium text-foreground">{new Date(details.scheduledStartAt).toLocaleString()}</span>
          </p>
          {!canManage ? <p className="text-muted-foreground">You cannot manage this appointment.</p> : null}
        </>
      ) : null}
      {canManage && details ? (
        <div className="space-y-3">
          {rescheduleLockedOnline ? (
            <p className="text-muted-foreground text-xs leading-relaxed">
              Online rescheduling is closed within 2 hours of this session&apos;s start time. Please call the clinic if
              you need a last-minute change.
            </p>
          ) : (
            <>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs font-medium tracking-tight">Pick a new start</span>
                <RescheduleDatetimeField
                  id="reschedule-start"
                  value={rescheduleAt}
                  onChange={setRescheduleAt}
                  disabled={isSubmitting}
                />
              </div>
              <ul className="text-muted-foreground list-inside list-disc space-y-0.5 text-[11px] leading-relaxed">
                {RESCHEDULE_RULE_LINES.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isSubmitting || !rescheduleAt || rescheduleLockedOnline}
              onClick={() => void handleReschedule()}
            >
              {isSubmitting ? "Saving..." : "Reschedule"}
            </Button>
            <Button size="sm" variant="destructive" disabled={isSubmitting} onClick={() => void handleCancel()}>
              {isSubmitting ? "Saving..." : "Cancel appointment"}
            </Button>
          </div>
        </div>
      ) : null}
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  )
}
