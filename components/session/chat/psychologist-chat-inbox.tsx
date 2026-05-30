"use client"

import * as React from "react"

import { ChatConversationView } from "@/components/session/chat/chat-conversation-view"
import { ChatPatientSidebar, type ChatPatientThread } from "@/components/session/chat/chat-patient-sidebar"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { getCurrentUser } from "@/src/auth/current-user"
import { getAppointmentChatMessages } from "@/src/patient/booking/api"
import type { ChatMessageResponse } from "@/src/session/chat-api"
import { getPsychologistPatientContext, getPsychologistWorkspace } from "@/src/psychologist/workspace/api"
import type { PsychologistWorkspaceItem } from "@/src/psychologist/workspace/api"

function pickChatAppointment(items: PsychologistWorkspaceItem[]): PsychologistWorkspaceItem | null {
  if (items.length === 0) return null
  const now = Date.now()
  const sorted = [...items].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
  const upcoming = sorted.find((item) => new Date(item.startsAt).getTime() >= now)
  return upcoming ?? sorted[sorted.length - 1] ?? null
}

function lastMessageFromHistory(messages: ChatMessageResponse[]): { text: string; at: string } | null {
  if (messages.length === 0) return null
  const last = messages[messages.length - 1]
  return { text: last.message, at: last.createdAt }
}

export function PsychologistChatInbox() {
  const [threads, setThreads] = React.useState<ChatPatientThread[]>([])
  const [selected, setSelected] = React.useState<ChatPatientThread | null>(null)
  const [viewerUserId, setViewerUserId] = React.useState<string>("")
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [onlineByPatient, setOnlineByPatient] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const user = await getCurrentUser()
        if (cancelled) return
        setViewerUserId(user.id)

        const workspace = await getPsychologistWorkspace(user.id)
        const patientIds = [...new Set(workspace.items.map((item) => item.patientId))]
        const contexts = await Promise.all(
          patientIds.map(async (patientId) => {
            try {
              return await getPsychologistPatientContext(user.id, patientId)
            } catch {
              return null
            }
          }),
        )
        const nameByPatient = new Map(
          contexts.filter((ctx): ctx is NonNullable<typeof ctx> => Boolean(ctx)).map((ctx) => [ctx.patientId, ctx.patientDisplayName]),
        )

        const threadDrafts = patientIds
          .map((patientId) => {
            const appointment = pickChatAppointment(workspace.items.filter((item) => item.patientId === patientId))
            if (!appointment) return null
            return {
              patientId,
              appointmentId: appointment.appointmentId,
              displayName: nameByPatient.get(patientId) ?? patientId,
            } satisfies Omit<ChatPatientThread, "lastMessage" | "lastMessageAt" | "isOnline">
          })
          .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))

        const previews = await Promise.all(
          threadDrafts.map(async (draft) => {
            try {
              const messages = await getAppointmentChatMessages(draft.appointmentId)
              const last = lastMessageFromHistory(messages)
              return { appointmentId: draft.appointmentId, last }
            } catch {
              return { appointmentId: draft.appointmentId, last: null }
            }
          }),
        )
        const previewByAppointment = new Map(previews.map((entry) => [entry.appointmentId, entry.last]))

        const built: ChatPatientThread[] = threadDrafts.map((draft) => {
          const last = previewByAppointment.get(draft.appointmentId)
          return {
            ...draft,
            lastMessage: last?.text,
            lastMessageAt: last?.at,
            isOnline: false,
          }
        })

        if (!cancelled) {
          setThreads(built)
          setError(null)
        }
      } catch {
        if (!cancelled) setError("Could not load message inbox.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const handleIncomingMessage = React.useCallback(
    (message: ChatMessageResponse) => {
      setThreads((prev) =>
        prev.map((thread) =>
          thread.appointmentId === message.appointmentId
            ? {
                ...thread,
                lastMessage: message.message,
                lastMessageAt: message.createdAt,
              }
            : thread,
        ),
      )
    },
    [],
  )

  const threadsWithPresence = React.useMemo(
    () =>
      threads.map((thread) => ({
        ...thread,
        isOnline: onlineByPatient[thread.patientId] ?? thread.isOnline,
      })),
    [onlineByPatient, threads],
  )

  const activeThread = selected
    ? threadsWithPresence.find((thread) => thread.appointmentId === selected.appointmentId) ?? selected
    : null

  if (error) {
    return <DashboardStateBlock variant="error" message={error} />
  }

  return (
    <div className="border-border/70 flex h-[calc(100vh-4rem)] min-h-[32rem] overflow-hidden rounded-xl border bg-background shadow-sm">
      <ChatPatientSidebar
        threads={threadsWithPresence}
        selectedAppointmentId={selected?.appointmentId ?? null}
        onSelect={setSelected}
        isLoading={loading}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <ChatConversationView
          appointmentId={selected?.appointmentId ?? null}
          viewerRole="psychologist"
          viewerUserId={viewerUserId}
          peerDisplayName={activeThread?.displayName}
          peerUserId={activeThread?.patientId}
          onMessage={handleIncomingMessage}
          onPresence={(onlineUserIds) => {
            if (!selected) return
            const isOnline = onlineUserIds.includes(selected.patientId)
            setOnlineByPatient((prev) => ({ ...prev, [selected.patientId]: isOnline }))
            setThreads((prev) =>
              prev.map((thread) =>
                thread.patientId === selected.patientId ? { ...thread, isOnline } : thread,
              ),
            )
          }}
          className="h-full"
        />
      </div>
    </div>
  )
}
