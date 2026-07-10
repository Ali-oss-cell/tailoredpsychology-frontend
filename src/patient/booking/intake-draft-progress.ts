import type { BookingRequestDraft } from "@/src/patient/booking/types"

/** Rough intake completion for onboarding UI (not legal/account-setup gate). */
export function computeIntakeDraftPercent(draft: Partial<BookingRequestDraft> | null | undefined): number {
  if (!draft) return 0

  const checks = [
    Boolean(draft.patientIdentity?.fullName?.trim()),
    Boolean(draft.patientIdentity?.dateOfBirth),
    Boolean(draft.patientIdentity?.mobile?.trim()),
    Boolean(draft.patientIdentity?.suburb?.trim()),
    Boolean(draft.patientIdentity?.state),
    Boolean(draft.patientIdentity?.preferredContactMethod),
    Boolean(draft.careContext?.presentingConcerns?.trim()),
    Boolean(draft.medicarePath?.hasMhtp),
    Boolean(draft.telehealthSafety?.emergencyContactName?.trim()),
    Boolean(draft.telehealthSafety?.emergencyContactPhone?.trim()),
    Boolean(draft.consents?.privacyAccepted),
    Boolean(draft.consents?.telehealthAccepted),
    Boolean(draft.consents?.treatmentAccepted),
  ]

  const filled = checks.filter(Boolean).length
  return Math.round((filled / checks.length) * 100)
}
