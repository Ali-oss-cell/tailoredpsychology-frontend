"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import {
  SessionChatClient,
  getChatMessagesFallback,
  getChatWindowFallback,
  sendChatMessageFallback,
  type ChatMessageResponse,
} from "@/src/session/chat-api"

type ChatWindowStatus = "locked" | "open" | "closed"

type UseSessionChatRoomOptions = {
  onMessage?: (message: ChatMessageResponse) => void
  onPresence?: (onlineUserIds: string[]) => void
}

const REST_POLL_MS = 5_000

function mergeMessages(existing: ChatMessageResponse[], incoming: ChatMessageResponse[]): ChatMessageResponse[] {
  const byId = new Map(existing.map((message) => [message.messageId, message]))
  for (const message of incoming) {
    byId.set(message.messageId, message)
  }
  return [...byId.values()].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )
}

async function loadRestSnapshot(appointmentId: string) {
  const [window, history] = await Promise.all([
    getChatWindowFallback(appointmentId),
    getChatMessagesFallback(appointmentId).catch(() => [] as ChatMessageResponse[]),
  ])
  return { window, history }
}

export function useSessionChatRoom(appointmentId: string, options: UseSessionChatRoomOptions = {}) {
  const clientRef = useRef<SessionChatClient | null>(null)
  const onMessageRef = useRef(options.onMessage)
  const onPresenceRef = useRef(options.onPresence)

  useEffect(() => {
    onMessageRef.current = options.onMessage
    onPresenceRef.current = options.onPresence
  }, [options.onMessage, options.onPresence])

  const [messages, setMessages] = useState<ChatMessageResponse[]>([])
  const [status, setStatus] = useState<ChatWindowStatus>("locked")
  const [opensAt, setOpensAt] = useState(() => new Date().toISOString())
  const [reason, setReason] = useState("Checking session window...")
  const [presenceOnlineUserIds, setPresenceOnlineUserIds] = useState<string[]>([])
  const [isDegradedMode, setIsDegradedMode] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset room state when switching appointments
    setIsConnecting(true)
    setError(null)
    setMessages([])
    setPresenceOnlineUserIds([])
    setIsDegradedMode(false)

    async function connect() {
      const chatClient = new SessionChatClient()
      clientRef.current = chatClient

      try {
        await chatClient.connect()
        chatClient.subscribe({
          onMessage: (message) => {
            if (!mounted) return
            setMessages((prev) => mergeMessages(prev, [message]))
            onMessageRef.current?.(message)
          },
          onPresence: (presence) => {
            if (!mounted || presence.appointmentId !== appointmentId) return
            setPresenceOnlineUserIds(presence.onlineUserIds)
            onPresenceRef.current?.(presence.onlineUserIds)
          },
          onWindow: (window) => {
            if (!mounted || window.appointmentId !== appointmentId) return
            setStatus(window.status)
            setOpensAt(window.opensAt)
            setReason(window.reason)
          },
          onError: (socketError) => mounted && setError(socketError),
        })
        const joined = await chatClient.join(appointmentId)
        if (!mounted) return
        setMessages(joined.messages)
        setPresenceOnlineUserIds(joined.presence.onlineUserIds)
        setStatus(joined.window.status)
        setOpensAt(joined.window.opensAt)
        setReason(joined.window.reason)
        setIsDegradedMode(false)
      } catch (connectError) {
        if (!mounted) return
        setIsDegradedMode(true)
        try {
          const { window, history } = await loadRestSnapshot(appointmentId)
          if (!mounted) return
          setStatus(window.status)
          setOpensAt(window.opensAt)
          setReason(window.reason)
          setMessages(history)
          setError(null)
        } catch {
          if (mounted) {
            const detail = connectError instanceof Error ? connectError.message : "Could not load chat."
            setError(detail)
          }
        }
      } finally {
        if (mounted) setIsConnecting(false)
      }
    }

    void connect()
    return () => {
      mounted = false
      clientRef.current?.disconnect()
      clientRef.current = null
    }
  }, [appointmentId])

  useEffect(() => {
    if (!isDegradedMode || !appointmentId) return

    let cancelled = false

    async function poll() {
      try {
        const { window, history } = await loadRestSnapshot(appointmentId)
        if (cancelled) return
        setStatus(window.status)
        setOpensAt(window.opensAt)
        setReason(window.reason)
        setMessages((prev) => mergeMessages(prev, history))
      } catch {
        // Keep last good snapshot during transient poll failures.
      }
    }

    const timer = window.setInterval(() => {
      void poll()
    }, REST_POLL_MS)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [appointmentId, isDegradedMode])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!appointmentId || status !== "open") return
      const message = text.trim()
      if (!message) return

      setError(null)
      try {
        if (isDegradedMode) {
          const created = await sendChatMessageFallback(appointmentId, message)
          setMessages((prev) => mergeMessages(prev, [created]))
          onMessageRef.current?.(created)
        } else {
          await clientRef.current?.send(appointmentId, message)
        }
      } catch {
        setError("Message could not be delivered.")
        throw new Error("send failed")
      }
    },
    [appointmentId, isDegradedMode, status],
  )

  const canSend = useMemo(() => status === "open" && Boolean(appointmentId), [appointmentId, status])

  return {
    messages,
    status,
    opensAt,
    reason,
    presenceOnlineUserIds,
    isDegradedMode,
    isConnecting,
    error,
    canSend,
    sendMessage,
    setError,
  }
}
