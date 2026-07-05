import { formatInvoiceIdDisplay } from "@/src/patient/billing/format-invoice-id"

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
