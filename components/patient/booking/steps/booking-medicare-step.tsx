"use client"

import { useBookingWizardContext } from "@/components/patient/booking/booking-wizard-context"
import {
  PortalSelect,
  PortalTextInput,
} from "@/components/shared/portal-form-field"
import { bookingContent, referralSourceOptions } from "@/content/patient-booking"
import { publicPricing } from "@/content/public-pricing"
import type { BookingRequestDraft } from "@/src/patient/booking/types"

export function BookingMedicareStep() {
  const { draft, updateDraft } = useBookingWizardContext()

  if (draft.bookingMeta.bookingType === "follow_up" && draft.bookingMeta.changesSinceLastVisit === "no") {
    return (
      <p className="text-muted-foreground text-sm">
        Medicare and referral details are unchanged for this follow-up booking.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">{bookingContent.helper.medicare}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Mental Health Treatment Plan (MHTP)</label>
          <PortalSelect
            value={draft.medicarePath.hasMhtp}
            onChange={(event) =>
              updateDraft("medicarePath", {
                ...draft.medicarePath,
                hasMhtp: event.target.value as BookingRequestDraft["medicarePath"]["hasMhtp"],
              })
            }
          >
            <option value="unsure">Not sure yet</option>
            <option value="yes">Yes, I have one</option>
            <option value="no">No, I do not have one</option>
          </PortalSelect>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Referral available now?</label>
          <PortalSelect
            value={draft.medicarePath.hasReferral}
            onChange={(event) =>
              updateDraft("medicarePath", {
                ...draft.medicarePath,
                hasReferral: event.target.value as "yes" | "no",
              })
            }
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </PortalSelect>
        </div>

        {draft.medicarePath.hasReferral === "yes" ? (
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Referral type</label>
            <PortalSelect
              value={draft.medicarePath.referralType}
              onChange={(event) =>
                updateDraft("medicarePath", {
                  ...draft.medicarePath,
                  referralType: event.target.value as BookingRequestDraft["medicarePath"]["referralType"],
                })
              }
            >
              <option value="">Select referral type</option>
              {referralSourceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </PortalSelect>
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm font-medium">Estimated sessions used this year</label>
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
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">GP name (optional)</label>
          <PortalTextInput
            value={draft.medicarePath.gpName}
            onChange={(event) =>
              updateDraft("medicarePath", {
                ...draft.medicarePath,
                gpName: event.target.value,
              })
            }
          />
        </div>
      </div>
      <div className="rounded-md border border-border/60 p-3">
        <p className="text-sm font-medium">Indicative out-of-pocket examples</p>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {publicPricing.gapExamples.map((example) => (
            <div key={example.label} className="rounded-md border border-border/50 p-2 text-xs">
              <p className="font-medium">{example.label}</p>
              <p className="text-muted-foreground">Fee: ${example.sessionFeeAud.toFixed(2)}</p>
              <p className="text-muted-foreground">Rebate: ${example.medicareRebateAud.toFixed(2)}</p>
              <p>Estimated gap: ${example.estimatedGapAud.toFixed(2)}</p>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground mt-2 text-xs">{publicPricing.assumptions}</p>
      </div>
    </div>
  )
}
