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

export type ReferralQueueItem = {
  documentId: string
  patientId: string
  status: "received" | "review_needed" | "approved" | "rejected" | "info_requested"
  fileName: string
  fileSize: number
  mimeType: string
  sourceType?: string
  referralDate?: string
  notes?: string
  uploadedAt: string
  dueAt: string
  overdue: boolean
  assignedOwnerUserId?: string
  reviewedBy?: string
  reviewedAt?: string
  reviewReason?: string
  reviewNotes?: string
}

type ReferralAction = "approve" | "reject" | "request-info"
type ReferralOwnerFilter = "all" | "unreviewed" | "mine"
type ReferralOverdueFilter = "all" | "overdue" | "on-track"

export type ReferralQueueFilters = {
  status?: "all" | ReferralQueueItem["status"]
  owner?: ReferralOwnerFilter
  overdue?: ReferralOverdueFilter
}

export async function getReferralQueue(filters: ReferralQueueFilters = {}): Promise<ReferralQueueItem[]> {
  const url = buildApiUrl("ops/referrals")
  if (filters.status && filters.status !== "all") {
    url.searchParams.set("status", filters.status)
  }
  if (filters.owner && filters.owner !== "all") {
    url.searchParams.set("owner", filters.owner)
  }
  if (filters.overdue && filters.overdue !== "all") {
    url.searchParams.set("overdue", filters.overdue)
  }
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`Fetch referral queue failed (${response.status})`)
  }
  return (await response.json()) as ReferralQueueItem[]
}

export async function submitReferralAction(
  referralId: string,
  action: ReferralAction,
  payload: { reason?: string; notes?: string },
): Promise<ReferralQueueItem> {
  const response = await fetch(buildApiUrl(`ops/referrals/${encodeURIComponent(referralId)}/${action}`).toString(), {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`Referral ${action} failed (${response.status})`)
  }
  return (await response.json()) as ReferralQueueItem
}
