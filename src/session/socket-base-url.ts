/**
 * Socket.IO connects to the API host root (not `/api`).
 * Override with NEXT_PUBLIC_SOCKET_BASE_URL when the API is on a different origin.
 */
export function getSocketBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SOCKET_BASE_URL?.trim()
  if (explicit) {
    return explicit.replace(/\/$/, "")
  }

  const fallback = "http://localhost:3001"
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? `${fallback}/api`
  return apiBase.endsWith("/api") ? apiBase.slice(0, -4) : apiBase.replace(/\/$/, "")
}
