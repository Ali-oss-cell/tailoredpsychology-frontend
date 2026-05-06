import { BookingWizard } from "@/components/patient/booking/booking-wizard"
import { PatientShell } from "@/components/patient/patient-shell"

export default function PatientBookAppointmentPage() {
  return (
    <PatientShell activeRoute="appointments">
      <BookingWizard />
    </PatientShell>
  )
}
