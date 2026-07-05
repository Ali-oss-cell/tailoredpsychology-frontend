import { OpsPortalPage } from "@/components/ops/ops-portal-page"
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
  eyebrow?: string
  cardTitle: string
  rows: readonly Record<string, string>[]
}

export function OpsPageTemplate({
  activeRoute,
  title,
  description,
  eyebrow = "Operations",
  cardTitle,
  rows,
}: OpsPageTemplateProps) {
  return (
    <OpsShell activeRoute={activeRoute}>
      <OpsPortalPage title={title} description={description} eyebrow={eyebrow}>
        <OpsListCard title={cardTitle} rows={rows} />
      </OpsPortalPage>
    </OpsShell>
  )
}
