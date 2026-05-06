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

async function authJsonHeaders(): Promise<Record<string, string>> {
  const token = await ensureBackendAccessToken()
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

export type MoodCheckinItem = {
  id: string
  moodLabel: string
  createdAt: string
}

export async function getMoodCheckins(patientId: string, limit = 14): Promise<{ items: MoodCheckinItem[] }> {
  const url = buildApiUrl(`patients/${patientId}/mood-checkins`)
  url.searchParams.set("limit", String(limit))
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: await authJsonHeaders(),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`Fetch mood check-ins failed (${response.status})`)
  }
  return (await response.json()) as { items: MoodCheckinItem[] }
}

export async function postMoodCheckin(patientId: string, moodLabel: string): Promise<MoodCheckinItem> {
  const url = buildApiUrl(`patients/${patientId}/mood-checkins`)
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: await authJsonHeaders(),
    body: JSON.stringify({ moodLabel }),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`Save mood check-in failed (${response.status})`)
  }
  return (await response.json()) as MoodCheckinItem
}
