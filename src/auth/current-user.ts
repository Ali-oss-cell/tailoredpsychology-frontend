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

export type PreferredContactMethod = "email" | "sms" | "phone"

export type PatientContactProfile = {
  phoneMobile: string
  preferredContactMethod: PreferredContactMethod
  accessibilityNotes: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
}

export function emptyPatientContactProfile(): PatientContactProfile {
  return {
    phoneMobile: "",
    preferredContactMethod: "email",
    accessibilityNotes: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
  }
}

export type PatientDemographics = {
  dateOfBirth: string
  indigenousStatus: string
  state: string
  suburb: string
}

export function emptyPatientDemographics(): PatientDemographics {
  return {
    dateOfBirth: "",
    indigenousStatus: "",
    state: "",
    suburb: "",
  }
}

export type CurrentUser = {
  id: string
  email: string
  displayName: string
  role: "patient" | "psychologist" | "practice_manager" | "admin"
  /** False for new patients until POST /auth/onboarding-complete; omitted legacy responses treated as complete. */
  accountSetupComplete: boolean
  /** Present for patient accounts from the API. */
  patientContactProfile?: PatientContactProfile
  /** Present for patient accounts from the API (committed intake demographics). */
  patientDemographics?: PatientDemographics
}

function parsePatientDemographics(raw: unknown): PatientDemographics | undefined {
  if (!raw || typeof raw !== "object") return undefined
  const o = raw as Record<string, unknown>
  return {
    dateOfBirth: typeof o.dateOfBirth === "string" ? o.dateOfBirth : "",
    indigenousStatus: typeof o.indigenousStatus === "string" ? o.indigenousStatus : "",
    state: typeof o.state === "string" ? o.state : "",
    suburb: typeof o.suburb === "string" ? o.suburb : "",
  }
}

function parsePatientContactProfile(raw: unknown): PatientContactProfile | undefined {
  if (!raw || typeof raw !== "object") return undefined
  const o = raw as Record<string, unknown>
  const method = o.preferredContactMethod
  const preferredContactMethod =
    method === "email" || method === "sms" || method === "phone" ? method : "email"
  return {
    phoneMobile: typeof o.phoneMobile === "string" ? o.phoneMobile : "",
    preferredContactMethod,
    accessibilityNotes: typeof o.accessibilityNotes === "string" ? o.accessibilityNotes : "",
    emergencyContactName: typeof o.emergencyContactName === "string" ? o.emergencyContactName : "",
    emergencyContactPhone: typeof o.emergencyContactPhone === "string" ? o.emergencyContactPhone : "",
    emergencyContactRelationship:
      typeof o.emergencyContactRelationship === "string" ? o.emergencyContactRelationship : "",
  }
}

export function parseCurrentUser(payload: unknown): CurrentUser {
  const row = payload as Partial<CurrentUser> & Pick<CurrentUser, "id" | "email" | "displayName" | "role">
  const parsedPatient = row.role === "patient" ? parsePatientContactProfile(row.patientContactProfile) : undefined
  const parsedDemographics =
    row.role === "patient" ? parsePatientDemographics(row.patientDemographics) : undefined
  return {
    id: row.id,
    email: row.email,
    displayName: row.displayName,
    role: row.role,
    accountSetupComplete: row.accountSetupComplete !== false,
    ...(row.role === "patient"
      ? {
          patientContactProfile: parsedPatient ?? emptyPatientContactProfile(),
          patientDemographics: parsedDemographics ?? emptyPatientDemographics(),
        }
      : {}),
  }
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const token = await ensureBackendAccessToken()
  const response = await fetch(buildApiUrl("auth/me").toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Get current user failed (${response.status})`)
  return parseCurrentUser(await response.json())
}

/** No-op compatibility POST; `accountSetupComplete` reflects saved intake + profile rules from the server. */
export async function completeAccountOnboarding(): Promise<CurrentUser> {
  const token = await ensureBackendAccessToken()
  const response = await fetch(buildApiUrl("auth/onboarding-complete").toString(), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Complete onboarding failed (${response.status})`)
  return parseCurrentUser(await response.json())
}
