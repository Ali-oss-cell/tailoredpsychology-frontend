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

export type SecurityIncident = {
  incidentId: string
  title: string
  summary: string
  severity: "low" | "medium" | "high" | "critical"
  impact: "low" | "moderate" | "severe"
  status: "reported" | "triage" | "investigating" | "notification_assessment" | "notification_ready" | "closed"
  ndbAssessment: "not_required" | "assessment_in_progress" | "eligible_for_notification" | "notifiable"
  containsPersonalData: boolean
  assignedOwnerUserId?: string
  resolutionNotes?: string
  detectedAt: string
  createdAt: string
  updatedAt: string
  closedAt?: string
}

export async function createSecurityIncident(payload: {
  title: string
  summary: string
  severity: SecurityIncident["severity"]
  impact: SecurityIncident["impact"]
  containsPersonalData: boolean
}): Promise<SecurityIncident> {
  const response = await fetch(buildApiUrl("admin/security-incidents").toString(), {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Create security incident failed (${response.status})`)
  return (await response.json()) as SecurityIncident
}

export async function getSecurityIncidents(): Promise<SecurityIncident[]> {
  const response = await fetch(buildApiUrl("admin/security-incidents").toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get security incidents failed (${response.status})`)
  return (await response.json()) as SecurityIncident[]
}

export async function updateSecurityIncident(
  incidentId: string,
  payload: Partial<Pick<SecurityIncident, "status" | "impact" | "ndbAssessment" | "assignedOwnerUserId" | "resolutionNotes">>,
): Promise<SecurityIncident> {
  const response = await fetch(buildApiUrl(`admin/security-incidents/${encodeURIComponent(incidentId)}`).toString(), {
    method: "PATCH",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Update security incident failed (${response.status})`)
  return (await response.json()) as SecurityIncident
}
