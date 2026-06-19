import { render, screen } from "@testing-library/react"

import { PatientDashboardHeroCta } from "@/components/patient/dashboard/patient-dashboard-hero-cta"
import type { PatientAppointmentSummary } from "@/src/patient/booking/api"

function makeAppointment(overrides: Partial<PatientAppointmentSummary> = {}): PatientAppointmentSummary {
  const start = new Date(Date.now() + 10 * 60 * 1000)
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
    ...overrides,
  }
}

describe("PatientDashboardHeroCta", () => {
  it("renders Join Video Session when join is imminent", () => {
    render(<PatientDashboardHeroCta nextSession={makeAppointment()} />)

    expect(screen.getByRole("link", { name: "Join Video Session" })).toHaveAttribute(
      "href",
      "/video-session/appt_hero_001",
    )
  })

  it("renders Book New Session when there is no upcoming session", () => {
    render(<PatientDashboardHeroCta nextSession={null} />)

    expect(screen.getByRole("link", { name: "Book New Session" })).toHaveAttribute("href", "/patient/book-appointment")
  })

  it("renders nothing when session exists but join is not imminent", () => {
    const later = makeAppointment({
      scheduledStartAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      scheduledEndAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    })
    const { container } = render(<PatientDashboardHeroCta nextSession={later} />)

    expect(container).toBeEmptyDOMElement()
  })

  it("renders nothing while loading", () => {
    const { container } = render(<PatientDashboardHeroCta nextSession={null} loading />)

    expect(container).toBeEmptyDOMElement()
  })
})
