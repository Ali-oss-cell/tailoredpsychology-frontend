"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthField } from "@/components/auth/auth-field"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { authContent } from "@/content/auth"
import { loginWithBackend } from "@/src/auth/api"
import { getDefaultRouteForRole } from "@/src/auth/session"

function isSafeRedirectPath(value: string | null): value is string {
  return Boolean(value && value.startsWith("/") && !value.startsWith("//"))
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const session = await loginWithBackend({
        email: email.trim().toLowerCase(),
        password,
      })

      const redirectPath = new URLSearchParams(window.location.search).get("redirect")
      const destination = isSafeRedirectPath(redirectPath)
        ? redirectPath
        : getDefaultRouteForRole(session.user.role)

      router.push(destination)
      router.refresh()
    } catch {
      setError("Invalid credentials. Check your email and password and try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      sideTitle={authContent.login.sideTitle}
      sideDescription={authContent.login.sideDescription}
      sideImageSrc="/assets/login-therapy-DNw4ktXJ.webp"
      sideImageAlt="Therapy session in a calm, supportive setting."
    >
      <AuthCard
        title={authContent.login.title}
        description={authContent.login.description}
        footer={
          <p className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Register
            </Link>
          </p>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <AuthField
            id="email"
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
          <AuthField
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            rightLabel={
              <Link href="/forgot-password" className="text-primary text-xs hover:underline">
                Forgot password?
              </Link>
            }
          />
          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : (
            <p className="text-muted-foreground text-xs">Use your registered account credentials.</p>
          )}
          {process.env.NODE_ENV === "development" ? (
            <p className="text-muted-foreground border-border/60 rounded-md border border-dashed bg-muted/20 p-2 text-[11px] leading-relaxed">
              <span className="font-medium text-foreground">Local demo logins</span> (stub backend):{" "}
              <span className="font-mono">patient@clink.test</span> / <span className="font-mono">Patient123!</span>
              {" · "}
              <span className="font-mono">admin@clink.test</span> / <span className="font-mono">Admin123!</span>
              <br />
              If you changed a password in this session, restart the API so stub users reset.
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </AuthCard>
    </AuthShell>
  )
}
