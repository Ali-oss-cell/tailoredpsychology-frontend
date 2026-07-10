"use client"

import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { EmptyState } from "@/components/shared/empty-state"
import { useUrlSearchQuery } from "@/components/shared/use-url-search-query"
import { patientResourcesContent } from "@/content/patient-resources"

export function PatientResourcesSection() {
  const [search] = useUrlSearchQuery()
  const term = search.trim().toLowerCase()

  const categories = React.useMemo(() => {
    if (!term) return patientResourcesContent.categories
    return patientResourcesContent.categories.filter((category) => {
      const haystack = `${category.title} ${category.description}`.toLowerCase()
      return haystack.includes(term)
    })
  }, [term])

  return (
    <>
      {term && categories.length === 0 ? (
        <EmptyState title="No resources matched your search." description="Try different keywords or browse all categories." />
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.title} className="dashboard-card interactive-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{category.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-6">
              {category.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
