"use client"

import { Paperclip, PaperPlaneTilt } from "@phosphor-icons/react"
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react"

import { ChatAvatar } from "@/components/session/chat/chat-avatar"
import { ChatMessageBubble } from "@/components/session/chat/chat-message-bubble"
import { Button } from "@/components/ui/button"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { EmptyState } from "@/components/shared/empty-state"
import type { ChatMessageResponse } from "@/src/session/chat-api"
import { useSessionChatRoom } from "@/src/session/use-session-chat-room"

type ViewerRole = ChatMessageResponse["authorRole"]

type ChatConversationViewProps = {
  appointmentId: string | null
  viewerRole: ViewerRole
  viewerUserId?: string
  peerDisplayName?: string
  peerUserId?: string
  showHeader?: boolean
  compact?: boolean
  className?: string
  onMessage?: (message: ChatMessageResponse) => void
  onPresence?: (onlineUserIds: string[]) => void
  onAccessDenied?: (appointmentId: string) => void
}

type ActiveConversationProps = Omit<ChatConversationViewProps, "appointmentId"> & {
  appointmentId: string
}

function formatCountdown(opensAt: string): string {
  const diff = new Date(opensAt).getTime() - Date.now()
  if (diff <= 0) return "00:00"
  const totalSeconds = Math.floor(diff / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

function isOwnMessage(message: ChatMessageResponse, viewerRole: ViewerRole, viewerUserId?: string): boolean {
  if (viewerUserId && message.authorUserId === viewerUserId) return true
  return message.authorRole === viewerRole
}

function ChatConversationActive({
  appointmentId,
  viewerRole,
  viewerUserId,
  peerDisplayName = "Patient",
  peerUserId,
  showHeader = true,
  compact = false,
  className = "",
  onMessage,
  onPresence,
  onAccessDenied,
}: ActiveConversationProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [nowTick, setNowTick] = useState(() => Date.now())

  const {
    messages,
    status,
    opensAt,
    reason,
    presenceOnlineUserIds,
    isDegradedMode,
    accessDenied,
    isConnecting,
    error,
    canSend,
    sendMessage,
  } = useSessionChatRoom(appointmentId, { onMessage, onPresence, onAccessDenied })

  const peerOnline = peerUserId ? presenceOnlineUserIds.includes(peerUserId) : false

  useEffect(() => {
    const node = scrollRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [messages, appointmentId])

  useEffect(() => {
    if (status !== "locked") return
    const timer = window.setInterval(() => setNowTick(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [status, opensAt])

  const countdownText = useMemo(() => {
    void nowTick
    return formatCountdown(opensAt)
  }, [opensAt, nowTick])

  async function handleSend() {
    if (!canSend || isSending || !draft.trim()) return
    const text = draft.trim()
    setDraft("")
    setIsSending(true)
    try {
      await sendMessage(text)
    } catch {
      setDraft(text)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className={`flex min-h-0 flex-1 flex-col bg-card ${className}`}>
      {showHeader ? (
        <header className="border-border/70 flex shrink-0 items-center gap-3 border-b px-4 py-3 shadow-sm md:px-5">
          <ChatAvatar name={peerDisplayName} id={peerUserId ?? peerDisplayName} isOnline={peerOnline} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold">{peerDisplayName}</p>
            <p className="text-muted-foreground text-xs">{peerOnline ? "Active now" : "Offline"}</p>
          </div>
        </header>
      ) : null}

      {accessDenied ? (
        <p className="border-destructive/30 bg-destructive/5 text-destructive shrink-0 border-b px-4 py-3 text-sm md:px-5">
          {error ?? "You don't have access to this appointment's chat."}
        </p>
      ) : isDegradedMode ? (
        <p className="border-warning/80 bg-warning/10 text-warning-foreground shrink-0 border-b px-4 py-2 text-xs">
          Live updates unavailable — syncing every few seconds. Messages still send normally.
        </p>
      ) : null}

      {status !== "open" ? (
        <div className="border-border/60 bg-muted/40 text-muted-foreground shrink-0 border-b px-4 py-2 text-xs md:px-5">
          <span className="font-medium text-foreground capitalize">{status}</span>
          {" · "}
          {reason}
          {status === "locked" ? ` · Opens in ${countdownText}` : null}
        </div>
      ) : null}

      <div
        ref={scrollRef}
        className={`chat-scroll min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 md:px-5 ${compact ? "max-h-52" : ""}`}
        aria-live="polite"
        aria-relevant="additions"
        aria-atomic="false"
      >
        {isConnecting && messages.length === 0 ? (
          <DashboardStateBlock variant="loading" message="Loading conversation…" />
        ) : messages.length === 0 ? (
          <EmptyState
            className="border-none bg-transparent py-6"
            title="No messages yet"
            description="Say hello when you're ready."
          />
        ) : (
          messages.map((message) => (
            <ChatMessageBubble
              key={message.messageId}
              message={message}
              isOwnMessage={isOwnMessage(message, viewerRole, viewerUserId)}
            />
          ))
        )}
      </div>

      <footer className="border-border/70 shrink-0 border-t bg-card px-3 py-3 shadow-[0_-4px_16px_-12px_rgba(0,0,0,0.25)] md:px-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground shrink-0 rounded-full"
            disabled
            aria-label="Attach file (not available)"
            title="File attachments are not available in chat yet"
          >
            <Paperclip size={20} />
          </Button>
          <input
            value={draft}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                void handleSend()
              }
            }}
            placeholder={status === "open" ? "Type a message…" : "Chat is unavailable"}
            disabled={!canSend || isSending}
            className="bg-muted/50 border-border focus-visible:ring-ring h-11 min-w-0 flex-1 rounded-full border px-4 text-sm outline-none transition-shadow focus-visible:ring-2"
          />
          <Button
            type="button"
            onClick={() => void handleSend()}
            disabled={!canSend || isSending || !draft.trim()}
            className="h-11 shrink-0 rounded-full px-5"
          >
            <PaperPlaneTilt size={18} weight="fill" className="mr-1.5" />
            Send
          </Button>
        </div>
        {error ? <p className="text-destructive mt-2 px-1 text-xs">{error}</p> : null}
        <p className="text-muted-foreground mt-2 px-1 text-[11px]">
          Press Enter to send. Attachments are not supported in chat — share files through your clinician if needed.
        </p>
      </footer>
    </div>
  )
}

export function ChatConversationView({
  appointmentId,
  className = "",
  ...props
}: ChatConversationViewProps) {
  if (!appointmentId) {
    return (
      <div className={`flex flex-1 flex-col items-center justify-center bg-muted/20 px-6 text-center ${className}`}>
        <p className="text-muted-foreground text-sm">Select a patient to start chatting</p>
      </div>
    )
  }

  return <ChatConversationActive appointmentId={appointmentId} className={className} {...props} />
}
