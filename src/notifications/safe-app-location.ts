/** Accepts internal app paths with optional `?openNotifications=1` only (no other query keys). */
export function parseSafeAppLocation(raw: string): { href: string } | null {
  const trimmed = raw.trim()
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return null
  try {
    const u = new URL(trimmed, "http://clink.invalid")
    if (u.protocol !== "http:" || u.hostname !== "clink.invalid") return null
    const path = u.pathname
    if (!path.startsWith("/") || path.includes("//")) return null
    const keys = [...u.searchParams.keys()]
    if (keys.some((k) => k !== "openNotifications")) return null
    if (u.searchParams.has("openNotifications") && u.searchParams.get("openNotifications") !== "1") return null
    return { href: `${path}${u.search || ""}` }
  } catch {
    return null
  }
}

/**
 * Resolves a safe in-app href from notification metadata (`ctaPath` or legacy `deepLink`).
 */
export function getNotificationOpenHref(metadata: Record<string, string> | undefined | null): string | null {
  if (!metadata) return null
  const cta = typeof metadata.ctaPath === "string" ? parseSafeAppLocation(metadata.ctaPath) : null
  if (cta) return cta.href
  const deep = typeof metadata.deepLink === "string" ? parseSafeAppLocation(metadata.deepLink) : null
  if (deep) return deep.href
  return null
}
