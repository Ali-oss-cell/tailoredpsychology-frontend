"use client"

import { io, type Socket } from "socket.io-client"

import { isTransientNetworkError } from "@/src/lib/network-error"
import { getNotificationStreamToken, type NotificationItem } from "@/src/notifications/api"
import {
  attachResilientSocketHandlers,
  bindSocketVisibilityPause,
  RESILIENT_SOCKET_OPTIONS,
} from "@/src/session/resilient-socket"
import { getSocketBaseUrl } from "@/src/session/socket-base-url"

export class NotificationRealtimeClient {
  private socket: Socket | null = null
  private detachHandlers: (() => void) | null = null
  private detachVisibility: (() => void) | null = null

  async connectAndSubscribe(onNotification: (notification: NotificationItem) => void): Promise<void> {
    if (this.socket?.connected) return
    const { socketToken } = await getNotificationStreamToken()
    this.socket = io(`${getSocketBaseUrl()}/notifications`, {
      ...RESILIENT_SOCKET_OPTIONS,
      auth: { token: `Bearer ${socketToken}` },
    })

    this.detachHandlers = attachResilientSocketHandlers(this.socket, "notifications")
    this.detachVisibility = bindSocketVisibilityPause(this.socket)

    try {
      await new Promise<void>((resolve, reject) => {
        this.socket?.once("connect", () => resolve())
        this.socket?.once("connect_error", (error: Error) => reject(error ?? new Error("Notification socket connect failed")))
      })

      this.socket.on("notifications:new", onNotification)
      const ack = (await this.socket.emitWithAck("notifications:subscribe", {})) as { ok: boolean; error?: string }
      if (!ack.ok) {
        throw new Error(ack.error ?? "Unable to subscribe to notifications stream")
      }
    } catch (error) {
      if (!isTransientNetworkError(error) && process.env.NODE_ENV === "development") {
        console.warn("[socket:notifications] connect failed:", error)
      }
      throw error
    }
  }

  disconnect(): void {
    this.detachHandlers?.()
    this.detachHandlers = null
    this.detachVisibility?.()
    this.detachVisibility = null
    this.socket?.disconnect()
    this.socket = null
  }
}
