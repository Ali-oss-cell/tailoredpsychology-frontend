import { JourneyRail } from "@/components/patient/journey/journey-rail"
import { PortalPageHeader } from "@/components/shared/portal-page-header"
import { cn } from "@/lib/utils"

type PatientPortalPageProps = {
  title: string
  description: string
  eyebrow?: string
  showJourney?: boolean
  children: React.ReactNode
  className?: string
  tutorialId?: string
}

export function PatientPortalPage({
  title,
  description,
  eyebrow,
  showJourney = false,
  children,
  className,
  tutorialId,
}: PatientPortalPageProps) {
  return (
    <section className={cn("space-y-6", className)} data-tutorial={tutorialId}>
      <PortalPageHeader title={title} description={description} eyebrow={eyebrow} />
      {showJourney ? <JourneyRail /> : null}
      {children}
    </section>
  )
}
