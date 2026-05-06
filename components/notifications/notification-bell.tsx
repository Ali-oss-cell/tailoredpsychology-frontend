"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Bell } from "@phosphor-icons/react/dist/ssr"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Button } from "@/components/ui/button"
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  markNotificationUnread,
  type NotificationItem,
} from "@/src/notifications/api"
import { NotificationRealtimeClient } from "@/src/notifications/realtime"
import { getNotificationOpenHref } from "@/src/notifications/safe-app-location"

const DASHBOARD_PATHS_WITH_NOTIFICATION_QUERY = new Set([
  "/patient/dashboard",
  "/psychologist/dashboard",
  "/admin/dashboard",
  "/manager/dashboard",
])

function mergeUpdatedItem(prev: NotificationItem[], updated: NotificationItem): NotificationItem[] {
  return prev.map((entry) => (entry.notificationId === updated.notificationId ? updated : entry))
}

export function NotificationBell() {
  const router = useRouter()
  const pathname = usePathname() ?? ""
  const [items, setItems] = React.useState<NotificationItem[]>([])
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [markingAll, setMarkingAll] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    const realtime = new NotificationRealtimeClient()
    const load = async () => {
      try {
        const next = await listNotifications()
        if (!cancelled) {
          setItems(next)
          setError(null)
        }
      } catch {
        if (!cancelled) {
          setItems([])
          setError("We couldn't load this section. Try again.")
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    void load()
    let timer = window.setInterval(() => void load(), 15000)
    void realtime
      .connectAndSubscribe((incoming) => {
        if (cancelled) return
        setItems((prev) => {
          const exists = prev.some((item) => item.notificationId === incoming.notificationId)
          if (exists) return prev
          return [incoming, ...prev].slice(0, 100)
        })
      })
      .then(() => {
        window.clearInterval(timer)
        timer = window.setInterval(() => void load(), 60000)
      })
      .catch(() => {
        // Keep fast polling as fallback when realtime channel is unavailable
      })
    return () => {
      cancelled = true
      window.clearInterval(timer)
      realtime.disconnect()
    }
  }, [])

  React.useEffect(() => {
    if (!DASHBOARD_PATHS_WITH_NOTIFICATION_QUERY.has(pathname)) return
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    if (params.get("openNotifications") !== "1") return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(true)
    params.delete("openNotifications")
    const qs = params.toString()
    const next = `${pathname}${qs ? `?${qs}` : ""}`
    window.history.replaceState(null, "", next)
  }, [pathname])

  const unreadCount = items.filter((item) => !item.readAt).length

  const handleMarkRead = async (e: React.MouseEvent, notificationId: string) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const latest = await markNotificationRead(notificationId)
      setItems((prev) => mergeUpdatedItem(prev, latest))
    } catch {
      /* ignore */
    }
  }

  const handleMarkUnread = async (e: React.MouseEvent, notificationId: string) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const latest = await markNotificationUnread(notificationId)
      setItems((prev) => mergeUpdatedItem(prev, latest))
    } catch {
      /* ignore */
    }
  }

  const handleOpenDestination = (e: React.MouseEvent, item: NotificationItem) => {
    e.preventDefault()
    e.stopPropagation()
    const href = getNotificationOpenHref(item.metadata)
    if (!href) return
    setOpen(false)
    router.push(href)
  }

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (unreadCount === 0) return
    setMarkingAll(true)
    try {
      await markAllNotificationsRead()
      const next = await listNotifications()
      setItems(next)
    } catch {
      /* ignore */
    } finally {
      setMarkingAll(false)
    }
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon-sm" aria-label="Notifications" onClick={() => setOpen((prev) => !prev)}>
        <Bell size={18} />
      </Button>
      {unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {unreadCount}
        </span>
      ) : null}
      {open ? (
        <div className="bg-background absolute right-0 z-40 mt-2 w-[min(100vw-2rem,22rem)] rounded-md border border-border p-2 shadow-md sm:w-96">
          <div className="flex items-start justify-between gap-2 px-2 pb-2">
            <p className="text-xs font-semibold">Notifications</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-7 shrink-0 px-2 text-xs"
              disabled={unreadCount === 0 || markingAll}
              onClick={(e) => void handleMarkAllRead(e)}
            >
              {markingAll ? "Updating…" : "Mark all read"}
            </Button>
          </div>
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {isLoading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
            {!isLoading && error ? <DashboardStateBlock variant="error" message={error} /> : null}
            {!isLoading && !error && items.length === 0 ? (
              <DashboardStateBlock variant="empty" message="No notifications yet." />
            ) : null}
            {items.map((item) => {
              const hasDestination = Boolean(getNotificationOpenHref(item.metadata))
              const isUnread = !item.readAt
              return (
                <div
                  key={item.notificationId}
                  className="border-border/60 hover:bg-muted/40 rounded-md border p-2 text-left text-xs transition-colors"
                >
                  <div className="flex gap-2">
                    <span
                      className={isUnread ? "bg-primary mt-1.5 h-2 w-2 shrink-0 rounded-full" : "mt-1.5 h-2 w-2 shrink-0"}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="font-medium leading-snug">{item.title}</p>
                      <p className="text-muted-foreground leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-border/40 pt-2">
                    {hasDestination ? (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => handleOpenDestination(e, item)}
                      >
                        Open
                      </Button>
                    ) : null}
                    {isUnread ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => void handleMarkRead(e, item.notificationId)}
                      >
                        Mark read
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => void handleMarkUnread(e, item.notificationId)}
                      >
                        Mark unread
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
