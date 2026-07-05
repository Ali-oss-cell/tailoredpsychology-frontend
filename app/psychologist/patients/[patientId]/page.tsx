"use client"

import * as React from "react"
import { useParams } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PsychologistPortalPage } from "@/components/psychologist/psychologist-portal-page"
import { PsychologistShell } from "@/components/psychologist/psychologist-shell"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PortalListRow } from "@/components/shared/portal-list-row"
import { PatientIntakeSummaryCard } from "@/components/psychologist/patient-intake-summary-card"
import { PreSessionChecklistCard } from "@/components/psychologist/pre-session-checklist-card"
import { getCurrentUser } from "@/src/auth/current-user"
import {
  getPatientIntakeLatest,
  getPsychologistPatientContext,
  getPsychologistWorkspace,
  type PatientIntakeLatest,
  type PsychologistWorkspaceItem,
} from "@/src/psychologist/workspace/api"
import { getPsychologistSessions, type SessionSummary } from "@/src/sessions/api"
import { Button } from "@/components/ui/button"
import { getPsychologistReferrals, type PsychologistReferral } from "@/src/psychologist/referrals/api"
import {
  downloadPsychologistPatientExport,
  getPsychologistPatientExportStatus,
  requestPsychologistPatientExport,
  type PsychologistPatientExportStatus,
} from "@/src/psychologist/exports/api"

import { cn } from "@/lib/utils"

function riskBadgeClass(level: string | undefined): string {
  if (level === "high") return "border-destructive/30 bg-destructive/10 text-destructive"
  if (level === "medium") return "border-amber-400/50 bg-amber-50 text-amber-950"
  return "border-primary/25 bg-primary/10 text-primary"
}

export default function PsychologistPatientProfilePage() {
  const params = useParams<{ patientId: string }>()
  const patientId = params.patientId
  const [context, setContext] = React.useState<Awaited<ReturnType<typeof getPsychologistPatientContext>> | null>(null)
  const [patientSessions, setPatientSessions] = React.useState<SessionSummary[]>([])
  const [sessionTab, setSessionTab] = React.useState<"upcoming" | "past">("upcoming")
  const [referrals, setReferrals] = React.useState<PsychologistReferral[]>([])
  const [psychologistId, setPsychologistId] = React.useState<string>("")
  const [exportStatus, setExportStatus] = React.useState<PsychologistPatientExportStatus | null>(null)
  const [exportBusy, setExportBusy] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [workspaceItems, setWorkspaceItems] = React.useState<PsychologistWorkspaceItem[]>([])
  const [intake, setIntake] = React.useState<PatientIntakeLatest | null>(null)
  const [intakeLoading, setIntakeLoading] = React.useState(true)
  const [intakeError, setIntakeError] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    setIntake(null)
    setIntakeError(false)
    setWorkspaceItems([])
    setIntakeLoading(true)
    void (async () => {
      try {
        const user = await getCurrentUser()
        const [ctx, psychologistSessions, workspace, intakeResult] = await Promise.all([
          getPsychologistPatientContext(user.id, patientId),
          getPsychologistSessions(user.id),
          getPsychologistWorkspace(user.id).catch(() => null),
          getPatientIntakeLatest(patientId).catch(() => null),
        ])
        const referralRows = await getPsychologistReferrals(user.id).catch(() => [])
        if (!cancelled) {
          setPsychologistId(user.id)
          setContext(ctx)
          setPatientSessions(psychologistSessions.filter((item) => item.patientId === patientId))
          setReferrals(referralRows.filter((row) => row.patientId === patientId))
          setWorkspaceItems(workspace?.items.filter((item) => item.patientId === patientId) ?? [])
          if (intakeResult) {
            setIntake(intakeResult)
            setIntakeError(false)
          } else {
            setIntake(null)
            setIntakeError(true)
          }
          setError(null)
        }
      } catch {
        if (!cancelled) setError("Could not load patient context.")
      } finally {
        if (!cancelled) {
          setLoading(false)
          setIntakeLoading(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [patientId])

  const requestExport = async () => {
    if (!psychologistId) return
    try {
      setExportBusy(true)
      const created = await requestPsychologistPatientExport(psychologistId, patientId)
      const status = await getPsychologistPatientExportStatus(psychologistId, patientId, created.jobId)
      setExportStatus(status)
    } catch {
      setError("Could not request patient export.")
    } finally {
      setExportBusy(false)
    }
  }

  const refreshExportStatus = async () => {
    if (!psychologistId || !exportStatus?.jobId) return
    try {
      setExportBusy(true)
      const status = await getPsychologistPatientExportStatus(psychologistId, patientId, exportStatus.jobId)
      setExportStatus(status)
    } catch {
      setError("Could not refresh export status.")
    } finally {
      setExportBusy(false)
    }
  }

  const { upcomingSessions, pastSessions } = React.useMemo(() => {
    const now = Date.now()
    const upcoming: SessionSummary[] = []
    const past: SessionSummary[] = []
    for (const s of patientSessions) {
      const endMs = new Date(s.scheduledEndAt).getTime()
      const terminal = s.status === "completed" || s.status === "cancelled" || s.status === "no_show"
      if (terminal || endMs < now) past.push(s)
      else upcoming.push(s)
    }
    upcoming.sort((a, b) => new Date(a.scheduledStartAt).getTime() - new Date(b.scheduledStartAt).getTime())
    past.sort((a, b) => new Date(b.scheduledStartAt).getTime() - new Date(a.scheduledStartAt).getTime())
    return { upcomingSessions: upcoming, pastSessions: past }
  }, [patientSessions])

  const displayedSessions = sessionTab === "upcoming" ? upcomingSessions : pastSessions

  const downloadExport = async () => {
    if (!psychologistId || !exportStatus?.jobId) return
    try {
      setExportBusy(true)
      const { blob, fileName } = await downloadPsychologistPatientExport(psychologistId, patientId, exportStatus.jobId)
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = objectUrl
      link.download = fileName ?? `patient-export-${exportStatus.jobId}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(objectUrl)
    } catch {
      setError("Could not download patient export.")
    } finally {
      setExportBusy(false)
    }
  }

  return (
    <PsychologistShell activeRoute="patients">
      <PsychologistPortalPage
        title={context?.patientDisplayName ?? patientId}
        description="Live patient context, referrals, sessions, and governed export."
        eyebrow="Patient profile"
        tutorialId="psychologist.page.patient-profile"
      >
        {loading ? <DashboardStateBlock variant="loading" message="Loading patient profile..." /> : null}
        {error ? <DashboardStateBlock variant="error" message={error} /> : null}
        <div className="grid gap-4 md:grid-cols-2">
          {psychologistId ? (
            <PreSessionChecklistCard items={workspaceItems} psychologistId={psychologistId} patientId={patientId} />
          ) : null}
          <PatientIntakeSummaryCard intake={intake} loading={intakeLoading} error={intakeError} />
          <Card id="patient-clinical-snapshot" className="interactive-lift">
            <CardHeader className="pb-3">
              <p className="card-eyebrow">Clinical</p>
              <CardTitle className="text-lg">Clinical snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-xs">Risk</span>
                <Badge variant="outline" className={cn("capitalize", riskBadgeClass(context?.riskLevel))}>
                  {context?.riskLevel ?? "unknown"}
                </Badge>
              </div>
              <p>
                <span className="text-muted-foreground">Referral:</span> {context?.referralStatus?.replace(/_/g, " ") ?? "unknown"}
              </p>
              <p>
                <span className="text-muted-foreground">Readiness:</span> {context?.readinessStatus ?? "unknown"}
              </p>
              <p>
                <span className="text-muted-foreground">Care signals:</span> {context?.careSignals.join(", ") || "none"}
              </p>
            </CardContent>
          </Card>
          <Card id="patient-sessions" className="interactive-lift md:col-span-2">
            <CardHeader className="pb-3">
              <p className="card-eyebrow">Sessions</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg">Session history</CardTitle>
                <div
                  className="flex gap-1 rounded-md border border-border/60 bg-muted/30 p-0.5"
                  role="group"
                  aria-label="Filter sessions by time"
                >
                  <Button
                    type="button"
                    size="sm"
                    variant={sessionTab === "upcoming" ? "default" : "ghost"}
                    className="h-8 flex-1 px-3 text-xs sm:flex-none"
                    onClick={() => setSessionTab("upcoming")}
                  >
                    Upcoming ({upcomingSessions.length})
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={sessionTab === "past" ? "default" : "ghost"}
                    className="h-8 flex-1 px-3 text-xs sm:flex-none"
                    onClick={() => setSessionTab("past")}
                  >
                    Past ({pastSessions.length})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm">
              {displayedSessions.length === 0 ? (
                <p className="text-muted-foreground">
                  {sessionTab === "upcoming" ? "No upcoming sessions for this patient." : "No past sessions in this list."}
                </p>
              ) : (
                <div className="relative space-y-0 border-l border-border/80 pl-4">
                  {displayedSessions.map((session) => (
                    <div key={session.sessionId} className="relative pb-4 last:pb-0">
                      <span
                        className="bg-primary absolute -left-1 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
                        aria-hidden
                      />
                      <div className="rounded border border-border/60 bg-background/50 p-2 pl-3">
                        <p className="font-medium">{new Date(session.scheduledStartAt).toLocaleString()}</p>
                        <p className="text-muted-foreground text-xs">status: {session.status.replace(/_/g, " ")}</p>
                        <p className="text-muted-foreground text-xs">
                          {new Date(session.scheduledStartAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} –{" "}
                          {new Date(session.scheduledEndAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card id="patient-referrals" className="interactive-lift">
            <CardHeader className="pb-3">
              <p className="card-eyebrow">Referrals</p>
              <CardTitle className="text-lg">Linked referrals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {referrals.length === 0 ? <p className="text-muted-foreground">No referrals linked.</p> : null}
              {referrals.map((referral) => (
                <PortalListRow key={referral.documentId} className="md:grid-cols-[minmax(0,1fr)_auto]">
                  <div>
                    <p className="font-medium">{referral.documentId}</p>
                    <p className="text-muted-foreground text-xs">
                      {referral.status} · {referral.sourceType}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-xs md:text-right">
                    Due {new Date(referral.dueAt).toLocaleString()}
                  </p>
                </PortalListRow>
              ))}
            </CardContent>
          </Card>
          <Card className="interactive-lift">
            <CardHeader className="pb-3">
              <p className="card-eyebrow">Governance</p>
              <CardTitle className="text-lg">Patient PDF export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">Request and download a governed patient data export PDF.</p>
              {!exportStatus ? (
                <Button type="button" variant="outline" size="sm" onClick={() => void requestExport()} disabled={exportBusy}>
                  {exportBusy ? "Requesting..." : "Request patient PDF export"}
                </Button>
              ) : (
                <div className="space-y-2">
                  <p>
                    Status: <span className="font-medium capitalize">{exportStatus.status}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => void refreshExportStatus()} disabled={exportBusy}>
                      Refresh
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => void downloadExport()}
                      disabled={exportBusy || exportStatus.status !== "ready"}
                    >
                      Download PDF
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PsychologistPortalPage>
    </PsychologistShell>
  )
}
