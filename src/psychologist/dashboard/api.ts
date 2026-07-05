"use client"

import { ensureBackendAccessToken } from "@/src/patient/booking/api"
import type { SessionSummary } from "@/src/sessions/api"

const DEFAULT_API_BASE = "http://localhost:3001/api"

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE
}

function buildApiUrl(path: string): URL {
  const base = getApiBaseUrl()
  const normalizedBase = base.endsWith("/") ? base : `${base}/`
  return new URL(path, normalizedBase)
}

export type SessionWindowSnapshot = {
  status: "locked" | "open" | "closed"
  opensAt: string
  closesAt: string
}

export type PsychologistNextSession = SessionSummary & {
  window: SessionWindowSnapshot
}

export type PsychologistDashboardSnapshot = {
  user: { userId: string; displayName: string }
  sessions: {
    totalCount: number
    todayCount: number
    upcomingCount: number
    completedCount: number
  }
  todaySchedule: SessionSummary[]
  nextSession: PsychologistNextSession | null
  notes: { pendingCount: number; signedCount: number }
  workspace: { prepCount: number; attentionCount: number; itemCount: number }
  generatedAt: string
}

export async function getPsychologistDashboard(): Promise<PsychologistDashboardSnapshot> {
  const token = await ensureBackendAccessToken()
  const response = await fetch(buildApiUrl("psychologists/me/dashboard").toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get psychologist dashboard failed (${response.status})`)
  return (await response.json()) as PsychologistDashboardSnapshot
}
