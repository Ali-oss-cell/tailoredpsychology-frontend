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

export type PatientCareClinician = {
  clinicianId: string
  psychologistUserId: string
  displayName: string
  registrationNumber?: string
  providerNumber?: string
  specialties: string[]
  bio?: string
  profileImageUrl?: string
  accountStatus: "active" | "inactive" | "unknown"
  nextSessionAt?: string
  lastSessionAt?: string
}

export async function getMyCareTeam(): Promise<PatientCareClinician[]> {
  const response = await fetch(buildApiUrl("patients/me/care-team").toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get care team failed (${response.status})`)
  return (await response.json()) as PatientCareClinician[]
}
