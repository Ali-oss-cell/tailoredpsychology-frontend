"use client"

import { ChatCircle, FileText, Heartbeat, Receipt } from "@phosphor-icons/react/dist/ssr"

import {
  DashboardSummaryPill,
  DashboardSummaryPillsRow,
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
      ? `${careProgress.done}/${careProgress.total} steps`
      : "Getting started"

  const messagesValue =
    unreadMessages === null ? "—" : unreadMessages === 0 ? "Caught up" : `${unreadMessages} unread`

  const documentsValue =
    documentCount === null ? "Available" : documentCount === 0 ? "None yet" : `${documentCount}`

  const billingValue = billingStatus ?? "Up to date"

  return (
    <DashboardSummaryPillsRow data-tutorial="patient.dashboard.summary-cards">
      <DashboardSummaryPill
        label="Care"
        value={careValue}
        href="/patient/dashboard#care-journey"
        icon={<Heartbeat size={16} weight="duotone" aria-hidden />}
        loading={loading}
      />
      <DashboardSummaryPill
        label="Messages"
        value={messagesValue}
        icon={<ChatCircle size={16} weight="duotone" aria-hidden />}
        onClick={openPatientChat}
        loading={loading}
      />
      <DashboardSummaryPill
        label="Documents"
        value={documentsValue}
        href="/patient/recordings"
        icon={<FileText size={16} weight="duotone" aria-hidden />}
        loading={loading}
      />
      <DashboardSummaryPill
        label="Billing"
        value={billingValue}
        href="/patient/invoices"
        icon={<Receipt size={16} weight="duotone" aria-hidden />}
        loading={loading}
      />
    </DashboardSummaryPillsRow>
  )
}
