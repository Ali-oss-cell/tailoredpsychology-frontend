"use client"

import Link from "next/link"
import type * as React from "react"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export type DashboardSummaryCardProps = {
  title: string
  value: string
  href?: string
  linkLabel: string
  icon: React.ReactNode
  progressPct?: number
  onClick?: () => void
  loading?: boolean
  className?: string
}

export function DashboardSummaryCard({
  title,
  value,
  href = "#",
  linkLabel,
  icon,
  progressPct,
  onClick,
  loading = false,
  className,
}: DashboardSummaryCardProps) {
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

  const classNames = cn(
    "dashboard-card flex flex-col gap-4 rounded-dashboard-card border border-border/50 bg-card p-6 shadow-e1",
    "focus-visible:ring-ring outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    className,
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(classNames, "text-left")} aria-label={`${title}: ${value}`}>
        {body}
      </button>
    )
  }

  return (
    <Link href={href} className={classNames} aria-label={`${title}: ${value}`}>
      {body}
    </Link>
  )
}

type DashboardSummaryCardsRowProps = {
  children: React.ReactNode
  className?: string
  "aria-label"?: string
  "data-tutorial"?: string
}

export function DashboardSummaryCardsRow({
  children,
  className,
  "aria-label": ariaLabel = "Quick summary",
  "data-tutorial": dataTutorial,
}: DashboardSummaryCardsRowProps) {
  return (
    <section
      className={cn("dashboard-section grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}
      aria-label={ariaLabel}
      data-tutorial={dataTutorial}
    >
      {children}
    </section>
  )
}

export type DashboardSummaryPillProps = {
  label: string
  value: string
  href?: string
  icon: React.ReactNode
  onClick?: () => void
  loading?: boolean
  className?: string
}

export function DashboardSummaryPill({
  label,
  value,
  href = "#",
  icon,
  onClick,
  loading = false,
  className,
}: DashboardSummaryPillProps) {
  const body = (
    <>
      <span className="text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="text-muted-foreground block text-xs font-medium">{label}</span>
        {loading ? (
          <Skeleton className="skeleton-shimmer mt-1 h-4 w-20" />
        ) : (
          <span className="text-foreground block truncate text-sm font-semibold">{value}</span>
        )}
      </span>
    </>
  )

  const classNames = cn(
    "dashboard-card flex min-w-0 items-center gap-2.5 rounded-full border border-border/50 bg-card px-3 py-2 shadow-e1",
    "focus-visible:ring-ring outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    className,
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(classNames, "text-left")} aria-label={`${label}: ${value}`}>
        {body}
      </button>
    )
  }

  return (
    <Link href={href} className={classNames} aria-label={`${label}: ${value}`}>
      {body}
    </Link>
  )
}

type DashboardSummaryPillsRowProps = {
  children: React.ReactNode
  className?: string
  "aria-label"?: string
  "data-tutorial"?: string
}

export function DashboardSummaryPillsRow({
  children,
  className,
  "aria-label": ariaLabel = "Quick summary",
  "data-tutorial": dataTutorial,
}: DashboardSummaryPillsRowProps) {
  return (
    <section
      className={cn("grid grid-cols-2 gap-2 sm:grid-cols-4", className)}
      aria-label={ariaLabel}
      data-tutorial={dataTutorial}
    >
      {children}
    </section>
  )
}
