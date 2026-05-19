"use client"

import { parseHttpErrorMessage } from "@/src/auth/parse-http-error-message"

const DEFAULT_API_BASE = "http://localhost:3001/api"

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE
}

function buildApiUrl(path: string): URL {
  const base = getApiBaseUrl()
  const normalizedBase = base.endsWith("/") ? base : `${base}/`
  return new URL(path, normalizedBase)
}

export type ForgotPasswordResult = {
  message: string
  devResetUrl?: string
}

export async function requestPasswordReset(email: string): Promise<ForgotPasswordResult> {
  const response = await fetch(buildApiUrl("auth/forgot-password").toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
    credentials: "include",
    cache: "no-store",
  })
  if (!response.ok) {
    const detail = await parseHttpErrorMessage(response)
    throw new Error(detail ?? `Request failed (${response.status})`)
  }
  return (await response.json()) as ForgotPasswordResult
}

export async function completePasswordReset(token: string, newPassword: string): Promise<{ message: string }> {
  const response = await fetch(buildApiUrl("auth/reset-password").toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
    credentials: "include",
    cache: "no-store",
  })
  if (!response.ok) {
    const detail = await parseHttpErrorMessage(response)
    throw new Error(detail ?? `Reset failed (${response.status})`)
  }
  return (await response.json()) as { message: string }
}
