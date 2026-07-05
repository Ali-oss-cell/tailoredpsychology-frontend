"use client"

import { io, type Socket } from "socket.io-client"

import { ensureBackendAccessToken } from "@/src/patient/booking/api"
import { getSocketBaseUrl } from "@/src/session/socket-base-url"

export type PortalInvalidateScope = "billing" | "journey" | "all"

export type PortalAppointmentUpdated = {
  appointmentId: string
  status: string
  occurredAt: string
}

export type PortalEventHandlers = {
  onAppointmentUpdated?: (payload: PortalAppointmentUpdated) => void
  onDashboardInvalidate?: (scope: PortalInvalidateScope) => void
  onError?: (message: string) => void
}

const SOCKET_OPTIONS = {
  path: "/socket.io",
  transports: ["polling", "websocket"] as ("polling" | "websocket")[],
  upgrade: true,
  reconnection: true,
  reconnectionAttempts: 8,
  timeout: 25_000,
}

function waitForConnect(socket: Socket, timeoutMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (socket.connected) {
      resolve()
      return
    }
    const timer = window.setTimeout(() => {
      cleanup()
      reject(new Error("Portal socket connect timeout"))
    }, timeoutMs)
    const onConnect = () => {
      cleanup()
      resolve()
    }
    const onConnectError = () => {
      cleanup()
      reject(new Error("Portal socket connect failed"))
    }
    const cleanup = () => {
      window.clearTimeout(timer)
      socket.off("connect", onConnect)
      socket.off("connect_error", onConnectError)
    }
    socket.once("connect", onConnect)
    socket.once("connect_error", onConnectError)
  })
}

/** Singleton portal socket for patient dashboard live updates. */
export class PortalSocketClient {
  private socket: Socket | null = null

  async connect(handlers: PortalEventHandlers): Promise<void> {
    if (this.socket?.connected) return

    const token = await ensureBackendAccessToken()
    this.socket = io(`${getSocketBaseUrl()}/portal`, {
      ...SOCKET_OPTIONS,
      auth: { token: `Bearer ${token}` },
    })

    this.socket.on("appointment.updated", (payload: PortalAppointmentUpdated) => {
      handlers.onAppointmentUpdated?.(payload)
    })
    this.socket.on("dashboard.invalidate", (payload: { scope?: PortalInvalidateScope }) => {
      handlers.onDashboardInvalidate?.(payload?.scope ?? "all")
    })
    this.socket.on("portal:error", (payload: { message?: string }) => {
      handlers.onError?.(payload?.message ?? "Portal socket error")
    })

    await waitForConnect(this.socket, SOCKET_OPTIONS.timeout)
    const ack = (await this.socket.emitWithAck("portal:subscribe", {})) as { ok: boolean; error?: string }
    if (!ack.ok) {
      throw new Error(ack.error ?? "Portal subscribe failed")
    }
  }

  disconnect(): void {
    this.socket?.disconnect()
    this.socket = null
  }
}
