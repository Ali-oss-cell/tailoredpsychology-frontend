import {
  invoiceStatusLabel,
  isInvoiceUnpaid,
  normalizeInvoiceStatus,
} from "@/src/patient/billing/invoice-status"

describe("normalizeInvoiceStatus", () => {
  it("maps Paid/Pending case-insensitively", () => {
    expect(normalizeInvoiceStatus("Paid")).toBe("paid")
    expect(normalizeInvoiceStatus("PAID")).toBe("paid")
    expect(normalizeInvoiceStatus(" pending ")).toBe("pending")
    expect(normalizeInvoiceStatus("Pending")).toBe("pending")
  })

  it("maps common aliases", () => {
    expect(normalizeInvoiceStatus("unpaid")).toBe("pending")
    expect(normalizeInvoiceStatus("awaiting payment")).toBe("pending")
    expect(normalizeInvoiceStatus("past_due")).toBe("overdue")
    expect(normalizeInvoiceStatus("payment-failed")).toBe("failed")
  })

  it("keeps overdue/failed as defensive kinds", () => {
    expect(normalizeInvoiceStatus("Overdue")).toBe("overdue")
    expect(normalizeInvoiceStatus("Failed")).toBe("failed")
  })

  it("returns unknown for unrecognized values", () => {
    expect(normalizeInvoiceStatus("refunded")).toBe("unknown")
    expect(normalizeInvoiceStatus("")).toBe("unknown")
  })
})

describe("invoiceStatusLabel", () => {
  it("returns title-case for known kinds", () => {
    expect(invoiceStatusLabel("paid")).toBe("Paid")
    expect(invoiceStatusLabel("PENDING")).toBe("Pending")
    expect(invoiceStatusLabel("overdue")).toBe("Overdue")
    expect(invoiceStatusLabel("failed")).toBe("Failed")
  })

  it("preserves unknown raw status text", () => {
    expect(invoiceStatusLabel("Refunded")).toBe("Refunded")
    expect(invoiceStatusLabel("  ")).toBe("Unknown")
  })
})

describe("isInvoiceUnpaid", () => {
  it("treats pending/overdue/failed as unpaid", () => {
    expect(isInvoiceUnpaid("Pending")).toBe(true)
    expect(isInvoiceUnpaid("Overdue")).toBe(true)
    expect(isInvoiceUnpaid("Failed")).toBe(true)
    expect(isInvoiceUnpaid("Paid")).toBe(false)
    expect(isInvoiceUnpaid("Refunded")).toBe(false)
  })
})
