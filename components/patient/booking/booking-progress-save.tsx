"use client"

import { ArrowsClockwise, CheckCircle, Cloud, WarningCircle } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

export type BookingDraftSyncState = "idle" | "syncing" | "saved" | "conflict" | "error"

type BookingDraftStatusProps = {
  syncState: BookingDraftSyncState
  localMessage: string
  className?: string
  onRefreshDraft?: () => void
}

function syncLabel(syncState: BookingDraftSyncState): string | null {
  switch (syncState) {
    case "syncing":
      return "Saving to cloud..."
    case "saved":
      return "Saved across devices"
    case "conflict":
      return "Another device saved a newer draft. Refresh to load it and keep going."
    case "error":
      return "We could not save to the cloud. Your progress is still on this device."
    default:
      return null
  }
}

export function BookingDraftStatus({ syncState, localMessage, className, onRefreshDraft }: BookingDraftStatusProps) {
  const isSyncing = syncState === "syncing"
  const isError = syncState === "conflict" || syncState === "error"
  const isSaved = syncState === "saved"
  const syncLine = syncLabel(syncState)

  return (
    <div
      className={cn(
        "text-muted-foreground inline-flex max-w-xs items-start gap-2 rounded-lg border border-border/40 bg-muted/20 px-2.5 py-1.5 text-[11px] leading-snug font-normal",
        className,
      )}
      aria-live="polite"
    >
      {isSyncing ? (
        <ArrowsClockwise size={13} className="mt-0.5 shrink-0 animate-spin text-primary" aria-hidden />
      ) : isError ? (
        <WarningCircle size={13} className="text-warning mt-0.5 shrink-0" aria-hidden />
      ) : isSaved ? (
        <CheckCircle size={13} className="text-primary mt-0.5 shrink-0" aria-hidden />
      ) : (
        <Cloud size={13} className="mt-0.5 shrink-0 opacity-70" aria-hidden />
      )}
      <span>
        {syncLine ? <span className="text-foreground/75 block font-medium">{syncLine}</span> : null}
        <span className="text-muted-foreground/90">{localMessage}</span>
        {isError && onRefreshDraft ? (
          <button
            type="button"
            onClick={onRefreshDraft}
            className="text-primary mt-1 block font-medium underline-offset-2 hover:underline"
          >
            Refresh draft
          </button>
        ) : null}
      </span>
    </div>
  )
}

/** @deprecated Use {@link BookingDraftStatus} */
export function BookingProgressSave({ message }: { message: string }) {
  return <BookingDraftStatus syncState="idle" localMessage={message} />
}
