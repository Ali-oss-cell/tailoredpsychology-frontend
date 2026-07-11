"use client"

import { ChatCircleText } from "@phosphor-icons/react/dist/ssr"
import * as React from "react"

import { SessionNotesPanel } from "@/components/session/session-notes-panel"
import { TwilioVideoRoom } from "@/components/session/twilio-video-room"
import { Button } from "@/components/ui/button"
import {
  type JoinAttemptDecisionResponse,
  type JoinSessionTokenResponse,
  postJoinAttempt,
  postJoinSession,
  type TelehealthReadinessResponse,
} from "@/src/patient/booking/api"

type JoinSessionGateProps = {
  appointmentId: string
  readiness: TelehealthReadinessResponse | null
  role: "patient" | "psychologist" | "practice_manager" | "admin" | null
  onRunChecks: () => void
  onJoinedChange?: (joined: boolean) => void
  onConnectionStatusChange?: (status: "connecting" | "connected" | "error" | "idle") => void
}

function warningCopyFromReasons(reasons: string[]): string {
  if (reasons.includes("session_window_locked")) return "Your session window is not open yet."
  if (reasons.includes("session_window_closed")) return "Your session window has already closed."
  if (reasons.includes("readiness_attention")) return "Some readiness checks still need attention."
  if (reasons.includes("readiness_unknown")) return "Readiness has not been checked recently."
  return "Please review readiness before joining."
}

export function JoinSessionGate({
  appointmentId,
  readiness,
  role,
  onRunChecks,
  onJoinedChange,
  onConnectionStatusChange,
}: JoinSessionGateProps) {
  const [decision, setDecision] = React.useState<JoinAttemptDecisionResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isJoined, setIsJoined] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [overrideReason, setOverrideReason] = React.useState("")
  const [sessionToken, setSessionToken] = React.useState<JoinSessionTokenResponse | null>(null)
  const [showNotes, setShowNotes] = React.useState(false)

  const isWarning = (readiness?.overallStatus ?? "attention") !== "ready"
  const joinLabel =
    role === "psychologist" && isWarning ? "Override warning and join" : role === "patient" ? "Join session" : "Proceed to session"

  const leaveCall = React.useCallback(() => {
    setIsJoined(false)
    setSessionToken(null)
    onJoinedChange?.(false)
    onConnectionStatusChange?.("idle")
  }, [onJoinedChange, onConnectionStatusChange])

  const evaluateJoin = async (acknowledgementNote?: string) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const next = await postJoinAttempt(appointmentId, {
        channel: "video",
        acknowledgementNote,
        overrideReason: overrideReason.trim() || undefined,
      })
      setDecision(next)
      if (!next.allowed) return
      if (next.reasons.length > 0 && !acknowledgementNote) {
        setShowConfirm(true)
        return
      }
      const token = await postJoinSession(appointmentId, {
        channel: "video",
        overrideReason: overrideReason.trim() || undefined,
      })
      setSessionToken(token)
      setIsJoined(true)
      onJoinedChange?.(true)
      setShowConfirm(false)
    } catch {
      setError("We couldn't start the video session. Check that telehealth is configured and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isJoined && sessionToken) {
    const viewerRole = role === "psychologist" ? "psychologist" : "patient"
    return (
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-3">
          <TwilioVideoRoom
            accessToken={sessionToken.accessToken}
            roomName={sessionToken.roomName}
            participantIdentity={sessionToken.participantIdentity}
            onLeave={leaveCall}
            onConnectionStatusChange={onConnectionStatusChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="press gap-1.5 lg:hidden"
            aria-expanded={showNotes}
            onClick={() => setShowNotes((open) => !open)}
          >
            <ChatCircleText size={16} aria-hidden />
            {showNotes ? "Hide session notes" : "Show session notes"}
          </Button>
          {showNotes ? (
            <div className="h-[22rem] lg:hidden">
              <SessionNotesPanel appointmentId={appointmentId} viewerRole={viewerRole} />
            </div>
          ) : null}
        </div>
        <div className="hidden lg:block">
          <SessionNotesPanel appointmentId={appointmentId} viewerRole={viewerRole} />
        </div>
      </div>
    )
  }

  return (
    <section
      className="dashboard-card rounded-dashboard-card space-y-4 p-5 md:p-6"
      aria-label="Session join"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="font-heading text-lg font-semibold tracking-tight">Join session</h2>
          <p className="text-muted-foreground text-sm">
            Complete readiness checks above, then join when you are ready.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => void evaluateJoin()}
          disabled={isSubmitting}
          className="h-12 min-w-[11rem] shrink-0 rounded-xl px-6 text-base font-semibold"
        >
          {isSubmitting ? "Connecting…" : joinLabel}
        </Button>
      </div>

      {decision?.reasons.length ? (
        <div
          className="border-warning bg-warning/10 text-warning-foreground rounded-xl border px-4 py-3 text-sm"
          role="alert"
        >
          {warningCopyFromReasons(decision.reasons)}
        </div>
      ) : null}

      {showConfirm ? (
        <div className="dashboard-card rounded-dashboard-card border-border/60 bg-muted/20 space-y-3 p-4 text-sm">
          <p className="font-medium">You can still continue.</p>
          <p className="text-muted-foreground">Proceed anyway or run checks again first.</p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="default"
              className="h-11 rounded-xl"
              onClick={() => void evaluateJoin("warning_acknowledged")}
            >
              Proceed anyway
            </Button>
            <Button size="default" variant="outline" className="h-11 rounded-xl" onClick={onRunChecks}>
              Run checks now
            </Button>
          </div>
        </div>
      ) : null}

      {role === "psychologist" && decision?.reasons.length ? (
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="overrideReason">
            Override reason (optional)
          </label>
          <textarea
            id="overrideReason"
            value={overrideReason}
            onChange={(event) => setOverrideReason(event.target.value)}
            placeholder="Explain why proceeding despite warning..."
            className="border-border/70 focus-visible:ring-ring min-h-24 w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm shadow-sm focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>
      ) : null}

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  )
}
