import { IntakeQueueCard } from "@/components/ops/intake-queue-card"
import { ReferralActionCard } from "@/components/ops/referral-action-card"
import { OpsShell } from "@/components/ops/ops-shell"
import { OpsInsightsCard } from "@/components/ops/ops-insights-card"
import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { TelehealthInsightsCard } from "@/components/ops/telehealth-insights-card"
import { opsPagesContent } from "@/content/ops-pages"

export default function ManagerDashboardPage() {
  return (
    <OpsShell activeRoute="manager-dashboard">
      <OpsPortalPage
        title={opsPagesContent.managerDashboard.title}
        description={opsPagesContent.managerDashboard.description}
        eyebrow="Operations"
        tutorialId="manager.page.dashboard"
      >
        <OpsInsightsCard />
        <ReferralActionCard mode="manager" />
        <TelehealthInsightsCard />
        <IntakeQueueCard />
      </OpsPortalPage>
    </OpsShell>
  )
}
