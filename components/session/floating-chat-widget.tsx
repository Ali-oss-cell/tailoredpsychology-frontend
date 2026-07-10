"use client"

import { ChatCircleDots, X } from "@phosphor-icons/react/dist/ssr"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"

import { PreSessionChatPanel } from "@/components/session/pre-session-chat-panel"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/src/auth/current-user"
import { getPatientAppointments } from "@/src/patient/booking/api"
import { usePsychologistCurrentUser } from "@/src/psychologist/queries/use-current-user"
import { usePsychologistWorkspace } from "@/src/psychologist/queries/use-psychologist-workspace"

type FloatingChatWidgetProps = {
  role: "patient" | "psychologist"
}

const STORAGE_KEY = "clink_last_chat_appointment_v1"

function getAppointmentIdFromPath(pathname: string): string | null {
  const match = pathname.match(/\/video-session\/([^/]+)/)
  if (!match || !match[1]) return null
  return decodeURIComponent(match[1])
}

export function FloatingChatWidget({ role }: FloatingChatWidgetProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [appointmentId, setAppointmentId] = useState<string | null>(null)
  const [isResolving, setIsResolving] = useState(true)
  const psychologistUserQuery = usePsychologistCurrentUser()
  const psychologistId =
    role === "psychologist" && psychologistUserQuery.data?.role === "psychologist"
      ? psychologistUserQuery.data.id
      : undefined
  const workspaceQuery = usePsychologistWorkspace(psychologistId, { sortBy: "startsAt", sortOrder: "asc" })

  const handleAccessDenied = useCallback((deniedAppointmentId: string) => {
    window.localStorage.removeItem(STORAGE_KEY)
    setAppointmentId((current) => (current === deniedAppointmentId ? null : current))
  }, [])

  useEffect(() => {
    const fromPath = getAppointmentIdFromPath(pathname)
    if (fromPath) {
      window.localStorage.setItem(STORAGE_KEY, fromPath)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAppointmentId(fromPath)
      setIsResolving(false)
      return
    }

    const fromStorage = window.localStorage.getItem(STORAGE_KEY)
    if (fromStorage) {
      setAppointmentId(fromStorage)
      setIsResolving(false)
      return
    }

    if (role === "psychologist") {
      if (workspaceQuery.isLoading) return
      const workspace = workspaceQuery.data
      if (workspace) {
        const now = Date.now()
        const nextItem =
          workspace.items.find((item) => new Date(item.startsAt).getTime() > now) ?? workspace.items[0]
        if (nextItem?.appointmentId) {
          window.localStorage.setItem(STORAGE_KEY, nextItem.appointmentId)
          setAppointmentId(nextItem.appointmentId)
        }
      }
      setIsResolving(false)
      return
    }

    let cancelled = false
    async function resolvePatientChat() {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser.role !== "patient") return
        const { upcoming } = await getPatientAppointments(currentUser.id)
        const now = Date.now()
        const nextAppt = upcoming.find((a) => new Date(a.scheduledStartAt).getTime() > now) ?? upcoming[0]
        if (!cancelled && nextAppt?.appointmentId) {
          window.localStorage.setItem(STORAGE_KEY, nextAppt.appointmentId)
          setAppointmentId(nextAppt.appointmentId)
        }
      } catch {
        // Keep prior appointmentId from path/storage when API fails
      } finally {
        if (!cancelled) setIsResolving(false)
      }
    }

    void resolvePatientChat()
    return () => {
      cancelled = true
    }
  }, [pathname, role, workspaceQuery.data, workspaceQuery.isLoading])

  useEffect(() => {
    const openChat = () => setIsOpen(true)
    window.addEventListener("clink:open-chat", openChat)
    return () => window.removeEventListener("clink:open-chat", openChat)
  }, [])

  const isDisabled = useMemo(() => isResolving, [isResolving])

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isOpen ? (
        <div className="w-[22rem] max-w-[calc(100vw-2rem)] space-y-2 rounded-xl border border-border bg-background p-2 shadow-lg">
          <div className="flex items-center justify-between px-2 pt-1">
            <p className="text-sm font-medium">Session chat</p>
            <Button variant="ghost" size="icon-xs" aria-label="Close chat panel" onClick={() => setIsOpen(false)}>
              <X size={14} />
            </Button>
          </div>
          {appointmentId ? (
            <PreSessionChatPanel
              appointmentId={appointmentId}
              compact
              viewerRole={role === "psychologist" ? "psychologist" : "patient"}
              onAccessDenied={handleAccessDenied}
            />
          ) : (
            <div className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
              {isResolving
                ? "Looking for your next appointment chat..."
                : "No active appointment chat found yet. Open a video session page to start chat."}
            </div>
          )}
        </div>
      ) : (
        <Button
          className="rounded-full shadow-md"
          aria-label="Open session chat"
          onClick={() => setIsOpen(true)}
          disabled={isDisabled}
        >
          <ChatCircleDots size={16} />
          Chat
        </Button>
      )}
    </div>
  )
}
