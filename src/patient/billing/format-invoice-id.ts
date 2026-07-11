import { formatDateAu } from "@/src/lib/format-au"

const LONG_ID_PREFIX = /^inv_/

/** Shorten long Stripe-style invoice ids for display; full id stays in `title` / copy. */
export function formatInvoiceIdDisplay(invoiceId: string, maxLength = 28): string {
  if (invoiceId.length <= maxLength) return invoiceId
  const head = invoiceId.slice(0, 14)
  const tail = invoiceId.slice(-10)
  return `${head}…${tail}`
}

/** Prefer en-AU formatting when the API value is parseable; otherwise keep server copy. */
export function formatInvoiceIssuedDate(issuedDate: string): string {
  const trimmed = issuedDate.trim()
  if (!trimmed) return issuedDate
  const parsed = Date.parse(trimmed)
  if (!Number.isNaN(parsed)) {
    return formatDateAu(new Date(parsed))
  }
  return issuedDate
}

/** Patient-facing reference — never lead with a raw Stripe/internal id. */
export function formatInvoiceReferenceLabel(invoiceId: string, dateLabel: string): string {
  const isLongInternalId = invoiceId.length > 16 || LONG_ID_PREFIX.test(invoiceId)
  if (!isLongInternalId) {
    return `Invoice · ${invoiceId}`
  }
  if (dateLabel) {
    return `Invoice · ${dateLabel}`
  }
  return `Invoice · …${invoiceId.slice(-8)}`
}
