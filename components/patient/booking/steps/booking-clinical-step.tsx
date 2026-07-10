"use client"

import { useBookingWizardContext } from "@/components/patient/booking/booking-wizard-context"
import {
  PortalFormField,
  PortalSelect,
  PortalTextarea,
  PortalTextInput,
} from "@/components/shared/portal-form-field"
import { appointmentModalityOptions, clinicianGenderOptions } from "@/content/patient-booking"
import { AU_MOBILE_HINT, formatAuMobileDisplay } from "@/src/lib/au-mobile"
import type { BookingRequestDraft } from "@/src/patient/booking/types"

export function BookingClinicalStep() {
  const { draft, updateDraft, fieldErrors } = useBookingWizardContext()
  const requireClinicalUpdate =
    draft.bookingMeta.bookingType === "initial" || draft.bookingMeta.changesSinceLastVisit === "yes"

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <PortalFormField
        id="symptom-duration"
        label="How long have symptoms affected you?"
        error={fieldErrors.symptomDuration}
        required={requireClinicalUpdate}
        className="md:col-span-2"
      >
        <PortalTextInput
          value={draft.careContext.symptomDuration}
          onChange={(event) =>
            updateDraft("careContext", { ...draft.careContext, symptomDuration: event.target.value })
          }
          placeholder="e.g. 6 months"
          disabled={!requireClinicalUpdate}
          hasError={Boolean(fieldErrors.symptomDuration)}
        />
      </PortalFormField>
      <PortalFormField
        id="session-modality"
        label="Preferred session format"
        error={fieldErrors.modality}
        required
        className="md:col-span-2"
      >
        <PortalSelect
          value={draft.preferences.modality}
          onChange={(event) =>
            updateDraft("preferences", {
              ...draft.preferences,
              modality: event.target.value as BookingRequestDraft["preferences"]["modality"],
            })
          }
          hasError={Boolean(fieldErrors.modality)}
        >
          {appointmentModalityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </PortalSelect>
      </PortalFormField>
      <PortalFormField id="prior-care" label="Previous therapy or care" className="md:col-span-1">
        <PortalTextarea
          rows={3}
          value={draft.careContext.priorCare}
          onChange={(event) =>
            updateDraft("careContext", { ...draft.careContext, priorCare: event.target.value })
          }
          disabled={!requireClinicalUpdate}
        />
      </PortalFormField>
      <PortalFormField id="current-medications" label="Current medications" className="md:col-span-1">
        <PortalTextarea
          rows={3}
          value={draft.careContext.currentMedications}
          onChange={(event) =>
            updateDraft("careContext", { ...draft.careContext, currentMedications: event.target.value })
          }
          disabled={!requireClinicalUpdate}
        />
      </PortalFormField>
      <PortalFormField
        id="session-location"
        label="Where you'll join telehealth sessions"
        hint="Describe the private space you usually use — e.g. home office with reliable internet. This is separate from your postal suburb above."
        error={fieldErrors.currentSessionLocation}
        required
      >
        <PortalTextInput
          value={draft.telehealthSafety.currentSessionLocation}
          onChange={(event) =>
            updateDraft("telehealthSafety", {
              ...draft.telehealthSafety,
              currentSessionLocation: event.target.value,
            })
          }
          placeholder="e.g. Home — quiet room with reliable internet"
          hasError={Boolean(fieldErrors.currentSessionLocation)}
        />
      </PortalFormField>
      <PortalFormField
        id="emergency-contact-name"
        label="Emergency contact name"
        hint="Saved to your account for future sessions."
        error={fieldErrors.emergencyContactName}
        required
      >
        <PortalTextInput
          value={draft.telehealthSafety.emergencyContactName}
          onChange={(event) =>
            updateDraft("telehealthSafety", {
              ...draft.telehealthSafety,
              emergencyContactName: event.target.value,
            })
          }
          hasError={Boolean(fieldErrors.emergencyContactName)}
        />
      </PortalFormField>
      <PortalFormField
        id="emergency-contact-phone"
        label="Emergency contact phone"
        hint={AU_MOBILE_HINT}
        error={fieldErrors.emergencyContactPhone}
        required
      >
        <PortalTextInput
          value={draft.telehealthSafety.emergencyContactPhone}
          onChange={(event) =>
            updateDraft("telehealthSafety", {
              ...draft.telehealthSafety,
              emergencyContactPhone: event.target.value,
            })
          }
          onBlur={(event) => {
            const formatted = formatAuMobileDisplay(event.target.value)
            if (formatted !== event.target.value) {
              updateDraft("telehealthSafety", {
                ...draft.telehealthSafety,
                emergencyContactPhone: formatted,
              })
            }
          }}
          inputMode="tel"
          autoComplete="tel"
          hasError={Boolean(fieldErrors.emergencyContactPhone)}
        />
      </PortalFormField>
      <PortalFormField id="emergency-contact-relationship" label="Relationship">
        <PortalTextInput
          value={draft.telehealthSafety.emergencyContactRelationship}
          onChange={(event) =>
            updateDraft("telehealthSafety", {
              ...draft.telehealthSafety,
              emergencyContactRelationship: event.target.value,
            })
          }
        />
      </PortalFormField>
      <PortalFormField id="preferred-clinician-gender" label="Preferred clinician gender">
        <PortalSelect
          value={draft.preferences.preferredClinicianGender}
          onChange={(event) =>
            updateDraft("preferences", {
              ...draft.preferences,
              preferredClinicianGender:
                event.target.value as BookingRequestDraft["preferences"]["preferredClinicianGender"],
            })
          }
        >
          {clinicianGenderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </PortalSelect>
      </PortalFormField>
      <PortalFormField id="preferred-language" label="Preferred language (optional)">
        <PortalTextInput
          value={draft.preferences.preferredLanguage}
          onChange={(event) =>
            updateDraft("preferences", {
              ...draft.preferences,
              preferredLanguage: event.target.value,
            })
          }
          placeholder="e.g. English, Arabic"
        />
      </PortalFormField>
    </div>
  )
}
