"use client"

import { ensureBackendAccessToken } from "@/src/patient/booking/api"

const DEFAULT_API_BASE = "http://localhost:3001/api"

export type IntakeQueueItem = {
  queueItemId: string
  sourceType: "booking_request" | "intake_draft"
  sourceId: string
  patientId: string
  state: string
  risk: "none" | "urgent_support_needed"
  referralStatus: "missing_referral" | "linked_referral"
  medicareUncertain: boolean
  assignedClinicianId?: string
  updatedAt: string
}

export type AssignableClinician = {
  clinicianId: string
  displayName: string
  specialties: string[]
}

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

export async function getIntakeQueue(params: {
  risk?: string
  referralStatus?: string
  medicareUncertain?: string
  assignedClinicianId?: string
} = {}): Promise<IntakeQueueItem[]> {
  const url = buildApiUrl("ops/intake-queue")
  if (params.risk) url.searchParams.set("risk", params.risk)
  if (params.referralStatus) url.searchParams.set("referralStatus", params.referralStatus)
  if (params.medicareUncertain) url.searchParams.set("medicareUncertain", params.medicareUncertain)
  if (params.assignedClinicianId) url.searchParams.set("assignedClinicianId", params.assignedClinicianId)
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`Fetch intake queue failed (${response.status})`)
  }
  return (await response.json()) as IntakeQueueItem[]
}

export async function assignIntakeQueueItem(queueItemId: string, assignedClinicianId: string): Promise<IntakeQueueItem> {
  const url = buildApiUrl(`ops/intake-queue/${encodeURIComponent(queueItemId)}/assign`)
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ assignedClinicianId }),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`Assign queue item failed (${response.status})`)
  }
  return (await response.json()) as IntakeQueueItem
}

export async function getAssignableClinicians(): Promise<AssignableClinician[]> {
  const url = buildApiUrl("ops/intake-queue/assignable-clinicians")
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`Fetch assignable clinicians failed (${response.status})`)
  }
  return (await response.json()) as AssignableClinician[]
}
