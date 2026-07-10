import { screen, waitFor } from "@testing-library/react"

import { renderWithQueryClient } from "@/src/patient/queries/test-utils"

jest.mock("@/src/psychologist/queries/use-current-user", () => ({
  usePsychologistCurrentUser: jest.fn(),
}))

jest.mock("@/src/psychologist/queries/use-psychologist-workspace", () => ({
  usePsychologistWorkspace: jest.fn(),
}))

import { usePsychologistCurrentUser } from "@/src/psychologist/queries/use-current-user"
import { usePsychologistWorkspace } from "@/src/psychologist/queries/use-psychologist-workspace"

import { PsychologistJoinNextSession } from "./psychologist-join-next-session"

const mockedUsePsychologistCurrentUser = usePsychologistCurrentUser as jest.MockedFunction<
  typeof usePsychologistCurrentUser
>
const mockedUsePsychologistWorkspace = usePsychologistWorkspace as jest.MockedFunction<typeof usePsychologistWorkspace>

const psychologistUser = {
  id: "user_psychologist_001",
  email: "psychologist@clink.test",
  displayName: "Psych",
  role: "psychologist" as const,
  accountSetupComplete: true,
}

describe("PsychologistJoinNextSession", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders link when workspace has a future session", async () => {
    const future = new Date(Date.now() + 60 * 60 * 1000).toISOString()
    mockedUsePsychologistCurrentUser.mockReturnValue({
      data: psychologistUser,
      isLoading: false,
    } as ReturnType<typeof usePsychologistCurrentUser>)
    mockedUsePsychologistWorkspace.mockReturnValue({
      data: {
        psychologistId: psychologistUser.id,
        items: [
          {
            appointmentId: "appt_next",
            patientId: "p1",
            startsAt: future,
            risk: "none",
            referralStatus: "missing_referral",
            intakeState: "committed",
            readinessStatus: "ready",
            actions: [],
          },
        ],
      },
      isLoading: false,
    } as ReturnType<typeof usePsychologistWorkspace>)

    renderWithQueryClient(<PsychologistJoinNextSession />)

    await waitFor(() => {
      const link = screen.getByRole("link", { name: /join next session/i })
      expect(link).toHaveAttribute("href", "/video-session/appt_next")
    })
  })

  it("renders nothing when no upcoming session", async () => {
    mockedUsePsychologistCurrentUser.mockReturnValue({
      data: psychologistUser,
      isLoading: false,
    } as ReturnType<typeof usePsychologistCurrentUser>)
    mockedUsePsychologistWorkspace.mockReturnValue({
      data: {
        psychologistId: psychologistUser.id,
        items: [],
      },
      isLoading: false,
    } as ReturnType<typeof usePsychologistWorkspace>)

    const { container } = renderWithQueryClient(<PsychologistJoinNextSession />)

    await waitFor(() => {
      expect(screen.queryByRole("link", { name: /join next session/i })).toBeNull()
    })
    expect(container).toBeEmptyDOMElement()
  })
})
