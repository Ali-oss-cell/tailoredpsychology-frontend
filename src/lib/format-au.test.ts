import { formatAud, formatDateAu, formatDateTimeAu, formatSessionRangeAu, formatTimeAu } from "@/src/lib/format-au"

describe("format-au", () => {
  const sample = new Date("2026-07-10T14:30:00+10:00")

  it("formats dates in en-AU", () => {
    expect(formatDateAu(sample)).toMatch(/10/)
    expect(formatDateAu(sample)).toMatch(/2026/)
  })

  it("formats times in en-AU", () => {
    expect(formatTimeAu(sample)).toMatch(/30/)
    expect(formatTimeAu(sample)).toMatch(/am|pm/i)
  })

  it("formats date-time in en-AU", () => {
    expect(formatDateTimeAu(sample)).toMatch(/10 July 2026/)
    expect(formatDateTimeAu(sample)).toMatch(/30/)
  })

  it("formats AUD currency", () => {
    expect(formatAud(120)).toMatch(/\$120/)
  })

  it("formats session ranges", () => {
    const range = formatSessionRangeAu("2026-07-10T14:30:00+10:00", "2026-07-10T15:00:00+10:00")
    expect(range.date).toMatch(/10/)
    expect(range.time).toContain("–")
  })
})
