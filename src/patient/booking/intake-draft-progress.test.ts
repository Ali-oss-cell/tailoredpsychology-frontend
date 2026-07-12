import { initialBookingDraft } from "@/content/patient-booking"
import type { BookingRequestDraft } from "@/src/patient/booking/types"
import {
  buildIntakeProgressSnapshot,
  computeIntakeDraftPercent,
  inferBookingResumeStep,
  isFormFieldsComplete,
  isScheduleSelectionComplete,
  type IntakeProgressContext,
} from "@/src/patient/booking/intake-draft-progress"

function completeDraft(): Partial<BookingRequestDraft> {
  return {
    ...initialBookingDraft,
    patientIdentity: {
      ...initialBookingDraft.patientIdentity,
      fullName: "Alex Patient",
      dateOfBirth: "1990-01-01",
      mobile: "0412345678",
      suburb: "Sydney",
      state: "NSW",
      preferredContactMethod: "email",
    },
    careContext: {
      ...initialBookingDraft.careContext,
      presentingConcerns: "Anxiety",
      symptomDuration: "3 months",
    },
    medicarePath: {
      ...initialBookingDraft.medicarePath,
      hasMhtp: "yes",
      hasReferral: "no",
    },
    telehealthSafety: {
      ...initialBookingDraft.telehealthSafety,
      currentSessionLocation: "Home",
      emergencyContactName: "Sam",
      emergencyContactPhone: "0412345679",
    },
    preferences: {
      ...initialBookingDraft.preferences,
      modality: "telehealth",
    },
    consents: {
      privacyAccepted: true,
      telehealthAccepted: true,
      treatmentAccepted: true,
    },
  }
}

describe("computeIntakeDraftPercent", () => {
  it("returns 0 for empty draft", () => {
    expect(computeIntakeDraftPercent(null)).toBe(0)
    expect(computeIntakeDraftPercent({})).toBe(0)
  })

  it("does not reach 100% when all form fields are filled but schedule and payment are incomplete", () => {
    const draft = completeDraft()
    expect(computeIntakeDraftPercent(draft)).toBe(70)
    expect(computeIntakeDraftPercent(draft)).toBeLessThan(100)
  })

  it("caps at 90% when form and schedule are complete but payment is not", () => {
    const draft = {
      ...completeDraft(),
      scheduleSelection: {
        selectedClinicianId: "clinician_001",
        selectedDate: "2026-07-15",
        selectedSlotId: "slot_1",
      },
    }
    expect(computeIntakeDraftPercent(draft)).toBe(90)
  })

  it("returns 95% when payment is pending", () => {
    const draft = {
      ...completeDraft(),
      scheduleSelection: {
        selectedClinicianId: "clinician_001",
        selectedDate: "2026-07-15",
        selectedSlotId: "slot_1",
      },
      wizardMeta: { pendingBookingRequestId: "br_000001", activeStep: "review" as const },
    }
    const context: IntakeProgressContext = { paymentPending: true }
    expect(computeIntakeDraftPercent(draft, context)).toBe(95)
  })
})

describe("inferBookingResumeStep", () => {
  it("returns schedule when form is complete but no slot is selected", () => {
    expect(inferBookingResumeStep(completeDraft())).toBe("schedule")
  })

  it("returns review when payment is pending", () => {
    const draft = {
      ...completeDraft(),
      wizardMeta: { pendingBookingRequestId: "br_000001", activeStep: "review" as const },
    }
    expect(inferBookingResumeStep(draft, { paymentPending: true })).toBe("review")
  })

  it("restores saved wizard step when still valid", () => {
    const draft = {
      ...completeDraft(),
      wizardMeta: { activeStep: "medicare" as const },
    }
    expect(inferBookingResumeStep(draft)).toBe("medicare")
  })

  it("returns review when form and schedule are complete", () => {
    const draft = {
      ...completeDraft(),
      scheduleSelection: {
        selectedClinicianId: "clinician_001",
        selectedDate: "2026-07-15",
        selectedSlotId: "slot_1",
      },
    }
    expect(inferBookingResumeStep(draft)).toBe("review")
  })
})

describe("buildIntakeProgressSnapshot", () => {
  it("uses payment copy when checkout was not completed", () => {
    const draft = {
      ...completeDraft(),
      scheduleSelection: {
        selectedClinicianId: "clinician_001",
        selectedDate: "2026-07-15",
        selectedSlotId: "slot_1",
      },
      wizardMeta: { pendingBookingRequestId: "br_000001" },
    }
    const snapshot = buildIntakeProgressSnapshot(draft, { paymentPending: true })
    expect(snapshot.percent).toBe(95)
    expect(snapshot.heroDescription).toMatch(/payment/i)
    expect(snapshot.ctaLabel).toMatch(/payment/i)
    expect(snapshot.resumeHref).toContain("step=review")
    expect(snapshot.resumeHref).toContain("resumePayment=br_000001")
  })

  it("uses schedule copy when intake form is done but slot is missing", () => {
    const snapshot = buildIntakeProgressSnapshot(completeDraft())
    expect(snapshot.phase).toBe("schedule")
    expect(isFormFieldsComplete(completeDraft())).toBe(true)
    expect(isScheduleSelectionComplete(completeDraft())).toBe(false)
    expect(snapshot.resumeHref).toContain("step=schedule")
  })
})
