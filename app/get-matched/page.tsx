import { Suspense } from "react"

import { PublicFooter } from "@/components/layout/public-footer"
import { PublicHeader } from "@/components/layout/public-header"
import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { GetMatchedWizard } from "@/components/marketing/get-matched/get-matched-wizard"
import { Badge } from "@/components/ui/badge"
import { getMatchedQuizContent } from "@/content/get-matched-quiz"

export const metadata = {
  title: "Find your psychologist | Tailored Psychology",
  description:
    "Take a short confidential quiz to find psychologists who fit your state, goals, and preferences at Tailored Psychology.",
}

function GetMatchedIntro() {
  const hero = getMatchedQuizContent.hero
  return (
    <PageSection className="border-b border-border/60 py-10 md:py-12">
      <PageContainer>
        <div className="mx-auto max-w-2xl space-y-4 text-center md:text-left">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            {hero.eyebrow}
          </Badge>
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {hero.title} <span className="text-primary">{hero.titleAccent}</span>
          </h1>
          <p className="text-muted-foreground text-lg">{hero.description}</p>
        </div>
      </PageContainer>
    </PageSection>
  )
}

export default function GetMatchedPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main>
        <GetMatchedIntro />
        <Suspense
          fallback={
            <PageContainer className="py-12">
              <p className="text-muted-foreground text-center text-sm">Loading quiz…</p>
            </PageContainer>
          }
        >
          <GetMatchedWizard />
        </Suspense>
      </main>
      <PublicFooter />
    </div>
  )
}
