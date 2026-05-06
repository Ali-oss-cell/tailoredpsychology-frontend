"use client"

import { ensureBackendAccessToken } from "@/src/patient/booking/api"

const DEFAULT_API_BASE = "http://localhost:3001/api"

function buildApiUrl(path: string): URL {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE
  const normalizedBase = base.endsWith("/") ? base : `${base}/`
  return new URL(path, normalizedBase)
}

export async function trackFrontendAnalyticsEvent(params: {
  name:
    | "intake_started"
    | "intake_submitted"
    | "booking_requested"
    | "booking_confirmed"
    | "session_started"
    | "session_completed"
    | "session_no_show"
    | "compare_cta_click"
    | "pricing_cta_click"
    | "condition_cta_click"
  targetId: string
  idempotencyKey?: string
  metadata?: Record<string, string | number | boolean | null>
}) {
  const token = await ensureBackendAccessToken()
  await fetch(buildApiUrl("analytics/events").toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    cache: "no-store",
  })
}
