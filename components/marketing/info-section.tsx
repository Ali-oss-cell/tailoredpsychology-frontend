import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"

type InfoSectionProps = {
  title: string
  body: string
  muted?: boolean
}

export function InfoSection({ title, body, muted = false }: InfoSectionProps) {
  return (
    <PageSection muted={muted}>
      <PageContainer className="grid gap-4 md:grid-cols-12">
        <h2 className="font-heading text-2xl font-semibold tracking-tight md:col-span-4 md:text-3xl">
          {title}
        </h2>
        <p className="text-muted-foreground md:col-span-8">{body}</p>
      </PageContainer>
    </PageSection>
  )
}
