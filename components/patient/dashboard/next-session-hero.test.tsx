import { fireEvent, screen, waitFor } from "@testing-library/react"

import { NextSessionHero } from "@/components/patient/dashboard/next-session-hero"
import type { PatientNextSession } from "@/src/patient/dashboard/api"
import { renderWithQueryClient } from "@/src/patient/queries/test-utils"

jest.mock("@/src/patient/booking/api", () => ({
  getAppointmentDetails: jest.fn(),
  postManageAppointment: jest.fn(),
}))

import { getAppointmentDetails, postManageAppointment } from "@/src/patient/booking/api"

const mockedGetAppointmentDetails = getAppointmentDetails as jest.MockedFunction<typeof getAppointmentDetails>
const mockedPostManageAppointment = postManageAppointment as jest.MockedFunction<typeof postManageAppointment>

function makeSession(overrides: Partial<PatientNextSession> = {}): PatientNextSession {
  const start = new Date(Date.now() + 2 * 60 * 60 * 1000)
  const end = new Date(start.getTime() + 50 * 60 * 1000)
  return {
    appointmentId: "appt_hero_001",
    clinicianId: "clin_1",
    clinicianName: "Dr. Example",
    sessionTypeLabel: "Consultation",
    scheduledStartAt: start.toISOString(),
    scheduledEndAt: end.toISOString(),
    status: "scheduled",
    statusLabel: "Scheduled",
    window: {
      status: "locked",
      opensAt: new Date(start.getTime() - 30 * 60 * 1000).toISOString(),
      closesAt: end.toISOString(),
    },
    ...overrides,
  }
}

describe("NextSessionHero", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedGetAppointmentDetails.mockResolvedValue({
      appointmentId: "appt_hero_001",
      patientId: "user_patient_001",
      clinicianId: "clin_1",
      scheduledStartAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      scheduledEndAt: new Date(Date.now() + 110 * 60 * 1000).toISOString(),
      status: "scheduled",
      chatWindowStatus: "locked",
      canJoinNow: false,
      canManage: true,
    })
    mockedPostManageAppointment.mockResolvedValue({
      appointmentId: "appt_hero_001",
      patientId: "user_patient_001",
      clinicianId: "clin_1",
      scheduledStartAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      scheduledEndAt: new Date(Date.now() + 110 * 60 * 1000).toISOString(),
      status: "cancelled",
      chatWindowStatus: "locked",
      canJoinNow: false,
      canManage: true,
    })
  })

  it("renders the join link when the window is open", () => {
    renderWithQueryClient(<NextSessionHero session={makeSession({ window: { status: "open", opensAt: "", closesAt: "" } })} />)

    expect(screen.getByRole("link", { name: /Join session/i })).toHaveAttribute(
      "href",
      "/video-session/appt_hero_001",
    )
  })

  it("renders the join link when the session starts within 15 minutes", () => {
    const start = new Date(Date.now() + 10 * 60 * 1000)
    const end = new Date(start.getTime() + 50 * 60 * 1000)
    renderWithQueryClient(
      <NextSessionHero
        session={makeSession({ scheduledStartAt: start.toISOString(), scheduledEndAt: end.toISOString() })}
      />,
    )

    expect(screen.getByRole("link", { name: /Join session/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Test camera & mic/i })).toBeInTheDocument()
  })

  it("hides the join link and explains the window when session is far out", () => {
    renderWithQueryClient(<NextSessionHero session={makeSession()} />)

    expect(screen.queryByRole("link", { name: /Join session/i })).not.toBeInTheDocument()
    expect(screen.getByText(/Join opens 15 minutes before/i)).toBeInTheDocument()
  })

  it("renders the book CTA when there is no upcoming session", () => {
    renderWithQueryClient(<NextSessionHero session={null} />)

    expect(screen.getByRole("link", { name: /Book appointment/i })).toHaveAttribute(
      "href",
      "/patient/book-appointment",
    )
  })

  it("shows a skeleton while loading", () => {
    renderWithQueryClient(<NextSessionHero session={null} loading />)

    expect(screen.getByLabelText("Loading your next step")).toBeInTheDocument()
  })

  it("shows an error state with retry", () => {
    const onRetry = jest.fn()
    renderWithQueryClient(<NextSessionHero session={null} error="Could not load your dashboard." onRetry={onRetry} />)

    fireEvent.click(screen.getByRole("button", { name: "Retry" }))
    expect(onRetry).toHaveBeenCalled()
  })

  it("opens manage panel, loads details, and allows cancel", async () => {
    renderWithQueryClient(<NextSessionHero session={makeSession()} />)

    fireEvent.click(screen.getByRole("button", { name: "Manage" }))
    await waitFor(() => expect(mockedGetAppointmentDetails).toHaveBeenCalledWith("appt_hero_001"))

    fireEvent.click(screen.getByRole("button", { name: "Cancel appointment" }))
    fireEvent.click(screen.getByRole("button", { name: "Yes, cancel appointment" }))
    await waitFor(() =>
      expect(mockedPostManageAppointment).toHaveBeenCalledWith("appt_hero_001", { action: "cancel" }),
    )
  })
})
