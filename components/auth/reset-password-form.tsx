"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthField } from "@/components/auth/auth-field"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { authContent } from "@/content/auth"
import { PASSWORD_HINT } from "@/src/auth/password-policy"
import { completePasswordReset } from "@/src/auth/password-reset-api"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault()
    setError(null)
    if (!token) {
      setError("Reset link is missing or invalid. Request a new link from forgot password.")
      return
    }
    if (newPassword.length < 8) {
      setError("Use at least 8 characters.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setBusy(true)
    try {
      await completePasswordReset(token, newPassword)
      router.push("/login?reset=1")
    } catch {
      setError("Could not reset password. The link may have expired — request a new one.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      sideTitle={authContent.resetPassword.sideTitle}
      sideDescription={authContent.resetPassword.sideDescription}
      sideImageSrc="/assets/telehealth-session.svg"
      sideImageAlt="Secure account recovery flow"
    >
      <AuthCard
        title={authContent.resetPassword.title}
        description={authContent.resetPassword.description}
        footer={
          <p className="text-muted-foreground text-center text-sm">
            Need help?{" "}
            <Link href="/contact" className="text-primary font-medium hover:underline">
              Contact support
            </Link>
          </p>
        }
      >
        <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
          <AuthField
            id="newPassword"
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            disabled={busy}
            required
            hint={PASSWORD_HINT}
            autoComplete="new-password"
          />
          <AuthField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            hint={PASSWORD_HINT}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={busy}
            required
            autoComplete="new-password"
          />
          {error ? <p className="text-destructive text-sm">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Saving…" : "Save New Password"}
          </Button>
        </form>
      </AuthCard>
    </AuthShell>
  )
}
