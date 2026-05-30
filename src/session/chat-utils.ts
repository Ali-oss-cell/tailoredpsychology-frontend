export function truncateMessage(text: string, maxLength = 56): string {
  const trimmed = text.trim().replace(/\s+/g, " ")
  if (trimmed.length <= maxLength) return trimmed
  return `${trimmed.slice(0, maxLength - 1)}…`
}

export function formatRelativeChatTime(iso: string, nowMs = Date.now()): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ""

  const diffMs = nowMs - then
  if (diffMs < 0) return "Just now"

  const seconds = Math.floor(diffMs / 1000)
  if (seconds < 60) return "Just now"

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`

  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase()
}

export function avatarHueFromId(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % 360
}
