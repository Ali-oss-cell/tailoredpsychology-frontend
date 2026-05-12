"use client"

import type { Role } from "@/src/auth/access-control"
import { setBackendAccessTokenInSessionStorage, setBackendRoleInSessionStorage } from "@/src/auth/backend-session"
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

export type AuthSession = {
  accessToken: string
  tokenType: "Bearer"
  expiresInSeconds: number
  user: {
    id: string
    email: string
    displayName: string
    role: Exclude<Role, "guest">
    accountSetupComplete: boolean
  }
}

export async function loginWithBackend(params: { email: string; password: string }): Promise<AuthSession> {
  const response = await fetch(buildApiUrl("auth/login").toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    credentials: "include",
    cache: "no-store",
  })
  if (!response.ok) {
    const detail = await parseHttpErrorMessage(response)
    throw new Error(detail ?? `Login failed (${response.status})`)
  }
  const session = (await response.json()) as AuthSession
  setBackendAccessTokenInSessionStorage(session.accessToken)
  setBackendRoleInSessionStorage(session.user.role)
  return session
}

export async function registerWithBackend(params: {
  email: string
  password: string
  displayName: string
}): Promise<AuthSession> {
  const response = await fetch(buildApiUrl("auth/register").toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    credentials: "include",
    cache: "no-store",
  })
  if (!response.ok) {
    const detail = await parseHttpErrorMessage(response)
    throw new Error(detail ?? `Registration failed (${response.status})`)
  }
  const session = (await response.json()) as AuthSession
  setBackendAccessTokenInSessionStorage(session.accessToken)
  setBackendRoleInSessionStorage(session.user.role)
  return session
}
