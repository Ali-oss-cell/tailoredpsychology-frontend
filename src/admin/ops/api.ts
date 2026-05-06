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

export type AuditEvent = {
  eventId: string
  actorUserId: string
  actorRole: string
  action: string
  targetType: string
  targetId: string
  occurredAt: string
}

export type PatientRetentionStatus = {
  patientId: string
  deletedAt: string | null
  deletionReason: string | null
  legalHoldActive: boolean
  retentionUntil: string | null
  purgeEligible: boolean
}

export type AdminAppointmentItem = {
  appointmentId: string
  patientId: string
  patientName: string
  clinicianId: string
  clinicianName: string
  scheduledStartAt: string
  status: string
}

export type AdminPatientItem = {
  patientId: string
  displayName: string
  email: string
  intakeState: "draft_in_progress" | "committed" | "none"
  retentionStatus: "active" | "deleted" | "legal_hold" | "purge_pending"
  legalHoldActive: boolean
}

export type AdminStaffItem = {
  userId: string
  displayName: string
  email: string
  role: string
  status: string
}

export type AdminResourceItem = {
  resourceId: string
  title: string
  state: string
  owner: string
  updatedAt: string
}

export type AdminDeletionQueueItem = {
  patientId: string
  deletedAt: string | null
  retentionUntil: string | null
  legalHoldActive: boolean
  purgeEligible: boolean
}

export type AdminBillingSummary = {
  revenueToday: number
  revenueWeek: number
  revenueMonth: number
  failedPayments: number
  pendingClaims: number
}

export type AdminAnalyticsSummary = {
  totalAnalyticsEvents: number
  totalAuditEvents: number
  bookingRequested: number
  joinFailures: number
}

export type AdminSettingsDomain = {
  key: string
  value: string
  editable: boolean
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(buildApiUrl(path).toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`GET ${path} failed (${response.status})`)
  return (await response.json()) as T
}

export function getAuditEvents(): Promise<AuditEvent[]> {
  return getJson<AuditEvent[]>("audit/events")
}

export function getRetentionStatus(patientId: string): Promise<PatientRetentionStatus> {
  return getJson<PatientRetentionStatus>(`admin/patients/${encodeURIComponent(patientId)}/retention-status`)
}

export function getPurgeEligible(): Promise<PatientRetentionStatus[]> {
  return getJson<PatientRetentionStatus[]>("admin/patients/purge-eligible")
}

export function getAdminOpsAppointments(): Promise<AdminAppointmentItem[]> {
  return getJson<AdminAppointmentItem[]>("admin/ops/appointments")
}

export function getAdminOpsPatients(): Promise<AdminPatientItem[]> {
  return getJson<AdminPatientItem[]>("admin/ops/patients")
}

export function getAdminOpsStaff(): Promise<AdminStaffItem[]> {
  return getJson<AdminStaffItem[]>("admin/ops/staff")
}

export function getAdminOpsSettings(): Promise<AdminSettingsDomain[]> {
  return getJson<AdminSettingsDomain[]>("admin/ops/settings")
}

export function getAdminOpsResources(): Promise<AdminResourceItem[]> {
  return getJson<AdminResourceItem[]>("admin/ops/resources")
}

export function getAdminDeletionQueue(state: "all" | "deleted" | "legal_hold" | "purge_eligible" = "all"): Promise<AdminDeletionQueueItem[]> {
  const path = state === "all" ? "admin/ops/deletion-queue" : `admin/ops/deletion-queue?state=${state}`
  return getJson<AdminDeletionQueueItem[]>(path)
}

export function getAdminOpsBilling(): Promise<AdminBillingSummary> {
  return getJson<AdminBillingSummary>("admin/ops/billing")
}

export function getAdminAnalyticsSummary(): Promise<AdminAnalyticsSummary> {
  return getJson<AdminAnalyticsSummary>("admin/ops/analytics-summary")
}
