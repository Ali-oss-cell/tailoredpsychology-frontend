import { ChartLineUp, UserSwitch, VideoCamera } from "@phosphor-icons/react/dist/ssr"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import type { HomeCareJourneyStep } from "@/content/homepage"

type HomeCareJourneyStepsSectionProps = {
  title: string
  description: string
  steps: HomeCareJourneyStep[]
}

const stepIconMap = {
  match: UserSwitch,
  meet: VideoCamera,
  manage: ChartLineUp,
} as const

/**
 * "Match / Meet / Manage" — Stitch's framing for the ongoing patient relationship.
 * Complements (does not replace) HomeHowItWorksSection, which explains the pre-booking funnel.
 */
export function HomeCareJourneyStepsSection({ title, description, steps }: HomeCareJourneyStepsSectionProps) {
  return (
    <PageSection className="bg-marketing-canvas">
      <PageContainer className="space-y-10 md:space-y-12">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="marketing-h2 text-balance">{title}</h2>
          <p className="marketing-body text-muted-foreground text-balance">{description}</p>
        </div>
        <ol className="grid gap-5 md:grid-cols-3 md:gap-6">
          {steps.map((step) => {
            const Icon = stepIconMap[step.icon]
            return (
              <li key={step.title}>
                <article className="marketing-card interactive-lift flex h-full flex-col items-center gap-3 p-6 text-center md:p-7">
                  <span className="bg-primary-strong/12 text-primary-strong flex h-14 w-14 items-center justify-center rounded-full">
                    <Icon size={26} weight="duotone" aria-hidden />
                  </span>
                  <h3 className="marketing-h3 text-balance">
                    {step.step}. {step.title}
                  </h3>
                  <p className="marketing-small leading-relaxed">{step.description}</p>
                </article>
              </li>
            )
          })}
        </ol>
      </PageContainer>
    </PageSection>
  )
}
