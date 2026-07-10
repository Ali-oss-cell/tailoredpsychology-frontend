import { BookingScheduleSkeleton } from "@/components/patient/booking/booking-schedule-skeleton"
import { BookingWizard } from "@/components/patient/booking/booking-wizard"
import { Suspense } from "react"

export default function PatientBookAppointmentPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 p-1" aria-busy="true" aria-label="Loading booking">
          <div className="bg-muted/40 h-8 w-56 animate-pulse rounded-lg" />
          <BookingScheduleSkeleton />
        </div>
      }
    >
      <BookingWizard />
    </Suspense>
  )
}
