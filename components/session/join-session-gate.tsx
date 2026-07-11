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
import {
  devicePrepWarnings,
  hardBlockMessage,
  joinButtonLabel,
  shouldAutoAcknowledgeWarnings,
} from "@/src/session/join-session-gate.helpers"

type JoinSessionGateProps = {
  appointmentId: string
  readiness: TelehealthReadinessResponse | null
  role: "patient" | "psychologist" | "practice_manager" | "admin" | null
  onRunChecks: () => void
  onJoinedChange?: (joined: boolean) => void
  onConnectionStatusChange?: (status: "connecting" | "connected" | "error" | "idle") => void
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

  const prepWarnings = devicePrepWarnings(readiness)
  const joinLabel = joinButtonLabel(role, readiness, isSubmitting)

  const leaveCall = React.useCallback(() => {
    setIsJoined(false)
    setSessionToken(null)
    onJoinedChange?.(false)
    onConnectionStatusChange?.("idle")
  }, [onJoinedChange, onConnectionStatusChange])

  const evaluateJoin = async (acknowledgementNote?: string) => {
    setIsSubmitting(true)
    setError(null)
    setShowConfirm(false)
    try {
      const next = await postJoinAttempt(appointmentId, {
        channel: "video",
        acknowledgementNote,
        overrideReason: overrideReason.trim() || undefined,
      })
      setDecision(next)

      if (!next.allowed) {
        setError(hardBlockMessage(next))
        return
      }

      const ack =
        acknowledgementNote ??
        (shouldAutoAcknowledgeWarnings(role, next.reasons) ? "warning_acknowledged" : undefined)

      if (next.reasons.length > 0 && !ack) {
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
    } catch {
      setError(
        "We couldn't start the video session. Check your connection and try again, or contact support if this keeps happening.",
      )
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
          <h2 className="font-heading text-lg font-semibold tracking-tight">Ready to join</h2>
          <p className="text-muted-foreground text-sm">
            You can join now. Testing your camera and mic above is optional prep — not required to enter.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => void evaluateJoin()}
            disabled={isSubmitting}
            className="h-12 min-w-[11rem] shrink-0 rounded-xl px-6 text-base font-semibold"
          >
            {joinLabel}
          </Button>
          <Button type="button" variant="outline" className="h-12 rounded-xl" onClick={onRunChecks} disabled={isSubmitting}>
            Test camera &amp; mic
          </Button>
        </div>
      </div>

      {prepWarnings.map((warning) => (
        <div
          key={warning}
          className="border-warning bg-warning/10 text-warning-foreground rounded-xl border px-4 py-3 text-sm"
          role="status"
        >
          {warning}
        </div>
      ))}

      {decision && !decision.allowed ? (
        <div
          className="border-destructive/40 bg-destructive/10 text-destructive rounded-xl border px-4 py-3 text-sm"
          role="alert"
        >
          {hardBlockMessage(decision)}
        </div>
      ) : null}

      {showConfirm ? (
        <div className="dashboard-card rounded-dashboard-card border-border/60 bg-muted/20 space-y-3 p-4 text-sm">
          <p className="font-medium">Some checks need attention — you can still join.</p>
          <p className="text-muted-foreground">Proceed now or run checks again first.</p>
          <div className="flex flex-wrap gap-2">
            <Button size="lg" onClick={() => void evaluateJoin("warning_acknowledged")}>
              Join anyway
            </Button>
            <Button size="lg" variant="outline" onClick={onRunChecks}>
              Run checks again
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
        <div className="space-y-2" role="alert">
          <p className="text-destructive text-sm">{error}</p>
          <Button type="button" variant="outline" size="sm" onClick={() => void evaluateJoin()} disabled={isSubmitting}>
            Try again
          </Button>
        </div>
      ) : null}
    </section>
  )
}
