"use client"

export const BACKEND_TOKEN_STORAGE_KEY = "clink_backend_access_token_v1"

/** Refresh a bit before `exp` so a request in flight does not hit a just-expired token. */
const DEFAULT_EXPIRY_SKEW_MS = 120_000

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
    const json = atob(padded)
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

/**
 * Returns true when the token should not be sent (missing/invalid `exp`, or past exp minus skew).
 * Used so we do not keep using an expired JWT from sessionStorage after the access TTL elapses.
 */
export function isBackendAccessTokenExpired(token: string, clockSkewMs: number = DEFAULT_EXPIRY_SKEW_MS): boolean {
  const payload = decodeJwtPayload(token)
  const exp = payload?.exp
  if (typeof exp !== "number" || !Number.isFinite(exp)) {
    return true
  }
  const expMs = exp * 1000
  return Date.now() >= expMs - clockSkewMs
}

export function getBackendAccessTokenFromSessionStorage(): string | null {
  if (typeof window === "undefined") return null
  return window.sessionStorage.getItem(BACKEND_TOKEN_STORAGE_KEY)
}

export function setBackendAccessTokenInSessionStorage(token: string): void {
  if (typeof window === "undefined") return
  window.sessionStorage.setItem(BACKEND_TOKEN_STORAGE_KEY, token)
}

export function clearBackendAccessTokenInSessionStorage(): void {
  if (typeof window === "undefined") return
  window.sessionStorage.removeItem(BACKEND_TOKEN_STORAGE_KEY)
}
