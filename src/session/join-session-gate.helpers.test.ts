import type { JoinAttemptDecisionResponse, TelehealthReadinessResponse } from "@/src/patient/booking/api"
import {
  devicePrepWarnings,
  hardBlockMessage,
  joinButtonLabel,
  shouldAutoAcknowledgeWarnings,
} from "@/src/session/join-session-gate.helpers"

function readiness(overrides: Partial<TelehealthReadinessResponse> = {}): TelehealthReadinessResponse {
  return {
    appointmentId: "appt_1",
    overallStatus: "attention",
    checks: [
      { key: "camera", status: "pass", message: "ok" },
      { key: "microphone", status: "pass", message: "ok" },
      { key: "network", status: "pass", message: "ok" },
      { key: "session_window", status: "pass", message: "open" },
    ],
    guidance: "",
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

function decision(overrides: Partial<JoinAttemptDecisionResponse> = {}): JoinAttemptDecisionResponse {
  return {
    appointmentId: "appt_1",
    allowed: false,
    policyMode: "warn_allow",
    readinessStatus: "attention",
    windowStatus: "locked",
    reasons: ["session_window_locked"],
    recordedAt: new Date().toISOString(),
    ...overrides,
  }
}

describe("join-session-gate helpers", () => {
  it("describes hard blocks with recovery guidance", () => {
    expect(hardBlockMessage(decision({ reasons: ["session_window_locked"] }))).toMatch(/not open yet/i)
    expect(hardBlockMessage(decision({ reasons: ["session_window_closed"] }))).toMatch(/closed/i)
    expect(hardBlockMessage(decision({ reasons: ["payment_pending"] }))).toMatch(/payment/i)
  })

  it("surfaces device and network prep warnings without blocking join", () => {
    expect(
      devicePrepWarnings(
        readiness({
          checks: [
            { key: "camera", status: "review", message: "blocked" },
            { key: "microphone", status: "review", message: "blocked" },
            { key: "network", status: "pass", message: "ok" },
            { key: "session_window", status: "pass", message: "open" },
          ],
        }),
      ),
    ).toContain("Mic and camera unavailable — you can still join and use chat.")

    expect(
      devicePrepWarnings(
        readiness({
          checks: [
            { key: "camera", status: "pass", message: "ok" },
            { key: "microphone", status: "pass", message: "ok" },
            { key: "network", status: "review", message: "slow" },
            { key: "session_window", status: "pass", message: "open" },
          ],
        }),
      ),
    ).toEqual(["Your connection looks slow — you can join, but video may be unstable. Try moving closer to your router."])
  })

  it("uses join anyway for patients when prep failed", () => {
    const blocked = readiness({
      checks: [
        { key: "camera", status: "review", message: "blocked" },
        { key: "microphone", status: "pass", message: "ok" },
        { key: "network", status: "pass", message: "ok" },
        { key: "session_window", status: "pass", message: "open" },
      ],
    })
    expect(joinButtonLabel("patient", blocked, false)).toBe("Join anyway")
    expect(joinButtonLabel("patient", readiness(), false)).toBe("Join session")
  })

  it("auto-acknowledges soft readiness warnings for patients only", () => {
    expect(shouldAutoAcknowledgeWarnings("patient", ["readiness_attention"])).toBe(true)
    expect(shouldAutoAcknowledgeWarnings("psychologist", ["readiness_attention"])).toBe(false)
    expect(shouldAutoAcknowledgeWarnings("patient", ["session_window_locked"])).toBe(false)
  })
})
