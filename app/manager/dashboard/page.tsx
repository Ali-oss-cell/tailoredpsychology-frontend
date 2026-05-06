import { IntakeQueueCard } from "@/components/ops/intake-queue-card"
import { ReferralActionCard } from "@/components/ops/referral-action-card"
import { OpsShell } from "@/components/ops/ops-shell"
import { OpsInsightsCard } from "@/components/ops/ops-insights-card"
import { TelehealthInsightsCard } from "@/components/ops/telehealth-insights-card"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { opsPagesContent } from "@/content/ops-pages"

export default function ManagerDashboardPage() {
  return (
    <OpsShell activeRoute="manager-dashboard">
      <section className="space-y-6">
        <PatientPageHeader
          title={opsPagesContent.managerDashboard.title}
          description={opsPagesContent.managerDashboard.description}
        />
        <OpsInsightsCard />
        <ReferralActionCard mode="manager" />
        <TelehealthInsightsCard />
        <IntakeQueueCard />
      </section>
    </OpsShell>
  )
}
