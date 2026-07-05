import { PatientAppointmentsSection } from "@/components/patient/appointments/patient-appointments-section"
import { PatientPortalPage } from "@/components/patient/patient-portal-page"
import { patientAppointmentsContent } from "@/content/patient-appointments"

export default function PatientAppointmentsPage() {
  return (
    <PatientPortalPage
      title={patientAppointmentsContent.header.title}
      description={patientAppointmentsContent.header.description}
      eyebrow="Your care"
      showJourney
      tutorialId="patient.page.appointments"
    >
      <PatientAppointmentsSection />
    </PatientPortalPage>
  )
}
