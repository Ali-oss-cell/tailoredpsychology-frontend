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

export type PatientJourneyStep = {
  key: string
  status: "pending" | "done"
  occurredAt?: string
  label: string
}

export type PatientJourneyTimeline = {
  patientId: string
  steps: PatientJourneyStep[]
}

export async function getPatientJourneyTimeline(patientId: string): Promise<PatientJourneyTimeline> {
  const token = await ensureBackendAccessToken()
  const response = await fetch(buildApiUrl(`patients/${patientId}/journey-timeline`).toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get patient journey timeline failed (${response.status})`)
  return (await response.json()) as PatientJourneyTimeline
}
