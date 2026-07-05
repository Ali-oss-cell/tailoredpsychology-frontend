/**
 * Public legal contact details — filled by counsel after review.
 * Set `approvedForProduction: true` only after counsel sign-off in LEGAL_SIGNOFF_TRACKER.md.
 */
export const publicContactDetails = {
  approvedForProduction: false,
  entityName: "Tailored Psychology Pty Ltd",
  privacyOfficerName: "", // counsel to provide
  privacyEmail: "", // counsel to provide
  generalEmail: "", // counsel to provide
  phone: "", // counsel to provide
  postalAddress: "", // counsel to provide (multi-line string)
  abn: "", // optional — counsel to confirm if required
} as const

export function hasPublishedContactDetails(): boolean {
  if (!publicContactDetails.approvedForProduction) return false
  return Boolean(
    publicContactDetails.privacyEmail.trim() ||
      publicContactDetails.generalEmail.trim() ||
      publicContactDetails.phone.trim() ||
      publicContactDetails.postalAddress.trim(),
  )
}
