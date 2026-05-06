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

export type SessionVideoItem = {
  videoId: string
  sessionId: string
  patientId: string
  clinicianId: string
  sessionDate: string
  policyStatus: "active" | "hold" | "purge_pending"
  canDownload: boolean
  policyReason?: string
  watermarkRequired: boolean
  watermarkText: string
  transcriptReady: boolean
}

export type SessionVideoAccessGrant = {
  videoId: string
  canDownload: boolean
  denialReason?: string
  accessToken?: string
  expiresAt?: string
  watermarkText?: string
  downloadUrl?: string
}

export async function getPsychologistSessionVideos(psychologistId: string): Promise<SessionVideoItem[]> {
  const response = await fetch(buildApiUrl(`psychologists/${encodeURIComponent(psychologistId)}/session-videos`).toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get psychologist session videos failed (${response.status})`)
  return (await response.json()) as SessionVideoItem[]
}

export async function getPatientSessionVideos(patientId: string): Promise<SessionVideoItem[]> {
  const response = await fetch(buildApiUrl(`patients/${encodeURIComponent(patientId)}/session-videos`).toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get patient session videos failed (${response.status})`)
  return (await response.json()) as SessionVideoItem[]
}

export async function requestSessionVideoAccess(videoId: string): Promise<SessionVideoAccessGrant> {
  const response = await fetch(buildApiUrl(`session-videos/${encodeURIComponent(videoId)}/access`).toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Request session video access failed (${response.status})`)
  return (await response.json()) as SessionVideoAccessGrant
}
