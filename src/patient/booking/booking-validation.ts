import type { BookingRequestDraft, BookingStepId } from "@/src/patient/booking/types"

export type BookingFieldErrors = Partial<Record<string, string>>

export type BookingStepValidation = {
  fieldErrors: BookingFieldErrors
  summaryErrors: string[]
}

function pushField(
  fieldErrors: BookingFieldErrors,
  summaryErrors: string[],
  field: string,
  message: string,
) {
  fieldErrors[field] = message
  summaryErrors.push(message)
}

export function validateBookingStep(
  step: BookingStepId,
  draft: BookingRequestDraft,
): BookingStepValidation {
  const fieldErrors: BookingFieldErrors = {}
  const summaryErrors: string[] = []
  const isInitial = draft.bookingMeta.bookingType === "initial"
  const hasChanges = draft.bookingMeta.changesSinceLastVisit === "yes"

  if (step === "mode") {
    if (!draft.bookingMeta.bookingType) {
      pushField(fieldErrors, summaryErrors, "bookingType", "Please select booking type.")
    }
  }

  if (step === "schedule") {
    if (!draft.scheduleSelection.selectedClinicianId) {
      pushField(fieldErrors, summaryErrors, "selectedClinicianId", "Please select a clinician or choose no preference.")
    }
    if (!draft.scheduleSelection.selectedDate) {
      pushField(fieldErrors, summaryErrors, "selectedDate", "Please select a date from schedule.")
    }
    if (!draft.scheduleSelection.selectedSlotId) {
      pushField(fieldErrors, summaryErrors, "selectedSlotId", "Please select an available time slot.")
    }
  }

  if (step === "reason") {
    if (isInitial && !draft.patientIdentity.fullName.trim()) {
      pushField(fieldErrors, summaryErrors, "fullName", "Full name is required.")
    }
    if (isInitial && !draft.patientIdentity.dateOfBirth) {
      pushField(fieldErrors, summaryErrors, "dateOfBirth", "Date of birth is required.")
    }
    if (!draft.patientIdentity.mobile.trim()) {
      pushField(fieldErrors, summaryErrors, "mobile", "Mobile number is required.")
    }
    if (isInitial && !draft.patientIdentity.suburb.trim()) {
      pushField(fieldErrors, summaryErrors, "suburb", "Suburb is required.")
    }
    if (isInitial && !draft.patientIdentity.state) {
      pushField(fieldErrors, summaryErrors, "state", "State or territory is required.")
    }
    if (!draft.patientIdentity.preferredContactMethod) {
      pushField(fieldErrors, summaryErrors, "preferredContactMethod", "Please select a preferred contact method.")
    }
    if ((isInitial || hasChanges) && !draft.careContext.presentingConcerns.trim()) {
      pushField(fieldErrors, summaryErrors, "presentingConcerns", "Please describe your main concern.")
    }
  }

  if (step === "medicare") {
    if (draft.bookingMeta.bookingType === "follow_up" && draft.bookingMeta.changesSinceLastVisit === "no") {
      return { fieldErrors: {}, summaryErrors: [] }
    }
    if (!draft.medicarePath.hasMhtp) {
      pushField(fieldErrors, summaryErrors, "hasMhtp", "Please select whether you have a mental health treatment plan.")
    }
    if (!draft.medicarePath.hasReferral) {
      pushField(fieldErrors, summaryErrors, "hasReferral", "Please select whether you have a referral.")
    }
    if (draft.medicarePath.hasReferral === "yes" && !draft.medicarePath.referralType) {
      pushField(fieldErrors, summaryErrors, "referralType", "Please select a referral type.")
    }
  }

  if (step === "clinical") {
    if ((isInitial || hasChanges) && !draft.careContext.symptomDuration.trim()) {
      pushField(fieldErrors, summaryErrors, "symptomDuration", "Please provide symptom duration.")
    }
    if (!draft.preferences.modality) {
      pushField(fieldErrors, summaryErrors, "modality", "Please select your preferred session format.")
    }
    if (!draft.telehealthSafety.currentSessionLocation.trim()) {
      pushField(
        fieldErrors,
        summaryErrors,
        "currentSessionLocation",
        "Please provide your typical telehealth session location.",
      )
    }
    if (!draft.telehealthSafety.emergencyContactName.trim()) {
      pushField(fieldErrors, summaryErrors, "emergencyContactName", "Emergency contact name is required.")
    }
    if (!draft.telehealthSafety.emergencyContactPhone.trim()) {
      pushField(fieldErrors, summaryErrors, "emergencyContactPhone", "Emergency contact phone is required.")
    }
  }

  if (step === "consent") {
    if (!draft.consents.privacyAccepted) {
      pushField(fieldErrors, summaryErrors, "privacyAccepted", "Privacy acknowledgement is required.")
    }
    if (!draft.consents.telehealthAccepted) {
      pushField(fieldErrors, summaryErrors, "telehealthAccepted", "Telehealth consent is required.")
    }
    if (!draft.consents.treatmentAccepted) {
      pushField(fieldErrors, summaryErrors, "treatmentAccepted", "Treatment terms acknowledgement is required.")
    }
  }

  return { fieldErrors, summaryErrors }
}

/** First invalid field id for focus management (maps validation keys to DOM ids). */
export const BOOKING_FIELD_IDS: Record<string, string> = {
  bookingType: "booking-type",
  selectedClinicianId: "booking-clinician",
  selectedDate: "booking-date",
  selectedSlotId: "booking-slot",
  fullName: "patient-full-name",
  dateOfBirth: "patient-date-of-birth",
  mobile: "patient-mobile",
  suburb: "patient-suburb",
  state: "patient-state",
  preferredContactMethod: "patient-preferred-contact",
  presentingConcerns: "presenting-concerns",
  hasMhtp: "medicare-mhtp",
  hasReferral: "medicare-referral",
  referralType: "medicare-referral-type",
  symptomDuration: "symptom-duration",
  modality: "session-modality",
  currentSessionLocation: "session-location",
  emergencyContactName: "emergency-contact-name",
  emergencyContactPhone: "emergency-contact-phone",
  privacyAccepted: "consent-privacy",
  telehealthAccepted: "consent-telehealth",
  treatmentAccepted: "consent-treatment",
}

export function firstInvalidFieldId(fieldErrors: BookingFieldErrors): string | null {
  const firstKey = Object.keys(fieldErrors)[0]
  if (!firstKey) return null
  return BOOKING_FIELD_IDS[firstKey] ?? firstKey
}
