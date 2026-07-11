import { PatientDataRequestsSection } from "@/components/patient/data-requests/patient-data-requests-section"
import { PatientPortalPage } from "@/components/patient/patient-portal-page"
import { patientPrivacyRequestsContent } from "@/content/patient-privacy-requests"

export default function PatientDataRequestsPage() {
  const copy = patientPrivacyRequestsContent

  return (
    <PatientPortalPage
      title={copy.header.title}
      description={copy.header.description}
      eyebrow="Privacy"
      tutorialId="patient.page.privacy-requests"
    >
      <PatientDataRequestsSection />
    </PatientPortalPage>
  )
}
