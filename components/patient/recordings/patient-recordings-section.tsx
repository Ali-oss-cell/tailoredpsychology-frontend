"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { VideoCamera } from "@phosphor-icons/react"

import { CardSectionHeading } from "@/components/shared/card-section-heading"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { EmptyState } from "@/components/shared/empty-state"
import { PortalListRow } from "@/components/shared/portal-list-row"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/src/auth/current-user"
import { getMyCareTeam } from "@/src/patient/care-team/api"
import {
  formatRecordingPolicyStatus,
  formatRecordingSessionLabel,
  recordingPolicyBadgeClassName,
} from "@/src/patient/recordings/recording-labels"
import { getPatientSessionVideos, requestSessionVideoAccess, type SessionVideoItem } from "@/src/psychologist/videos/api"

type AccessFeedback = {
  message: string
  tone: "success" | "error" | "neutral"
}

export function PatientRecordingsSection() {
  const [rows, setRows] = useState<SessionVideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestingVideoId, setRequestingVideoId] = useState<string | null>(null)
  const [statusByVideo, setStatusByVideo] = useState<Record<string, AccessFeedback>>({})
  const [clinicianNamesById, setClinicianNamesById] = useState<Record<string, string>>({})

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
      const [videos, careTeam] = await Promise.all([
        getPatientSessionVideos(user.id),
        getMyCareTeam().catch(() => []),
      ])
      setRows(videos)
      setClinicianNamesById(
        Object.fromEntries(careTeam.map((clinician) => [clinician.clinicianId, clinician.displayName])),
      )
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

  const hasData = !loading && !error && rows.length > 0

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()),
    [rows],
  )

  async function handleRequestAccess(recording: SessionVideoItem): Promise<void> {
    if (requestingVideoId) return
    setRequestingVideoId(recording.videoId)
    try {
      const grant = await requestSessionVideoAccess(recording.videoId)
      if (!grant.canDownload || !grant.downloadUrl) {
        setStatusByVideo((current) => ({
          ...current,
          [recording.videoId]: {
            message: grant.denialReason ?? "Download denied by policy.",
            tone: "error",
          },
        }))
        return
      }
      setStatusByVideo((current) => ({
        ...current,
        [recording.videoId]: {
          message: `Access granted until ${new Date(grant.expiresAt ?? "").toLocaleTimeString()}`,
          tone: "success",
        },
      }))
      window.open(grant.downloadUrl, "_blank", "noopener,noreferrer")
    } catch {
      setStatusByVideo((current) => ({
        ...current,
        [recording.videoId]: {
          message: "Could not request access. Try again.",
          tone: "error",
        },
      }))
    } finally {
      setRequestingVideoId(null)
    }
  }

  return (
    <Card className="interactive-lift">
      <CardHeader className="pb-3">
        <CardSectionHeading>Library</CardSectionHeading>
        <CardTitle className="text-lg">My session videos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? <DashboardStateBlock variant="loading" message="Loading recordings..." /> : null}
        {!loading && error ? (
          <DashboardStateBlock variant="error" message={error} onRetry={() => void loadRecordings()} />
        ) : null}
        {!loading && !error && rows.length === 0 ? (
          <EmptyState
            icon={<VideoCamera size={28} weight="duotone" aria-hidden />}
            title="No session videos yet"
            description="When your clinician records a session and policy allows, it will appear here."
          />
        ) : null}
        {hasData ? (
          <div className="overflow-x-auto">
            <div className="min-w-[36rem] space-y-2">
              {sortedRows.map((recording) => {
                const feedback = statusByVideo[recording.videoId]
                const isRequesting = requestingVideoId === recording.videoId
                return (
                  <PortalListRow key={recording.videoId} className="md:grid-cols-[minmax(0,1fr)_auto_auto]">
                    <div>
                      <p className="text-sm font-medium">
                        {formatRecordingSessionLabel(recording, clinicianNamesById)}
                      </p>
                      <p className="text-muted-foreground text-xs">Reference {recording.sessionId}</p>
                    </div>
                    <p className="self-center text-sm">
                      {recording.transcriptReady ? "Transcript ready" : "Transcript pending"}
                    </p>
                    <div className="space-y-1.5 self-center">
                      <Badge
                        variant="outline"
                        className={cn("font-normal capitalize", recordingPolicyBadgeClassName(recording.policyStatus))}
                      >
                        {formatRecordingPolicyStatus(recording.policyStatus)}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!recording.canDownload || isRequesting}
                        aria-busy={isRequesting}
                        onClick={() => void handleRequestAccess(recording)}
                      >
                        {isRequesting ? "Requesting…" : "Request access"}
                      </Button>
                      {feedback ? (
                        <p
                          className={cn(
                            "text-xs",
                            feedback.tone === "success" && "text-success",
                            feedback.tone === "error" && "text-destructive",
                            feedback.tone === "neutral" && "text-muted-foreground",
                          )}
                          role={feedback.tone === "error" ? "alert" : undefined}
                        >
                          {feedback.message}
                        </p>
                      ) : null}
                    </div>
                  </PortalListRow>
                )
              })}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
