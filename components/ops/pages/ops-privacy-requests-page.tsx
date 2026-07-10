import { PatientDataRequestsQueueCard } from "@/components/ops/patient-data-requests-queue-card"
import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { opsPagesContent } from "@/content/ops-pages"

export function OpsPrivacyRequestsPage({ role }: { role: "manager" | "admin" }) {
  const pageCopy = role === "manager" ? opsPagesContent.managerPrivacyRequests : opsPagesContent.adminPrivacyRequests

  return (
    <OpsPortalPage
      eyebrow={pageCopy.eyebrow}
      title={pageCopy.title}
      description={pageCopy.description}
      tutorialId={role === "manager" ? "manager.page.privacy-requests" : "admin.page.privacy-requests"}
    >
      <PatientDataRequestsQueueCard />
    </OpsPortalPage>
  )
}
