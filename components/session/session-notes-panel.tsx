"use client"

import { NotePencil } from "@phosphor-icons/react/dist/ssr"

import { ChatConversationView } from "@/components/session/chat/chat-conversation-view"
import type { ChatMessageResponse } from "@/src/session/chat-api"

type SessionNotesPanelProps = {
  appointmentId: string
  viewerRole?: ChatMessageResponse["authorRole"]
  viewerUserId?: string
  peerUserId?: string
}

/**
 * Lightweight shared-notes panel shown alongside an active video call (Stitch spec).
 * Reuses the same secure chat channel as the pre-session chat panel — no new backend.
 */
export function SessionNotesPanel({ appointmentId, viewerRole = "patient", viewerUserId, peerUserId }: SessionNotesPanelProps) {
  return (
    <aside
      className="dashboard-card flex h-full min-h-0 flex-col overflow-hidden rounded-2xl shadow-e1"
      aria-label="Session notes"
    >
      <header className="border-border/70 flex shrink-0 items-center gap-2 border-b px-4 py-3">
        <NotePencil className="text-primary-strong" size={18} weight="duotone" aria-hidden />
        <h2 className="font-heading text-sm font-semibold">Session Notes</h2>
      </header>
      <ChatConversationView
        appointmentId={appointmentId}
        viewerRole={viewerRole}
        viewerUserId={viewerUserId}
        peerUserId={peerUserId}
        showHeader={false}
        compact
        className="min-h-0 flex-1"
      />
    </aside>
  )
}
