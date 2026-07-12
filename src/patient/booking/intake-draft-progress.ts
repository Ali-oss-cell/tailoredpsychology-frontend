import { bookingSteps } from "@/content/patient-booking"
import { initialBookingDraft } from "@/content/patient-booking"
import { validateBookingStep } from "@/src/patient/booking/booking-validation"
import type { BookingRequestDraft, BookingStepId } from "@/src/patient/booking/types"

/** Rough intake completion for onboarding UI (not legal/account-setup gate). */
const FORM_FIELD_CHECKS = (draft: Partial<BookingRequestDraft>) => [
  Boolean(draft.patientIdentity?.fullName?.trim()),
  Boolean(draft.patientIdentity?.dateOfBirth),
  Boolean(draft.patientIdentity?.mobile?.trim()),
  Boolean(draft.patientIdentity?.suburb?.trim()),
  Boolean(draft.patientIdentity?.state),
  Boolean(draft.patientIdentity?.preferredContactMethod),
  Boolean(draft.careContext?.presentingConcerns?.trim()),
  Boolean(draft.medicarePath?.hasMhtp),
  Boolean(draft.telehealthSafety?.emergencyContactName?.trim()),
  Boolean(draft.telehealthSafety?.emergencyContactPhone?.trim()),
  Boolean(draft.consents?.privacyAccepted),
  Boolean(draft.consents?.telehealthAccepted),
  Boolean(draft.consents?.treatmentAccepted),
]

const FORM_WEIGHT = 70
const SCHEDULE_WEIGHT = 20
const PAYMENT_WEIGHT = 5

export type IntakeProgressPhase = "form" | "schedule" | "review" | "payment"

export type IntakeProgressContext = {
  paymentPending?: boolean
  paymentAbandoned?: boolean
}

export type IntakeProgressSnapshot = {
  percent: number
  phase: IntakeProgressPhase
  resumeStep: BookingStepId
  resumeHref: string
  heroTitle: string
  heroDescription: string
  ctaLabel: string
}

export function isScheduleSelectionComplete(draft: Partial<BookingRequestDraft>): boolean {
  const schedule = draft.scheduleSelection
  return Boolean(schedule?.selectedClinicianId && schedule?.selectedDate && schedule?.selectedSlotId)
}

export function isFormFieldsComplete(draft: Partial<BookingRequestDraft>): boolean {
  const checks = FORM_FIELD_CHECKS(draft)
  return checks.length > 0 && checks.every(Boolean)
}

export function computeIntakeDraftPercent(
  draft: Partial<BookingRequestDraft> | null | undefined,
  context?: IntakeProgressContext,
): number {
  if (!draft) return 0

  const checks = FORM_FIELD_CHECKS(draft)
  const filled = checks.filter(Boolean).length
  const formComplete = checks.length > 0 && filled === checks.length
  const scheduleComplete = isScheduleSelectionComplete(draft)

  let percent = Math.round((filled / checks.length) * FORM_WEIGHT)

  if (formComplete && scheduleComplete) {
    percent = FORM_WEIGHT + SCHEDULE_WEIGHT
  } else if (formComplete) {
    percent = FORM_WEIGHT
  }

  if (context?.paymentPending || context?.paymentAbandoned) {
    percent = FORM_WEIGHT + SCHEDULE_WEIGHT + PAYMENT_WEIGHT
  }

  const maxBeforePayment = FORM_WEIGHT + SCHEDULE_WEIGHT
  if (!context?.paymentPending && !context?.paymentAbandoned) {
    percent = Math.min(percent, maxBeforePayment)
  } else {
    percent = Math.min(percent, FORM_WEIGHT + SCHEDULE_WEIGHT + PAYMENT_WEIGHT)
  }

  return percent
}

function asFullDraft(draft: Partial<BookingRequestDraft>): BookingRequestDraft {
  return {
    ...initialBookingDraft,
    ...draft,
    bookingMeta: { ...initialBookingDraft.bookingMeta, ...(draft.bookingMeta ?? {}) },
    scheduleSelection: { ...initialBookingDraft.scheduleSelection, ...(draft.scheduleSelection ?? {}) },
    patientIdentity: { ...initialBookingDraft.patientIdentity, ...(draft.patientIdentity ?? {}) },
    careContext: { ...initialBookingDraft.careContext, ...(draft.careContext ?? {}) },
    medicarePath: { ...initialBookingDraft.medicarePath, ...(draft.medicarePath ?? {}) },
    telehealthSafety: { ...initialBookingDraft.telehealthSafety, ...(draft.telehealthSafety ?? {}) },
    referralFile: { ...initialBookingDraft.referralFile, ...(draft.referralFile ?? {}), file: null },
    preferences: { ...initialBookingDraft.preferences, ...(draft.preferences ?? {}) },
    consents: { ...initialBookingDraft.consents, ...(draft.consents ?? {}) },
    wizardMeta: { ...initialBookingDraft.wizardMeta, ...(draft.wizardMeta ?? {}) },
  }
}

const RESUMABLE_STEPS: BookingStepId[] = bookingSteps.map((step) => step.id)

export function inferBookingResumeStep(
  draft: Partial<BookingRequestDraft> | null | undefined,
  context?: IntakeProgressContext,
): BookingStepId {
  if (!draft) return "reason"

  if (context?.paymentPending || context?.paymentAbandoned || draft.wizardMeta?.pendingBookingRequestId) {
    return "review"
  }

  const savedStep = draft.wizardMeta?.activeStep
  if (savedStep && RESUMABLE_STEPS.includes(savedStep)) {
    return savedStep
  }

  const full = asFullDraft(draft)
  for (const step of RESUMABLE_STEPS) {
    if (step === "review") continue
    const validation = validateBookingStep(step, full)
    if (validation.summaryErrors.length > 0) {
      return step
    }
  }

  if (!isScheduleSelectionComplete(draft)) {
    return "schedule"
  }

  return "review"
}

export function buildBookingResumeHref(
  draft: Partial<BookingRequestDraft> | null | undefined,
  context?: IntakeProgressContext,
): string {
  const step = inferBookingResumeStep(draft, context)
  const params = new URLSearchParams()
  params.set("step", step)

  const pendingId = draft?.wizardMeta?.pendingBookingRequestId
  if (context?.paymentPending || context?.paymentAbandoned || pendingId) {
    if (pendingId) {
      params.set("resumePayment", pendingId)
    }
    params.set("step", "review")
  }

  return `/patient/book-appointment?${params.toString()}`
}

function resolvePhase(
  draft: Partial<BookingRequestDraft>,
  context?: IntakeProgressContext,
): IntakeProgressPhase {
  if (context?.paymentPending || context?.paymentAbandoned) {
    return "payment"
  }
  if (isFormFieldsComplete(draft) && isScheduleSelectionComplete(draft)) {
    return "review"
  }
  if (isFormFieldsComplete(draft)) {
    return "schedule"
  }
  return "form"
}

export function buildIntakeProgressSnapshot(
  draft: Partial<BookingRequestDraft> | null | undefined,
  context?: IntakeProgressContext,
): IntakeProgressSnapshot {
  const percent = computeIntakeDraftPercent(draft, context)
  const phase = draft ? resolvePhase(draft, context) : "form"
  const resumeStep = inferBookingResumeStep(draft, context)
  const resumeHref = buildBookingResumeHref(draft, context)

  if (phase === "payment") {
    return {
      percent,
      phase,
      resumeStep,
      resumeHref,
      heroTitle: "Almost done",
      heroDescription: "Complete payment to confirm your appointment — your slot may still be held briefly.",
      ctaLabel: "Complete payment",
    }
  }

  if (phase === "review") {
    return {
      percent,
      phase,
      resumeStep,
      resumeHref,
      heroTitle: "Continue your intake",
      heroDescription: `You're ${percent}% through — review and pay to finish booking.`,
      ctaLabel: "Continue to payment",
    }
  }

  if (phase === "schedule") {
    return {
      percent,
      phase,
      resumeStep,
      resumeHref,
      heroTitle: "Continue your intake",
      heroDescription: `You're ${percent}% through — choose a session time to continue.`,
      ctaLabel: "Choose session time",
    }
  }

  const showProgress = percent > 0
  return {
    percent,
    phase,
    resumeStep,
    resumeHref,
    heroTitle: showProgress ? "Continue your intake" : "Complete your intake",
    heroDescription: showProgress
      ? `You're ${percent}% through — pick up where you left off.`
      : "Tell us about yourself so we can match you with the right care.",
    ctaLabel: showProgress ? "Continue intake" : "Start intake",
  }
}
