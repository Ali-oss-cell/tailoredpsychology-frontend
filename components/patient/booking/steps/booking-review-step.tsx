"use client"

import { BookingReviewSummary } from "@/components/patient/booking/booking-review-summary"
import { useBookingWizardContext } from "@/components/patient/booking/booking-wizard-context"

export function BookingReviewStep() {
  const { draft, liveClinicians, selectedSlotLabel } = useBookingWizardContext()
  const clinicianName =
    liveClinicians.find((item) => item.id === draft.scheduleSelection.selectedClinicianId)?.name ??
    "Not selected"

  return (
    <BookingReviewSummary
      draft={draft}
      clinicianName={clinicianName}
      slotDate={draft.scheduleSelection.selectedDate}
      slotTimeLabel={selectedSlotLabel}
    />
  )
}
