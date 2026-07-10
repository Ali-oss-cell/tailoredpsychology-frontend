"use client"

import { useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from "@/src/notifications/api"
import { toast } from "@/src/lib/toast"

const defaultPrefs: NotificationPreferences = {
  inAppEnabled: true,
  bookingSubmitted: true,
  bookingConfirmed: true,
  chatWindowOpen: true,
  sessionStartingSoon: true,
}

/**
 * Psychologist notification preferences (same API as patient account).
 * Lives on profile so header menu can deep-link here.
 */
export function PsychologistNotificationPrefsCard() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(defaultPrefs)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [busy, setBusy] = useState(false)

  const loadPrefs = useCallback(async (): Promise<void> => {
    setLoading(true)
    setLoadError(false)
    try {
      const next = await getNotificationPreferences()
      setPrefs(next)
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPrefs()
  }, [loadPrefs])

  async function save(): Promise<void> {
    setBusy(true)
    try {
      await updateNotificationPreferences(prefs)
      toast.success("Notification preferences saved")
    } catch {
      toast.error("Could not save notification preferences.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card id="psychologist-profile-notifications" className="scroll-mt-20 md:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Notifications</CardTitle>
        <p className="text-muted-foreground pt-1 text-xs font-normal leading-relaxed">
          Control in-app and email-style alerts for your account. Critical clinical messages may still be delivered when
          required.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? <DashboardStateBlock variant="loading" message="Loading preferences..." /> : null}
        {loadError ? (
          <DashboardStateBlock variant="error" message="Could not load notification preferences." onRetry={() => void loadPrefs()} />
        ) : null}
        {!loading && !loadError ? (
          <>
            <fieldset className="space-y-2 text-sm">
              <legend className="sr-only">Notification channels and topics</legend>
              {(
                [
                  ["inAppEnabled", "In-app notifications", "Banner and in-product reminders while you are signed in."],
                  ["bookingSubmitted", "Booking submitted", "When a booking request is received."],
                  ["bookingConfirmed", "Booking confirmed", "When an appointment is confirmed or updated."],
                  ["chatWindowOpen", "Chat window open", "When a pre-session chat window opens."],
                  ["sessionStartingSoon", "Session starting soon", "A reminder shortly before session start."],
                ] as const
              ).map(([key, label, hint]) => (
                <label key={key} className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                  <span className="min-w-0">
                    <span className="font-medium text-foreground">{label}</span>
                    <span className="text-muted-foreground block text-xs">{hint}</span>
                  </span>
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 sm:mt-0.5"
                    checked={prefs[key]}
                    onChange={(event) => setPrefs((prev) => ({ ...prev, [key]: event.target.checked }))}
                    disabled={busy}
                  />
                </label>
              ))}
            </fieldset>
            <Button size="sm" type="button" disabled={busy} onClick={() => void save()}>
              {busy ? "Saving..." : "Save preferences"}
            </Button>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
