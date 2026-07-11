import { fireEvent, screen } from "@testing-library/react"

import { JourneyRail } from "@/components/patient/journey/journey-rail"
import { renderWithQueryClient } from "@/src/patient/queries/test-utils"

jest.mock("@/src/patient/queries/use-current-user", () => ({
  useCurrentUser: () => ({ data: { id: "user_patient_001", role: "patient" } }),
  usePatientId: () => "user_patient_001",
}))

jest.mock("@/src/patient/use-patient-portal-context", () => ({
  usePatientPortalContext: () => ({
    mode: "returning",
    isFirstTime: false,
    isReturning: true,
    loading: false,
    hasUpcomingSession: false,
    hasPastSessions: false,
    currentStepKey: "booking_requested",
    journeyProgress: { done: 2, total: 7, pct: 29 },
  }),
}))

jest.mock("@/src/patient/journey/api", () => ({
  getPatientJourneyTimeline: jest.fn(),
}))

import { getPatientJourneyTimeline } from "@/src/patient/journey/api"

const mockedGetTimeline = getPatientJourneyTimeline as jest.MockedFunction<typeof getPatientJourneyTimeline>

const baseSteps = [
  { key: "intake_started", label: "Intake started", status: "done" as const, occurredAt: "2026-07-01T09:00:00Z" },
  { key: "intake_submitted", label: "Intake submitted", status: "done" as const, occurredAt: "2026-07-01T09:20:00Z" },
  { key: "booking_requested", label: "Booking requested", status: "pending" as const },
  { key: "booking_confirmed", label: "Booking confirmed", status: "pending" as const },
  { key: "session_started", label: "Session started", status: "pending" as const },
  { key: "session_completed", label: "Session completed", status: "pending" as const },
  { key: "session_no_show", label: "Session no-show", status: "pending" as const },
  { key: "invoice_downloaded", label: "Invoice downloaded", status: "pending" as const },
]

describe("JourneyRail", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedGetTimeline.mockResolvedValue({ patientId: "user_patient_001", steps: baseSteps })
  })

  it("renders all visible milestones and hides pending no-show branch", async () => {
    renderWithQueryClient(<JourneyRail />)

    const tabs = await screen.findAllByRole("tab")
    expect(tabs).toHaveLength(7)
    expect(screen.queryByText("Session missed")).not.toBeInTheDocument()
  })

  it("shows journey summary progress and motivation copy", async () => {
    renderWithQueryClient(<JourneyRail />)

    expect(await screen.findByRole("progressbar")).toBeInTheDocument()
    expect(screen.getByText(/29% complete/i)).toBeInTheDocument()
    expect(screen.getByText(/2 of 7 steps/i)).toBeInTheDocument()
    expect(screen.getByText(/Everything is on track/i)).toBeInTheDocument()
  })

  it("shows upcoming milestones and quick actions", async () => {
    renderWithQueryClient(<JourneyRail showInvoiceAction />)

    await screen.findByRole("progressbar")
    expect(screen.getAllByText("Appointment confirmed").length).toBeGreaterThan(0)
    expect(screen.getByText("Coming next")).toBeInTheDocument()
    expect(screen.getByText("Need help?")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Contact clinic/i })).toHaveAttribute("href", "/contact")
    expect(screen.getByRole("link", { name: /Download invoice/i })).toHaveAttribute("href", "/patient/invoices")
  })

  it("shows expandable recorded detail when selecting a done step", async () => {
    renderWithQueryClient(<JourneyRail />)

    fireEvent.click(await screen.findByRole("tab", { name: /Intake complete/i }))
    fireEvent.click(screen.getByRole("button", { name: /Intake complete/i }))
    expect(screen.getByRole("link", { name: "View details" })).toHaveAttribute("href", "/patient/book-appointment")
  })

  it("renders the consolidated current step card with session CTAs", async () => {
    const start = new Date(Date.now() + 2 * 60 * 60 * 1000)
    const end = new Date(start.getTime() + 50 * 60 * 1000)

    renderWithQueryClient(
      <JourneyRail
        nextSession={{
          appointmentId: "appt_journey_001",
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
        }}
      />,
    )

    expect(await screen.findByText("Current step")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /View appointment/i })).toHaveAttribute("href", "/patient/appointments")
    expect(screen.getByRole("button", { name: /Add to calendar/i })).toBeInTheDocument()
  })
})
