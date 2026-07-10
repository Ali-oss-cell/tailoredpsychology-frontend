"use client"

import * as React from "react"

import {
  PortalFormField,
  PortalTextInput,
} from "@/components/shared/portal-form-field"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ChangePasswordFormProps = {
  /** Parent-driven busy (e.g. other saves); combined with internal submit state. */
  disabled?: boolean
  /**
   * Change password; throw on failure so fields stay filled.
   * On success, return nothing — the form clears fields then calls `onSuccess`.
   */
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>
  /** After a successful submit, after fields are cleared. */
  onSuccess?: () => void
  /** Mismatch or local validation (before `onSubmit`). */
  onValidationError?: (message: string) => void
  showCancelButton?: boolean
  onCancel?: () => void
  className?: string
}

/**
 * Shared password-change fields + actions for account/security surfaces.
 * Keeps password state internal so parents only supply API wiring.
 */
export function ChangePasswordForm({
  disabled = false,
  onSubmit,
  onSuccess,
  onValidationError,
  showCancelButton = false,
  onCancel,
  className,
}: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [localError, setLocalError] = React.useState<string | null>(null)

  const busy = disabled || submitting
  const canSubmit =
    !busy &&
    Boolean(currentPassword && newPassword && confirmPassword && newPassword === confirmPassword)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (newPassword.length < 8) {
      const message = "New password must be at least 8 characters."
      setLocalError(message)
      onValidationError?.(message)
      return
    }
    if (newPassword !== confirmPassword) {
      const message = "New password and confirmation do not match."
      setLocalError(message)
      onValidationError?.(message)
      return
    }
    setLocalError(null)
    setSubmitting(true)
    try {
      await onSubmit(currentPassword, newPassword)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      onSuccess?.()
    } catch {
      /* Parent handles errors; fields kept for retry */
    } finally {
      setSubmitting(false)
    }
  }

  function handleCancel(): void {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setLocalError(null)
    onCancel?.()
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className={cn("space-y-3 rounded-md border border-border/60 bg-muted/30 p-3", className)}
    >
      <PortalFormField id="current-password" label="Current password" required>
        <PortalTextInput
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={busy}
        />
      </PortalFormField>
      <PortalFormField
        id="new-password"
        label="New password"
        hint="At least 8 characters."
        required
        error={localError && localError.includes("8 characters") ? localError : undefined}
      >
        <PortalTextInput
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={busy}
        />
      </PortalFormField>
      <PortalFormField
        id="confirm-password"
        label="Confirm new password"
        required
        error={localError && localError.includes("match") ? localError : undefined}
      >
        <PortalTextInput
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={busy}
        />
      </PortalFormField>
      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" size="sm" disabled={!canSubmit}>
          {busy ? "Updating..." : "Update password"}
        </Button>
        {showCancelButton ? (
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={handleCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  )
}
