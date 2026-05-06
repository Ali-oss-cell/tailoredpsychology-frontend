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

export type AdminPsychologistUser = {
  id: string
  email: string
  displayName: string
  registrationNumber: string
  providerNumber: string
  specialties: string[]
  status: "active" | "inactive"
}

export async function getAdminPsychologistUsers(): Promise<AdminPsychologistUser[]> {
  const response = await fetch(buildApiUrl("admin/users/psychologists").toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`List psychologists failed (${response.status})`)
  return (await response.json()) as AdminPsychologistUser[]
}

export async function createAdminPsychologistUser(payload: Omit<AdminPsychologistUser, "id">): Promise<AdminPsychologistUser> {
  const response = await fetch(buildApiUrl("admin/users/psychologists").toString(), {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Create psychologist failed (${response.status})`)
  return (await response.json()) as AdminPsychologistUser
}

export async function updateAdminPsychologistUser(
  id: string,
  payload: Omit<AdminPsychologistUser, "id" | "email">,
): Promise<AdminPsychologistUser> {
  const response = await fetch(buildApiUrl(`admin/users/psychologists/${encodeURIComponent(id)}`).toString(), {
    method: "PATCH",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Update psychologist failed (${response.status})`)
  return (await response.json()) as AdminPsychologistUser
}
