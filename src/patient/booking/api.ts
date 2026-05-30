import {
  clearBackendAccessTokenInSessionStorage,
  getBackendAccessTokenFromSessionStorage,
  getBackendRoleFromSessionStorage,
  isBackendAccessTokenExpired,
  setBackendAccessTokenInSessionStorage,
} from "@/src/auth/backend-session"
import { ChatAccessError, chatAccessMessage } from "@/src/session/chat-errors"

export type AvailabilitySlot = {
  slotId: string
  date: string
  startTime: string
  endTime: string
  available: boolean
}

export type ClinicianAvailabilityResponse = {
  clinicianId: string
  clinicianName: string
  slots: AvailabilitySlot[]
  specialties?: string[]
  bio?: string
  profileImageUrl?: string
}

export type CreateBookingRequestPayload = {
  clinicianId: string
  slotId: string
  appointmentDate: string
  notes?: string
  idempotencyKey?: string
  timezone?: string
  referralDocumentId?: string
}

export type BookingRequestCreatedResponse = {
  bookingRequestId: string
  state: "pending_payment" | "submitted" | "triage_review" | "matched_pending_confirmation" | "appointment_confirmed" | "payment_abandoned"
  createdAt: string
  idempotentReplay: boolean
}

export type BookingRequestStatusResponse = {
  bookingRequestId: string
  state: "pending_payment" | "submitted" | "triage_review" | "matched_pending_confirmation" | "appointment_confirmed" | "payment_abandoned"
  lastUpdated: string
  nextAction: string
  clinicianId: string
  slotId: string
  appointmentDate: string
  referralDocumentId?: string
}

export type ReferralDocumentResponse = {
  documentId: string
  status: "received" | "review_needed" | "valid" | "expired" | "rejected"
  fileName: string
  fileSize: number
  mimeType: string
  uploadedAt: string
}

type GetAvailabilityParams = {
  startDate: string
  endDate: string
  clinicianId?: string
  timezone?: string
}

const DEFAULT_API_BASE = "http://localhost:3001/api"

const DEMO_ROLE_CREDENTIALS: Record<string, { email: string; password: string }> = {
  patient: { email: "patient@clink.test", password: "Patient123!" },
  psychologist: { email: "psychologist@clink.test", password: "Psych123!" },
  practice_manager: { email: "manager@clink.test", password: "Manager123!" },
  admin: { email: "admin@clink.test", password: "Admin123!" },
}

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE
}

function buildApiUrl(path: string): URL {
  const base = getApiBaseUrl()
  const normalizedBase = base.endsWith("/") ? base : `${base}/`
  return new URL(path, normalizedBase)
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null
  }

  const entries = document.cookie.split(";").map((item) => item.trim())
  const match = entries.find((entry) => entry.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.split("=")[1]) : null
}

function isLocalDevApi(): boolean {
  const base = getApiBaseUrl()
  return base.includes("localhost") || base.includes("127.0.0.1")
}

export async function ensureBackendAccessToken(): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("Backend token is only available in browser context")
  }

  const cached = getBackendAccessTokenFromSessionStorage()
  if (cached && !isBackendAccessTokenExpired(cached)) {
    return cached
  }
  if (cached) {
    clearBackendAccessTokenInSessionStorage()
  }

  if (!isLocalDevApi()) {
    throw new Error("Session expired. Please log out and sign in again.")
  }

  const cookieRole = readCookie("clink_role")
  const storedRole = getBackendRoleFromSessionStorage()
  const role = cookieRole ?? storedRole
  const creds =
    role && role in DEMO_ROLE_CREDENTIALS ? DEMO_ROLE_CREDENTIALS[role as keyof typeof DEMO_ROLE_CREDENTIALS] : null
  if (!creds) {
    throw new Error("No supported authenticated role found for booking API")
  }

  const loginUrl = buildApiUrl("auth/login")
  const response = await fetch(loginUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(creds),
    credentials: "include",
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Backend auth failed (${response.status})`)
  }

  const payload = (await response.json()) as { accessToken?: string }
  if (!payload.accessToken) {
    throw new Error("Backend auth response missing access token")
  }

  setBackendAccessTokenInSessionStorage(payload.accessToken)
  return payload.accessToken
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await ensureBackendAccessToken()
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

export type ChatWindowResponse = {
  appointmentId: string
  status: "locked" | "open" | "closed"
  opensAt: string
  closesAt: string
  reason: string
  messageCount: number
}

export type TelehealthReadinessResponse = {
  appointmentId: string
  overallStatus: "ready" | "attention"
  checks: Array<{
    key: "camera" | "microphone" | "network" | "session_window"
    status: "pass" | "review"
    message: string
  }>
  guidance: string
  updatedAt: string
}

export type SaveTelehealthReadinessPayload = {
  overallStatus: "ready" | "attention"
  checks: TelehealthReadinessResponse["checks"]
}

export type ChatMessageResponse = {
  messageId: string
  appointmentId: string
  authorUserId: string
  authorRole: "patient" | "psychologist" | "practice_manager" | "admin"
  message: string
  createdAt: string
}

export type JoinAttemptPayload = {
  channel: "video" | "chat"
  acknowledgementNote?: string
  overrideReason?: string
}

export type JoinAttemptDecisionResponse = {
  appointmentId: string
  allowed: boolean
  policyMode: "warn_allow"
  readinessStatus: "ready" | "attention" | "unknown"
  windowStatus: "locked" | "open" | "closed"
  reasons: string[]
  recordedAt: string
}

export type JoinSessionPayload = {
  channel: "video" | "chat"
  overrideReason?: string
}

export type JoinSessionTokenResponse = {
  appointmentId: string
  roomName: string
  participantIdentity: string
  accessToken: string
  expiresAt: string
  policyMode: "warn_allow"
  warnings: string[]
}

export type AppointmentDetailsResponse = {
  appointmentId: string
  patientId: string
  clinicianId: string
  scheduledStartAt: string
  scheduledEndAt: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "no_show"
  chatWindowStatus: "locked" | "open" | "closed"
  canJoinNow: boolean
  canManage: boolean
}

export type ManageAppointmentPayload = {
  action: "cancel" | "reschedule"
  scheduledStartAt?: string
}

export type PatientAppointmentSummary = {
  appointmentId: string
  clinicianId: string
  clinicianName: string
  sessionTypeLabel: string
  scheduledStartAt: string
  scheduledEndAt: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "no_show"
  statusLabel: string
}

export type PatientAppointmentsListResponse = {
  upcoming: PatientAppointmentSummary[]
  past: PatientAppointmentSummary[]
}

export type IntakeDraftResponse = {
  patientId: string
  draftVersion: number
  data: Record<string, unknown>
  updatedAt: string
  committed: boolean
}

export type IntakeDraftSaveResponse = {
  patientId: string
  draftVersion: number
  updatedAt: string
  saved: boolean
}

export async function getClinicianAvailability(
  params: GetAvailabilityParams,
): Promise<ClinicianAvailabilityResponse[]> {
  const url = buildApiUrl("clinicians/availability")
  url.searchParams.set("startDate", params.startDate)
  url.searchParams.set("endDate", params.endDate)
  if (params.clinicianId) {
    url.searchParams.set("clinicianId", params.clinicianId)
  }
  url.searchParams.set("timezone", params.timezone ?? "Australia/Sydney")

  const response = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Availability API failed (${response.status})`)
  }

  return (await response.json()) as ClinicianAvailabilityResponse[]
}

export async function createBookingRequest(
  payload: CreateBookingRequestPayload,
): Promise<BookingRequestCreatedResponse> {
  const url = buildApiUrl("booking-requests")
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Create booking request failed (${response.status})`)
  }

  return (await response.json()) as BookingRequestCreatedResponse
}

export async function getBookingRequestStatus(bookingRequestId: string): Promise<BookingRequestStatusResponse> {
  const url = buildApiUrl(`booking-requests/${bookingRequestId}/status`)
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: await getAuthHeaders(),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Fetch booking status failed (${response.status})`)
  }

  return (await response.json()) as BookingRequestStatusResponse
}

export type BookingCheckoutResponse = {
  checkoutUrl: string
  checkoutSessionId: string
  invoiceId: string
  devModeAutoConfirmed: boolean
}

export async function createBookingCheckout(bookingRequestId: string): Promise<BookingCheckoutResponse> {
  const url = buildApiUrl(`payments/booking/${encodeURIComponent(bookingRequestId)}/checkout`)
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: await getAuthHeaders(),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Payment checkout failed (${response.status})`)
  }

  return (await response.json()) as BookingCheckoutResponse
}

export async function uploadReferralDocument(params: {
  file: File
  sourceType?: string
  referralDate?: string
  notes?: string
}): Promise<ReferralDocumentResponse> {
  const url = buildApiUrl("documents/referrals")
  const token = await ensureBackendAccessToken()
  const form = new FormData()
  form.append("file", params.file)
  if (params.sourceType) form.append("sourceType", params.sourceType)
  if (params.referralDate) form.append("referralDate", params.referralDate)
  if (params.notes) form.append("notes", params.notes)

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Referral upload failed (${response.status})`)
  }

  return (await response.json()) as ReferralDocumentResponse
}

export async function getAppointmentChatWindow(appointmentId: string): Promise<ChatWindowResponse> {
  const url = buildApiUrl(`appointments/${appointmentId}/chat-window`)
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: await getAuthHeaders(),
    cache: "no-store",
  })
  if (!response.ok) {
    if (response.status === 403 || response.status === 404) {
      throw new ChatAccessError(chatAccessMessage(response.status), response.status)
    }
    throw new Error(`Fetch chat window failed (${response.status})`)
  }
  return (await response.json()) as ChatWindowResponse
}

export async function getAppointmentReadiness(appointmentId: string): Promise<TelehealthReadinessResponse> {
  const url = buildApiUrl(`appointments/${appointmentId}/readiness`)
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: await getAuthHeaders(),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`Fetch telehealth readiness failed (${response.status})`)
  }
  return (await response.json()) as TelehealthReadinessResponse
}

export async function saveAppointmentReadiness(
  appointmentId: string,
  payload: SaveTelehealthReadinessPayload,
): Promise<TelehealthReadinessResponse> {
  const url = buildApiUrl(`appointments/${appointmentId}/readiness`)
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`Save telehealth readiness failed (${response.status})`)
  }
  return (await response.json()) as TelehealthReadinessResponse
}

export async function getAppointmentChatMessages(appointmentId: string): Promise<ChatMessageResponse[]> {
  const url = buildApiUrl(`appointments/${appointmentId}/chat/messages`)
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: await getAuthHeaders(),
    cache: "no-store",
  })
  if (!response.ok) {
    if (response.status === 403 || response.status === 404) {
      throw new ChatAccessError(chatAccessMessage(response.status), response.status)
    }
    throw new Error(`Fetch chat messages failed (${response.status})`)
  }
  return (await response.json()) as ChatMessageResponse[]
}

export async function postAppointmentChatMessage(
  appointmentId: string,
  message: string,
): Promise<ChatMessageResponse> {
  const url = buildApiUrl(`appointments/${appointmentId}/chat/messages`)
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ message }),
    cache: "no-store",
  })
  if (!response.ok) {
    if (response.status === 403 || response.status === 404) {
      throw new ChatAccessError(chatAccessMessage(response.status), response.status)
    }
    throw new Error(`Post chat message failed (${response.status})`)
  }
  return (await response.json()) as ChatMessageResponse
}

export async function postJoinAttempt(
  appointmentId: string,
  payload: JoinAttemptPayload,
): Promise<JoinAttemptDecisionResponse> {
  const url = buildApiUrl(`appointments/${appointmentId}/join-attempt`)
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`Join attempt failed (${response.status})`)
  }
  return (await response.json()) as JoinAttemptDecisionResponse
}

export async function postJoinSession(
  appointmentId: string,
  payload: JoinSessionPayload,
): Promise<JoinSessionTokenResponse> {
  const url = buildApiUrl(`appointments/${appointmentId}/join-session`)
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`Join session handoff failed (${response.status})`)
  }
  return (await response.json()) as JoinSessionTokenResponse
}

export async function getAppointmentDetails(appointmentId: string): Promise<AppointmentDetailsResponse> {
  const url = buildApiUrl(`appointments/${appointmentId}`)
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: await getAuthHeaders(),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`Fetch appointment details failed (${response.status})`)
  }
  return (await response.json()) as AppointmentDetailsResponse
}

export async function postManageAppointment(
  appointmentId: string,
  payload: ManageAppointmentPayload,
): Promise<AppointmentDetailsResponse> {
  const url = buildApiUrl(`appointments/${appointmentId}/manage`)
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  })
  if (!response.ok) {
    let detail: string | undefined
    try {
      const data = (await response.json()) as { message?: string | string[] }
      if (typeof data.message === "string") detail = data.message
      else if (Array.isArray(data.message)) detail = data.message.filter(Boolean).join(" ")
    } catch {
      detail = undefined
    }
    throw new Error(detail ?? `Manage appointment failed (${response.status})`)
  }
  return (await response.json()) as AppointmentDetailsResponse
}

export async function getPatientAppointments(patientId: string): Promise<PatientAppointmentsListResponse> {
  const url = buildApiUrl(`patients/${patientId}/appointments`)
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: await getAuthHeaders(),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`Fetch patient appointments failed (${response.status})`)
  }
  return (await response.json()) as PatientAppointmentsListResponse
}

export async function getLatestIntakeDraft(patientId: string): Promise<IntakeDraftResponse> {
  const url = buildApiUrl(`patients/${patientId}/intake-latest`)
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: await getAuthHeaders(),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`Fetch intake draft failed (${response.status})`)
  }
  return (await response.json()) as IntakeDraftResponse
}

export async function saveIntakeDraftDelta(params: {
  patientId: string
  baseVersion: number
  delta: Record<string, unknown>
}): Promise<IntakeDraftSaveResponse> {
  const url = buildApiUrl(`patients/${params.patientId}/intake-delta`)
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({
      baseVersion: params.baseVersion,
      delta: params.delta,
    }),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`Save intake draft failed (${response.status})`)
  }
  return (await response.json()) as IntakeDraftSaveResponse
}

export async function commitIntakeDraft(patientId: string): Promise<IntakeDraftSaveResponse> {
  const url = buildApiUrl(`patients/${patientId}/intake-draft/commit`)
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: await getAuthHeaders(),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`Commit intake draft failed (${response.status})`)
  }
  return (await response.json()) as IntakeDraftSaveResponse
}
