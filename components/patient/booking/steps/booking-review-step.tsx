"use client"

import { BookingReviewSummary } from "@/components/patient/booking/booking-review-summary"
import { useBookingWizardContext } from "@/components/patient/booking/booking-wizard-context"
import { StepIntro } from "@/components/shared/step-intro"

export function BookingReviewStep() {
  const { draft, liveClinicians, selectedSlotLabel } = useBookingWizardContext()
  const clinicianName =
    liveClinicians.find((item) => item.id === draft.scheduleSelection.selectedClinicianId)?.name ??
    "Not selected"

  return (
    <div className="space-y-5">
      <StepIntro
        title="Review your booking"
        description="Check everything looks right before you continue to payment."
      />
      <BookingReviewSummary
        draft={draft}
        clinicianName={clinicianName}
        slotDate={draft.scheduleSelection.selectedDate}
        slotTimeLabel={selectedSlotLabel}
      />
    </div>
  )
}
