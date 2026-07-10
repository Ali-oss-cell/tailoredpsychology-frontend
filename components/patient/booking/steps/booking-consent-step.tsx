"use client"

import { BookingConsentCheckboxes } from "@/components/patient/booking/booking-consent-checkboxes"
import { useBookingWizardContext } from "@/components/patient/booking/booking-wizard-context"
import { InlinePurposeHint } from "@/components/shared/inline-purpose-hint"

export function BookingConsentStep() {
  const { draft, updateDraft, fieldErrors } = useBookingWizardContext()

  return (
    <div className="space-y-3">
      <InlinePurposeHint>
        These confirmations are required before we can securely hold your health information and deliver telehealth care.
      </InlinePurposeHint>
      <BookingConsentCheckboxes
        consents={draft.consents}
        fieldErrors={{
          privacyAccepted: fieldErrors.privacyAccepted,
          telehealthAccepted: fieldErrors.telehealthAccepted,
          treatmentAccepted: fieldErrors.treatmentAccepted,
        }}
        onChange={(consents) => updateDraft("consents", consents)}
      />
    </div>
  )
}
