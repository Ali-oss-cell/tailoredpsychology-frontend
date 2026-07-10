import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { OpsListCard } from "@/components/ops/ops-list-card"

type OpsPageTemplateProps = {
  title: string
  description: string
  eyebrow?: string
  cardTitle: string
  rows: readonly Record<string, string>[]
}

export function OpsPageTemplate({
  title,
  description,
  eyebrow = "Operations",
  cardTitle,
  rows,
}: OpsPageTemplateProps) {
  return (
    <OpsPortalPage title={title} description={description} eyebrow={eyebrow}>
      <OpsListCard title={cardTitle} rows={rows} />
    </OpsPortalPage>
  )
}
