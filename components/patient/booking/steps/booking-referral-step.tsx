"use client"

import { CompactDatePicker } from "@/components/patient/booking/compact-date-picker"
import { ReferralUpload } from "@/components/patient/booking/referral-upload"
import { useBookingWizardContext } from "@/components/patient/booking/booking-wizard-context"
import { PortalSelect, PortalTextarea } from "@/components/shared/portal-form-field"
import { bookingContent, referralSourceOptions } from "@/content/patient-booking"
import type { BookingRequestDraft } from "@/src/patient/booking/types"

export function BookingReferralStep() {
  const { draft, updateDraft } = useBookingWizardContext()

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">{bookingContent.helper.referralUpload}</p>
      <ReferralUpload value={draft.referralFile} onChange={(next) => updateDraft("referralFile", next)} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Referral source</label>
          <PortalSelect
            value={draft.referralFile.sourceType}
            onChange={(event) =>
              updateDraft("referralFile", {
                ...draft.referralFile,
                sourceType: event.target.value as BookingRequestDraft["referralFile"]["sourceType"],
              })
            }
          >
            <option value="">Select source</option>
            {referralSourceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </PortalSelect>
        </div>
        <CompactDatePicker
          id="referral-date"
          label="Referral date"
          value={draft.referralFile.referralDate}
          onChange={(next) =>
            updateDraft("referralFile", {
              ...draft.referralFile,
              referralDate: next,
            })
          }
          capAtToday={false}
        />
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Referral notes (optional)</label>
          <PortalTextarea
            rows={3}
            value={draft.referralFile.notes}
            onChange={(event) =>
              updateDraft("referralFile", {
                ...draft.referralFile,
                notes: event.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
