"use client"

import * as React from "react"

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
}

function warningCopyFromReasons(reasons: string[]): string {
  if (reasons.includes("session_window_locked")) return "Your session window is not open yet."
  if (reasons.includes("session_window_closed")) return "Your session window has already closed."
  if (reasons.includes("readiness_attention")) return "Some readiness checks still need attention."
  if (reasons.includes("readiness_unknown")) return "Readiness has not been checked recently."
  return "Please review readiness before joining."
}

export function JoinSessionGate({ appointmentId, readiness, role, onRunChecks }: JoinSessionGateProps) {
  const [decision, setDecision] = React.useState<JoinAttemptDecisionResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isJoined, setIsJoined] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [overrideReason, setOverrideReason] = React.useState("")
  const [sessionToken, setSessionToken] = React.useState<JoinSessionTokenResponse | null>(null)

  const isWarning = (readiness?.overallStatus ?? "attention") !== "ready"
  const joinLabel =
    role === "psychologist" && isWarning ? "Override warning and join" : role === "patient" ? "Join session" : "Proceed to session"

  const leaveCall = React.useCallback(() => {
    setIsJoined(false)
    setSessionToken(null)
  }, [])

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
      setShowConfirm(false)
    } catch {
      setError("We couldn't start the video session. Check that telehealth is configured and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isJoined && sessionToken) {
    return (
      <TwilioVideoRoom
        accessToken={sessionToken.accessToken}
        roomName={sessionToken.roomName}
        participantIdentity={sessionToken.participantIdentity}
        onLeave={leaveCall}
      />
    )
  }

  return (
    <section className="space-y-3 rounded-xl border border-border bg-card p-4" aria-label="Session join">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Join session</h2>
        <Button
          type="button"
          onClick={() => void evaluateJoin()}
          disabled={isSubmitting}
          size="lg"
          className="min-h-11 w-full shrink-0 px-6 sm:w-auto"
        >
          {isSubmitting ? "Connecting…" : joinLabel}
        </Button>
      </div>

      {decision?.reasons.length ? (
        <p className="border-warning bg-warning/10 text-warning-foreground rounded-md border px-3 py-2 text-xs">
          {warningCopyFromReasons(decision.reasons)}
        </p>
      ) : null}

      {showConfirm ? (
        <div className="rounded-md border border-border/70 bg-muted/40 px-3 py-3 text-sm">
          <p className="font-medium">You can still continue.</p>
          <p className="mt-1 text-muted-foreground">Proceed anyway or run checks again first.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => void evaluateJoin("warning_acknowledged")}>
              Proceed anyway
            </Button>
            <Button size="sm" variant="outline" onClick={onRunChecks}>
              Run checks now
            </Button>
          </div>
        </div>
      ) : null}

      {role === "psychologist" && decision?.reasons.length ? (
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="overrideReason">
            Override reason (optional)
          </label>
          <textarea
            id="overrideReason"
            value={overrideReason}
            onChange={(event) => setOverrideReason(event.target.value)}
            placeholder="Explain why proceeding despite warning..."
            className="min-h-20 w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
          />
        </div>
      ) : null}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </section>
  )
}
