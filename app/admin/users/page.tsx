import { AdminPsychologistUsersCard } from "@/components/ops/admin-psychologist-users-card"
import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { opsPagesContent } from "@/content/ops-pages"

export default function AdminUsersPage() {
  return (
    <OpsPortalPage
      eyebrow="Administration"
      title={opsPagesContent.adminUsers.title}
      description={opsPagesContent.adminUsers.description}
    >
      <AdminPsychologistUsersCard />
    </OpsPortalPage>
  )
}
