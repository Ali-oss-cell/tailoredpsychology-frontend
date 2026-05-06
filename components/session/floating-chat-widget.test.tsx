import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { FloatingChatWidget } from "@/components/session/floating-chat-widget"

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}))

jest.mock("@/components/session/pre-session-chat-panel", () => ({
  PreSessionChatPanel: ({ appointmentId }: { appointmentId: string }) => (
    <div data-testid="compact-chat">Chat for {appointmentId}</div>
  ),
}))

jest.mock("@/src/auth/current-user", () => ({
  getCurrentUser: jest.fn(),
}))

jest.mock("@/src/psychologist/workspace/api", () => ({
  getPsychologistWorkspace: jest.fn(),
}))

jest.mock("@/src/patient/booking/api", () => ({
  getPatientAppointments: jest.fn(),
}))

import { usePathname } from "next/navigation"
import { getCurrentUser } from "@/src/auth/current-user"
import { getPatientAppointments } from "@/src/patient/booking/api"
import { getPsychologistWorkspace } from "@/src/psychologist/workspace/api"

const mockedUsePathname = usePathname as jest.MockedFunction<typeof usePathname>
const mockedGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>
const mockedGetPsychologistWorkspace = getPsychologistWorkspace as jest.MockedFunction<typeof getPsychologistWorkspace>
const mockedGetPatientAppointments = getPatientAppointments as jest.MockedFunction<typeof getPatientAppointments>

describe("FloatingChatWidget", () => {
  beforeEach(() => {
    window.localStorage.clear()
    jest.clearAllMocks()
    mockedGetPatientAppointments.mockResolvedValue({ upcoming: [], past: [] })
  })

  it("opens chat from video-session route appointment id", async () => {
    mockedUsePathname.mockReturnValue("/video-session/appt_open_001")

    render(<FloatingChatWidget role="patient" />)

    const openButton = await screen.findByRole("button", { name: "Open session chat" })
    expect(openButton).toBeEnabled()
    fireEvent.click(openButton)

    expect(await screen.findByTestId("compact-chat")).toHaveTextContent("Chat for appt_open_001")
  })

  it("lets patient open chat panel without video-session path; shows hint when no appointment resolved", async () => {
    mockedUsePathname.mockReturnValue("/patient/dashboard")
    mockedGetCurrentUser.mockResolvedValue({
      id: "user_patient_001",
      email: "patient@clink.test",
      displayName: "Pat",
      role: "patient",
      accountSetupComplete: true,
    })

    render(<FloatingChatWidget role="patient" />)

    const openButton = await screen.findByRole("button", { name: "Open session chat" })
    await waitFor(() => expect(openButton).toBeEnabled())
    fireEvent.click(openButton)

    expect(
      await screen.findByText(/no active appointment chat found yet/i),
    ).toBeInTheDocument()
  })

  it("resolves psychologist appointment from workspace when path/storage missing", async () => {
    mockedUsePathname.mockReturnValue("/psychologist/dashboard")
    mockedGetCurrentUser.mockResolvedValue({
      id: "psychologist_001",
      email: "psychologist@clink.test",
      displayName: "Dr. Lee",
      role: "psychologist",
      accountSetupComplete: true,
    })
    mockedGetPsychologistWorkspace.mockResolvedValue({
      psychologistId: "psychologist_001",
      items: [
        {
          appointmentId: "appt_psy_010",
          patientId: "patient_001",
          startsAt: new Date().toISOString(),
          risk: "none",
          referralStatus: "linked_referral",
          intakeState: "committed",
          readinessStatus: "ready",
          actions: [],
        },
      ],
    })

    render(<FloatingChatWidget role="psychologist" />)

    const openButton = await screen.findByRole("button", { name: "Open session chat" })
    await waitFor(() => expect(openButton).toBeEnabled())
    fireEvent.click(openButton)

    expect(await screen.findByTestId("compact-chat")).toHaveTextContent("Chat for appt_psy_010")
  })
})
