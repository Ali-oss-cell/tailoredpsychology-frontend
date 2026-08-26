"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PortalListRow } from "@/components/shared/portal-list-row"
import { PsychologistPortalPage } from "@/components/psychologist/psychologist-portal-page"
import { psychologistRecordingsContent } from "@/content/psychologist-recordings"
import { formatTimeAu } from "@/src/lib/format-au"
import {
  formatClinicianRecordingLabel,
  formatRecordingPolicyStatus,
} from "@/src/patient/recordings/recording-labels"
import { Button } from "@/components/ui/button"
import { usePsychologistId } from "@/src/psychologist/queries/use-current-user"
import { resolvePatientDisplayNames } from "@/src/psychologist/resolve-patient-display-names"
import { getPsychologistSessionVideos, requestSessionVideoAccess, type SessionVideoItem } from "@/src/psychologist/videos/api"

export default function PsychologistRecordingsPage() {
  const psychologistId = usePsychologistId()
  const [rows, setRows] = useState<SessionVideoItem[]>([])
  const [patientNamesById, setPatientNamesById] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusByVideo, setStatusByVideo] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!psychologistId) return
    let cancelled = false
    void (async () => {
      setLoading(true)
      try {
        const videos = await getPsychologistSessionVideos(psychologistId)
        const names = await resolvePatientDisplayNames(
          psychologistId,
          videos.map((video) => video.patientId),
        )
        if (!cancelled) {
          setRows(videos)
          setPatientNamesById(Object.fromEntries(names))
          setError(null)
        }
      } catch {
        if (!cancelled) setError("Could not load recordings.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [psychologistId])

  return (
    <PsychologistPortalPage
      title={psychologistRecordingsContent.header.title}
      description={psychologistRecordingsContent.header.description}
      eyebrow="Session media"
      tutorialId="psychologist.page.recordings"
    >
      <Card className="dashboard-card interactive-lift">
        <CardHeader className="pb-3">
          <p className="card-eyebrow">Library</p>
          <CardTitle className="text-lg">Recording list</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? <DashboardStateBlock variant="loading" message="Loading recordings..." /> : null}
          {!loading && error ? <DashboardStateBlock variant="error" message={error} /> : null}
          {!loading && !error && rows.length === 0 ? (
            <DashboardStateBlock variant="empty" message="No recordings yet." />
          ) : null}
          {!loading && !error
            ? rows.map((recording) => (
                <PortalListRow key={recording.videoId} className="md:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
                  <div>
                    <p className="text-sm font-medium">
                      {formatClinicianRecordingLabel(recording, patientNamesById)}
                    </p>
                    <p className="text-muted-foreground text-xs">Session reference · {recording.sessionId}</p>
                  </div>
                  <p className="text-sm">{recording.transcriptReady ? "Ready" : "Processing"}</p>
                  <p className="text-sm">{formatRecordingPolicyStatus(recording.policyStatus)}</p>
                  <div className="space-y-1">
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
                            [recording.videoId]: grant.expiresAt
                              ? `Access granted until ${formatTimeAu(grant.expiresAt)}`
                              : "Access granted",
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
                </PortalListRow>
              ))
            : null}
        </CardContent>
      </Card>
    </PsychologistPortalPage>
  )
}
