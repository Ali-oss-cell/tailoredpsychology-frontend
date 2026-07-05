import { PortalPageHeader } from "@/components/shared/portal-page-header"
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
    <section className={cn("space-y-6", className)} data-tutorial={tutorialId}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PortalPageHeader title={title} description={description} eyebrow={eyebrow} />
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  )
}
