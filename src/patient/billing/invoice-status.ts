/**
 * Canonical invoice status kinds for UI.
 * API / DB currently emit title-case `Paid` and `Pending` (free-form string).
 * `overdue` / `failed` are defensive fallbacks if the API adds them later.
 */
export type InvoiceStatusKind = "paid" | "pending" | "overdue" | "failed" | "unknown"

const LABEL_BY_KIND: Record<Exclude<InvoiceStatusKind, "unknown">, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
  failed: "Failed",
}

/** Map raw API status (any casing / common aliases) to a UI kind. */
export function normalizeInvoiceStatus(status: string): InvoiceStatusKind {
  const normalized = status.trim().toLowerCase().replace(/[\s-]+/g, "_")
  switch (normalized) {
    case "paid":
    case "complete":
    case "completed":
    case "settled":
      return "paid"
    case "pending":
    case "unpaid":
    case "open":
    case "awaiting_payment":
      return "pending"
    case "overdue":
    case "past_due":
      return "overdue"
    case "failed":
    case "payment_failed":
    case "declined":
      return "failed"
    default:
      return "unknown"
  }
}

/** Stable display label; unknown keeps the trimmed API string when present. */
export function invoiceStatusLabel(status: string): string {
  const kind = normalizeInvoiceStatus(status)
  if (kind !== "unknown") return LABEL_BY_KIND[kind]
  const trimmed = status.trim()
  return trimmed.length > 0 ? trimmed : "Unknown"
}

export function isInvoiceUnpaid(status: string): boolean {
  const kind = normalizeInvoiceStatus(status)
  return kind === "pending" || kind === "overdue" || kind === "failed"
}
