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

export type PsychologistReferral = {
  documentId: string
  patientId: string
  status: string
  sourceType: string
  uploadedAt: string
  dueAt: string
}

export async function getPsychologistReferrals(psychologistId: string): Promise<PsychologistReferral[]> {
  const token = await ensureBackendAccessToken()
  const response = await fetch(buildApiUrl(`psychologists/${encodeURIComponent(psychologistId)}/referrals`).toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get psychologist referrals failed (${response.status})`)
  return (await response.json()) as PsychologistReferral[]
}
