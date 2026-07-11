/** True for transient connectivity failures (tab switch, offline, DNS flap). */
export function isTransientNetworkError(error: unknown): boolean {
  if (!error) return false
  const message = error instanceof Error ? error.message : String(error)
  const lower = message.toLowerCase()
  return (
    lower.includes("err_network") ||
    lower.includes("networkerror") ||
    lower.includes("network changed") ||
    lower.includes("failed to fetch") ||
    lower.includes("load failed") ||
    lower.includes("network request failed") ||
    lower.includes("connection") ||
    lower.includes("timeout") ||
    lower.includes("aborted") ||
    (error instanceof TypeError && (lower.includes("fetch") || lower.includes("network")))
  )
}

export function isNetworkChangedError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return message.includes("ERR_NETWORK_CHANGED") || message.toLowerCase().includes("network changed")
}
