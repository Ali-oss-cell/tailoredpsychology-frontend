import { OpsShell } from "@/components/ops/ops-shell"
import { ReferralQueueCard } from "@/components/ops/referral-queue-card"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { opsPagesContent } from "@/content/ops-pages"

export default function ManagerReferralsPage() {
  return (
    <OpsShell activeRoute="manager-referrals">
      <section className="space-y-6">
        <PatientPageHeader
          title={opsPagesContent.managerReferrals.title}
          description={opsPagesContent.managerReferrals.description}
        />
        <ReferralQueueCard title={opsPagesContent.managerReferrals.cardTitle} />
      </section>
    </OpsShell>
  )
}
