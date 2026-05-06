import type { SessionSummary } from "@/src/sessions/api"

import { filterSessionsScheduledToday } from "./session-filters"

describe("filterSessionsScheduledToday", () => {
  it("keeps only sessions on the same local calendar day as the anchor instant", () => {
    const anchor = new Date(2026, 4, 2, 14, 0, 0)
    const sameLocalDay = new Date(2026, 4, 2, 9, 30, 0).toISOString()
    const nextLocalDay = new Date(2026, 4, 3, 8, 0, 0).toISOString()
    const sameDay: SessionSummary = {
      sessionId: "s1",
      scheduledStartAt: sameLocalDay,
      scheduledEndAt: sameLocalDay,
      status: "scheduled",
      clinicianId: "c1",
      patientId: "p1",
    }
    const otherDay: SessionSummary = {
      ...sameDay,
      sessionId: "s2",
      scheduledStartAt: nextLocalDay,
    }
    const out = filterSessionsScheduledToday([sameDay, otherDay], anchor.getTime())
    expect(out.map((s) => s.sessionId)).toEqual(["s1"])
  })
})
