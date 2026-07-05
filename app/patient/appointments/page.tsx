import { JourneyRail } from "@/components/patient/journey/journey-rail"
import { PatientAppointmentsSection } from "@/components/patient/appointments/patient-appointments-section"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { patientAppointmentsContent } from "@/content/patient-appointments"

export default function PatientAppointmentsPage() {
  return (
    <section className="space-y-6" data-tutorial="patient.page.appointments">
      <PatientPageHeader
        title={patientAppointmentsContent.header.title}
        description={patientAppointmentsContent.header.description}
      />

      <JourneyRail />
      <PatientAppointmentsSection />
    </section>
  )
}
