import { OpsShell } from "@/components/ops/ops-shell"
import { ReferralQueueCard } from "@/components/ops/referral-queue-card"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { opsPagesContent } from "@/content/ops-pages"

export default function AdminReferralsPage() {
  return (
    <OpsShell activeRoute="admin-referrals">
      <section className="space-y-6">
        <PatientPageHeader title={opsPagesContent.adminReferrals.title} description={opsPagesContent.adminReferrals.description} />
        <ReferralQueueCard title={opsPagesContent.adminReferrals.cardTitle} />
      </section>
    </OpsShell>
  )
}
