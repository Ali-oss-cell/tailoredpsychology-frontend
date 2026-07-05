import { AdminPsychologistUsersCard } from "@/components/ops/admin-psychologist-users-card"
import { OpsShell } from "@/components/ops/ops-shell"
import { AdminPageHeader } from "@/components/ops/ops-page-header"
import { opsPagesContent } from "@/content/ops-pages"

export default function AdminUsersPage() {
  return (
    <OpsShell activeRoute="admin-users">
      <section className="space-y-6">
        <AdminPageHeader title={opsPagesContent.adminUsers.title} description={opsPagesContent.adminUsers.description} />
        <AdminPsychologistUsersCard />
      </section>
    </OpsShell>
  )
}
