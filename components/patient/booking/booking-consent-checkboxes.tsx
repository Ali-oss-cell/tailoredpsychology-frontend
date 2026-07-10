import * as React from "react"
import Link from "next/link"

import { bookingContent } from "@/content/patient-booking"
import type { BookingRequestDraft } from "@/src/patient/booking/types"

type BookingConsentCheckboxesProps = {
  consents: BookingRequestDraft["consents"]
  fieldErrors?: Partial<Record<keyof BookingRequestDraft["consents"], string>>
  onChange: (next: BookingRequestDraft["consents"]) => void
}

function ConsentRow({
  id,
  checked,
  error,
  onChange,
  children,
}: {
  id: string
  checked: boolean
  error?: string
  onChange: (checked: boolean) => void
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={id}
      className="bg-muted/35 flex items-start gap-3 rounded-lg border border-border/60 p-3 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-2"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <span className="text-sm leading-relaxed">{children}</span>
      {error ? (
        <span id={`${id}-error`} className="sr-only">
          {error}
        </span>
      ) : null}
    </label>
  )
}

export function BookingConsentCheckboxes({ consents, fieldErrors, onChange }: BookingConsentCheckboxesProps) {
  const copy = bookingContent.consentText
  const linkClass = "text-primary font-medium underline-offset-4 hover:underline"

  return (
    <div className="space-y-3">
      <ConsentRow
        id="consent-privacy"
        checked={consents.privacyAccepted}
        error={fieldErrors?.privacyAccepted}
        onChange={(privacyAccepted) => onChange({ ...consents, privacyAccepted })}
      >
        {copy.privacyPrefix}{" "}
        <Link href="/privacy-policy" className={linkClass} target="_blank" rel="noopener noreferrer">
          {copy.privacyLink}
        </Link>{" "}
        {copy.privacySuffix}
      </ConsentRow>
      <ConsentRow
        id="consent-telehealth"
        checked={consents.telehealthAccepted}
        error={fieldErrors?.telehealthAccepted}
        onChange={(telehealthAccepted) => onChange({ ...consents, telehealthAccepted })}
      >
        {copy.telehealthPrefix}{" "}
        <Link href="/telehealth-requirements" className={linkClass} target="_blank" rel="noopener noreferrer">
          {copy.telehealthLink}
        </Link>{" "}
        {copy.telehealthSuffix}
      </ConsentRow>
      <ConsentRow
        id="consent-treatment"
        checked={consents.treatmentAccepted}
        error={fieldErrors?.treatmentAccepted}
        onChange={(treatmentAccepted) => onChange({ ...consents, treatmentAccepted })}
      >
        {copy.treatmentPrefix}{" "}
        <Link href="/terms-of-service" className={linkClass} target="_blank" rel="noopener noreferrer">
          {copy.termsLink}
        </Link>{" "}
        {copy.treatmentSuffix}
      </ConsentRow>
    </div>
  )
}
