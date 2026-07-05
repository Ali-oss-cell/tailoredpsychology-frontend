import { PatientPortalPage } from "@/components/patient/patient-portal-page"
import { PatientResourcesSection } from "@/components/patient/resources/patient-resources-section"
import { patientResourcesContent } from "@/content/patient-resources"

export default function PatientResourcesPage() {
  return (
    <PatientPortalPage
      title={patientResourcesContent.header.title}
      description={patientResourcesContent.header.description}
      eyebrow="Support"
      tutorialId="patient.page.resources"
    >
      <PatientResourcesSection />
    </PatientPortalPage>
  )
}
