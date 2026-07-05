"use client"

import Link from "next/link"
import * as React from "react"
import { useUrlSearchQuery } from "@/components/shared/use-url-search-query"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PsychologistPortalPage } from "@/components/psychologist/psychologist-portal-page"
import { PsychologistShell } from "@/components/psychologist/psychologist-shell"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PortalListRow } from "@/components/shared/portal-list-row"
import { psychologistPatientsContent } from "@/content/psychologist-patients"
import { getCurrentUser } from "@/src/auth/current-user"
import { getPsychologistPatientContext, getPsychologistWorkspace } from "@/src/psychologist/workspace/api"
import { getPsychologistSessions } from "@/src/sessions/api"

type CaseloadRow = {
  id: string
  name: string
  nextSession: string
  nextSessionMs: number
  status: string
  needsPrep: boolean
  firstVisitLikely: boolean
}

export default function PsychologistPatientsPage() {
  const [rows, setRows] = React.useState<CaseloadRow[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [search, setSearch] = useUrlSearchQuery()

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const user = await getCurrentUser()
        const [workspace, allSessions] = await Promise.all([
          getPsychologistWorkspace(user.id),
          getPsychologistSessions(user.id).catch(() => []),
        ])
        const uniquePatientIds = [...new Set(workspace.items.map((item) => item.patientId))]
        const contexts = await Promise.all(
          uniquePatientIds.map(async (patientId) => getPsychologistPatientContext(user.id, patientId).catch(() => null)),
        )
        const byPatient = new Map(contexts.filter((ctx): ctx is NonNullable<typeof ctx> => Boolean(ctx)).map((ctx) => [ctx.patientId, ctx]))
        const mapped: CaseloadRow[] = uniquePatientIds.map((patientId) => {
          const patientWorkspaceItems = workspace.items.filter((item) => item.patientId === patientId)
          const nextItem = [...patientWorkspaceItems].sort(
            (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
          )[0]
          const context = byPatient.get(patientId)
          const needsPrep = patientWorkspaceItems.some((item) => item.actions.length > 0)
          const sessionsForPatient = allSessions.filter((s) => s.patientId === patientId)
          const completedCount = sessionsForPatient.filter((s) => s.status === "completed").length
          const firstVisitLikely = completedCount === 0
          const nextSessionMs = nextItem ? new Date(nextItem.startsAt).getTime() : Number.POSITIVE_INFINITY
          return {
            id: patientId,
            name: context?.patientDisplayName ?? patientId,
            nextSession: nextItem ? new Date(nextItem.startsAt).toLocaleString() : "No upcoming sessions",
            nextSessionMs,
            status: context?.riskLevel ?? "unknown",
            needsPrep,
            firstVisitLikely,
          }
        })
        mapped.sort((a, b) => {
          if (a.needsPrep !== b.needsPrep) return a.needsPrep ? -1 : 1
          if (a.firstVisitLikely !== b.firstVisitLikely) return a.firstVisitLikely ? -1 : 1
          return a.nextSessionMs - b.nextSessionMs
        })
        if (!cancelled) {
          setRows(mapped)
          setError(null)
        }
      } catch {
        if (!cancelled) setError("Could not load live caseload.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredRows = React.useMemo(() => {
    if (!search.trim()) return rows
    const term = search.toLowerCase()
    return rows.filter((row) => row.name.toLowerCase().includes(term) || row.id.toLowerCase().includes(term))
  }, [rows, search])

  return (
    <PsychologistShell activeRoute="patients">
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
            {error ? <DashboardStateBlock variant="error" message={error} /> : null}
            {!loading && !error && filteredRows.length === 0 ? (
              <DashboardStateBlock variant="empty" message={search ? "No patients matched your search." : "No assigned patients yet."} />
            ) : null}
            {filteredRows.map((patient) => (
              <PortalListRow key={patient.id} highlight={patient.needsPrep} className="md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto_auto]">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{patient.name}</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.needsPrep ? (
                      <Badge variant="outline" className="border-amber-400/80 bg-amber-50 text-[11px] text-amber-950">
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
    </PsychologistShell>
  )
}
