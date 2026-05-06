"use client"

import Link from "next/link"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { PsychologistShell } from "@/components/psychologist/psychologist-shell"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
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

  return (
    <PsychologistShell activeRoute="patients">
      <section className="space-y-6">
        <PatientPageHeader
          title={psychologistPatientsContent.header.title}
          description={psychologistPatientsContent.header.description}
        />
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Active Caseload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? <DashboardStateBlock variant="loading" message="Loading live caseload..." /> : null}
            {error ? <DashboardStateBlock variant="error" message={error} /> : null}
            {!loading && !error && rows.length === 0 ? <DashboardStateBlock variant="empty" message="No assigned patients yet." /> : null}
            {rows.map((patient) => (
              <div
                key={patient.id}
                className="bg-muted/40 border-border/60 grid grid-cols-1 gap-3 rounded-lg border p-3 sm:grid-cols-2 md:grid-cols-4"
              >
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
                <p className="text-sm">{patient.status}</p>
                <Button asChild size="sm" variant="outline" className="justify-self-start md:justify-self-end">
                  <Link href={`/psychologist/patients/${patient.id}`}>Open profile</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </PsychologistShell>
  )
}
