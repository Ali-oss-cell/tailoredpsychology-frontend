"use client"

import * as React from "react"

import { JoinSessionGate } from "@/components/session/join-session-gate"
import { VideoSessionSessionBanner } from "@/components/session/video-session-session-banner"
import { PreSessionChatPanel } from "@/components/session/pre-session-chat-panel"
import { PreSessionReadinessCard } from "@/components/session/pre-session-readiness-card"
import { type TelehealthReadinessResponse } from "@/src/patient/booking/api"

type VideoSessionWorkspaceProps = {
  appointmentId: string
  role: "patient" | "psychologist" | "practice_manager" | "admin" | null
}

export function VideoSessionWorkspace({ appointmentId, role }: VideoSessionWorkspaceProps) {
  const [readiness, setReadiness] = React.useState<TelehealthReadinessResponse | null>(null)
  const [rerunSignal, setRerunSignal] = React.useState(0)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Video session workspace</h1>
      <p className="text-sm text-muted-foreground">
        Twilio video stream is separate. This panel handles pre-session realtime chat only.
      </p>
      <VideoSessionSessionBanner appointmentId={appointmentId} />
      <JoinSessionGate
        appointmentId={appointmentId}
        readiness={readiness}
        role={role}
        onRunChecks={() => setRerunSignal((value) => value + 1)}
      />
      <PreSessionReadinessCard
        appointmentId={appointmentId}
        onReadinessChange={setReadiness}
        rerunSignal={rerunSignal}
      />
      <PreSessionChatPanel appointmentId={appointmentId} />
    </div>
  )
}
