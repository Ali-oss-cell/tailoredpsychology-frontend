import { BookingWizard } from "@/components/patient/booking/booking-wizard"
import { Suspense } from "react"

export default function PatientBookAppointmentPage() {
  return (
    <Suspense fallback={null}>
      <BookingWizard />
    </Suspense>
  )
}
