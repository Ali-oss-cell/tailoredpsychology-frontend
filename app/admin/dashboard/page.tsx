import { IntakeQueueCard } from "@/components/ops/intake-queue-card"
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
      <OpsInsightsCard />
      <TelehealthInsightsCard />
      <ReferralActionCard mode="admin" />
      <IntakeQueueCard />
    </OpsPortalPage>
  )
}
