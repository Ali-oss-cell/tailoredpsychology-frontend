"use client"

import Link from "next/link"
import type * as React from "react"
import { ArrowRight, ChatCircle, FileText, Heartbeat, Receipt } from "@phosphor-icons/react/dist/ssr"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type DashboardSummaryCardsProps = {
  careProgress: { done: number; total: number; pct: number } | null
  unreadMessages: number | null
  documentCount: number | null
  billingStatus: string | null
  loading?: boolean
}

type SummaryCardProps = {
  title: string
  value: string
  href: string
  linkLabel: string
  icon: React.ReactNode
  progressPct?: number
  onClick?: () => void
  loading?: boolean
}

function SummaryCard({
  title,
  value,
  href,
  linkLabel,
  icon,
  progressPct,
  onClick,
  loading = false,
}: SummaryCardProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          {loading ? (
            <Skeleton className="skeleton-shimmer h-7 w-24" />
          ) : (
            <p className="font-heading text-xl font-semibold tracking-tight">{value}</p>
          )}
        </div>
        <span className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          {icon}
        </span>
      </div>
      {progressPct !== undefined && !loading ? (
        <div
          className="bg-muted h-1.5 w-full overflow-hidden rounded-full"
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${title} progress`}
        >
          <div
            className="from-primary to-primary/70 h-full rounded-full bg-gradient-to-r transition-[width] duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      ) : null}
      {!loading ? (
        <span className="text-primary inline-flex items-center gap-1 text-sm font-medium">
          {linkLabel} <ArrowRight size={14} aria-hidden />
        </span>
      ) : (
        <Skeleton className="skeleton-shimmer h-4 w-28" />
      )}
    </>
  )

  const className = cn(
    "dashboard-card interactive-lift flex flex-col gap-4 rounded-2xl border border-border/50 bg-card p-6 shadow-e1",
    "focus-visible:ring-ring outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(className, "text-left")} aria-label={`${title}: ${value}`}>
        {body}
      </button>
    )
  }

  return (
    <Link href={href} className={className} aria-label={`${title}: ${value}`}>
      {body}
    </Link>
  )
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
    <section
      className="dashboard-section grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Quick summary"
      data-tutorial="patient.dashboard.summary-cards"
    >
      <SummaryCard
        title="Care progress"
        value={careValue}
        href="/patient/dashboard#care-journey"
        linkLabel="View journey"
        icon={<Heartbeat size={20} weight="duotone" aria-hidden />}
        progressPct={careProgress?.pct}
        loading={loading}
      />
      <SummaryCard
        title="Messages"
        value={messagesValue}
        href="/patient/dashboard"
        linkLabel="View messages"
        icon={<ChatCircle size={20} weight="duotone" aria-hidden />}
        onClick={openPatientChat}
        loading={loading}
      />
      <SummaryCard
        title="Documents"
        value={documentsValue}
        href="/patient/recordings"
        linkLabel="View documents"
        icon={<FileText size={20} weight="duotone" aria-hidden />}
        loading={loading}
      />
      <SummaryCard
        title="Billing"
        value={billingValue}
        href="/patient/invoices"
        linkLabel="View billing"
        icon={<Receipt size={20} weight="duotone" aria-hidden />}
        loading={loading}
      />
    </section>
  )
}
