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

export type PsychologistProfile = {
  psychologistId: string
  email: string
  displayName: string
  registrationNumber: string
  providerNumber: string
  specialties: string[]
  status: "active" | "inactive"
  bio: string
  profileImageUrl?: string
}

export async function getPsychologistProfile(): Promise<PsychologistProfile> {
  const response = await fetch(buildApiUrl("psychologists/me/profile").toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get psychologist profile failed (${response.status})`)
  return (await response.json()) as PsychologistProfile
}

export async function updatePsychologistProfile(
  payload: Partial<
    Pick<PsychologistProfile, "displayName" | "registrationNumber" | "providerNumber" | "specialties" | "status" | "bio" | "profileImageUrl">
  >,
): Promise<PsychologistProfile> {
  const response = await fetch(buildApiUrl("psychologists/me/profile").toString(), {
    method: "PATCH",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Update psychologist profile failed (${response.status})`)
  return (await response.json()) as PsychologistProfile
}

export async function uploadPsychologistProfileAvatar(file: File): Promise<PsychologistProfile> {
  const token = await ensureBackendAccessToken()
  const body = new FormData()
  body.append("file", file)
  const response = await fetch(buildApiUrl("psychologists/me/profile/avatar").toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Upload profile photo failed (${response.status})`)
  return (await response.json()) as PsychologistProfile
}
