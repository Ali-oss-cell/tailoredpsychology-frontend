"use client"

import Link from "next/link"
import type * as React from "react"
import { CalendarBlank, ChatCircle, NotePencil, UsersThree } from "@phosphor-icons/react/dist/ssr"

import {
  DashboardSummaryCard,
  DashboardSummaryCardsRow,
} from "@/components/shared/dashboard-summary-card"
import { useNotificationUnreadCount } from "@/src/patient/queries/use-notification-unread-count"

type PsychologistDashboardSummaryCardsProps = {
  todaySessions: number | null
  caseloadCount: number | null
  pendingNotes: number | null
  loading?: boolean
}

function openPsychologistChat(): void {
  window.dispatchEvent(new CustomEvent("clink:open-chat"))
}

export function PsychologistDashboardSummaryCards({
  todaySessions,
  caseloadCount,
  pendingNotes,
  loading = false,
}: PsychologistDashboardSummaryCardsProps) {
  const notificationsQuery = useNotificationUnreadCount()
  const unreadMessages = notificationsQuery.isSuccess ? notificationsQuery.data : null
  const cardsLoading = loading || notificationsQuery.isLoading

  const sessionsValue =
    todaySessions === null ? "—" : todaySessions === 0 ? "None today" : `${todaySessions} today`

  const caseloadValue =
    caseloadCount === null ? "—" : caseloadCount === 0 ? "No patients" : `${caseloadCount} active`

  const messagesValue =
    unreadMessages === null ? "—" : unreadMessages === 0 ? "All caught up" : `${unreadMessages} unread`

  const notesValue =
    pendingNotes === null ? "—" : pendingNotes === 0 ? "All signed" : `${pendingNotes} pending`

  return (
    <DashboardSummaryCardsRow aria-label="Clinical summary" data-tutorial="psychologist.dashboard.summary-cards">
      <DashboardSummaryCard
        title="Today's sessions"
        value={sessionsValue}
        href="/psychologist/schedule"
        linkLabel="View schedule"
        icon={<CalendarBlank size={20} weight="duotone" aria-hidden />}
        loading={cardsLoading}
      />
      <DashboardSummaryCard
        title="Caseload"
        value={caseloadValue}
        href="/psychologist/patients"
        linkLabel="View patients"
        icon={<UsersThree size={20} weight="duotone" aria-hidden />}
        loading={cardsLoading}
      />
      <DashboardSummaryCard
        title="Messages"
        value={messagesValue}
        linkLabel="Open inbox"
        icon={<ChatCircle size={20} weight="duotone" aria-hidden />}
        onClick={openPsychologistChat}
        loading={cardsLoading}
      />
      <DashboardSummaryCard
        title="Pending notes"
        value={notesValue}
        href="/psychologist/notes"
        linkLabel="Open notes"
        icon={<NotePencil size={20} weight="duotone" aria-hidden />}
        loading={cardsLoading}
      />
    </DashboardSummaryCardsRow>
  )
}
