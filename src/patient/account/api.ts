"use client"

import {
  parseCurrentUser,
  type CurrentUser,
  type PatientContactProfile,
} from "@/src/auth/current-user"
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

export type PatchAuthProfilePayload = {
  displayName: string
  patientContactProfile?: PatientContactProfile
}

export type PatientDataExportJob = {
  jobId: string
  status: "queued" | "processing" | "ready" | "failed"
  requestedAt?: string
  completedAt?: string
  expiresAt?: string
}

export async function patchAuthProfile(payload: PatchAuthProfilePayload): Promise<CurrentUser> {
  const body: Record<string, unknown> = { displayName: payload.displayName }
  if (payload.patientContactProfile) {
    body.patientContactProfile = payload.patientContactProfile
  }
  const response = await fetch(buildApiUrl("auth/profile").toString(), {
    method: "PATCH",
    headers: await authJsonHeaders(),
    body: JSON.stringify(body),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Update profile failed (${response.status})`)
  return parseCurrentUser(await response.json())
}

export async function postChangePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  const response = await fetch(buildApiUrl("auth/change-password").toString(), {
    method: "POST",
    headers: await authJsonHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Change password failed (${response.status})`)
  return (await response.json()) as { message: string }
}

export async function requestPatientDataExport(): Promise<PatientDataExportJob> {
  const response = await fetch(buildApiUrl("patients/me/data-export").toString(), {
    method: "POST",
    headers: await authJsonHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Request export failed (${response.status})`)
  return (await response.json()) as PatientDataExportJob
}

export async function getPatientDataExportStatus(jobId: string): Promise<PatientDataExportJob> {
  const response = await fetch(buildApiUrl(`patients/me/data-export/${encodeURIComponent(jobId)}`).toString(), {
    method: "GET",
    headers: await authJsonHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get export status failed (${response.status})`)
  return (await response.json()) as PatientDataExportJob
}

export async function downloadPatientDataExport(jobId: string): Promise<void> {
  const response = await fetch(buildApiUrl(`patients/me/data-export/${encodeURIComponent(jobId)}/download`).toString(), {
    method: "GET",
    headers: await authJsonHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Download export failed (${response.status})`)
  const blob = await response.blob()
  const href = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = href
  anchor.download = `clink-patient-data-export-${jobId}.pdf`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(href)
}
