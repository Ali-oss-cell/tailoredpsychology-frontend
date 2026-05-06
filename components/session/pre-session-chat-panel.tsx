"use client"

import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { SessionChatClient, getChatWindowFallback, sendChatMessageFallback, type ChatMessageResponse } from "@/src/session/chat-api"

type PreSessionChatPanelProps = {
  appointmentId: string
  compact?: boolean
}

function formatCountdown(opensAt: string): string {
  const diff = new Date(opensAt).getTime() - Date.now()
  if (diff <= 0) return "00:00"
  const totalSeconds = Math.floor(diff / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

export function PreSessionChatPanel({ appointmentId, compact = false }: PreSessionChatPanelProps) {
  const clientRef = useRef<SessionChatClient | null>(null)
  const [messages, setMessages] = useState<ChatMessageResponse[]>([])
  const [status, setStatus] = useState<"locked" | "open" | "closed">("locked")
  const [opensAt, setOpensAt] = useState<string>(new Date().toISOString())
  const [reason, setReason] = useState<string>("Checking session window...")
  const [presenceCount, setPresenceCount] = useState(0)
  const [draft, setDraft] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isDegradedMode, setIsDegradedMode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nowTick, setNowTick] = useState(() => Date.now())

  useEffect(() => {
    let mounted = true

    async function connect() {
      const chatClient = new SessionChatClient()
      clientRef.current = chatClient

      try {
        await chatClient.connect()
        chatClient.subscribe({
          onMessage: (message) => mounted && setMessages((prev) => [...prev, message]),
          onPresence: (presence) => mounted && setPresenceCount(presence.onlineUserIds.length),
          onWindow: (window) => {
            if (!mounted) return
            setStatus(window.status)
            setOpensAt(window.opensAt)
            setReason(window.reason)
          },
          onError: (socketError) => mounted && setError(socketError),
        })
        const joined = await chatClient.join(appointmentId)
        if (!mounted) return
        setMessages(joined.messages)
        setPresenceCount(joined.presence.onlineUserIds.length)
        setStatus(joined.window.status)
        setOpensAt(joined.window.opensAt)
        setReason(joined.window.reason)
      } catch {
        if (!mounted) return
        setIsDegradedMode(true)
        const window = await getChatWindowFallback(appointmentId)
        if (!mounted) return
        setStatus(window.status)
        setOpensAt(window.opensAt)
        setReason(window.reason)
      }
    }

    void connect()
    return () => {
      mounted = false
      clientRef.current?.disconnect()
    }
  }, [appointmentId])

  useEffect(() => {
    if (status !== "locked") return
    const timer = window.setInterval(() => setNowTick(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [status, opensAt])

  const countdownText = useMemo(() => {
    void nowTick
    return formatCountdown(opensAt)
  }, [opensAt, nowTick])

  const canSend = useMemo(() => status === "open" && !isSending && draft.trim().length > 0, [status, isSending, draft])

  async function handleSend() {
    if (!canSend) return
    const message = draft.trim()
    setDraft("")
    setIsSending(true)
    setError(null)
    try {
      if (isDegradedMode) {
        const created = await sendChatMessageFallback(appointmentId, message)
        setMessages((prev) => [...prev, created])
      } else {
        await clientRef.current?.send(appointmentId, message)
      }
    } catch {
      setError("Message could not be delivered.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className={`space-y-3 rounded-xl border border-border bg-card p-4 ${compact ? "text-sm" : "space-y-4"}`}>
      <div className="flex items-center justify-between">
        <h2 className={compact ? "text-base font-semibold" : "text-lg font-semibold"}>Pre-session chat</h2>
        <span className="text-xs text-muted-foreground">Online: {presenceCount}</span>
      </div>
      {isDegradedMode ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Realtime unavailable. Running in fallback mode.
        </p>
      ) : null}
      <div className="rounded-md bg-muted px-3 py-2 text-sm">
        <p>
          Status: <strong>{status}</strong>
        </p>
        <p className="text-muted-foreground">{reason}</p>
        {status === "locked" ? <p>Opens in: {countdownText}</p> : null}
      </div>

      <div className={`${compact ? "max-h-52" : "max-h-80"} space-y-2 overflow-y-auto rounded-md border border-border p-3`}>
        {messages.length === 0 ? (
          <DashboardStateBlock variant="empty" message="No messages yet." />
        ) : (
          messages.map((message) => (
            <article key={message.messageId} className="rounded-md bg-muted px-3 py-2 text-sm">
              <p className="font-medium">{message.authorRole}</p>
              <p>{message.message}</p>
            </article>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setDraft(event.target.value)}
          placeholder={status === "open" ? "Type your message..." : "Chat is unavailable"}
          disabled={status !== "open" || isSending}
          className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm"
        />
        <Button onClick={() => void handleSend()} disabled={!canSend}>
          Send
        </Button>
      </div>
      {error ? <DashboardStateBlock variant="error" message={error} /> : null}
    </section>
  )
}
