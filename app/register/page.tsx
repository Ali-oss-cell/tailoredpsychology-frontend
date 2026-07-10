"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthField } from "@/components/auth/auth-field"
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button"
import { AuthShell } from "@/components/auth/auth-shell"
import { AuthTrustIndicators } from "@/components/auth/auth-trust-indicators"
import { PortalCheckboxField } from "@/components/shared/portal-form-field"
import { authContent } from "@/content/auth"
import { registerWithBackend } from "@/src/auth/api"
import { PASSWORD_HINT, isPasswordLongEnough } from "@/src/auth/password-policy"
import { getDefaultRouteForRole } from "@/src/auth/session"

export default function RegisterPage() {
  const router = useRouter()
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [acceptedTerms, setAcceptedTerms] = React.useState(false)
  const [error, setError] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!isPasswordLongEnough(password)) {
      setError("Password must be at least 8 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (!acceptedTerms) {
      setError("Please accept terms to create your account.")
      return
    }

    const displayName = `${firstName.trim()} ${lastName.trim()}`.trim()
    if (displayName.length < 2) {
      setError("Please provide your first and last name.")
      return
    }

    setIsSubmitting(true)
    try {
      const session = await registerWithBackend({
        email: email.trim().toLowerCase(),
        password,
        displayName,
      })

      const nextPath = session.user.role === "patient" ? "/patient/onboarding" : getDefaultRouteForRole(session.user.role)
      router.push(nextPath)
      router.refresh()
    } catch {
      setError("We could not create your account. The email may already be in use.")
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      sideTitle={authContent.register.sideTitle}
      sideDescription={authContent.register.sideDescription}
      sideImageSrc="/assets/auth-wellness-Cy4YmFxd.webp"
      sideImageAlt="Calm wellness moment suggesting balance and recovery."
    >
      <AuthCard
        title={authContent.register.title}
        description={authContent.register.description}
        footer={
          <p className="text-muted-foreground text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </p>
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <AuthField id="firstName" label="First Name" placeholder="Sarah" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required />
            <AuthField id="lastName" label="Last Name" placeholder="Chen" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" required />
          </div>
          <AuthField id="email" label="Email Address" type="email" placeholder="sarah@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          <AuthField id="password" label="Password" type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} hint={PASSWORD_HINT} autoComplete="new-password" required />
          <AuthField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            hint={PASSWORD_HINT}
            autoComplete="new-password"
            required
          />
          <PortalCheckboxField
            id="accept-terms"
            checked={acceptedTerms}
            onChange={setAcceptedTerms}
            className="dashboard-card rounded-dashboard-card border-border/60 bg-muted/20 p-4"
            label={
              <>
                I agree to the{" "}
                <Link href="/terms-of-service" className="text-primary font-medium hover:underline">
                  Terms of Service
                </Link>
                ,{" "}
                <Link href="/privacy-policy" className="text-primary font-medium hover:underline">
                  Privacy Policy
                </Link>
                , and electronic communications.
              </>
            }
          />
          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}
          <AuthPrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create account"}
          </AuthPrimaryButton>
        </form>
        <AuthTrustIndicators className="mt-6" />
      </AuthCard>
    </AuthShell>
  )
}
