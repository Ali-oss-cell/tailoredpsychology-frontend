"use client"

import { ChatConversationView } from "@/components/session/chat/chat-conversation-view"
import type { ChatMessageResponse } from "@/src/session/chat-api"

type PreSessionChatPanelProps = {
  appointmentId: string
  compact?: boolean
  viewerRole?: ChatMessageResponse["authorRole"]
  viewerUserId?: string
  peerDisplayName?: string
  peerUserId?: string
  onAccessDenied?: (appointmentId: string) => void
}

export function PreSessionChatPanel({
  appointmentId,
  compact = false,
  viewerRole = "patient",
  viewerUserId,
  peerDisplayName = "Session chat",
  peerUserId,
  onAccessDenied,
}: PreSessionChatPanelProps) {
  return (
    <section className={`overflow-hidden rounded-xl border border-border bg-card shadow-sm ${compact ? "text-sm" : ""}`}>
      <ChatConversationView
        appointmentId={appointmentId}
        viewerRole={viewerRole}
        viewerUserId={viewerUserId}
        peerDisplayName={peerDisplayName}
        peerUserId={peerUserId}
        onAccessDenied={onAccessDenied}
        showHeader={!compact}
        compact={compact}
        className={compact ? "max-h-[22rem]" : ""}
      />
    </section>
  )
}
