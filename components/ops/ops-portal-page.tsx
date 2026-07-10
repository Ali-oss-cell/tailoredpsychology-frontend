import { DashboardPageHeader } from "@/components/shared/dashboard-page-header"
import { cn } from "@/lib/utils"

type OpsPortalPageProps = {
  title: string
  description: string
  eyebrow?: string
  children: React.ReactNode
  className?: string
  tutorialId?: string
  actions?: React.ReactNode
}

export function OpsPortalPage({
  title,
  description,
  eyebrow = "Operations",
  children,
  className,
  tutorialId,
  actions,
}: OpsPortalPageProps) {
  return (
    <section className={cn("space-y-8 pb-4", className)} data-tutorial={tutorialId}>
      <DashboardPageHeader title={title} description={description} eyebrow={eyebrow} actions={actions} />
      {children}
    </section>
  )
}
