"use client"

import { ensureBackendAccessToken } from "@/src/patient/booking/api"
import type { PatientAppointmentSummary } from "@/src/patient/booking/api"
import type { InvoiceSummary } from "@/src/patient/billing/api"

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

export type PatientNextSession = PatientAppointmentSummary & {
  window: SessionWindowSnapshot
}

export type PatientJourneySnapshotStep = {
  key: string
  label: string
  status: "pending" | "done"
  occurredAt?: string
}

export type PatientDashboardSnapshot = {
  user: { userId: string; displayName: string }
  nextSession: PatientNextSession | null
  journey: { patientId: string; steps: PatientJourneySnapshotStep[] }
  billing: {
    latestInvoice: InvoiceSummary | null
    unpaidCount: number
    invoiceCount: number
  }
  generatedAt: string
}

/** Consolidated dashboard snapshot — one round trip, one loading state. */
export async function getPatientDashboard(): Promise<PatientDashboardSnapshot> {
  const token = await ensureBackendAccessToken()
  const response = await fetch(buildApiUrl("patients/me/dashboard").toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get patient dashboard failed (${response.status})`)
  return (await response.json()) as PatientDashboardSnapshot
}
