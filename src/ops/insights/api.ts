"use client"

import { ensureBackendAccessToken } from "@/src/patient/booking/api"

const DEFAULT_API_BASE = "http://localhost:3001/api"

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE
}

function buildApiUrl(path: string): URL {
  const base = getApiBaseUrl()
  const normalizedBase = base.endsWith("/") ? base : `${base}/`
  return new URL(path, normalizedBase)
}

export type OpsInsights = {
  queueTotal: number
  urgentRiskCount: number
  staleQueueCount: number
  bookingRequestedCount: number
  bookingConfirmedCount: number
  sessionNoShowCount: number
}

export type TelehealthInsights = {
  totalJoinAttempts: number
  warnedJoinCount: number
  warnedJoinRate: number
  failedJoinCount: number
  lateJoinCount: number
  recoveryRate: number
  last24h: {
    totalJoinAttempts: number
    warnedJoinCount: number
    warnedJoinRate: number
    failedJoinCount: number
    lateJoinCount: number
    recoveryRate: number
  }
  last7d: {
    totalJoinAttempts: number
    warnedJoinCount: number
    warnedJoinRate: number
    failedJoinCount: number
    lateJoinCount: number
    recoveryRate: number
  }
  clinicianBreakdown: Array<{
    clinicianId: string
    totalJoinAttempts: number
    warnedJoinCount: number
    warnedJoinRate: number
    failedJoinCount: number
    recoveryRate: number
  }>
}

export async function getOpsInsights(): Promise<OpsInsights> {
  const token = await ensureBackendAccessToken()
  const response = await fetch(buildApiUrl("ops/insights").toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get ops insights failed (${response.status})`)
  return (await response.json()) as OpsInsights
}

export async function getTelehealthInsights(): Promise<TelehealthInsights> {
  const token = await ensureBackendAccessToken()
  const response = await fetch(buildApiUrl("ops/telehealth-insights").toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get telehealth insights failed (${response.status})`)
  return (await response.json()) as TelehealthInsights
}
