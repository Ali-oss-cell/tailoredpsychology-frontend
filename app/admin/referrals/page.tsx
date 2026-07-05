import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { OpsShell } from "@/components/ops/ops-shell"
import { ReferralQueueCard } from "@/components/ops/referral-queue-card"
import { opsPagesContent } from "@/content/ops-pages"

export default function AdminReferralsPage() {
  return (
    <OpsShell activeRoute="admin-referrals">
      <OpsPortalPage
        title={opsPagesContent.adminReferrals.title}
        description={opsPagesContent.adminReferrals.description}
        eyebrow="Administration"
        tutorialId="admin.page.referrals"
      >
        <ReferralQueueCard title={opsPagesContent.adminReferrals.cardTitle} />
      </OpsPortalPage>
    </OpsShell>
  )
}
