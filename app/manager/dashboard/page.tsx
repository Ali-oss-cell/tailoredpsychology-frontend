import { IntakeQueueCard } from "@/components/ops/intake-queue-card"
import { ManagerOperationsSnapshotCard } from "@/components/ops/manager-operations-snapshot-card"
import { ReferralActionCard } from "@/components/ops/referral-action-card"
import { OpsInsightsCard } from "@/components/ops/ops-insights-card"
import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { TelehealthInsightsCard } from "@/components/ops/telehealth-insights-card"
import { opsPagesContent } from "@/content/ops-pages"

export default function ManagerDashboardPage() {
  return (
    <OpsPortalPage
      title={opsPagesContent.managerDashboard.title}
      description={opsPagesContent.managerDashboard.description}
      eyebrow="Operations"
      tutorialId="manager.page.dashboard"
    >
      <ManagerOperationsSnapshotCard />
      <OpsInsightsCard />
      <ReferralActionCard mode="manager" />
      <TelehealthInsightsCard />
      <IntakeQueueCard />
    </OpsPortalPage>
  )
}
