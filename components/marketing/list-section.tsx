import { BookOpen, CheckCircle, Heart, Lightbulb } from "@phosphor-icons/react/dist/ssr"
import * as React from "react"

import { PageContainer } from "@/components/layout/page-container"
import { PageSection } from "@/components/layout/page-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ListItem = {
  title: string
  description: string
}

type ListSectionProps = {
  title: string
  items: ListItem[]
  muted?: boolean
}

const ICONS = [CheckCircle, Heart, BookOpen, Lightbulb] as const satisfies readonly React.ElementType[]

export function ListSection({ title, items, muted = false }: ListSectionProps) {
  return (
    <PageSection muted={muted}>
      <PageContainer className="space-y-8">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance md:text-3xl">{title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            Key points at a glance — each card expands on one part of how we work with you.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length]
            return (
              <Card key={item.title} className="interactive-lift border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-start gap-3 text-lg leading-snug">
                    <span className="bg-primary/10 text-primary mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                      <Icon size={20} weight="duotone" aria-hidden />
                    </span>
                    <span>{item.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm leading-relaxed">{item.description}</CardContent>
              </Card>
            )
          })}
        </div>
      </PageContainer>
    </PageSection>
  )
}
