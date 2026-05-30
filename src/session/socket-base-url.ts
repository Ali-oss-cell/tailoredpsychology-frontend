/**
 * Socket.IO connects to the site origin in production (Traefik proxies /socket.io → backend).
 * Falls back to the API host root for local dev without rewrites.
 */
export function getSocketBaseUrl(): string {
  const sameOrigin = process.env.NEXT_PUBLIC_SOCKET_SAME_ORIGIN === "true"
  if (sameOrigin && typeof window !== "undefined") {
    return window.location.origin
  }

  const explicit = process.env.NEXT_PUBLIC_SOCKET_BASE_URL?.trim()
  if (explicit) {
    return explicit.replace(/\/$/, "")
  }

  const fallback = "http://localhost:3001"
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? `${fallback}/api`
  return apiBase.endsWith("/api") ? apiBase.slice(0, -4) : apiBase.replace(/\/$/, "")
}

export function usesSameOriginSocket(): boolean {
  return process.env.NEXT_PUBLIC_SOCKET_SAME_ORIGIN === "true"
}
