import { PatientDataRequestsQueueCard } from "@/components/ops/patient-data-requests-queue-card"
import { OpsPortalPage } from "@/components/ops/ops-portal-page"

export default function ManagerPrivacyRequestsPage() {
  return (
    <OpsPortalPage
      title="Patient Data Requests"
      description="Review and process patient access/correction requests in queue."
      eyebrow="Operations"
      tutorialId="manager.page.privacy-requests"
    >
      <PatientDataRequestsQueueCard />
    </OpsPortalPage>
  )
}
