import type { SessionDetail } from "@/src/sessions/api"

type VideoSessionHeaderProps = {
  appointmentId: string
  sessionDetail: SessionDetail | null
  connectionStatus: "connecting" | "connected" | "error" | "idle"
  participantLabel?: string
  elapsedLabel?: string
  onLeave?: () => void
  leaveLabel?: string
}

function connectionBadgeClass(status: VideoSessionHeaderProps["connectionStatus"]): string {
  switch (status) {
    case "connected":
      return "border-success/30 bg-success/10 text-success"
    case "connecting":
      return "border-warning/30 bg-warning/10 text-warning"
    case "error":
      return "border-destructive/30 bg-destructive/10 text-destructive"
    default:
      return "border-border/60 bg-muted/40 text-muted-foreground"
  }
}

function connectionLabel(status: VideoSessionHeaderProps["connectionStatus"]): string {
  switch (status) {
    case "connected":
      return "Connected"
    case "connecting":
      return "Connecting"
    case "error":
      return "Connection issue"
    default:
      return "Preparing"
  }
}

export function VideoSessionHeader({
  appointmentId,
  sessionDetail,
  connectionStatus,
  participantLabel,
  elapsedLabel,
  onLeave,
  leaveLabel = "Leave session",
}: VideoSessionHeaderProps) {
  const title = sessionDetail?.sessionTypeLabel ?? "Video session"
  const participants = participantLabel ?? `Appointment ${appointmentId}`

  return (
    <header className="border-border/60 bg-card/95 supports-[backdrop-filter]:bg-card/80 sticky top-0 z-20 border-b backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="min-w-0 space-y-0.5">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Telehealth session</p>
          <h1 className="font-heading truncate text-lg font-semibold tracking-tight md:text-xl">{title}</h1>
          <p className="text-muted-foreground truncate text-sm">{participants}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {elapsedLabel ? (
            <span className="text-muted-foreground hidden text-xs tabular-nums sm:inline" aria-live="polite">
              {elapsedLabel}
            </span>
          ) : null}
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${connectionBadgeClass(connectionStatus)}`}
            role="status"
            aria-label={`Connection status: ${connectionLabel(connectionStatus)}`}
          >
            {connectionLabel(connectionStatus)}
          </span>
          {onLeave ? (
            <button
              type="button"
              onClick={onLeave}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-ring inline-flex h-11 items-center rounded-xl px-4 text-sm font-semibold focus-visible:ring-2 focus-visible:outline-none"
              aria-label={`${leaveLabel} for appointment ${appointmentId}`}
            >
              {leaveLabel}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
