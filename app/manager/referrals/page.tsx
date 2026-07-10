import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { ReferralQueueCard } from "@/components/ops/referral-queue-card"
import { opsPagesContent } from "@/content/ops-pages"

export default function ManagerReferralsPage() {
  return (
    <OpsPortalPage
      title={opsPagesContent.managerReferrals.title}
      description={opsPagesContent.managerReferrals.description}
      eyebrow="Operations"
      tutorialId="manager.page.referrals"
    >
      <ReferralQueueCard title={opsPagesContent.managerReferrals.cardTitle} />
    </OpsPortalPage>
  )
}
