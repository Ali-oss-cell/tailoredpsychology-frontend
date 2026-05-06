"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PatientShell } from "@/components/patient/patient-shell"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { Button } from "@/components/ui/button"
import { getPatientSessionVideos, requestSessionVideoAccess, type SessionVideoItem } from "@/src/psychologist/videos/api"

export default function PatientRecordingsPage() {
  const [rows, setRows] = useState<SessionVideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusByVideo, setStatusByVideo] = useState<Record<string, string>>({})

  useEffect(() => {
    void (async () => {
      try {
        setRows(await getPatientSessionVideos("user_patient_001"))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <PatientShell activeRoute="resources">
      <section className="space-y-6">
        <PatientPageHeader title="Session Recordings" description="Access your session video library and transcript readiness." />
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">My Session Videos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
            {!loading && rows.length === 0 ? <DashboardStateBlock variant="empty" message="No session videos yet." /> : null}
            {rows.map((recording) => (
              <div key={recording.videoId} className="grid grid-cols-2 gap-2 rounded-md border border-border/70 bg-muted/40 p-3 md:grid-cols-5">
                <p className="text-sm font-medium">{recording.videoId}</p>
                <p className="text-sm">{recording.sessionId}</p>
                <p className="text-sm">{new Date(recording.sessionDate).toLocaleString()}</p>
                <p className="text-sm">{recording.transcriptReady ? "Transcript ready" : "Transcript pending"}</p>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase">{recording.policyStatus.replace("_", " ")}</p>
                  <p className="text-xs text-muted-foreground">{recording.policyReason ?? "Download permitted under owner policy."}</p>
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
                    <p className="text-xs text-muted-foreground">{statusByVideo[recording.videoId]}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </PatientShell>
  )
}
