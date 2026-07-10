"use client"

import Link from "next/link"
import { CalendarBlank, ChatCircle, FileText, Heartbeat, Receipt } from "@phosphor-icons/react/dist/ssr"

import {
  DashboardSummaryCard,
  DashboardSummaryCardsRow,
} from "@/components/shared/dashboard-summary-card"

type DashboardSummaryCardsProps = {
  careProgress: { done: number; total: number; pct: number } | null
  unreadMessages: number | null
  documentCount: number | null
  billingStatus: string | null
  loading?: boolean
}

function openPatientChat(): void {
  window.dispatchEvent(new CustomEvent("clink:open-chat"))
}

export function DashboardSummaryCards({
  careProgress,
  unreadMessages,
  documentCount,
  billingStatus,
  loading = false,
}: DashboardSummaryCardsProps) {
  const careValue =
    careProgress && careProgress.total > 0
      ? `${careProgress.done} of ${careProgress.total} steps`
      : "Getting started"

  const messagesValue =
    unreadMessages === null ? "—" : unreadMessages === 0 ? "All caught up" : `${unreadMessages} unread`

  const documentsValue =
    documentCount === null ? "Available" : documentCount === 0 ? "None yet" : `${documentCount} available`

  const billingValue = billingStatus ?? "View billing"

  return (
    <DashboardSummaryCardsRow data-tutorial="patient.dashboard.summary-cards">
      <DashboardSummaryCard
        title="Care progress"
        value={careValue}
        href="/patient/dashboard#care-journey"
        linkLabel="View journey"
        icon={<Heartbeat size={20} weight="duotone" aria-hidden />}
        progressPct={careProgress?.pct}
        loading={loading}
      />
      <DashboardSummaryCard
        title="Messages"
        value={messagesValue}
        linkLabel="View messages"
        icon={<ChatCircle size={20} weight="duotone" aria-hidden />}
        onClick={openPatientChat}
        loading={loading}
      />
      <DashboardSummaryCard
        title="Documents"
        value={documentsValue}
        href="/patient/recordings"
        linkLabel="View documents"
        icon={<FileText size={20} weight="duotone" aria-hidden />}
        loading={loading}
      />
      <DashboardSummaryCard
        title="Billing"
        value={billingValue}
        href="/patient/invoices"
        linkLabel="View billing"
        icon={<Receipt size={20} weight="duotone" aria-hidden />}
        loading={loading}
      />
    </DashboardSummaryCardsRow>
  )
}
