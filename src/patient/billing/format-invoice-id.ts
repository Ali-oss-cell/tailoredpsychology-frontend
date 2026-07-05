/** Shorten long Stripe-style invoice ids for display; full id stays in `title` / copy. */
export function formatInvoiceIdDisplay(invoiceId: string, maxLength = 28): string {
  if (invoiceId.length <= maxLength) return invoiceId
  const head = invoiceId.slice(0, 14)
  const tail = invoiceId.slice(-10)
  return `${head}…${tail}`
}
