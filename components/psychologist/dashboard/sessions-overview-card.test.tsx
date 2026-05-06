import { render, screen, waitFor } from "@testing-library/react"

import { SessionsOverviewCard } from "@/components/psychologist/dashboard/sessions-overview-card"

jest.mock("@/src/auth/current-user", () => ({
  getCurrentUser: jest.fn(),
}))
jest.mock("@/src/sessions/api", () => ({
  getPsychologistSessions: jest.fn(),
}))

import { getCurrentUser } from "@/src/auth/current-user"
import { getPsychologistSessions } from "@/src/sessions/api"

const mockedGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>
const mockedGetPsychologistSessions = getPsychologistSessions as jest.MockedFunction<typeof getPsychologistSessions>

describe("SessionsOverviewCard", () => {
  it("renders live psychologist session metrics", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      id: "user_psychologist_001",
      email: "psychologist@clink.test",
      displayName: "Psych",
      role: "psychologist",
      accountSetupComplete: true,
    })
    mockedGetPsychologistSessions.mockResolvedValue([
      {
        sessionId: "s1",
        scheduledStartAt: new Date(Date.now() + 60_000).toISOString(),
        scheduledEndAt: new Date(Date.now() + 120_000).toISOString(),
        status: "scheduled",
        clinicianId: "clinician_001",
        patientId: "user_patient_001",
      },
      {
        sessionId: "s2",
        scheduledStartAt: new Date(Date.now() - 60_000).toISOString(),
        scheduledEndAt: new Date(Date.now() - 30_000).toISOString(),
        status: "completed",
        clinicianId: "clinician_001",
        patientId: "user_patient_001",
      },
    ])

    render(<SessionsOverviewCard />)

    await waitFor(() => expect(screen.getByText("Total sessions")).toBeInTheDocument())
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("Upcoming")).toBeInTheDocument()
    expect(screen.getByText("Completed")).toBeInTheDocument()
  })
})
