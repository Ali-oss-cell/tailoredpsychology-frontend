import { AdminPsychologistUsersCard } from "@/components/ops/admin-psychologist-users-card"
import { OpsShell } from "@/components/ops/ops-shell"
import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { opsPagesContent } from "@/content/ops-pages"

export default function AdminUsersPage() {
  return (
    <OpsShell activeRoute="admin-users">
      <OpsPortalPage eyebrow="Administration"
        title={opsPagesContent.adminUsers.title} description={opsPagesContent.adminUsers.description}>
        <AdminPsychologistUsersCard />
      </OpsPortalPage>
    </OpsShell>
  )
}
