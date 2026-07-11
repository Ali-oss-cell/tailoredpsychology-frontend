import {
  formatInvoiceIdDisplay,
  formatInvoiceIssuedDate,
  formatInvoiceReferenceLabel,
} from "@/src/patient/billing/format-invoice-id"

describe("formatInvoiceIdDisplay", () => {
  it("returns short ids unchanged", () => {
    expect(formatInvoiceIdDisplay("INV-1042")).toBe("INV-1042")
  })

  it("truncates long ids with ellipsis", () => {
    const longId = "inv_br_9649694c84e64999b1f2d17678deeb44"
    const display = formatInvoiceIdDisplay(longId)
    expect(display.length).toBeLessThan(longId.length)
    expect(display).toContain("…")
  })
})

describe("formatInvoiceIssuedDate", () => {
  it("formats parseable dates in en-AU style", () => {
    expect(formatInvoiceIssuedDate("2026-06-01T00:00:00.000Z")).toMatch(/Jun/)
    expect(formatInvoiceIssuedDate("2026-06-01T00:00:00.000Z")).toMatch(/2026/)
  })

  it("returns server copy when parsing fails", () => {
    expect(formatInvoiceIssuedDate("not-a-date")).toBe("not-a-date")
  })
})

describe("formatInvoiceReferenceLabel", () => {
  it("uses human invoice numbers for short ids", () => {
    expect(formatInvoiceReferenceLabel("INV-1042", "24 Oct 2026")).toBe("Invoice · INV-1042")
  })

  it("uses date for long internal ids", () => {
    const longId = "inv_br_9649694c84e64999b1f2d17678deeb44"
    expect(formatInvoiceReferenceLabel(longId, "1 June 2026")).toBe("Invoice · 1 June 2026")
  })

  it("falls back to last eight characters without a date", () => {
    const longId = "inv_br_9649694c84e64999b1f2d17678deeb44"
    expect(formatInvoiceReferenceLabel(longId, "")).toBe("Invoice · …78deeb44")
  })
})
