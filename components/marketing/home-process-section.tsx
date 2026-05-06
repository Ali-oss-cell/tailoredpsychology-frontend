import Image from "next/image"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"

type ProcessStep = {
  title: string
  body: string
}

type HomeProcessSectionProps = {
  title: string
  description: string
  steps: ProcessStep[]
  imageSrc: string
  imageAlt: string
}

export function HomeProcessSection({
  title,
  description,
  steps,
  imageSrc,
  imageAlt,
}: HomeProcessSectionProps) {
  return (
    <PageSection muted>
      <PageContainer>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance md:text-3xl">
                {title}
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed md:text-lg">{description}</p>
            </div>
            <ol className="space-y-6">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="bg-primary/12 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums">
                    {index + 1}
                  </span>
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium leading-snug">{step.title}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="ring-primary/10 relative overflow-hidden rounded-2xl border border-border/70 shadow-lg ring-2">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={900}
              height={650}
              className="aspect-[16/11] h-auto w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </PageContainer>
    </PageSection>
  )
}
