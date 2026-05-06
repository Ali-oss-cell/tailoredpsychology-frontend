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

export type PsychologistWorkspaceItem = {
  appointmentId: string
  patientId: string
  startsAt: string
  risk: "none" | "urgent_support_needed"
  referralStatus: "missing_referral" | "linked_referral"
  intakeState: "missing" | "draft_in_progress" | "committed"
  readinessStatus: "ready" | "attention" | "unknown"
  readinessUpdatedAt?: string
  actions: string[]
}

export type PsychologistWorkspace = {
  psychologistId: string
  items: PsychologistWorkspaceItem[]
}

export type PsychologistWorkspaceQuery = {
  readinessStatus?: "ready" | "attention" | "unknown"
  staleMinutes?: number
  sortBy?: "startsAt" | "readinessUpdatedAt" | "readinessStatus"
  sortOrder?: "asc" | "desc"
}

export type PsychologistPatientContext = {
  psychologistId: string
  patientId: string
  patientDisplayName: string
  riskLevel: "low" | "medium" | "high"
  referralStatus: "missing_referral" | "linked_referral"
  readinessStatus: "ready" | "attention" | "unknown"
  careSignals: string[]
}

export async function getPsychologistWorkspace(
  psychologistId: string,
  query?: PsychologistWorkspaceQuery,
): Promise<PsychologistWorkspace> {
  const token = await ensureBackendAccessToken()
  const url = buildApiUrl(`psychologists/${psychologistId}/pre-session-workspace`)
  if (query?.readinessStatus) url.searchParams.set("readinessStatus", query.readinessStatus)
  if (typeof query?.staleMinutes === "number") url.searchParams.set("staleMinutes", String(query.staleMinutes))
  if (query?.sortBy) url.searchParams.set("sortBy", query.sortBy)
  if (query?.sortOrder) url.searchParams.set("sortOrder", query.sortOrder)

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get psychologist workspace failed (${response.status})`)
  return (await response.json()) as PsychologistWorkspace
}

export async function getPsychologistPatientContext(psychologistId: string, patientId: string): Promise<PsychologistPatientContext> {
  const token = await ensureBackendAccessToken()
  const url = buildApiUrl(`psychologists/${encodeURIComponent(psychologistId)}/patients/${encodeURIComponent(patientId)}/context`)
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get psychologist patient context failed (${response.status})`)
  return (await response.json()) as PsychologistPatientContext
}

export type PatientIntakeLatest = {
  patientId: string
  draftVersion: number
  data: Record<string, unknown>
  updatedAt: string
  committed: boolean
}

export async function getPatientIntakeLatest(patientId: string): Promise<PatientIntakeLatest> {
  const token = await ensureBackendAccessToken()
  const url = buildApiUrl(`patients/${encodeURIComponent(patientId)}/intake-latest`)
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get intake latest failed (${response.status})`)
  return (await response.json()) as PatientIntakeLatest
}
