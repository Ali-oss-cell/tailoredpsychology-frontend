import * as React from "react"
import Link from "next/link"

import { PortalCheckboxField } from "@/components/shared/portal-form-field"
import { bookingContent } from "@/content/patient-booking"
import type { BookingRequestDraft } from "@/src/patient/booking/types"

type BookingConsentCheckboxesProps = {
  consents: BookingRequestDraft["consents"]
  fieldErrors?: Partial<Record<keyof BookingRequestDraft["consents"], string>>
  onChange: (next: BookingRequestDraft["consents"]) => void
}

export function BookingConsentCheckboxes({ consents, fieldErrors, onChange }: BookingConsentCheckboxesProps) {
  const copy = bookingContent.consentText
  const linkClass = "text-primary font-medium underline-offset-4 hover:underline"

  return (
    <div className="space-y-3">
      <PortalCheckboxField
        id="consent-privacy"
        checked={consents.privacyAccepted}
        error={fieldErrors?.privacyAccepted}
        onChange={(privacyAccepted) => onChange({ ...consents, privacyAccepted })}
        className="dashboard-card rounded-dashboard-card border-border/60 bg-muted/15 p-4"
        label={
          <>
            {copy.privacyPrefix}{" "}
            <Link href="/privacy-policy" className={linkClass} target="_blank" rel="noopener noreferrer">
              {copy.privacyLink}
            </Link>{" "}
            {copy.privacySuffix}
          </>
        }
      />
      <PortalCheckboxField
        id="consent-telehealth"
        checked={consents.telehealthAccepted}
        error={fieldErrors?.telehealthAccepted}
        onChange={(telehealthAccepted) => onChange({ ...consents, telehealthAccepted })}
        className="dashboard-card rounded-dashboard-card border-border/60 bg-muted/15 p-4"
        label={
          <>
            {copy.telehealthPrefix}{" "}
            <Link href="/telehealth-requirements" className={linkClass} target="_blank" rel="noopener noreferrer">
              {copy.telehealthLink}
            </Link>{" "}
            {copy.telehealthSuffix}
          </>
        }
      />
      <PortalCheckboxField
        id="consent-treatment"
        checked={consents.treatmentAccepted}
        error={fieldErrors?.treatmentAccepted}
        onChange={(treatmentAccepted) => onChange({ ...consents, treatmentAccepted })}
        className="dashboard-card rounded-dashboard-card border-border/60 bg-muted/15 p-4"
        label={
          <>
            {copy.treatmentPrefix}{" "}
            <Link href="/terms-of-service" className={linkClass} target="_blank" rel="noopener noreferrer">
              {copy.termsLink}
            </Link>{" "}
            {copy.treatmentSuffix}
          </>
        }
      />
    </div>
  )
}
