import { render, screen, waitFor } from "@testing-library/react"

jest.mock("@/src/auth/current-user", () => ({
  getCurrentUser: jest.fn(),
}))

jest.mock("@/src/psychologist/workspace/api", () => ({
  getPsychologistWorkspace: jest.fn(),
}))

import { getCurrentUser } from "@/src/auth/current-user"
import { getPsychologistWorkspace } from "@/src/psychologist/workspace/api"

import { PsychologistJoinNextSession } from "./psychologist-join-next-session"

const mockedGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>
const mockedGetWorkspace = getPsychologistWorkspace as jest.MockedFunction<typeof getPsychologistWorkspace>

describe("PsychologistJoinNextSession", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders link when workspace has a future session", async () => {
    const future = new Date(Date.now() + 60 * 60 * 1000).toISOString()
    mockedGetCurrentUser.mockResolvedValue({
      id: "user_psychologist_001",
      email: "psychologist@clink.test",
      displayName: "Psych",
      role: "psychologist",
      accountSetupComplete: true,
    })
    mockedGetWorkspace.mockResolvedValue({
      psychologistId: "user_psychologist_001",
      items: [{ appointmentId: "appt_next", patientId: "p1", startsAt: future, risk: "none", referralStatus: "missing_referral", intakeState: "committed", readinessStatus: "ready", actions: [] }],
    })

    render(<PsychologistJoinNextSession />)

    await waitFor(() => {
      const link = screen.getByRole("link", { name: /join next session/i })
      expect(link).toHaveAttribute("href", "/video-session/appt_next")
    })
  })

  it("renders disabled control when no upcoming session", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      id: "user_psychologist_001",
      email: "psychologist@clink.test",
      displayName: "Psych",
      role: "psychologist",
      accountSetupComplete: true,
    })
    mockedGetWorkspace.mockResolvedValue({
      psychologistId: "user_psychologist_001",
      items: [],
    })

    render(<PsychologistJoinNextSession />)

    await waitFor(() => {
      expect(screen.queryByRole("link", { name: /join next session/i })).toBeNull()
    })
    expect(screen.getByRole("button", { name: /join next session/i })).toBeDisabled()
  })
})
