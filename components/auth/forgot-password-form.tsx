"use client"

import Link from "next/link"
import * as React from "react"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthField } from "@/components/auth/auth-field"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
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
          <p className="text-center text-sm">
            <Link href="/login" className="text-primary font-medium hover:underline">
              Return to login
            </Link>
          </p>
        }
      >
        <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
          <AuthField
            id="email"
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={busy}
            required
          />
          {error ? <p className="text-destructive text-sm">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          {process.env.NODE_ENV === "development" && devResetUrl ? (
            <p className="text-muted-foreground rounded-md border border-border/60 bg-muted/40 p-3 text-xs">
              Email delivery is not configured in this environment. Use this link to reset:{" "}
              <Link href={devResetUrl} className="text-primary break-all font-medium hover:underline">
                {devResetUrl}
              </Link>
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Sending…" : "Send Reset Link"}
          </Button>
        </form>
      </AuthCard>
    </AuthShell>
  )
}
