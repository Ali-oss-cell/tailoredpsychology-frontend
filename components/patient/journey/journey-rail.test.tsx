import { fireEvent, screen } from "@testing-library/react"

import { JourneyRail } from "@/components/patient/journey/journey-rail"
import { renderWithQueryClient } from "@/src/patient/queries/test-utils"

jest.mock("@/src/patient/queries/use-current-user", () => ({
  useCurrentUser: () => ({ data: { id: "user_patient_001", role: "patient" } }),
  usePatientId: () => "user_patient_001",
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
    // 8 steps minus the pending session_no_show exception branch
    expect(tabs).toHaveLength(7)
    expect(screen.queryByText("No-show")).not.toBeInTheDocument()
  })

  it("defaults the detail panel to the first pending step with its CTA", async () => {
    renderWithQueryClient(<JourneyRail />)

    const panel = await screen.findByRole("tabpanel")
    expect(panel).toHaveTextContent("Booking requested")
    expect(screen.getByRole("link", { name: "View appointments" })).toBeInTheDocument()
  })

  it("shows recorded detail when selecting a done step", async () => {
    renderWithQueryClient(<JourneyRail />)

    fireEvent.click(await screen.findByRole("tab", { name: "Intake recorded" }))
    const panel = screen.getByRole("tabpanel")
    expect(panel).toHaveTextContent("What we logged:")
    expect(screen.getByText("Recorded")).toBeInTheDocument()
  })

  it("shows progress summary counts", async () => {
    renderWithQueryClient(<JourneyRail />)

    expect(await screen.findByRole("progressbar")).toBeInTheDocument()
    expect(screen.getByText(/2 of 7 completed/)).toBeInTheDocument()
  })
})
