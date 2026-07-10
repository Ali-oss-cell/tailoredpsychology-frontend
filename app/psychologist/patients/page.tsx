"use client"

import Link from "next/link"
import * as React from "react"
import { useUrlSearchQuery } from "@/components/shared/use-url-search-query"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PsychologistPortalPage } from "@/components/psychologist/psychologist-portal-page"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { EmptyState } from "@/components/shared/empty-state"
import { PortalListRow } from "@/components/shared/portal-list-row"
import { psychologistPatientsContent } from "@/content/psychologist-patients"
import { usePsychologistId } from "@/src/psychologist/queries/use-current-user"
import { usePsychologistCaseload } from "@/src/psychologist/queries/use-psychologist-caseload"

export default function PsychologistPatientsPage() {
  const psychologistId = usePsychologistId()
  const caseloadQuery = usePsychologistCaseload(psychologistId)
  const [search, setSearch] = useUrlSearchQuery()

  const filteredRows = React.useMemo(() => {
    const rows = caseloadQuery.data ?? []
    if (!search.trim()) return rows
    const term = search.toLowerCase()
    return rows.filter((row) => row.name.toLowerCase().includes(term) || row.id.toLowerCase().includes(term))
  }, [caseloadQuery.data, search])

  const loading = caseloadQuery.isLoading
  const error = caseloadQuery.isError ? "Could not load live caseload." : null

  return (
    <PsychologistPortalPage
      title={psychologistPatientsContent.header.title}
      description={psychologistPatientsContent.header.description}
      eyebrow="Caseload"
      tutorialId="psychologist.page.patients"
    >
      {search ? (
        <p className="text-muted-foreground text-sm">
          Showing results for &ldquo;{search}&rdquo;.{" "}
          <button type="button" className="text-primary font-medium underline-offset-2 hover:underline" onClick={() => setSearch("")}>
            Clear
          </button>
        </p>
      ) : null}
      <Card className="interactive-lift">
        <CardHeader className="pb-3">
          <p className="card-eyebrow">Assigned patients</p>
          <CardTitle className="text-lg">Active caseload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? <DashboardStateBlock variant="loading" message="Loading live caseload..." /> : null}
          {error ? <DashboardStateBlock variant="error" message={error} onRetry={() => void caseloadQuery.refetch()} /> : null}
          {!loading && !error && filteredRows.length === 0 ? (
            <EmptyState
              title={search ? "No patients matched your search." : "No assigned patients yet."}
              description={
                search ? "Try a different name or patient ID." : "Patients appear here once assigned to your caseload."
              }
            />
          ) : null}
          {filteredRows.map((patient) => (
            <PortalListRow key={patient.id} highlight={patient.needsPrep} className="md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto_auto]">
              <div className="space-y-1">
                <p className="text-sm font-medium">{patient.name}</p>
                <div className="flex flex-wrap gap-1">
                  {patient.needsPrep ? (
                    <Badge variant="outline" className="border-warning/80 bg-warning/10 text-[11px] text-warning-foreground">
                      Prep needed
                    </Badge>
                  ) : null}
                  {patient.firstVisitLikely ? (
                    <Badge variant="secondary" className="text-[11px]">
                      No completed visits yet
                    </Badge>
                  ) : null}
                </div>
              </div>
              <p className="text-sm">{patient.nextSession}</p>
              <p className="text-muted-foreground text-sm capitalize">{patient.status}</p>
              <Button asChild size="sm" variant="outline" className="justify-self-start md:justify-self-end">
                <Link href={`/psychologist/patients/${patient.id}`}>Open profile</Link>
              </Button>
            </PortalListRow>
          ))}
        </CardContent>
      </Card>
    </PsychologistPortalPage>
  )
}
