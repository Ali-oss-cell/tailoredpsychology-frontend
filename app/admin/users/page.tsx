import { AdminPsychologistUsersCard } from "@/components/ops/admin-psychologist-users-card"
import { OpsShell } from "@/components/ops/ops-shell"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { opsPagesContent } from "@/content/ops-pages"

export default function AdminUsersPage() {
  return (
    <OpsShell activeRoute="admin-users">
      <section className="space-y-6">
        <PatientPageHeader title={opsPagesContent.adminUsers.title} description={opsPagesContent.adminUsers.description} />
        <AdminPsychologistUsersCard />
      </section>
    </OpsShell>
  )
}
