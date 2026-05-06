"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Button } from "@/components/ui/button"
import { getDefaultRouteForRole, parseRole, SESSION_ROLE_COOKIE } from "@/src/auth/session"
import { getNotification, type NotificationItem } from "@/src/notifications/api"
import { getNotificationOpenHref } from "@/src/notifications/safe-app-location"

function readRoleFromDocumentCookie(): ReturnType<typeof parseRole> {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${SESSION_ROLE_COOKIE}=([^;]*)`))
  return parseRole(match?.[1] ? decodeURIComponent(match[1]) : undefined)
}

type NotificationDetailClientProps = {
  notificationId: string
}

export function NotificationDetailClient({ notificationId }: NotificationDetailClientProps) {
  const router = useRouter()
  const [item, setItem] = React.useState<NotificationItem | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const next = await getNotification(notificationId)
        if (!cancelled) {
          setItem(next)
        }
      } catch {
        if (!cancelled) {
          setItem(null)
          setError("This notification is unavailable or you no longer have access.")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [notificationId])

  const continueHref = item ? getNotificationOpenHref(item.metadata) : null
  const role = readRoleFromDocumentCookie()
  const homeHref = role ? getDefaultRouteForRole(role) : "/"

  if (loading) {
    return (
      <main className="bg-background text-foreground mx-auto max-w-lg p-6 md:p-10">
        <DashboardStateBlock variant="loading" message="Loading notification…" />
      </main>
    )
  }

  if (error || !item) {
    return (
      <main className="bg-background text-foreground mx-auto max-w-lg space-y-4 p-6 md:p-10">
        <DashboardStateBlock variant="error" message={error ?? "Notification not found."} />
        <Button asChild variant="outline">
          <Link href={homeHref}>Back to dashboard</Link>
        </Button>
      </main>
    )
  }

  return (
    <main className="bg-background text-foreground mx-auto max-w-lg space-y-6 p-6 md:p-10">
      <div className="space-y-1">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Notification</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">{item.title}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">{item.body}</p>
        <p className="text-muted-foreground text-xs">
          {new Date(item.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
          {item.readAt ? " · Read" : " · Unread"}
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {continueHref ? (
          <Button type="button" onClick={() => router.push(continueHref)}>
            Open linked page
          </Button>
        ) : null}
        <Button asChild variant="outline">
          <Link href={homeHref}>Back to dashboard</Link>
        </Button>
      </div>
    </main>
  )
}
