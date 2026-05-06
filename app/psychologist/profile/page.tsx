"use client"

import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChangePasswordForm } from "@/components/shared/change-password-form"
import { ClinicianPublicProfileHeader } from "@/components/shared/clinician-public-profile-header"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { PsychologistNotificationPrefsCard } from "@/components/psychologist/psychologist-notification-prefs-card"
import { PsychologistShell } from "@/components/psychologist/psychologist-shell"
import { psychologistProfileContent } from "@/content/psychologist-profile"
import {
  getPsychologistProfile,
  updatePsychologistProfile,
  uploadPsychologistProfileAvatar,
  type PsychologistProfile,
} from "@/src/psychologist/profile/api"
import { postChangePassword } from "@/src/patient/account/api"
import { toast } from "@/src/lib/toast"

const ACCEPT_IMAGE = "image/jpeg,image/png,image/webp"
const MAX_BYTES = 2 * 1024 * 1024
type Panel = "none" | "profile" | "password"

export default function PsychologistProfilePage() {
  const [profile, setProfile] = useState<PsychologistProfile | null>(null)
  const [formBio, setFormBio] = useState("")
  const [loadError, setLoadError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [panel, setPanel] = useState<Panel>("none")
  const [busy, setBusy] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void (async () => {
      try {
        const fetched = await getPsychologistProfile()
        setProfile(fetched)
        setFormBio(fetched.bio)
        setLoadError(null)
      } catch {
        setLoadError("Could not load profile.")
      }
    })()
  }, [])

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview)
    }
  }, [localPreview])

  const previewImageUrl = localPreview ?? profile?.profileImageUrl

  function togglePanel(next: Panel): void {
    setFormError(null)
    setFormSuccess(null)
    setPanel((current) => (current === next ? "none" : next))
  }

  async function onAvatarSelected(file: File | undefined): Promise<void> {
    if (!file) return
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setFormError("Use JPEG, PNG, or WebP.")
      toast.error("Use JPEG, PNG, or WebP.")
      return
    }
    if (file.size > MAX_BYTES) {
      setFormError("Image must be 2MB or smaller.")
      toast.error("Image must be 2MB or smaller.")
      return
    }
    const nextPreview = URL.createObjectURL(file)
    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return nextPreview
    })
    try {
      setAvatarUploading(true)
      setFormError(null)
      setFormSuccess(null)
      const updated = await uploadPsychologistProfileAvatar(file)
      setProfile(updated)
      setLocalPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      setFormSuccess("Profile photo updated.")
      toast.success("Photo updated", { description: "Patients may see your new photo on booking and care team." })
    } catch {
      setFormError("Could not upload photo.")
      toast.error("Could not upload photo.")
      setLocalPreview(null)
    } finally {
      setAvatarUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function onRemovePhoto(): Promise<void> {
    if (localPreview) {
      setLocalPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }
    if (!profile?.profileImageUrl) return
    try {
      setAvatarUploading(true)
      setFormError(null)
      setFormSuccess(null)
      const updated = await updatePsychologistProfile({ profileImageUrl: "" })
      setProfile(updated)
      setFormSuccess("Profile photo removed.")
      toast.success("Photo removed")
    } catch {
      setFormError("Could not remove photo.")
      toast.error("Could not remove photo.")
    } finally {
      setAvatarUploading(false)
    }
  }

  async function onSaveBio(): Promise<void> {
    if (!profile) return
    try {
      setBusy(true)
      setFormError(null)
      setFormSuccess(null)
      const updated = await updatePsychologistProfile({ bio: formBio })
      setProfile(updated)
      setFormBio(updated.bio)
      setFormSuccess("Profile updated.")
      setPanel("none")
      toast.success("Profile saved", { description: "Patients may see your updated bio on booking and care team." })
    } catch {
      setFormError("Could not update profile.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <PsychologistShell activeRoute="profile">
      <section className="space-y-6">
        <PatientPageHeader
          title={psychologistProfileContent.header.title}
          description={psychologistProfileContent.header.description}
        />
        {loadError ? <DashboardStateBlock variant="error" message={loadError} /> : null}
        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
        {formSuccess ? <p className="text-sm text-emerald-700">{formSuccess}</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Clinician Identity (AHPRA)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!profile && !loadError ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
              {profile ? (
                <div className="space-y-3">
                  <div className="rounded-md border border-border/60 p-3">
                    <p className="text-muted-foreground mb-3 text-xs">
                      Patient-facing preview — updates when you save bio or upload a photo.
                    </p>
                    <ClinicianPublicProfileHeader
                      density="care"
                      name={profile.displayName}
                      subtitle={profile.email}
                      specialtyLine={
                        profile.specialties.length > 0 ? profile.specialties.join(", ") : undefined
                      }
                      bio={formBio}
                      profileImageUrl={previewImageUrl || undefined}
                      titleRowEnd={
                        <Badge variant={profile.status === "active" ? "default" : "outline"}>
                          {profile.status}
                        </Badge>
                      }
                    />
                  </div>
                  <div className="grid gap-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">AHPRA registration:</span> {profile.registrationNumber}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Provider number:</span> {profile.providerNumber}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Specialties:</span>{" "}
                      {profile.specialties.join(", ") || "n/a"}
                    </p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Profile</CardTitle>
              <p className="text-muted-foreground pt-1 text-xs font-normal leading-relaxed">
                Bio and photo are shown to patients on booking and care-team where enabled. AHPRA fields on the left are
                managed separately.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button size="sm" type="button" onClick={() => togglePanel("profile")}>
                {panel === "profile" ? "Close edit" : "Edit profile"}
              </Button>
              {panel === "profile" ? (
                <div className="space-y-3 rounded-md border border-border/60 bg-muted/30 p-3">
                  <div className="space-y-2">
                    <span className="text-muted-foreground block text-xs">Profile photo</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      JPEG, PNG, or WebP · max 2 MB. Upload replaces any previous photo stored for this profile.
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ACCEPT_IMAGE}
                      className="sr-only"
                      aria-label="Upload profile photo"
                      disabled={avatarUploading}
                      onChange={(e) => void onAvatarSelected(e.target.files?.[0])}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={avatarUploading}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {avatarUploading ? "Uploading…" : "Choose photo"}
                      </Button>
                      {(profile?.profileImageUrl || localPreview) && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={avatarUploading}
                          onClick={() => void onRemovePhoto()}
                        >
                          Remove photo
                        </Button>
                      )}
                    </div>
                  </div>
                  <label className="block text-xs">
                    <span className="text-muted-foreground">Professional bio</span>
                    <textarea
                      value={formBio}
                      onChange={(event) => setFormBio(event.target.value)}
                      className="mt-1 w-full rounded border border-border px-2 py-1 text-sm"
                      rows={5}
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => void onSaveBio()} disabled={busy}>
                      {busy ? "Saving..." : "Save profile"}
                    </Button>
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => togglePanel("profile")}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
          <Card id="psychologist-profile-security" className="scroll-mt-20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Security and Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-sm">
                Keep your account secure. Updating your password signs in future sessions with the new password.
              </p>
              <Button size="sm" type="button" variant="outline" onClick={() => togglePanel("password")}>
                {panel === "password" ? "Close password" : "Change Password"}
              </Button>
              {panel === "password" ? (
                <ChangePasswordForm
                  disabled={busy}
                  showCancelButton
                  onCancel={() => togglePanel("password")}
                  onValidationError={(msg) => {
                    setFormError(msg)
                    toast.error(msg)
                  }}
                  onSubmit={async (currentPassword, newPasswordValue) => {
                    setFormError(null)
                    setFormSuccess(null)
                    setBusy(true)
                    try {
                      const result = await postChangePassword(currentPassword, newPasswordValue)
                      toast.success("Password updated")
                      setFormSuccess(result.message)
                      setPanel("none")
                    } catch {
                      setFormError("Could not change password. Check your current password.")
                      toast.error("Could not change password. Check your current password.")
                      throw new Error("change_failed")
                    } finally {
                      setBusy(false)
                    }
                  }}
                />
              ) : null}
            </CardContent>
          </Card>
          <PsychologistNotificationPrefsCard />
        </div>
      </section>
    </PsychologistShell>
  )
}
