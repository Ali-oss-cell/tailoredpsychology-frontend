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

export type PsychologistNote = {
  noteId: string
  psychologistId: string
  patientId: string
  sessionId: string
  status: "draft" | "ready_for_signoff" | "signed"
  body: string
  updatedAt: string
  signedAt?: string
}

export async function getPsychologistNotes(psychologistId: string): Promise<PsychologistNote[]> {
  const response = await fetch(buildApiUrl(`psychologists/${encodeURIComponent(psychologistId)}/notes`).toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get psychologist notes failed (${response.status})`)
  return (await response.json()) as PsychologistNote[]
}

export async function createPsychologistNote(
  psychologistId: string,
  payload: { patientId: string; sessionId: string; status: "draft" | "ready_for_signoff"; body: string },
): Promise<PsychologistNote> {
  const response = await fetch(buildApiUrl(`psychologists/${encodeURIComponent(psychologistId)}/notes`).toString(), {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Create psychologist note failed (${response.status})`)
  return (await response.json()) as PsychologistNote
}

export async function signPsychologistNote(psychologistId: string, noteId: string): Promise<PsychologistNote> {
  const response = await fetch(
    buildApiUrl(`psychologists/${encodeURIComponent(psychologistId)}/notes/${encodeURIComponent(noteId)}/sign`).toString(),
    {
      method: "POST",
      headers: await authHeaders(),
      cache: "no-store",
    },
  )
  if (!response.ok) throw new Error(`Sign psychologist note failed (${response.status})`)
  return (await response.json()) as PsychologistNote
}

export async function getPsychologistNote(psychologistId: string, noteId: string): Promise<PsychologistNote> {
  const response = await fetch(
    buildApiUrl(`psychologists/${encodeURIComponent(psychologistId)}/notes/${encodeURIComponent(noteId)}`).toString(),
    {
      method: "GET",
      headers: await authHeaders(),
      cache: "no-store",
    },
  )
  if (!response.ok) throw new Error(`Get psychologist note failed (${response.status})`)
  return (await response.json()) as PsychologistNote
}

export async function updatePsychologistNote(
  psychologistId: string,
  noteId: string,
  payload: Partial<Pick<PsychologistNote, "body" | "status">>,
): Promise<PsychologistNote> {
  const response = await fetch(
    buildApiUrl(`psychologists/${encodeURIComponent(psychologistId)}/notes/${encodeURIComponent(noteId)}`).toString(),
    {
      method: "PATCH",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  )
  if (!response.ok) throw new Error(`Update psychologist note failed (${response.status})`)
  return (await response.json()) as PsychologistNote
}
