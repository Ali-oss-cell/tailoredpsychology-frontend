import type { JoinAttemptDecisionResponse, TelehealthReadinessResponse } from "@/src/patient/booking/api"

const HARD_BLOCK_REASONS = new Set([
  "session_window_locked",
  "session_window_closed",
  "payment_pending",
])

export function isHardBlockReason(reason: string): boolean {
  return HARD_BLOCK_REASONS.has(reason)
}

export function hardBlockMessage(decision: JoinAttemptDecisionResponse): string {
  if (decision.reasons.includes("session_window_locked")) {
    return "Your session window is not open yet. Join opens 15 minutes before your scheduled start — check back soon or retry."
  }
  if (decision.reasons.includes("session_window_closed")) {
    return "This session window has closed. Contact the clinic if you still need to connect."
  }
  if (decision.reasons.includes("payment_pending")) {
    return "Payment is still pending for this appointment. Complete billing first, or contact the clinic for help."
  }
  return "You cannot join this session right now. Try again shortly or contact support if the problem continues."
}

export function devicePrepWarnings(readiness: TelehealthReadinessResponse | null): string[] {
  if (!readiness) return []

  const warnings: string[] = []
  const camera = readiness.checks.find((check) => check.key === "camera")
  const microphone = readiness.checks.find((check) => check.key === "microphone")
  const network = readiness.checks.find((check) => check.key === "network")

  if (camera && microphone && camera.status !== "pass" && microphone.status !== "pass") {
    warnings.push("Mic and camera unavailable — you can still join and use chat.")
  } else if (camera && camera.status !== "pass") {
    warnings.push("Camera unavailable — you can still join with audio and chat.")
  } else if (microphone && microphone.status !== "pass") {
    warnings.push("Microphone unavailable — you can still join and use chat.")
  }

  if (network && network.status !== "pass") {
    warnings.push("Your connection looks slow — you can join, but video may be unstable. Try moving closer to your router.")
  }

  return warnings
}

type JoinSessionGateRole = "patient" | "psychologist" | "practice_manager" | "admin" | null

export function joinButtonLabel(
  role: JoinSessionGateRole,
  readiness: TelehealthReadinessResponse | null,
  isSubmitting: boolean,
): string {
  if (isSubmitting) return "Connecting…"

  const hasDeviceWarnings = devicePrepWarnings(readiness).length > 0
  if (role === "psychologist" && hasDeviceWarnings) return "Override warning and join"
  if (hasDeviceWarnings && role === "patient") return "Join anyway"
  if (role === "patient") return "Join session"
  return "Proceed to session"
}

type JoinSessionGateRole = "patient" | "psychologist" | "practice_manager" | "admin" | null

export function shouldAutoAcknowledgeWarnings(
  role: JoinSessionGateRole,
  reasons: string[],
): boolean {
  if (role !== "patient") return false
  if (reasons.length === 0) return false
  return reasons.every((reason) => !isHardBlockReason(reason))
}
