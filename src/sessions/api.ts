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

async function authHeaders(): Promise<Record<string, string>> {
  const token = await ensureBackendAccessToken()
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

export type SessionSummary = {
  sessionId: string
  scheduledStartAt: string
  scheduledEndAt: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "no_show"
  clinicianId: string
  patientId: string
}

export type SessionDetail = {
  sessionId: string
  patientId: string
  clinicianId: string
  scheduledStartAt: string
  scheduledEndAt: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "no_show"
  sessionTypeLabel: string
  viewerAccessMode: "owner_patient" | "assigned_psychologist" | "ops"
}

export async function getPatientSessions(patientId: string): Promise<SessionSummary[]> {
  const response = await fetch(buildApiUrl(`patients/${encodeURIComponent(patientId)}/sessions`).toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get patient sessions failed (${response.status})`)
  return (await response.json()) as SessionSummary[]
}

export async function getPsychologistSessions(psychologistId: string): Promise<SessionSummary[]> {
  const response = await fetch(buildApiUrl(`psychologists/${encodeURIComponent(psychologistId)}/sessions`).toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get psychologist sessions failed (${response.status})`)
  return (await response.json()) as SessionSummary[]
}

export async function getSessionDetail(sessionId: string): Promise<SessionDetail> {
  const response = await fetch(buildApiUrl(`sessions/${encodeURIComponent(sessionId)}`).toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get session detail failed (${response.status})`)
  return (await response.json()) as SessionDetail
}
