import { initialBookingDraft } from "@/content/patient-booking"
import { validateBookingStep } from "@/src/patient/booking/booking-validation"
import type { BookingRequestDraft } from "@/src/patient/booking/types"

function draftWith(patch: Partial<BookingRequestDraft>): BookingRequestDraft {
  return {
    ...initialBookingDraft,
    ...patch,
    patientIdentity: { ...initialBookingDraft.patientIdentity, ...patch.patientIdentity },
    careContext: { ...initialBookingDraft.careContext, ...patch.careContext },
    telehealthSafety: { ...initialBookingDraft.telehealthSafety, ...patch.telehealthSafety },
    preferences: { ...initialBookingDraft.preferences, ...patch.preferences },
    consents: { ...initialBookingDraft.consents, ...patch.consents },
  }
}

describe("validateBookingStep", () => {
  it("requires suburb and state for initial bookings on reason step", () => {
    const draft = draftWith({
      patientIdentity: {
        ...initialBookingDraft.patientIdentity,
        fullName: "Alex Patient",
        dateOfBirth: "1990-01-01",
        mobile: "0412345678",
        suburb: "",
        state: "",
      },
      careContext: {
        ...initialBookingDraft.careContext,
        presentingConcerns: "Anxiety",
      },
    })

    const { fieldErrors, summaryErrors } = validateBookingStep("reason", draft)
    expect(fieldErrors.suburb).toBeDefined()
    expect(fieldErrors.state).toBeDefined()
    expect(summaryErrors.length).toBeGreaterThan(0)
  })

  it("returns field-keyed errors for consent step", () => {
    const { fieldErrors } = validateBookingStep("consent", initialBookingDraft)
    expect(fieldErrors.privacyAccepted).toBeDefined()
    expect(fieldErrors.telehealthAccepted).toBeDefined()
    expect(fieldErrors.treatmentAccepted).toBeDefined()
  })

  it("rejects invalid Australian mobile on reason step", () => {
    const draft = draftWith({
      patientIdentity: {
        ...initialBookingDraft.patientIdentity,
        mobile: "0312345678",
        suburb: "Parramatta",
        state: "NSW",
        preferredContactMethod: "sms",
      },
      careContext: {
        ...initialBookingDraft.careContext,
        presentingConcerns: "Anxiety",
      },
    })

    const { fieldErrors } = validateBookingStep("reason", draft)
    expect(fieldErrors.mobile).toBeDefined()
  })

  it("skips medicare validation for unchanged follow-up", () => {
    const draft = draftWith({
      bookingMeta: { bookingType: "follow_up", changesSinceLastVisit: "no" },
    })
    const { summaryErrors } = validateBookingStep("medicare", draft)
    expect(summaryErrors).toHaveLength(0)
  })
})
