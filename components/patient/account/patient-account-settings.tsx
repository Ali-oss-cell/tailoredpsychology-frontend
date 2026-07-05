"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChangePasswordForm } from "@/components/shared/change-password-form"
import { PatientPortalPage } from "@/components/patient/patient-portal-page"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import {
  emptyPatientContactProfile,
  emptyPatientDemographics,
  getCurrentUser,
  type CurrentUser,
  type PatientContactProfile,
  type PreferredContactMethod,
} from "@/src/auth/current-user"
import { patchAuthProfile, postChangePassword } from "@/src/patient/account/api"
import {
  downloadPatientDataExport,
  getPatientDataExportStatus,
  requestPatientDataExport,
  type PatientDataExportJob,
} from "@/src/patient/account/api"
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from "@/src/notifications/api"
import { toast } from "@/src/lib/toast"

type ProfileRow = { label: string; value: string }

type PatientAccountSettingsProps = {
  headerTitle: string
  headerDescription: string
  securityNotes: string[]
}

type Panel = "none" | "profile" | "password" | "notifications"

const defaultPrefs: NotificationPreferences = {
  inAppEnabled: true,
  bookingSubmitted: true,
  bookingConfirmed: true,
  chatWindowOpen: true,
  sessionStartingSoon: true,
}

function preferredContactLabel(method: PreferredContactMethod): string {
  if (method === "email") return "Email"
  if (method === "sms") return "SMS"
  return "Phone call"
}

function formatProfileRows(user: CurrentUser): ProfileRow[] {
  const rows: ProfileRow[] = [
    { label: "Full name", value: user.displayName },
    { label: "Email", value: user.email },
  ]
  const p = user.patientContactProfile ?? emptyPatientContactProfile()
  const d = user.patientDemographics ?? emptyPatientDemographics()
  rows.push(
    { label: "Date of birth", value: d.dateOfBirth.trim() || "—" },
    { label: "Mobile phone", value: p.phoneMobile.trim() || "—" },
    { label: "Preferred contact", value: preferredContactLabel(p.preferredContactMethod) },
    { label: "Accessibility and session needs", value: p.accessibilityNotes.trim() || "—" },
    { label: "Emergency contact name", value: p.emergencyContactName.trim() || "—" },
    { label: "Emergency contact phone", value: p.emergencyContactPhone.trim() || "—" },
    { label: "Emergency contact relationship", value: p.emergencyContactRelationship.trim() || "—" },
  )
  return rows
}

export function PatientAccountSettings({
  headerTitle,
  headerDescription,
  securityNotes,
}: PatientAccountSettingsProps) {
  const [panel, setPanel] = useState<Panel>("none")
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  const [displayNameDraft, setDisplayNameDraft] = useState("")
  const [contactDraft, setContactDraft] = useState<PatientContactProfile>(emptyPatientContactProfile())
  const [prefs, setPrefs] = useState<NotificationPreferences>(defaultPrefs)
  const [exportJob, setExportJob] = useState<PatientDataExportJob | null>(null)

  const loadUser = useCallback(async () => {
    setLoadError(null)
    try {
      const next = await getCurrentUser()
      setUser(next)
      setDisplayNameDraft(next.displayName)
      setContactDraft(next.patientContactProfile ?? emptyPatientContactProfile())
    } catch {
      setLoadError("Could not load account details.")
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadUser()
  }, [loadUser])

  useEffect(() => {
    if (panel !== "notifications") return
    let cancelled = false
    async function loadPrefs() {
      setFormError(null)
      try {
        const next = await getNotificationPreferences()
        if (!cancelled) setPrefs(next)
      } catch {
        if (!cancelled) setFormError("Could not load notification preferences.")
      }
    }
    void loadPrefs()
    return () => {
      cancelled = true
    }
  }, [panel])

  const profileRows = useMemo(() => (user ? formatProfileRows(user) : []), [user])

  async function handleSaveProfile(): Promise<void> {
    setBusy(true)
    setFormError(null)
    setFormSuccess(null)
    try {
      const next = await patchAuthProfile({
        displayName: displayNameDraft.trim(),
        patientContactProfile: contactDraft,
      })
      setUser(next)
      setContactDraft(next.patientContactProfile ?? emptyPatientContactProfile())
      setFormSuccess("Profile updated.")
      setPanel("none")
      toast.success("Profile updated")
    } catch {
      setFormError("Could not save profile.")
    } finally {
      setBusy(false)
    }
  }

  async function handleSavePrefs(): Promise<void> {
    setBusy(true)
    setFormError(null)
    setFormSuccess(null)
    try {
      await updateNotificationPreferences(prefs)
      setFormSuccess("Notification preferences saved.")
      setPanel("none")
      toast.success("Notification preferences saved")
    } catch {
      setFormError("Could not save notification preferences.")
    } finally {
      setBusy(false)
    }
  }

  function togglePanel(next: Panel): void {
    setFormError(null)
    setFormSuccess(null)
    if (next === "profile" && user) {
      setDisplayNameDraft(user.displayName)
      setContactDraft(user.patientContactProfile ?? emptyPatientContactProfile())
    }
    setPanel((current) => (current === next ? "none" : next))
  }

  async function handleRequestDataExport(): Promise<void> {
    setBusy(true)
    setFormError(null)
    setFormSuccess(null)
    try {
      const job = await requestPatientDataExport()
      setExportJob(job)
      setFormSuccess("Export requested. Preparing your PDF package...")
      const maxPolls = 12
      for (let attempt = 0; attempt < maxPolls; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const status = await getPatientDataExportStatus(job.jobId)
        setExportJob(status)
        if (status.status === "ready") {
          setFormSuccess("Export is ready. Downloading now.")
          await downloadPatientDataExport(status.jobId)
          break
        }
        if (status.status === "failed") {
          setFormError("Export failed. Please retry in a moment.")
          break
        }
      }
    } catch {
      setFormError("Could not request data export.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <PatientPortalPage
      title={headerTitle}
      description={headerDescription}
      eyebrow="Account"
      tutorialId="patient.page.account"
    >
      <p className="text-muted-foreground -mt-2 text-sm">
        <Link href="/patient/video-setup" className="text-primary font-medium underline-offset-2 hover:underline">
          Test camera & microphone
        </Link>{" "}
        before a video visit.
      </p>

      {loadError ? <DashboardStateBlock variant="error" message={loadError} /> : null}
      {formError ? <p className="text-destructive text-sm">{formError}</p> : null}
      {formSuccess ? <p className="text-sm text-emerald-700">{formSuccess}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {!user && !loadError ? <DashboardStateBlock variant="loading" message="Loading profile..." /> : null}
            {profileRows.map((field) => (
              <div
                key={field.label}
                className="flex items-center justify-between border-b border-border/40 py-2 text-sm last:border-b-0"
              >
                <span className="text-muted-foreground">{field.label}</span>
                <span className="max-w-[55%] text-right">{field.value}</span>
              </div>
            ))}
            <Button size="sm" className="mt-3" type="button" onClick={() => togglePanel("profile")}>
              {panel === "profile" ? "Close edit" : "Edit Profile"}
            </Button>
            {panel === "profile" ? (
              <div className="space-y-3 rounded-md border border-border/60 bg-muted/30 p-3">
                <p className="text-muted-foreground text-xs">
                  Your legal name and date of birth from booking intake stay on file with your referral; update
                  display name and contact details here for day-to-day care coordination.
                </p>
                <label className="block space-y-1 text-xs">
                  <span className="text-muted-foreground">Display name</span>
                  <input
                    className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                    value={displayNameDraft}
                    onChange={(event) => setDisplayNameDraft(event.target.value)}
                    disabled={busy}
                  />
                </label>
                <label className="block space-y-1 text-xs">
                  <span className="text-muted-foreground">Mobile phone</span>
                  <input
                    className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                    value={contactDraft.phoneMobile}
                    onChange={(event) => setContactDraft((d) => ({ ...d, phoneMobile: event.target.value }))}
                    disabled={busy}
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </label>
                <label className="block space-y-1 text-xs">
                  <span className="text-muted-foreground">Preferred contact method</span>
                  <select
                    className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                    value={contactDraft.preferredContactMethod}
                    onChange={(event) =>
                      setContactDraft((d) => ({
                        ...d,
                        preferredContactMethod: event.target.value as PreferredContactMethod,
                      }))
                    }
                    disabled={busy}
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="phone">Phone call</option>
                  </select>
                </label>
                <label className="block space-y-1 text-xs">
                  <span className="text-muted-foreground">Accessibility and session needs (optional)</span>
                  <textarea
                    className="min-h-[72px] w-full rounded-md border border-border bg-background px-2 py-2 text-sm"
                    value={contactDraft.accessibilityNotes}
                    onChange={(event) => setContactDraft((d) => ({ ...d, accessibilityNotes: event.target.value }))}
                    disabled={busy}
                    placeholder="e.g. captions, interpreter, mobility access"
                  />
                </label>
                <p className="text-xs font-medium text-foreground">Emergency contact</p>
                <label className="block space-y-1 text-xs">
                  <span className="text-muted-foreground">Name</span>
                  <input
                    className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                    value={contactDraft.emergencyContactName}
                    onChange={(event) =>
                      setContactDraft((d) => ({ ...d, emergencyContactName: event.target.value }))
                    }
                    disabled={busy}
                    autoComplete="name"
                  />
                </label>
                <label className="block space-y-1 text-xs">
                  <span className="text-muted-foreground">Phone</span>
                  <input
                    className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                    value={contactDraft.emergencyContactPhone}
                    onChange={(event) =>
                      setContactDraft((d) => ({ ...d, emergencyContactPhone: event.target.value }))
                    }
                    disabled={busy}
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </label>
                <label className="block space-y-1 text-xs">
                  <span className="text-muted-foreground">Relationship to you</span>
                  <input
                    className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                    value={contactDraft.emergencyContactRelationship}
                    onChange={(event) =>
                      setContactDraft((d) => ({ ...d, emergencyContactRelationship: event.target.value }))
                    }
                    disabled={busy}
                  />
                </label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    type="button"
                    disabled={busy || !displayNameDraft.trim()}
                    onClick={() => void handleSaveProfile()}
                  >
                    {busy ? "Saving..." : "Save"}
                  </Button>
                  <Button size="sm" type="button" variant="outline" disabled={busy} onClick={() => setPanel("none")}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Security and Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {securityNotes.map((item) => (
              <p key={item} className="text-muted-foreground text-sm">
                {item}
              </p>
            ))}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button size="sm" type="button" onClick={() => togglePanel("password")}>
                {panel === "password" ? "Close password" : "Change Password"}
              </Button>
              <Button size="sm" type="button" variant="outline" onClick={() => togglePanel("notifications")}>
                {panel === "notifications" ? "Close notifications" : "Notifications"}
              </Button>
              <Button size="sm" type="button" variant="outline" disabled={busy} onClick={() => void handleRequestDataExport()}>
                {busy ? "Preparing export..." : "Download my data (PDF)"}
              </Button>
            </div>
            {exportJob ? (
              <p className="text-xs text-muted-foreground">
                Export job `{exportJob.jobId}` status: {exportJob.status}
              </p>
            ) : null}

            {panel === "password" ? (
              <ChangePasswordForm
                disabled={busy}
                onValidationError={(msg) => setFormError(msg)}
                onSubmit={async (currentPassword, newPasswordValue) => {
                  setFormError(null)
                  setFormSuccess(null)
                  setBusy(true)
                  try {
                    const result = await postChangePassword(currentPassword, newPasswordValue)
                    setFormSuccess(result.message)
                    setPanel("none")
                    toast.success("Password updated")
                  } catch {
                    setFormError("Could not change password. Check your current password.")
                    throw new Error("change_failed")
                  } finally {
                    setBusy(false)
                  }
                }}
              />
            ) : null}

            {panel === "notifications" ? (
              <div className="space-y-3 rounded-md border border-border/60 bg-muted/30 p-3 text-sm">
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Choose which booking and session emails or in-app alerts you want. These settings apply to this account
                  only; critical clinical messages may still be sent when required.
                </p>
                <fieldset className="space-y-2">
                  <legend className="sr-only">Notification channels and topics</legend>
                  {(
                    [
                      ["inAppEnabled", "In-app notifications", "Banner and in-product reminders while you are signed in."],
                      ["bookingSubmitted", "Booking submitted", "When a booking request is received by the practice."],
                      ["bookingConfirmed", "Booking confirmed", "When an appointment is confirmed or updated."],
                      ["chatWindowOpen", "Chat window open", "When your clinician opens the pre-session chat window."],
                      ["sessionStartingSoon", "Session starting soon", "A reminder shortly before your session start time."],
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
                <Button size="sm" type="button" disabled={busy} onClick={() => void handleSavePrefs()}>
                  {busy ? "Saving..." : "Save preferences"}
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </PatientPortalPage>
  )
}
