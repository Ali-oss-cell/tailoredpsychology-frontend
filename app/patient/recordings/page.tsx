"use client"

import { useCallback, useEffect, useState } from "react"

import { PatientPortalPage } from "@/components/patient/patient-portal-page"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PortalListRow } from "@/components/shared/portal-list-row"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/src/auth/current-user"
import { getPatientSessionVideos, requestSessionVideoAccess, type SessionVideoItem } from "@/src/psychologist/videos/api"

export default function PatientRecordingsPage() {
  const [rows, setRows] = useState<SessionVideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusByVideo, setStatusByVideo] = useState<Record<string, string>>({})

  const loadRecordings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const user = await getCurrentUser()
      if (user.role !== "patient") {
        setError("Sign in as a patient to view session recordings.")
        setRows([])
        return
      }
      setRows(await getPatientSessionVideos(user.id))
    } catch {
      setError("Could not load session recordings.")
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadRecordings()
  }, [loadRecordings])

  return (
    <PatientPortalPage
      title="Session recordings"
      description="Access your session video library and transcript readiness."
      eyebrow="Your care"
      showJourney
      tutorialId="patient.page.recordings"
    >
      <Card className="interactive-lift">
        <CardHeader className="pb-3">
          <p className="card-eyebrow">Library</p>
          <CardTitle className="text-lg">My session videos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? <DashboardStateBlock variant="loading" message="Loading recordings..." /> : null}
          {!loading && error ? (
            <DashboardStateBlock variant="error" message={error} onRetry={() => void loadRecordings()} />
          ) : null}
          {!loading && !error && rows.length === 0 ? (
            <DashboardStateBlock variant="empty" message="No session videos yet." />
          ) : null}
          {!loading && !error
            ? rows.map((recording) => (
                <PortalListRow key={recording.videoId} className="md:grid-cols-[minmax(0,1fr)_auto_auto]">
                  <div>
                    <p className="text-sm font-medium">{recording.videoId}</p>
                    <p className="text-muted-foreground text-xs">Session {recording.sessionId}</p>
                    <p className="text-muted-foreground text-xs">{new Date(recording.sessionDate).toLocaleString()}</p>
                  </div>
                  <p className="text-sm self-center">{recording.transcriptReady ? "Transcript ready" : "Transcript pending"}</p>
                  <div className="space-y-1 self-center">
                    <p className="text-xs font-medium uppercase">{recording.policyStatus.replace("_", " ")}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!recording.canDownload}
                      onClick={() => {
                        void (async () => {
                          const grant = await requestSessionVideoAccess(recording.videoId)
                          if (!grant.canDownload || !grant.downloadUrl) {
                            setStatusByVideo((current) => ({
                              ...current,
                              [recording.videoId]: grant.denialReason ?? "Download denied by policy.",
                            }))
                            return
                          }
                          setStatusByVideo((current) => ({
                            ...current,
                            [recording.videoId]: `Access granted until ${new Date(grant.expiresAt ?? "").toLocaleTimeString()}`,
                          }))
                          window.open(grant.downloadUrl, "_blank", "noopener,noreferrer")
                        })()
                      }}
                    >
                      Request access
                    </Button>
                    {statusByVideo[recording.videoId] ? (
                      <p className="text-muted-foreground text-xs">{statusByVideo[recording.videoId]}</p>
                    ) : null}
                  </div>
                </PortalListRow>
              ))
            : null}
        </CardContent>
      </Card>
    </PatientPortalPage>
  )
}
