import type { PatientAppointmentSummary } from "@/src/patient/booking/api"
import { isJoinImminent, pickNextUpcoming, shouldShowBookHero } from "@/src/patient/dashboard/join-cta"

function makeAppointment(overrides: Partial<PatientAppointmentSummary> = {}): PatientAppointmentSummary {
  const start = new Date(Date.now() + 60 * 60 * 1000)
  const end = new Date(start.getTime() + 50 * 60 * 1000)
  return {
    appointmentId: "appt_1",
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

describe("pickNextUpcoming", () => {
  it("returns the next future appointment when one exists", () => {
    const future = makeAppointment({ appointmentId: "future" })
    const past = makeAppointment({
      appointmentId: "past",
      scheduledStartAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      scheduledEndAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    })
    expect(pickNextUpcoming([past, future])?.appointmentId).toBe("future")
  })

  it("falls back to first item when all are in the past", () => {
    const past = makeAppointment({
      scheduledStartAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      scheduledEndAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    })
    expect(pickNextUpcoming([past])?.appointmentId).toBe("appt_1")
  })
})

describe("isJoinImminent", () => {
  const now = new Date("2026-05-29T10:00:00.000Z").getTime()

  it("returns true when status is in_progress", () => {
    const row = makeAppointment({ status: "in_progress" })
    expect(isJoinImminent(row, now)).toBe(true)
  })

  it("returns true when now is within the session window", () => {
    const row = makeAppointment({
      scheduledStartAt: new Date(now - 5 * 60 * 1000).toISOString(),
      scheduledEndAt: new Date(now + 45 * 60 * 1000).toISOString(),
    })
    expect(isJoinImminent(row, now)).toBe(true)
  })

  it("returns true when start is within 15 minutes", () => {
    const row = makeAppointment({
      scheduledStartAt: new Date(now + 10 * 60 * 1000).toISOString(),
      scheduledEndAt: new Date(now + 60 * 60 * 1000).toISOString(),
    })
    expect(isJoinImminent(row, now)).toBe(true)
  })

  it("returns false when start is more than 15 minutes away", () => {
    const row = makeAppointment({
      scheduledStartAt: new Date(now + 20 * 60 * 1000).toISOString(),
      scheduledEndAt: new Date(now + 70 * 60 * 1000).toISOString(),
    })
    expect(isJoinImminent(row, now)).toBe(false)
  })

  it("returns false when row is null", () => {
    expect(isJoinImminent(null, now)).toBe(false)
  })
})

describe("shouldShowBookHero", () => {
  it("returns true when there is no upcoming session", () => {
    expect(shouldShowBookHero(null)).toBe(true)
  })

  it("returns false when a session exists", () => {
    expect(shouldShowBookHero(makeAppointment())).toBe(false)
  })
})
