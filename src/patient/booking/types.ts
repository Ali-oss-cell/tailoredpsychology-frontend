export type BookingStepId =
  | "mode"
  | "schedule"
  | "reason"
  | "medicare"
  | "clinical"
  | "referral"
  | "consent"
  | "review"
  | "submitted"

export type ReferralSourceType =
  | "gp_mhtp"
  | "psychiatrist"
  | "paediatrician"
  | "other_medical_practitioner"
  | "no_referral_yet"

export type IndigenousStatusOption =
  | ""
  | "aboriginal"
  | "torres_strait_islander"
  | "both"
  | "neither"
  | "prefer_not_to_say"

export type PreferredContactMethod = "sms" | "email" | "phone"
export type AppointmentModality = "telehealth" | "in_person" | "either"
export type BookingType = "initial" | "follow_up"
export type ClinicianGender = "female" | "male" | "non_binary" | "no_preference"

export type ReferralFileDraft = {
  file: File | null
  fileName: string
  fileSize: number
  uploadedAt: string
  documentId: string
  documentStatus: "received" | "review_needed" | "valid" | "expired" | "rejected" | ""
  sourceType: ReferralSourceType | ""
  referralDate: string
  notes: string
}

export type BookingRequestDraft = {
  bookingMeta: {
    bookingType: BookingType
    changesSinceLastVisit: "yes" | "no"
  }
  scheduleSelection: {
    selectedClinicianId: string
    selectedDate: string
    selectedSlotId: string
  }
  patientIdentity: {
    fullName: string
    dateOfBirth: string
    mobile: string
    email: string
    suburb: string
    state: string
    /** Optional; common Australian health intake reporting field. */
    indigenousStatus: IndigenousStatusOption
    preferredContactMethod: PreferredContactMethod
  }
  careContext: {
    presentingConcerns: string
    symptomDuration: string
    priorCare: string
    currentMedications: string
    riskFlag: "none" | "urgent_support_needed"
  }
  medicarePath: {
    hasMhtp: "yes" | "no" | "unsure"
    hasReferral: "yes" | "no"
    referralType: ReferralSourceType | ""
    sessionsUsedEstimate: string
    gpName: string
    gpClinic: string
  }
  telehealthSafety: {
    currentSessionLocation: string
    emergencyContactName: string
    emergencyContactPhone: string
    emergencyContactRelationship: string
  }
  referralFile: ReferralFileDraft
  preferences: {
    modality: AppointmentModality
    preferredClinicianGender: ClinicianGender
    preferredLanguage: string
  }
  consents: {
    privacyAccepted: boolean
    telehealthAccepted: boolean
    treatmentAccepted: boolean
  }
}

export type BookingStep = {
  id: BookingStepId
  label: string
  shortLabel: string
}

