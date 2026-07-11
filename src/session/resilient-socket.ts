"use client"

import type { Socket } from "socket.io-client"

import { isTransientNetworkError } from "@/src/lib/network-error"

export const RESILIENT_SOCKET_OPTIONS = {
  path: "/socket.io",
  transports: ["polling", "websocket"] as ("polling" | "websocket")[],
  upgrade: true,
  reconnection: true,
  reconnectionAttempts: 20,
  reconnectionDelay: 1_000,
  reconnectionDelayMax: 30_000,
  randomizationFactor: 0.4,
  timeout: 25_000,
} as const

type DegradedListener = (degraded: boolean) => void

let socketDegraded = false
const degradedListeners = new Set<DegradedListener>()

export function isSocketDegraded(): boolean {
  return socketDegraded
}

export function subscribeSocketDegraded(listener: DegradedListener): () => void {
  degradedListeners.add(listener)
  listener(socketDegraded)
  return () => degradedListeners.delete(listener)
}

function setSocketDegraded(next: boolean): void {
  if (socketDegraded === next) return
  socketDegraded = next
  degradedListeners.forEach((listener) => listener(next))
}

function shouldLogSocketIssue(error: unknown): boolean {
  if (process.env.NODE_ENV === "production") return false
  return !isTransientNetworkError(error)
}

/** Suppress noisy connect errors; surface degraded mode for UI banners. */
export function attachResilientSocketHandlers(socket: Socket, label: string): () => void {
  const onDisconnect = (reason: string) => {
    if (reason === "io client disconnect") return
    setSocketDegraded(true)
    if (process.env.NODE_ENV === "development") {
      console.info(`[socket:${label}] disconnected (${reason})`)
    }
  }

  const onConnect = () => {
    setSocketDegraded(false)
  }

  const onConnectError = (error: Error) => {
    setSocketDegraded(true)
    if (shouldLogSocketIssue(error)) {
      console.warn(`[socket:${label}] connect error:`, error.message)
    }
  }

  const onReconnectAttempt = () => {
    setSocketDegraded(true)
  }

  const onReconnect = () => {
    setSocketDegraded(false)
  }

  socket.on("disconnect", onDisconnect)
  socket.on("connect", onConnect)
  socket.on("connect_error", onConnectError)
  socket.io.on("reconnect_attempt", onReconnectAttempt)
  socket.io.on("reconnect", onReconnect)

  return () => {
    socket.off("disconnect", onDisconnect)
    socket.off("connect", onConnect)
    socket.off("connect_error", onConnectError)
    socket.io.off("reconnect_attempt", onReconnectAttempt)
    socket.io.off("reconnect", onReconnect)
  }
}

/** Pause socket while tab is hidden; reconnect when user returns. */
export function bindSocketVisibilityPause(socket: Socket): () => void {
  if (typeof document === "undefined") return () => {}

  let pausedByVisibility = false

  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      if (socket.connected) {
        pausedByVisibility = true
        socket.disconnect()
      }
      return
    }

    if (document.visibilityState === "visible" && (pausedByVisibility || !socket.connected)) {
      pausedByVisibility = false
      socket.connect()
    }
  }

  document.addEventListener("visibilitychange", onVisibilityChange)
  return () => document.removeEventListener("visibilitychange", onVisibilityChange)
}
