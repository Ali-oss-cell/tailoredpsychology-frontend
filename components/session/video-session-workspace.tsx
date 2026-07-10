"use client"

import * as React from "react"

import { JoinSessionGate } from "@/components/session/join-session-gate"
import { PreSessionChatPanel } from "@/components/session/pre-session-chat-panel"
import { PreSessionReadinessCard } from "@/components/session/pre-session-readiness-card"
import { VideoSessionHeader } from "@/components/session/video-session-header"
import { VideoSessionSessionBanner } from "@/components/session/video-session-session-banner"
import { type TelehealthReadinessResponse } from "@/src/patient/booking/api"
import { getSessionDetail, type SessionDetail } from "@/src/sessions/api"

type VideoSessionWorkspaceProps = {
  appointmentId: string
  role: "patient" | "psychologist" | "practice_manager" | "admin" | null
}

export function VideoSessionWorkspace({ appointmentId, role }: VideoSessionWorkspaceProps) {
  const [readiness, setReadiness] = React.useState<TelehealthReadinessResponse | null>(null)
  const [rerunSignal, setRerunSignal] = React.useState(0)
  const [sessionDetail, setSessionDetail] = React.useState<SessionDetail | null>(null)
  const [isInCall, setIsInCall] = React.useState(false)
  const [connectionStatus, setConnectionStatus] = React.useState<"connecting" | "connected" | "error" | "idle">("idle")

  React.useEffect(() => {
    let cancelled = false
    void getSessionDetail(appointmentId).then((detail) => {
      if (!cancelled) setSessionDetail(detail)
    })
    return () => {
      cancelled = true
    }
  }, [appointmentId])

  const viewerRole =
    role === "psychologist"
      ? "psychologist"
      : role === "practice_manager"
        ? "practice_manager"
        : role === "admin"
          ? "admin"
          : "patient"

  const scheduledLabel = sessionDetail
    ? new Date(sessionDetail.scheduledStartAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : undefined

  return (
    <>
      <VideoSessionHeader
        appointmentId={appointmentId}
        sessionDetail={sessionDetail}
        connectionStatus={isInCall ? connectionStatus : "idle"}
        participantLabel={scheduledLabel ? `Scheduled ${scheduledLabel}` : undefined}
      />

      <div className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 md:px-6">
        {!isInCall ? (
          <>
            <VideoSessionSessionBanner appointmentId={appointmentId} />
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="space-y-6">
                <PreSessionReadinessCard
                  appointmentId={appointmentId}
                  onReadinessChange={setReadiness}
                  rerunSignal={rerunSignal}
                />
              </div>
              <PreSessionChatPanel appointmentId={appointmentId} viewerRole={viewerRole} />
            </div>
          </>
        ) : null}

        <JoinSessionGate
          appointmentId={appointmentId}
          readiness={readiness}
          role={role}
          onRunChecks={() => setRerunSignal((value) => value + 1)}
          onJoinedChange={setIsInCall}
          onConnectionStatusChange={setConnectionStatus}
        />
      </div>
    </>
  )
}
