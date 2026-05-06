"use client"

import { ensureBackendAccessToken } from "@/src/patient/booking/api"

export type NotificationItem = {
  notificationId: string
  recipientUserId: string
  type: "booking_submitted" | "booking_confirmed" | "chat_window_open" | "session_starting_soon" | "account_welcome"
  title: string
  body: string
  createdAt: string
  readAt?: string
  metadata: Record<string, string>
}

const DEFAULT_API_BASE = "http://localhost:3001/api"

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE
}

function buildApiUrl(path: string): URL {
  const base = getApiBaseUrl()
  const normalizedBase = base.endsWith("/") ? base : `${base}/`
  return new URL(path, normalizedBase)
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await ensureBackendAccessToken()
  return { Authorization: `Bearer ${token}` }
}

export async function listNotifications(): Promise<NotificationItem[]> {
  const response = await fetch(buildApiUrl("notifications").toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`List notifications failed (${response.status})`)
  return (await response.json()) as NotificationItem[]
}

export async function getNotification(notificationId: string): Promise<NotificationItem> {
  const response = await fetch(buildApiUrl(`notifications/${encodeURIComponent(notificationId)}`).toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get notification failed (${response.status})`)
  return (await response.json()) as NotificationItem
}

export async function markNotificationRead(notificationId: string): Promise<NotificationItem> {
  const response = await fetch(buildApiUrl(`notifications/${notificationId}/read`).toString(), {
    method: "PATCH",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Mark notification read failed (${response.status})`)
  return (await response.json()) as NotificationItem
}

export async function markNotificationUnread(notificationId: string): Promise<NotificationItem> {
  const response = await fetch(buildApiUrl(`notifications/${notificationId}/unread`).toString(), {
    method: "PATCH",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Mark notification unread failed (${response.status})`)
  return (await response.json()) as NotificationItem
}

export async function markAllNotificationsRead(): Promise<{ updated: number }> {
  const response = await fetch(buildApiUrl("notifications/mark-all-read").toString(), {
    method: "POST",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Mark all notifications read failed (${response.status})`)
  return (await response.json()) as { updated: number }
}

export type NotificationPreferences = {
  inAppEnabled: boolean
  bookingSubmitted: boolean
  bookingConfirmed: boolean
  chatWindowOpen: boolean
  sessionStartingSoon: boolean
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const response = await fetch(buildApiUrl("notifications/preferences").toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get notification preferences failed (${response.status})`)
  return (await response.json()) as NotificationPreferences
}

export async function updateNotificationPreferences(
  payload: NotificationPreferences,
): Promise<NotificationPreferences> {
  const response = await fetch(buildApiUrl("notifications/preferences").toString(), {
    method: "POST",
    headers: { ...(await authHeaders()), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Update notification preferences failed (${response.status})`)
  return (await response.json()) as NotificationPreferences
}

export async function getNotificationStreamToken(): Promise<{ socketToken: string; expiresInSeconds: number }> {
  const response = await fetch(buildApiUrl("notifications/stream-token").toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get notification stream token failed (${response.status})`)
  return (await response.json()) as { socketToken: string; expiresInSeconds: number }
}
