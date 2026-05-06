"use client"

import { useEffect, useState } from "react"

import { OpsShell } from "@/components/ops/ops-shell"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createSecurityIncident, getSecurityIncidents, updateSecurityIncident, type SecurityIncident } from "@/src/admin/security-incidents/api"

export default function AdminSecurityIncidentsPage() {
  const [rows, setRows] = useState<SecurityIncident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actingId, setActingId] = useState<string | null>(null)

  const load = async () => {
    try {
      setRows(await getSecurityIncidents())
      setError(null)
    } catch {
      setError("We couldn't load security incidents. Try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [])

  const createEntry = async () => {
    try {
      const created = await createSecurityIncident({
        title: "Potential data exposure incident",
        summary: "Automatic alert detected anomalous access behavior requiring triage.",
        severity: "high",
        impact: "moderate",
        containsPersonalData: true,
      })
      setRows((prev) => [created, ...prev])
      setError(null)
    } catch {
      setError("Failed to create incident.")
    }
  }

  const progress = async (incident: SecurityIncident) => {
    const nextByStatus: Partial<Record<SecurityIncident["status"], SecurityIncident["status"]>> = {
      reported: "triage",
      triage: "investigating",
      investigating: "notification_assessment",
      notification_assessment: "notification_ready",
      notification_ready: "closed",
    }
    const nextStatus = nextByStatus[incident.status]
    if (!nextStatus) return
    try {
      setActingId(incident.incidentId)
      const updated = await updateSecurityIncident(incident.incidentId, {
        status: nextStatus,
        ndbAssessment: nextStatus === "notification_ready" ? "notifiable" : "assessment_in_progress",
        resolutionNotes: nextStatus === "closed" ? "Incident closed after required NDB workflow actions." : undefined,
      })
      setRows((prev) => prev.map((row) => (row.incidentId === updated.incidentId ? updated : row)))
      setError(null)
    } catch {
      setError("Failed to update incident state.")
    } finally {
      setActingId(null)
    }
  }

  return (
    <OpsShell activeRoute="admin-security-incidents">
      <section className="space-y-6">
        <PatientPageHeader
          title="Security Incident Register"
          description="Manage breach triage, investigation, and NDB notification readiness states."
        />
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Register controls</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => void createEntry()}>Create incident</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Incident queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
            {!loading && error ? <DashboardStateBlock variant="error" message={error} onRetry={() => void load()} /> : null}
            {!loading && !error && rows.length === 0 ? <DashboardStateBlock variant="empty" message="No incidents reported." /> : null}
            {rows.map((row) => (
              <div key={row.incidentId} className="rounded-md border border-border/70 bg-muted/40 p-3 text-sm">
                <p className="font-medium">
                  {row.incidentId} • {row.severity}
                </p>
                <p>{row.title}</p>
                <p className="text-muted-foreground">
                  status: {row.status} • NDB: {row.ndbAssessment} • impact: {row.impact}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  disabled={actingId === row.incidentId || row.status === "closed"}
                  onClick={() => void progress(row)}
                >
                  Advance state
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </OpsShell>
  )
}
