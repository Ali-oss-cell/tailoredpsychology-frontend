import {
  CalendarCheck,
  ChatCircleDots,
  UserCircleGear,
} from "@phosphor-icons/react/dist/ssr"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import type { HomeHowItWorksStep } from "@/content/homepage"

type HomeHowItWorksSectionProps = {
  title: string
  description: string
  steps: HomeHowItWorksStep[]
}

const stepIconMap = {
  questions: ChatCircleDots,
  match: UserCircleGear,
  book: CalendarCheck,
} as const

export function HomeHowItWorksSection({
  title,
  description,
  steps,
}: HomeHowItWorksSectionProps) {
  return (
    <PageSection id="how-it-works" className="scroll-mt-24 bg-marketing-canvas">
      <PageContainer className="space-y-10 md:space-y-12">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="marketing-h2 text-balance">{title}</h2>
          <p className="marketing-body text-muted-foreground text-balance">{description}</p>
        </div>
        <ol className="grid gap-5 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => {
            const Icon = stepIconMap[step.icon]
            return (
              <li key={step.title}>
                <article className="marketing-card interactive-lift relative h-full p-6 md:p-7">
                  <span className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
                    <Icon size={26} weight="duotone" aria-hidden />
                  </span>
                  <span className="text-muted-foreground absolute end-5 top-5 text-sm font-semibold tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="marketing-h3 mb-2 text-balance">{step.title}</h3>
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
