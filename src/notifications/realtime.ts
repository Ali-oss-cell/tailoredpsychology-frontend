"use client"

import { io, type Socket } from "socket.io-client"

import { getNotificationStreamToken, type NotificationItem } from "@/src/notifications/api"

function getSocketBaseUrl(): string {
  const fallback = "http://localhost:3001"
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? `${fallback}/api`
  return apiBase.endsWith("/api") ? apiBase.slice(0, -4) : apiBase
}

export class NotificationRealtimeClient {
  private socket: Socket | null = null

  async connectAndSubscribe(onNotification: (notification: NotificationItem) => void): Promise<void> {
    if (this.socket?.connected) return
    const { socketToken } = await getNotificationStreamToken()
    this.socket = io(`${getSocketBaseUrl()}/notifications`, {
      auth: { token: `Bearer ${socketToken}` },
      transports: ["websocket"],
    })

    await new Promise<void>((resolve, reject) => {
      this.socket?.once("connect", () => resolve())
      this.socket?.once("connect_error", () => reject(new Error("Notification socket connect failed")))
    })

    this.socket.on("notifications:new", onNotification)
    const ack = (await this.socket.emitWithAck("notifications:subscribe", {})) as { ok: boolean; error?: string }
    if (!ack.ok) {
      throw new Error(ack.error ?? "Unable to subscribe to notifications stream")
    }
  }

  disconnect(): void {
    this.socket?.disconnect()
    this.socket = null
  }
}
