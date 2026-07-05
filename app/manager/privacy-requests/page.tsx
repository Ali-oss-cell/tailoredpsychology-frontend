import { PatientDataRequestsQueueCard } from "@/components/ops/patient-data-requests-queue-card"
import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { OpsShell } from "@/components/ops/ops-shell"

export default function ManagerPrivacyRequestsPage() {
  return (
    <OpsShell activeRoute="manager-privacy-requests">
      <OpsPortalPage
        title="Patient Data Requests"
        description="Review and process patient access/correction requests in queue."
        eyebrow="Operations"
        tutorialId="manager.page.privacy-requests"
      >
        <PatientDataRequestsQueueCard />
      </OpsPortalPage>
    </OpsShell>
  )
}
