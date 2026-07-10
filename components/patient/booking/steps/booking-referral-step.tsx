"use client"

import { CompactDatePicker } from "@/components/patient/booking/compact-date-picker"
import { ReferralUpload } from "@/components/patient/booking/referral-upload"
import { useBookingWizardContext } from "@/components/patient/booking/booking-wizard-context"
import { StepIntro } from "@/components/shared/step-intro"
import { PortalFormField, PortalSelect, PortalTextarea } from "@/components/shared/portal-form-field"
import { bookingContent, referralSourceOptions } from "@/content/patient-booking"
import type { BookingRequestDraft } from "@/src/patient/booking/types"

export function BookingReferralStep() {
  const { draft, updateDraft } = useBookingWizardContext()

  return (
    <div className="space-y-6">
      <StepIntro
        title="Referral document"
        description={bookingContent.helper.referralUpload}
      />
      <div className="dashboard-card rounded-dashboard-card space-y-5 p-5 md:p-6">
        <ReferralUpload value={draft.referralFile} onChange={(next) => updateDraft("referralFile", next)} />
        <div className="grid gap-4 md:grid-cols-2">
          <PortalFormField id="referral-source" label="Referral source">
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
          </PortalFormField>
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
          <PortalFormField id="referral-notes" label="Referral notes (optional)" className="md:col-span-2">
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
          </PortalFormField>
        </div>
      </div>
    </div>
  )
}
