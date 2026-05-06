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

export type PatientDataRequest = {
  requestId: string
  patientId: string
  requestType: "access" | "correction"
  status: "submitted" | "triage_review" | "in_progress" | "fulfilled" | "rejected" | "cancelled"
  details: string
  requestedCorrection?: string
  triageOwnerUserId?: string
  resolutionNotes?: string
  slaDueAt: string
  triagedAt?: string
  resolvedAt?: string
  createdAt: string
  updatedAt: string
}

export async function createPatientDataRequest(payload: {
  requestType: "access" | "correction"
  details: string
  requestedCorrection?: string
}): Promise<PatientDataRequest> {
  const response = await fetch(buildApiUrl("patients/me/data-requests").toString(), {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Create patient data request failed (${response.status})`)
  return (await response.json()) as PatientDataRequest
}

export async function getMyPatientDataRequests(): Promise<PatientDataRequest[]> {
  const response = await fetch(buildApiUrl("patients/me/data-requests").toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get patient data requests failed (${response.status})`)
  return (await response.json()) as PatientDataRequest[]
}

export async function getOpsPatientDataRequests(): Promise<PatientDataRequest[]> {
  const response = await fetch(buildApiUrl("admin/patient-data-requests").toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get ops patient data requests failed (${response.status})`)
  return (await response.json()) as PatientDataRequest[]
}

export async function submitOpsPatientDataRequestAction(
  requestId: string,
  payload: { action: "assign" | "start_review" | "fulfill" | "reject" | "cancel"; notes?: string; reason?: string },
): Promise<PatientDataRequest> {
  const response = await fetch(buildApiUrl(`admin/patient-data-requests/${encodeURIComponent(requestId)}/actions`).toString(), {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Apply request action failed (${response.status})`)
  return (await response.json()) as PatientDataRequest
}
