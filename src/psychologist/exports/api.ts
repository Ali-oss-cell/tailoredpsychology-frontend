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

export type PsychologistPatientExportStatus = {
  jobId: string
  status: "queued" | "processing" | "ready" | "failed"
  requestedAt: string
  completedAt?: string
  expiresAt?: string
}

export async function requestPsychologistPatientExport(psychologistId: string, patientId: string): Promise<{ jobId: string; status: string }> {
  const response = await fetch(
    buildApiUrl(`psychologists/${encodeURIComponent(psychologistId)}/patients/${encodeURIComponent(patientId)}/data-export`).toString(),
    {
      method: "POST",
      headers: await authHeaders(),
      cache: "no-store",
    },
  )
  if (!response.ok) throw new Error(`Request psychologist patient export failed (${response.status})`)
  return (await response.json()) as { jobId: string; status: string }
}

export async function getPsychologistPatientExportStatus(
  psychologistId: string,
  patientId: string,
  jobId: string,
): Promise<PsychologistPatientExportStatus> {
  const response = await fetch(
    buildApiUrl(
      `psychologists/${encodeURIComponent(psychologistId)}/patients/${encodeURIComponent(patientId)}/data-export/${encodeURIComponent(jobId)}`,
    ).toString(),
    {
      method: "GET",
      headers: await authHeaders(),
      cache: "no-store",
    },
  )
  if (!response.ok) throw new Error(`Get psychologist patient export status failed (${response.status})`)
  return (await response.json()) as PsychologistPatientExportStatus
}

export async function downloadPsychologistPatientExport(
  psychologistId: string,
  patientId: string,
  jobId: string,
): Promise<{ blob: Blob; fileName: string | null }> {
  const response = await fetch(
    buildApiUrl(
      `psychologists/${encodeURIComponent(psychologistId)}/patients/${encodeURIComponent(patientId)}/data-export/${encodeURIComponent(jobId)}/download`,
    ).toString(),
    {
      method: "GET",
      headers: await authHeaders(),
      cache: "no-store",
    },
  )
  if (!response.ok) throw new Error(`Download psychologist patient export failed (${response.status})`)
  const contentDisposition = response.headers.get("Content-Disposition")
  const fileNameMatch = contentDisposition?.match(/filename=\"([^\"]+)\"/)
  const fileName = fileNameMatch?.[1] ?? null
  return { blob: await response.blob(), fileName }
}
