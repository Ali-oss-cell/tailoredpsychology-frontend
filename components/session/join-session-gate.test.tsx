import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { JoinSessionGate } from "@/components/session/join-session-gate"

jest.mock("@/src/patient/booking/api", () => ({
  postJoinAttempt: jest.fn(),
  postJoinSession: jest.fn(),
}))

jest.mock("@/components/session/twilio-video-room", () => ({
  TwilioVideoRoom: ({ participantIdentity }: { participantIdentity: string }) => (
    <div>Connected to video session as {participantIdentity}</div>
  ),
}))

jest.mock("@/components/session/session-notes-panel", () => ({
  SessionNotesPanel: () => <div>Session notes panel</div>,
}))

import { postJoinAttempt, postJoinSession } from "@/src/patient/booking/api"

const mockedPostJoinAttempt = postJoinAttempt as jest.MockedFunction<typeof postJoinAttempt>
const mockedPostJoinSession = postJoinSession as jest.MockedFunction<typeof postJoinSession>

describe("JoinSessionGate", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedPostJoinAttempt.mockReset()
    mockedPostJoinSession.mockReset()
    mockedPostJoinSession.mockResolvedValue({
      appointmentId: "appt_open_001",
      roomName: "clink_appt_open_001",
      participantIdentity: "user_patient_001",
      accessToken: "token",
      expiresAt: new Date().toISOString(),
      policyMode: "warn_allow",
      warnings: [],
    })
  })

  it("joins directly for patients when readiness needs attention", async () => {
    mockedPostJoinAttempt
      .mockResolvedValueOnce({
        appointmentId: "appt_open_001",
        allowed: true,
        policyMode: "warn_allow",
        readinessStatus: "attention",
        windowStatus: "open",
        reasons: ["readiness_attention"],
        recordedAt: new Date().toISOString(),
      })
      .mockResolvedValueOnce({
        appointmentId: "appt_open_001",
        allowed: true,
        policyMode: "warn_allow",
        readinessStatus: "attention",
        windowStatus: "open",
        reasons: [],
        recordedAt: new Date().toISOString(),
      })

    render(
      <JoinSessionGate
        appointmentId="appt_open_001"
        readiness={{
          appointmentId: "appt_open_001",
          overallStatus: "attention",
          checks: [
            { key: "camera", status: "review", message: "blocked" },
            { key: "microphone", status: "pass", message: "ok" },
            { key: "network", status: "pass", message: "ok" },
            { key: "session_window", status: "pass", message: "open" },
          ],
          guidance: "",
          updatedAt: new Date().toISOString(),
        }}
        role="patient"
        onRunChecks={jest.fn()}
      />,
    )

    expect(screen.getByText(/Camera unavailable — you can still join/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Join anyway" }))
    await waitFor(() =>
      expect(screen.getByText("Connected to video session as user_patient_001")).toBeInTheDocument(),
    )
  })

  it("joins directly when readiness is ready", async () => {
    mockedPostJoinAttempt.mockResolvedValue({
      appointmentId: "appt_open_001",
      allowed: true,
      policyMode: "warn_allow",
      readinessStatus: "ready",
      windowStatus: "open",
      reasons: [],
      recordedAt: new Date().toISOString(),
    })

    render(
      <JoinSessionGate
        appointmentId="appt_open_001"
        readiness={{
          appointmentId: "appt_open_001",
          overallStatus: "ready",
          checks: [
            { key: "camera", status: "pass", message: "ok" },
            { key: "microphone", status: "pass", message: "ok" },
            { key: "network", status: "pass", message: "ok" },
            { key: "session_window", status: "pass", message: "open" },
          ],
          guidance: "",
          updatedAt: new Date().toISOString(),
        }}
        role="patient"
        onRunChecks={jest.fn()}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Join session" }))
    await waitFor(() =>
      expect(screen.getByText("Connected to video session as user_patient_001")).toBeInTheDocument(),
    )
  })

  it("shows hard-block recovery when the session window is locked", async () => {
    mockedPostJoinAttempt.mockResolvedValue({
      appointmentId: "appt_open_001",
      allowed: false,
      policyMode: "warn_allow",
      readinessStatus: "attention",
      windowStatus: "locked",
      reasons: ["session_window_locked"],
      recordedAt: new Date().toISOString(),
    })

    render(
      <JoinSessionGate
        appointmentId="appt_open_001"
        readiness={null}
        role="patient"
        onRunChecks={jest.fn()}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Join session" }))
    await waitFor(() => expect(screen.getAllByText(/not open yet/i).length).toBeGreaterThan(0))
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument()
  })

  it("shows override reason input for psychologist in warning flow", async () => {
    mockedPostJoinAttempt.mockResolvedValue({
      appointmentId: "appt_open_001",
      allowed: true,
      policyMode: "warn_allow",
      readinessStatus: "attention",
      windowStatus: "open",
      reasons: ["readiness_attention"],
      recordedAt: new Date().toISOString(),
    })

    render(
      <JoinSessionGate
        appointmentId="appt_open_001"
        readiness={{
          appointmentId: "appt_open_001",
          overallStatus: "attention",
          checks: [
            { key: "camera", status: "review", message: "blocked" },
            { key: "microphone", status: "pass", message: "ok" },
            { key: "network", status: "pass", message: "ok" },
            { key: "session_window", status: "pass", message: "open" },
          ],
          guidance: "",
          updatedAt: new Date().toISOString(),
        }}
        role="psychologist"
        onRunChecks={jest.fn()}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Override warning and join" }))
    await waitFor(() => expect(screen.getByText("Join anyway")).toBeInTheDocument())
    expect(screen.getByLabelText("Override reason (optional)")).toBeInTheDocument()
  })
})
