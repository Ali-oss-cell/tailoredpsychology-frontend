import { BookingWizard } from "@/components/patient/booking/booking-wizard"
import { PatientShell } from "@/components/patient/patient-shell"
import { Suspense } from "react"

export default function PatientBookAppointmentPage() {
  return (
    <PatientShell activeRoute="appointments">
      <Suspense fallback={null}>
        <BookingWizard />
      </Suspense>
    </PatientShell>
  )
}
