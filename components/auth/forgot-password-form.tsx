"use client"

import Link from "next/link"
import { CheckCircle } from "@phosphor-icons/react"
import * as React from "react"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthField } from "@/components/auth/auth-field"
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button"
import { AuthShell } from "@/components/auth/auth-shell"
import { AuthTrustIndicators } from "@/components/auth/auth-trust-indicators"
import { authContent } from "@/content/auth"
import { requestPasswordReset } from "@/src/auth/password-reset-api"

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [message, setMessage] = React.useState<string | null>(null)
  const [devResetUrl, setDevResetUrl] = React.useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setMessage(null)
    setDevResetUrl(null)
    try {
      const result = await requestPasswordReset(email)
      setMessage(result.message)
      if (result.devResetUrl) {
        setDevResetUrl(result.devResetUrl)
      }
    } catch {
      setError("Could not process your request. Try again or contact support.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      sideTitle={authContent.forgotPassword.sideTitle}
      sideDescription={authContent.forgotPassword.sideDescription}
      sideImageSrc="/assets/resource-library.svg"
      sideImageAlt="Resource and support library"
    >
      <AuthCard
        title={authContent.forgotPassword.title}
        description={authContent.forgotPassword.description}
        footer={
          <p className="text-muted-foreground text-center text-sm">
            <Link href="/login" className="text-primary font-medium hover:underline">
              Return to login
            </Link>
          </p>
        }
      >
        <form className="space-y-5" onSubmit={(e) => void handleSubmit(e)}>
          <AuthField
            id="email"
            label="Email address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={busy}
            required
            autoComplete="email"
          />
          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}
          {message ? (
            <div
              className="border-success/40 bg-success/10 text-success space-y-2 rounded-xl border p-4 text-sm"
              role="status"
              aria-live="polite"
            >
              <p className="flex items-start gap-2 font-medium">
                <CheckCircle size={18} className="mt-0.5 shrink-0" aria-hidden />
                <span>{message}</span>
              </p>
              <p className="text-muted-foreground pl-7 text-sm">
                Check your inbox and spam or junk folder — the link can take a few minutes to arrive.
              </p>
            </div>
          ) : null}
          {process.env.NODE_ENV === "development" && devResetUrl ? (
            <p className="text-muted-foreground rounded-xl border border-border/60 bg-muted/30 p-3 text-xs">
              Email delivery is not configured in this environment. Use this link to reset:{" "}
              <Link href={devResetUrl} className="text-primary break-all font-medium hover:underline">
                {devResetUrl}
              </Link>
            </p>
          ) : null}
          <AuthPrimaryButton type="submit" disabled={busy}>
            {busy ? "Sending…" : "Send reset link"}
          </AuthPrimaryButton>
        </form>
        <AuthTrustIndicators className="mt-6" />
      </AuthCard>
    </AuthShell>
  )
}
