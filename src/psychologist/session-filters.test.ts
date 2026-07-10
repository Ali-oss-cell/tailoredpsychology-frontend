import type { SessionSummary } from "@/src/sessions/api"

import { filterSessionsScheduledToday, filterSessionsScheduledOnDay } from "./session-filters"

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

describe("filterSessionsScheduledOnDay", () => {
  it("filters sessions for an explicit selected day", () => {
    const targetDay = new Date(2026, 4, 5, 0, 0, 0)
    const onDay = new Date(2026, 4, 5, 11, 0, 0).toISOString()
    const otherDay = new Date(2026, 4, 6, 11, 0, 0).toISOString()
    const sessions: SessionSummary[] = [
      {
        sessionId: "s1",
        scheduledStartAt: onDay,
        scheduledEndAt: onDay,
        status: "scheduled",
        clinicianId: "c1",
        patientId: "p1",
      },
      {
        sessionId: "s2",
        scheduledStartAt: otherDay,
        scheduledEndAt: otherDay,
        status: "scheduled",
        clinicianId: "c1",
        patientId: "p2",
      },
    ]

    expect(filterSessionsScheduledOnDay(sessions, targetDay).map((row) => row.sessionId)).toEqual(["s1"])
  })
})
