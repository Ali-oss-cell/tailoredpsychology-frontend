import { findNextAvailableLabel } from "@/components/patient/booking/booking-wizard"
import { bookingSteps } from "@/content/patient-booking"

describe("findNextAvailableLabel", () => {
  it("returns earliest available slot across clinicians", () => {
    const label = findNextAvailableLabel([
      {
        clinicianId: "c1",
        clinicianName: "Clinician One",
        slots: [
          { slotId: "s1", date: "2026-05-02", startTime: "11:00", endTime: "11:50", available: true },
          { slotId: "s2", date: "2026-05-01", startTime: "15:00", endTime: "15:50", available: true },
        ],
      },
      {
        clinicianId: "c2",
        clinicianName: "Clinician Two",
        slots: [{ slotId: "s3", date: "2026-05-01", startTime: "09:30", endTime: "10:20", available: true }],
      },
    ])

    expect(label).toContain("01")
  })

  it("returns no current slots when none are available", () => {
    const label = findNextAvailableLabel([
      {
        clinicianId: "c1",
        clinicianName: "Clinician One",
        slots: [{ slotId: "s1", date: "2026-05-01", startTime: "11:00", endTime: "11:50", available: false }],
      },
    ])
    expect(label).toBe("No current slots")
  })
})

describe("booking step order (UX-C3)", () => {
  it("places clinical intake before schedule commitment for new patients", () => {
    const scheduleIndex = bookingSteps.findIndex((step) => step.id === "schedule")
    const reasonIndex = bookingSteps.findIndex((step) => step.id === "reason")
    const medicareIndex = bookingSteps.findIndex((step) => step.id === "medicare")
    const clinicalIndex = bookingSteps.findIndex((step) => step.id === "clinical")

    expect(reasonIndex).toBeGreaterThan(-1)
    expect(medicareIndex).toBeGreaterThan(reasonIndex)
    expect(clinicalIndex).toBeGreaterThan(medicareIndex)
    expect(scheduleIndex).toBeGreaterThan(clinicalIndex)
  })
})
