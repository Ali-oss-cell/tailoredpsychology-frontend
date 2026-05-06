import { findNextAvailableLabel } from "@/components/patient/booking/booking-wizard"

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
