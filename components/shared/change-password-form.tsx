"use client"

import * as React from "react"

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

  const busy = disabled || submitting
  const canSubmit =
    !busy &&
    Boolean(currentPassword && newPassword && confirmPassword && newPassword === confirmPassword)

  async function handleSubmit(): Promise<void> {
    if (newPassword !== confirmPassword) {
      onValidationError?.("New password and confirmation do not match.")
      return
    }
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
    onCancel?.()
  }

  return (
    <div className={cn("space-y-2 rounded-md border border-border/60 bg-muted/30 p-3", className)}>
      <label className="block space-y-1 text-xs">
        <span className="text-muted-foreground">Current password</span>
        <input
          type="password"
          autoComplete="current-password"
          className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={busy}
        />
      </label>
      <label className="block space-y-1 text-xs">
        <span className="text-muted-foreground">New password</span>
        <input
          type="password"
          autoComplete="new-password"
          className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={busy}
        />
      </label>
      <label className="block space-y-1 text-xs">
        <span className="text-muted-foreground">Confirm new password</span>
        <input
          type="password"
          autoComplete="new-password"
          className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={busy}
        />
      </label>
      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" size="sm" disabled={!canSubmit} onClick={() => void handleSubmit()}>
          {busy ? "Updating..." : "Update password"}
        </Button>
        {showCancelButton ? (
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={handleCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </div>
  )
}
