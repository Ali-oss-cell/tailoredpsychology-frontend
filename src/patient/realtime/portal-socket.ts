"use client"

import { io, type Socket } from "socket.io-client"

import { isTransientNetworkError } from "@/src/lib/network-error"
import { ensureBackendAccessToken } from "@/src/patient/booking/api"
import {
  attachResilientSocketHandlers,
  bindSocketVisibilityPause,
  RESILIENT_SOCKET_OPTIONS,
} from "@/src/session/resilient-socket"
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
  onConnectionChange?: (connected: boolean) => void
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
    const onConnectError = (error: Error) => {
      cleanup()
      reject(error ?? new Error("Portal socket connect failed"))
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
  private detachHandlers: (() => void) | null = null
  private detachVisibility: (() => void) | null = null

  async connect(handlers: PortalEventHandlers): Promise<void> {
    if (this.socket?.connected) return

    const token = await ensureBackendAccessToken()
    this.socket = io(`${getSocketBaseUrl()}/portal`, {
      ...RESILIENT_SOCKET_OPTIONS,
      auth: { token: `Bearer ${token}` },
    })

    this.detachHandlers = attachResilientSocketHandlers(this.socket, "portal")
    this.detachVisibility = bindSocketVisibilityPause(this.socket)

    this.socket.on("connect", () => handlers.onConnectionChange?.(true))
    this.socket.on("disconnect", () => handlers.onConnectionChange?.(false))

    this.socket.on("appointment.updated", (payload: PortalAppointmentUpdated) => {
      handlers.onAppointmentUpdated?.(payload)
    })
    this.socket.on("dashboard.invalidate", (payload: { scope?: PortalInvalidateScope }) => {
      handlers.onDashboardInvalidate?.(payload?.scope ?? "all")
    })
    this.socket.on("portal:error", (payload: { message?: string }) => {
      handlers.onError?.(payload?.message ?? "Portal socket error")
    })

    try {
      await waitForConnect(this.socket, RESILIENT_SOCKET_OPTIONS.timeout)
      const ack = (await this.socket.emitWithAck("portal:subscribe", {})) as { ok: boolean; error?: string }
      if (!ack.ok) {
        throw new Error(ack.error ?? "Portal subscribe failed")
      }
      handlers.onConnectionChange?.(true)
    } catch (error) {
      if (!isTransientNetworkError(error) && process.env.NODE_ENV === "development") {
        console.warn("[socket:portal] initial connect failed:", error)
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
