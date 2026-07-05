import { PatientDataRequestsQueueCard } from "@/components/ops/patient-data-requests-queue-card"
import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { OpsShell } from "@/components/ops/ops-shell"

export default function AdminPrivacyRequestsPage() {
  return (
    <OpsShell activeRoute="admin-privacy-requests">
      <OpsPortalPage
        title="Patient Data Requests"
        description="Triage patient access and correction requests with SLA-aware workflow."
        eyebrow="Administration"
        tutorialId="admin.page.privacy-requests"
      >
        <PatientDataRequestsQueueCard />
      </OpsPortalPage>
    </OpsShell>
  )
}
