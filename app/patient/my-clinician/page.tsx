import { PatientMyClinicianSection } from "@/components/patient/my-clinician/patient-my-clinician-section"
import { PatientPortalPage } from "@/components/patient/patient-portal-page"
import { patientMyClinicianContent } from "@/content/patient-my-clinician"

export default function PatientMyClinicianPage() {
  return (
    <PatientPortalPage
      title={patientMyClinicianContent.header.title}
      description={patientMyClinicianContent.header.description}
      eyebrow="Your care team"
      tutorialId="patient.page.my-clinician"
    >
      <PatientMyClinicianSection />
    </PatientPortalPage>
  )
}
