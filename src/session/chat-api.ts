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

const SOCKET_OPTIONS = {
  transports: ["polling", "websocket"] as ("polling" | "websocket")[],
  upgrade: true,
  reconnection: true,
  reconnectionAttempts: 5,
  timeout: 20_000,
}

export class SessionChatClient {
  private socket: Socket | null = null

  async connect(): Promise<void> {
    if (this.socket?.connected) {
      return
    }
    const token = await ensureBackendAccessToken()
    this.socket = io(`${getSocketBaseUrl()}/chat`, {
      ...SOCKET_OPTIONS,
      auth: { token: `Bearer ${token}` },
    })
    await new Promise<void>((resolve, reject) => {
      const onConnect = () => {
        cleanup()
        resolve()
      }
      const onError = (error: Error) => {
        cleanup()
        reject(error ?? new Error("Socket connection failed"))
      }
      const cleanup = () => {
        this.socket?.off("connect", onConnect)
        this.socket?.off("connect_error", onError)
      }
      this.socket?.once("connect", onConnect)
      this.socket?.once("connect_error", onError)
    })
  }

  disconnect(): void {
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
    if (!this.socket) {
      throw new Error("Socket is not connected")
    }
    const response = (await this.socket.emitWithAck("chat:join", { appointmentId })) as JoinAck
    if (!response.ok) {
      throw new Error(response.error ?? "Unable to join chat room")
    }
    return response
  }

  async send(appointmentId: string, message: string): Promise<SendAck> {
    if (!this.socket) {
      throw new Error("Socket is not connected")
    }
    const response = (await this.socket.emitWithAck("chat:send", { appointmentId, message })) as SendAck
    if (!response.ok) {
      throw new Error(response.error ?? "Unable to send message")
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
