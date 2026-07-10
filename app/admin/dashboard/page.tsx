import { IntakeQueueCard } from "@/components/ops/intake-queue-card"
import { OpsDashboardSummaryCards } from "@/components/ops/ops-dashboard-summary-cards"
import { ReferralActionCard } from "@/components/ops/referral-action-card"
import { OpsInsightsCard } from "@/components/ops/ops-insights-card"
import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { TelehealthInsightsCard } from "@/components/ops/telehealth-insights-card"
import { opsPagesContent } from "@/content/ops-pages"

export default function AdminDashboardPage() {
  return (
    <OpsPortalPage
      title={opsPagesContent.adminDashboard.title}
      description={opsPagesContent.adminDashboard.description}
      eyebrow="Administration"
      tutorialId="admin.page.dashboard"
    >
      <OpsDashboardSummaryCards mode="admin" />
      <OpsInsightsCard />
      <TelehealthInsightsCard />
      <ReferralActionCard mode="admin" />
      <IntakeQueueCard />
    </OpsPortalPage>
  )
}
