import { PatientAppointmentsSection } from "@/components/patient/appointments/patient-appointments-section"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { PatientShell } from "@/components/patient/patient-shell"
import { patientAppointmentsContent } from "@/content/patient-appointments"

export default function PatientAppointmentsPage() {
  return (
    <PatientShell activeRoute="appointments">
      <section className="space-y-6" data-tutorial="patient.page.appointments">
        <PatientPageHeader
          title={patientAppointmentsContent.header.title}
          description={patientAppointmentsContent.header.description}
        />

        <PatientAppointmentsSection />
      </section>
    </PatientShell>
  )
}
