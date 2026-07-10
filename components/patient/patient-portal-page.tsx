import { JourneyRail } from "@/components/patient/journey/journey-rail"
import { DashboardPageHeader } from "@/components/shared/dashboard-page-header"
import { cn } from "@/lib/utils"

type PatientPortalPageProps = {
  title: string
  description: string
  eyebrow?: string
  showJourney?: boolean
  children: React.ReactNode
  className?: string
  tutorialId?: string
  actions?: React.ReactNode
}

export function PatientPortalPage({
  title,
  description,
  eyebrow,
  showJourney = false,
  children,
  className,
  tutorialId,
  actions,
}: PatientPortalPageProps) {
  return (
    <section className={cn("space-y-8 pb-4", className)} data-tutorial={tutorialId}>
      <DashboardPageHeader title={title} description={description} eyebrow={eyebrow} actions={actions} />
      {showJourney ? (
        <div className="dashboard-section">
          <JourneyRail />
        </div>
      ) : null}
      {children}
    </section>
  )
}
