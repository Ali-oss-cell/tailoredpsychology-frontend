import { getPsychologistSessions } from "@/src/sessions/api"

import { getNoteSessionChoices } from "./note-session-choices"
import { getPsychologistPatientContext, getPsychologistWorkspace } from "./workspace/api"

jest.mock("./workspace/api", () => ({
  getPsychologistWorkspace: jest.fn(),
  getPsychologistPatientContext: jest.fn(),
}))

jest.mock("@/src/sessions/api", () => ({
  getPsychologistSessions: jest.fn(),
}))

const mockWorkspace = getPsychologistWorkspace as jest.MockedFunction<typeof getPsychologistWorkspace>
const mockContext = getPsychologistPatientContext as jest.MockedFunction<typeof getPsychologistPatientContext>
const mockSessions = getPsychologistSessions as jest.MockedFunction<typeof getPsychologistSessions>

describe("getNoteSessionChoices", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("uses patient display names in labels when workspace has items", async () => {
    mockWorkspace.mockResolvedValue({
      psychologistId: "psy1",
      items: [
        {
          appointmentId: "appt_a",
          patientId: "pat_a",
          startsAt: "2026-05-02T10:00:00.000Z",
          risk: "none",
          referralStatus: "linked_referral",
          intakeState: "committed",
          readinessStatus: "ready",
          actions: [],
        },
      ],
    })
    mockContext.mockResolvedValue({
      psychologistId: "psy1",
      patientId: "pat_a",
      patientDisplayName: "Alex Patient",
      riskLevel: "low",
      referralStatus: "linked_referral",
      readinessStatus: "ready",
      careSignals: [],
    })

    const choices = await getNoteSessionChoices("psy1")

    expect(mockContext).toHaveBeenCalledWith("psy1", "pat_a")
    expect(choices).toHaveLength(1)
    expect(choices[0]?.label).toContain("Alex Patient")
    expect(choices[0]?.label).not.toMatch(/^pat_a ·/)
    expect(choices[0]?.patientId).toBe("pat_a")
    expect(choices[0]?.sessionId).toBe("appt_a")
  })

  it("falls back to patient id when context fails", async () => {
    mockWorkspace.mockResolvedValue({
      psychologistId: "psy1",
      items: [
        {
          appointmentId: "appt_b",
          patientId: "pat_x",
          startsAt: "2026-05-02T11:00:00.000Z",
          risk: "none",
          referralStatus: "missing_referral",
          intakeState: "missing",
          readinessStatus: "unknown",
          actions: [],
        },
      ],
    })
    mockContext.mockRejectedValue(new Error("forbidden"))

    const choices = await getNoteSessionChoices("psy1")

    expect(choices[0]?.label.startsWith("pat_x ·")).toBe(true)
  })

  it("uses display names for sessions fallback path", async () => {
    mockWorkspace.mockResolvedValue({ psychologistId: "psy1", items: [] })
    mockSessions.mockResolvedValue([
      {
        sessionId: "sess_1",
        scheduledStartAt: "2026-05-03T09:00:00.000Z",
        scheduledEndAt: "2026-05-03T10:00:00.000Z",
        status: "scheduled",
        clinicianId: "c1",
        patientId: "pat_z",
      },
    ])
    mockContext.mockResolvedValue({
      psychologistId: "psy1",
      patientId: "pat_z",
      patientDisplayName: "Jordan Lee",
      riskLevel: "medium",
      referralStatus: "linked_referral",
      readinessStatus: "attention",
      careSignals: [],
    })

    const choices = await getNoteSessionChoices("psy1")

    expect(choices[0]?.label).toContain("Jordan Lee")
    expect(choices[0]?.label).toContain("scheduled")
  })
})
