"use client"

import { BookingCrisisPanel } from "@/components/patient/booking/booking-crisis-panel"
import { CompactDatePicker } from "@/components/patient/booking/compact-date-picker"
import { useBookingWizardContext } from "@/components/patient/booking/booking-wizard-context"
import { StepIntro } from "@/components/shared/step-intro"
import {
  PortalFormField,
  PortalSelect,
  PortalTextarea,
  PortalTextInput,
} from "@/components/shared/portal-form-field"
import { australianStates } from "@/content/get-matched-quiz"
import {
  indigenousStatusOptions,
  preferredContactMethodOptions,
} from "@/content/patient-booking"
import { AU_MOBILE_HINT, formatAuMobileDisplay } from "@/src/lib/au-mobile"
import type { BookingRequestDraft } from "@/src/patient/booking/types"

export function BookingReasonStep() {
  const { draft, updateDraft, fieldErrors, bookingEligibility } = useBookingWizardContext()
  const isInitial = draft.bookingMeta.bookingType === "initial"
  const requireCareSummary = isInitial || draft.bookingMeta.changesSinceLastVisit === "yes"

  return (
    <div className="space-y-6">
      <StepIntro
        title="About you and your care needs"
        description="Tell us how to reach you and what brings you in today. Fields marked with an asterisk are required."
      />
      <div className="dashboard-card rounded-dashboard-card grid gap-4 p-5 md:grid-cols-2 md:p-6">
      <PortalFormField
        id="patient-full-name"
        label="Full legal name"
        error={fieldErrors.fullName}
        required={isInitial}
        hint={!isInitial ? "We'll save this to your account." : undefined}
      >
        <PortalTextInput
          value={draft.patientIdentity.fullName}
          onChange={(event) =>
            updateDraft("patientIdentity", { ...draft.patientIdentity, fullName: event.target.value })
          }
          placeholder="Full name"
          disabled={!isInitial}
          hasError={Boolean(fieldErrors.fullName)}
        />
      </PortalFormField>
      <CompactDatePicker
        id="patient-date-of-birth"
        label="Date of birth"
        value={draft.patientIdentity.dateOfBirth}
        onChange={(next) => updateDraft("patientIdentity", { ...draft.patientIdentity, dateOfBirth: next })}
        disabled={!isInitial}
        error={fieldErrors.dateOfBirth}
        required={isInitial}
      />
      <PortalFormField
        id="patient-mobile"
        label="Mobile"
        hint={`${AU_MOBILE_HINT} Saved to your account when you complete booking.`}
        error={fieldErrors.mobile}
        required
      >
        <PortalTextInput
          value={draft.patientIdentity.mobile}
          onChange={(event) =>
            updateDraft("patientIdentity", { ...draft.patientIdentity, mobile: event.target.value })
          }
          onBlur={(event) => {
            const formatted = formatAuMobileDisplay(event.target.value)
            if (formatted !== event.target.value) {
              updateDraft("patientIdentity", { ...draft.patientIdentity, mobile: formatted })
            }
          }}
          placeholder="04XX XXX XXX"
          inputMode="tel"
          autoComplete="tel"
          hasError={Boolean(fieldErrors.mobile)}
        />
      </PortalFormField>
      <PortalFormField
        id="patient-email"
        label="Email"
        hint={
          bookingEligibility.email
            ? "Email is managed on your account and cannot be changed here."
            : "We'll save this to your account."
        }
      >
        <PortalTextInput
          type="email"
          value={draft.patientIdentity.email}
          onChange={(event) =>
            updateDraft("patientIdentity", { ...draft.patientIdentity, email: event.target.value })
          }
          placeholder="name@example.com"
          readOnly={Boolean(bookingEligibility.email)}
          aria-readonly={Boolean(bookingEligibility.email)}
          disabled={Boolean(bookingEligibility.email)}
        />
      </PortalFormField>
      <PortalFormField
        id="patient-suburb"
        label="Suburb"
        hint="Your home suburb — saved to your account for billing and care coordination."
        error={fieldErrors.suburb}
        required={isInitial}
      >
        <PortalTextInput
          value={draft.patientIdentity.suburb}
          onChange={(event) =>
            updateDraft("patientIdentity", { ...draft.patientIdentity, suburb: event.target.value })
          }
          placeholder="e.g. Parramatta"
          hasError={Boolean(fieldErrors.suburb)}
        />
      </PortalFormField>
      <PortalFormField
        id="patient-state"
        label="State or territory"
        error={fieldErrors.state}
        required={isInitial}
      >
        <PortalSelect
          value={draft.patientIdentity.state}
          onChange={(event) =>
            updateDraft("patientIdentity", { ...draft.patientIdentity, state: event.target.value })
          }
          hasError={Boolean(fieldErrors.state)}
        >
          <option value="">Select state</option>
          {australianStates.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </PortalSelect>
      </PortalFormField>
      <PortalFormField
        id="patient-preferred-contact"
        label="Preferred contact method"
        error={fieldErrors.preferredContactMethod}
        required
        className="md:col-span-2"
      >
        <PortalSelect
          value={draft.patientIdentity.preferredContactMethod}
          onChange={(event) =>
            updateDraft("patientIdentity", {
              ...draft.patientIdentity,
              preferredContactMethod: event.target.value as BookingRequestDraft["patientIdentity"]["preferredContactMethod"],
            })
          }
          hasError={Boolean(fieldErrors.preferredContactMethod)}
        >
          {preferredContactMethodOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </PortalSelect>
      </PortalFormField>
      <PortalFormField
        id="presenting-concerns"
        label="What brings you in today?"
        error={fieldErrors.presentingConcerns}
        required={requireCareSummary}
        className="md:col-span-2"
      >
        <PortalTextarea
          rows={4}
          value={draft.careContext.presentingConcerns}
          onChange={(event) =>
            updateDraft("careContext", { ...draft.careContext, presentingConcerns: event.target.value })
          }
          placeholder={
            requireCareSummary
              ? "Briefly describe your goals or concerns."
              : "No update required if nothing has changed."
          }
          disabled={!requireCareSummary}
          hasError={Boolean(fieldErrors.presentingConcerns)}
        />
      </PortalFormField>
      <PortalFormField id="urgency" label="Urgency" className="md:col-span-2">
        <PortalSelect
          value={draft.careContext.riskFlag}
          onChange={(event) =>
            updateDraft("careContext", {
              ...draft.careContext,
              riskFlag: event.target.value as BookingRequestDraft["careContext"]["riskFlag"],
            })
          }
        >
          <option value="none">Standard booking (no immediate safety concerns)</option>
          <option value="urgent_support_needed">I need urgent support from the care team</option>
        </PortalSelect>
      </PortalFormField>
      {draft.careContext.riskFlag === "urgent_support_needed" ? (
        <div className="md:col-span-2">
          <BookingCrisisPanel />
        </div>
      ) : null}
      <PortalFormField
        id="indigenous-status"
        label="Aboriginal and Torres Strait Islander status (optional)"
        className="md:col-span-2"
      >
        <PortalSelect
          value={draft.patientIdentity.indigenousStatus}
          onChange={(event) =>
            updateDraft("patientIdentity", {
              ...draft.patientIdentity,
              indigenousStatus: event.target.value as BookingRequestDraft["patientIdentity"]["indigenousStatus"],
            })
          }
        >
          {indigenousStatusOptions.map((opt) => (
            <option key={opt.value || "unset"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </PortalSelect>
      </PortalFormField>
      </div>
    </div>
  )
}
