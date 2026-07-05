import { PortalPageHeader } from "@/components/shared/portal-page-header"

export { PortalPageHeader as OpsPageHeader } from "@/components/shared/portal-page-header"

type OpsPageHeaderProps = {
  title: string
  description: string
  eyebrow?: string
}

export function ManagerPageHeader({ title, description }: OpsPageHeaderProps) {
  return <PortalPageHeader title={title} description={description} eyebrow="Operations" />
}

export function AdminPageHeader({ title, description }: OpsPageHeaderProps) {
  return <PortalPageHeader title={title} description={description} eyebrow="Administration" />
}
