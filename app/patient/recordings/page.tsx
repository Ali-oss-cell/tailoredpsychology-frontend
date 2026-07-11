import { PatientPortalPage } from "@/components/patient/patient-portal-page"
import { PatientRecordingsSection } from "@/components/patient/recordings/patient-recordings-section"

export default function PatientRecordingsPage() {
  return (
    <PatientPortalPage
      title="Session recordings"
      description="Access your session video library and transcript readiness."
      eyebrow="Your care"
      tutorialId="patient.page.recordings"
    >
      <PatientRecordingsSection />
    </PatientPortalPage>
  )
}
