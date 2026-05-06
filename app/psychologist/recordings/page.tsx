"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { PsychologistShell } from "@/components/psychologist/psychologist-shell"
import { psychologistRecordingsContent } from "@/content/psychologist-recordings"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/src/auth/current-user"
import { getPsychologistSessionVideos, requestSessionVideoAccess, type SessionVideoItem } from "@/src/psychologist/videos/api"

export default function PsychologistRecordingsPage() {
  const [rows, setRows] = useState<SessionVideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusByVideo, setStatusByVideo] = useState<Record<string, string>>({})

  useEffect(() => {
    void (async () => {
      try {
        const user = await getCurrentUser()
        if (user.role !== "psychologist") {
          setError("Sign in as a psychologist to view recordings.")
          return
        }
        setRows(await getPsychologistSessionVideos(user.id))
        setError(null)
      } catch {
        setError("Could not load recordings.")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <PsychologistShell activeRoute="recordings">
      <section className="space-y-6">
        <PatientPageHeader
          title={psychologistRecordingsContent.header.title}
          description={psychologistRecordingsContent.header.description}
        />
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recording List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
            {!loading && error ? <DashboardStateBlock variant="error" message={error} /> : null}
            {!loading && !error && rows.length === 0 ? <DashboardStateBlock variant="empty" message="No recordings yet." /> : null}
            {!loading && !error
              ? rows.map((recording) => (
              <div
                key={recording.videoId}
                className="bg-muted/40 border-border/60 grid grid-cols-2 gap-2 rounded-lg border p-3 md:grid-cols-5"
              >
                <p className="text-sm font-medium">{recording.videoId}</p>
                <p className="text-sm">{recording.patientId}</p>
                <p className="text-sm">{new Date(recording.sessionDate).toLocaleString()}</p>
                <p className="text-sm">{recording.transcriptReady ? "Ready" : "Processing"}</p>
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
              ))
              : null}
          </CardContent>
        </Card>
      </section>
    </PsychologistShell>
  )
}
