import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { OpsListCard } from "@/components/ops/ops-list-card"
import { OpsShell } from "@/components/ops/ops-shell"

type OpsPageTemplateProps = {
  activeRoute:
    | "manager-dashboard"
    | "manager-staff"
    | "manager-patients"
    | "manager-appointments"
    | "manager-billing"
    | "manager-referrals"
    | "manager-resources"
    | "admin-dashboard"
    | "admin-users"
    | "admin-appointments"
    | "admin-patients"
    | "admin-staff"
    | "admin-billing"
    | "admin-settings"
    | "admin-analytics"
    | "admin-audit-logs"
    | "admin-data-deletion"
    | "admin-referrals"
    | "admin-resources"
  title: string
  description: string
  cardTitle: string
  rows: readonly Record<string, string>[]
}

export function OpsPageTemplate({
  activeRoute,
  title,
  description,
  cardTitle,
  rows,
}: OpsPageTemplateProps) {
  return (
    <OpsShell activeRoute={activeRoute}>
      <section className="space-y-6">
        <PatientPageHeader title={title} description={description} />
        <OpsListCard title={cardTitle} rows={rows} />
      </section>
    </OpsShell>
  )
}
