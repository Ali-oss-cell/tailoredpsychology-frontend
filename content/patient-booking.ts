import type { BookingRequestDraft, BookingStep, BookingStepId, ReferralSourceType } from "@/src/patient/booking/types"

export const bookingSteps: BookingStep[] = [
  { id: "mode", label: "Booking type", shortLabel: "Type" },
  { id: "reason", label: "Reason and urgency", shortLabel: "Reason" },
  { id: "medicare", label: "Medicare and referral", shortLabel: "Medicare" },
  { id: "clinical", label: "Clinical background", shortLabel: "Clinical" },
  { id: "referral", label: "Referral PDF upload", shortLabel: "Referral" },
  { id: "schedule", label: "Clinician and schedule", shortLabel: "Schedule" },
  { id: "consent", label: "Consent checklist", shortLabel: "Consent" },
  { id: "review", label: "Review and submit", shortLabel: "Review" },
]

/** Approximate time remaining from each step (UX-C3). */
export const bookingStepTimeEstimates: Record<Exclude<BookingStepId, "submitted">, string> = {
  mode: "~30 sec left",
  reason: "~5 min left",
  medicare: "~4 min left",
  clinical: "~3 min left",
  referral: "~2 min left",
  schedule: "~2 min left",
  consent: "~1 min left",
  review: "Almost done",
}

/** One line per step: what the user can expect after this step (Wave 14). */
export const bookingStepWhatsNext: Record<Exclude<BookingStepId, "submitted">, string> = {
  mode: "Next: a few questions about your reason for care and contact details.",
  reason: "Next: Medicare and referral context to support billing and care matching.",
  medicare: "Next: a bit more clinical background and safety information for telehealth.",
  clinical: "Next: optional referral PDF upload, if you have one ready.",
  referral: "Next: choose a clinician and a real available session time.",
  schedule: "Next: required consent checkboxes before you review and send your request.",
  consent: "Next: a final review of your details before we submit your booking request.",
  review: "After submit: you will pay securely, then your appointment is confirmed.",
}

export const referralSourceOptions: { value: ReferralSourceType; label: string }[] = [
  { value: "gp_mhtp", label: "GP Mental Health Treatment Plan referral" },
  { value: "psychiatrist", label: "Psychiatrist referral" },
  { value: "paediatrician", label: "Paediatrician referral" },
  { value: "other_medical_practitioner", label: "Other medical practitioner referral" },
  { value: "no_referral_yet", label: "No referral yet" },
]

export const bookingContent = {
  header: {
    title: "Book an Appointment",
    description:
      "Telehealth-first intake for Australia. We collect only what your care team needs to safely match and schedule your first session.",
  },
  newPatient: {
    modeTitle: "Your first appointment",
    modeDescription:
      "We will guide you through intake, Medicare or referral context, and scheduling. Follow-up booking unlocks after you have visited with us at least once.",
    scheduleBanner: (clinicianName: string) =>
      `First session${clinicianName ? ` with ${clinicianName}` : ""} — choose a time that works for you.`,
  },
  returningPatient: {
    modeDescription: "Choose whether this is your first visit with us or a follow-up with your care team.",
  },
  helper: {
    save:
      "Draft is saved on this device while you complete the form. You can return and finish later.",
    medicare:
      "If you have a Mental Health Treatment Plan or referral, add details now to support rebate checks later.",
    telehealth:
      "Because most sessions are telehealth, we ask for a session location and emergency contact for safety planning.",
    referralUpload:
      "Upload your referral PDF now if available. If not, continue and we will guide next steps.",
    schedule:
      "Select a clinician and a real available session slot. Follow-up bookings can stay short with update-only questions.",
    followUp:
      "For follow-up bookings, we only ask what changed since your last visit plus booking essentials.",
  },
  consentText: {
    privacyPrefix: "I confirm I have read and accept the",
    privacyLink: "Privacy Policy",
    privacySuffix: "for collection and use of my health information.",
    telehealthPrefix: "I understand telehealth limitations and have read the",
    telehealthLink: "Telehealth requirements",
    telehealthSuffix: "(connectivity, privacy environment, and emergency protocols).",
    treatmentPrefix: "I accept the",
    termsLink: "Terms of Service",
    treatmentSuffix: "and treatment and cancellation policy, including short-notice cancellation handling.",
  },
  crisisSupport: {
    title: "If you need urgent help right now",
    body: "This booking form is not monitored in real time. If you or someone else is in immediate danger, call emergency services. For 24/7 crisis counselling in Australia:",
    emergency: "000 — Emergency (police, ambulance, fire)",
    lifeline: "13 11 14 — Lifeline (24/7 crisis support)",
    practice:
      "For non-urgent care team contact, call Tailored Psychology during business hours or leave a message — we will respond as soon as we can.",
  },
}

export const bookingTypeOptions = [
  {
    value: "initial",
    label: "Initial appointment",
    description: "First booking with Tailored Psychology. Includes complete intake and Medicare/referral context.",
  },
  {
    value: "follow_up",
    label: "Follow-up appointment",
    description: "Returning booking. We ask only key updates and scheduling details.",
  },
] as const

/** Same seed URLs as backend `BOOKING_SEED_CLINICIAN_PORTRAIT_URLS` for offline / API-error fallback. */
export const CLINICIAN_PORTRAIT_URLS: Record<string, string> = {
  clinician_001: "https://i.pravatar.cc/300?u=clink-clinician-001",
  clinician_002: "https://i.pravatar.cc/300?u=clink-clinician-002",
  clinician_003: "https://i.pravatar.cc/300?u=clink-clinician-003",
}

export const clinicians = [
  {
    id: "clinician_001",
    name: "Avery Mitchell",
    specialty: "Clinical psychology, anxiety, burnout",
    nextAvailable: "Tue 10:30 AM",
  },
  {
    id: "clinician_002",
    name: "Jordan Nguyen",
    specialty: "Trauma-informed care, relationships",
    nextAvailable: "Wed 2:00 PM",
  },
  {
    id: "clinician_003",
    name: "Samira Khan",
    specialty: "Mood disorders, telehealth care plans",
    nextAvailable: "Thu 9:00 AM",
  },
  {
    id: "no-preference",
    name: "No preference",
    specialty: "Auto-match earliest suitable clinician",
    nextAvailable: "Earliest available slot",
  },
] as const

/** Schedule-step fallback list with portrait URLs (must match backend seed URLs for `clinician_00*`). */
export function mapStaticCliniciansToLiveOptions(): {
  id: string
  name: string
  specialty: string
  nextAvailable: string
  profileImageUrl?: string
}[] {
  return clinicians.map((c) => ({
    id: c.id,
    name: c.name,
    specialty: c.specialty,
    nextAvailable: c.nextAvailable,
    profileImageUrl: CLINICIAN_PORTRAIT_URLS[c.id] ?? undefined,
  }))
}

export const scheduleByDate: Record<string, { id: string; label: string; clinicianId: string }[]> = {
  "2026-05-04": [
    { id: "slot-2026-05-04-0900", label: "9:00 AM", clinicianId: "clinician_003" },
    { id: "slot-2026-05-04-1030", label: "10:30 AM", clinicianId: "clinician_001" },
    { id: "slot-2026-05-04-1400", label: "2:00 PM", clinicianId: "clinician_002" },
  ],
  "2026-05-05": [
    { id: "slot-2026-05-05-1100", label: "11:00 AM", clinicianId: "clinician_001" },
    { id: "slot-2026-05-05-1330", label: "1:30 PM", clinicianId: "clinician_002" },
    { id: "slot-2026-05-05-1600", label: "4:00 PM", clinicianId: "clinician_003" },
  ],
  "2026-05-06": [
    { id: "slot-2026-05-06-0930", label: "9:30 AM", clinicianId: "clinician_002" },
    { id: "slot-2026-05-06-1230", label: "12:30 PM", clinicianId: "clinician_001" },
    { id: "slot-2026-05-06-1500", label: "3:00 PM", clinicianId: "clinician_003" },
  ],
}

export const indigenousStatusOptions = [
  { value: "", label: "Not specified (optional)" },
  { value: "aboriginal", label: "Aboriginal" },
  { value: "torres_strait_islander", label: "Torres Strait Islander" },
  { value: "both", label: "Aboriginal and Torres Strait Islander" },
  { value: "neither", label: "Neither Aboriginal nor Torres Strait Islander" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const

export const preferredContactMethodOptions = [
  { value: "sms", label: "SMS text message" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
] as const

export const appointmentModalityOptions = [
  { value: "telehealth", label: "Telehealth (video)" },
  { value: "in_person", label: "In person" },
  { value: "either", label: "Either — happy to discuss" },
] as const

export const mhtpStatusLabels: Record<"yes" | "no" | "unsure", string> = {
  yes: "Yes, I have one",
  no: "No, I do not have one",
  unsure: "Not sure yet",
}

export const yesNoLabels: Record<"yes" | "no", string> = {
  yes: "Yes",
  no: "No",
}

export const bookingTypeLabels: Record<"initial" | "follow_up", string> = {
  initial: "Initial appointment",
  follow_up: "Follow-up appointment",
}

export const riskFlagLabels: Record<"none" | "urgent_support_needed", string> = {
  none: "Standard booking",
  urgent_support_needed: "Urgent support requested",
}

export const clinicianGenderOptions = [
  { value: "no_preference", label: "No preference" },
  { value: "female", label: "Female clinician" },
  { value: "male", label: "Male clinician" },
  { value: "non_binary", label: "Non-binary clinician" },
] as const

export const initialBookingDraft: BookingRequestDraft = {
  bookingMeta: {
    bookingType: "initial",
    changesSinceLastVisit: "no",
  },
  scheduleSelection: {
    selectedClinicianId: "",
    selectedDate: "",
    selectedSlotId: "",
  },
  patientIdentity: {
    fullName: "",
    dateOfBirth: "",
    mobile: "",
    email: "",
    suburb: "",
    state: "",
    indigenousStatus: "",
    preferredContactMethod: "sms",
  },
  careContext: {
    presentingConcerns: "",
    symptomDuration: "",
    priorCare: "",
    currentMedications: "",
    riskFlag: "none",
  },
  medicarePath: {
    hasMhtp: "unsure",
    hasReferral: "no",
    referralType: "",
    sessionsUsedEstimate: "",
    gpName: "",
    gpClinic: "",
  },
  telehealthSafety: {
    currentSessionLocation: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
  },
  referralFile: {
    file: null,
    fileName: "",
    fileSize: 0,
    uploadedAt: "",
    documentId: "",
    documentStatus: "",
    sourceType: "",
    referralDate: "",
    notes: "",
  },
  preferences: {
    modality: "telehealth",
    preferredClinicianGender: "no_preference",
    preferredLanguage: "",
  },
  consents: {
    privacyAccepted: false,
    telehealthAccepted: false,
    treatmentAccepted: false,
  },
}

