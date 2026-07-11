"use client"

import { io, type Socket } from "socket.io-client"

import {
  ensureBackendAccessToken,
  getAppointmentChatMessages,
  getAppointmentChatWindow,
  postAppointmentChatMessage,
  type ChatMessageResponse,
  type ChatWindowResponse,
} from "@/src/patient/booking/api"
import {
  attachResilientSocketHandlers,
  bindSocketVisibilityPause,
  RESILIENT_SOCKET_OPTIONS,
} from "@/src/session/resilient-socket"
import { getSocketBaseUrl } from "@/src/session/socket-base-url"

type PresenceEvent = {
  appointmentId: string
  onlineUserIds: string[]
}

type JoinAck = {
  ok: boolean
  error?: string
  appointmentId: string
  window: ChatWindowResponse
  messages: ChatMessageResponse[]
  presence: PresenceEvent
}

type SendAck = {
  ok: boolean
  error?: string
  message: ChatMessageResponse
  window: ChatWindowResponse
}

type ChatEventHandlers = {
  onMessage?: (message: ChatMessageResponse) => void
  onPresence?: (presence: PresenceEvent) => void
  onWindow?: (window: ChatWindowResponse) => void
  onError?: (message: string) => void
}

const SOCKET_OPTIONS = RESILIENT_SOCKET_OPTIONS

function waitForStableConnect(socket: Socket, timeoutMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (socket.connected) {
      resolve()
      return
    }

    let settled = false
    const finish = (handler: () => void) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      cleanup()
      handler()
    }

    const timer = window.setTimeout(() => {
      finish(() => reject(new Error("Chat connection timed out")))
    }, timeoutMs)

    const onConnect = () => {
      finish(() => resolve())
    }

    const onConnectError = (error: Error) => {
      finish(() => reject(error ?? new Error("Chat connection failed")))
    }

    const cleanup = () => {
      socket.off("connect", onConnect)
      socket.off("connect_error", onConnectError)
    }

    socket.once("connect", onConnect)
    socket.once("connect_error", onConnectError)
  })
}

export class SessionChatClient {
  private socket: Socket | null = null
  private detachHandlers: (() => void) | null = null
  private detachVisibility: (() => void) | null = null

  async connect(): Promise<void> {
    if (this.socket?.connected) {
      return
    }

    this.disconnect()
    const token = await ensureBackendAccessToken()
    this.socket = io(`${getSocketBaseUrl()}/chat`, {
      ...SOCKET_OPTIONS,
      forceNew: true,
      auth: { token: `Bearer ${token}` },
    })
    this.detachHandlers = attachResilientSocketHandlers(this.socket, "chat")
    this.detachVisibility = bindSocketVisibilityPause(this.socket)
    await waitForStableConnect(this.socket, SOCKET_OPTIONS.timeout)
  }

  disconnect(): void {
    this.detachHandlers?.()
    this.detachHandlers = null
    this.detachVisibility?.()
    this.detachVisibility = null
    this.socket?.disconnect()
    this.socket = null
  }

  subscribe(handlers: ChatEventHandlers): void {
    if (!this.socket) {
      return
    }
    this.socket.on("chat:message", (payload: ChatMessageResponse) => handlers.onMessage?.(payload))
    this.socket.on("chat:presence", (payload: PresenceEvent) => handlers.onPresence?.(payload))
    this.socket.on("chat:window", (payload: ChatWindowResponse) => handlers.onWindow?.(payload))
    this.socket.on("chat:error", (payload: { message?: string }) =>
      handlers.onError?.(payload.message ?? "Socket error"),
    )
  }

  async join(appointmentId: string): Promise<JoinAck> {
    if (!this.socket?.connected) {
      throw new Error("Socket is not connected")
    }
    const response = (await this.socket.emitWithAck("chat:join", { appointmentId })) as JoinAck
    if (!response?.ok) {
      throw new Error(response?.error ?? "Unable to join chat room")
    }
    return response
  }

  async send(appointmentId: string, message: string): Promise<SendAck> {
    if (!this.socket?.connected) {
      throw new Error("Socket is not connected")
    }
    const response = (await this.socket.emitWithAck("chat:send", { appointmentId, message })) as SendAck
    if (!response?.ok) {
      throw new Error(response?.error ?? "Unable to send message")
    }
    return response
  }
}

export async function getChatWindowFallback(appointmentId: string): Promise<ChatWindowResponse> {
  return getAppointmentChatWindow(appointmentId)
}

export async function getChatMessagesFallback(appointmentId: string): Promise<ChatMessageResponse[]> {
  return getAppointmentChatMessages(appointmentId)
}

export async function sendChatMessageFallback(
  appointmentId: string,
  message: string,
): Promise<ChatMessageResponse> {
  return postAppointmentChatMessage(appointmentId, message)
}

export type { ChatMessageResponse, ChatWindowResponse, PresenceEvent }
