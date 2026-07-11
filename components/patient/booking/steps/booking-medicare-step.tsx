"use client"

import { useBookingWizardContext } from "@/components/patient/booking/booking-wizard-context"
import { StepIntro } from "@/components/shared/step-intro"
import {
  PortalFormField,
  PortalSelect,
  PortalTextInput,
} from "@/components/shared/portal-form-field"
import { bookingContent, referralSourceOptions } from "@/content/patient-booking"
import { publicPricing } from "@/content/public-pricing"
import type { BookingRequestDraft } from "@/src/patient/booking/types"

export function BookingMedicareStep() {
  const { draft, updateDraft, fieldErrors } = useBookingWizardContext()

  if (draft.bookingMeta.bookingType === "follow_up" && draft.bookingMeta.changesSinceLastVisit === "no") {
    return (
      <div className="space-y-4">
        <StepIntro title="Medicare details" description="No changes needed for this follow-up booking." />
        <p className="text-muted-foreground dashboard-card rounded-dashboard-card p-5 text-sm">
          Medicare and referral details are unchanged for this follow-up booking.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <StepIntro
        title="Medicare and referral"
        description={bookingContent.helper.medicare}
      />
      <div className="dashboard-card rounded-dashboard-card grid gap-4 p-5 md:grid-cols-2 md:p-6">
        <PortalFormField
          id="medicare-mhtp"
          label="Mental Health Treatment Plan (MHTP)"
          error={fieldErrors.hasMhtp}
          required
        >
          <PortalSelect
            value={draft.medicarePath.hasMhtp}
            onChange={(event) =>
              updateDraft("medicarePath", {
                ...draft.medicarePath,
                hasMhtp: event.target.value as BookingRequestDraft["medicarePath"]["hasMhtp"],
              })
            }
            hasError={Boolean(fieldErrors.hasMhtp)}
          >
            <option value="unsure">Not sure yet</option>
            <option value="yes">Yes, I have one</option>
            <option value="no">No, I do not have one</option>
          </PortalSelect>
        </PortalFormField>
        <PortalFormField
          id="medicare-referral"
          label="Referral available now?"
          error={fieldErrors.hasReferral}
          required
        >
          <PortalSelect
            value={draft.medicarePath.hasReferral}
            onChange={(event) =>
              updateDraft("medicarePath", {
                ...draft.medicarePath,
                hasReferral: event.target.value as "yes" | "no",
              })
            }
            hasError={Boolean(fieldErrors.hasReferral)}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </PortalSelect>
        </PortalFormField>

        {draft.medicarePath.hasReferral === "yes" ? (
          <PortalFormField
            id="medicare-referral-type"
            label="Referral type"
            error={fieldErrors.referralType}
            required
            className="md:col-span-2"
          >
            <PortalSelect
              value={draft.medicarePath.referralType}
              onChange={(event) =>
                updateDraft("medicarePath", {
                  ...draft.medicarePath,
                  referralType: event.target.value as BookingRequestDraft["medicarePath"]["referralType"],
                })
              }
              hasError={Boolean(fieldErrors.referralType)}
            >
              <option value="">Select referral type</option>
              {referralSourceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </PortalSelect>
          </PortalFormField>
        ) : null}

        <PortalFormField id="sessions-used" label="Estimated sessions used this year">
          <PortalTextInput
            value={draft.medicarePath.sessionsUsedEstimate}
            onChange={(event) =>
              updateDraft("medicarePath", {
                ...draft.medicarePath,
                sessionsUsedEstimate: event.target.value,
              })
            }
            placeholder="e.g. 2 individual sessions"
          />
        </PortalFormField>
        <PortalFormField id="gp-name" label="GP name (optional)">
          <PortalTextInput
            value={draft.medicarePath.gpName}
            onChange={(event) =>
              updateDraft("medicarePath", {
                ...draft.medicarePath,
                gpName: event.target.value,
              })
            }
          />
        </PortalFormField>
      </div>

      <div className="dashboard-card rounded-dashboard-card space-y-3 p-5 md:p-6">
        <p className="text-sm font-semibold">Indicative out-of-pocket examples</p>
        <div className="grid gap-3 md:grid-cols-3">
          {publicPricing.gapExamples.map((example) => (
            <div key={example.label} className="rounded-xl border border-border/50 bg-muted/15 p-3 text-xs">
              <p className="font-medium">{example.label}</p>
              <p className="text-muted-foreground">Fee: ${example.sessionFeeAud.toFixed(2)}</p>
              <p className="text-muted-foreground">Rebate: ${example.medicareRebateAud.toFixed(2)}</p>
              <p>Estimated gap: ${example.estimatedGapAud.toFixed(2)}</p>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed">{publicPricing.assumptions}</p>
      </div>
    </div>
  )
}
