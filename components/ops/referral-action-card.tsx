"use client"

import Link from "next/link"
import * as React from "react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getReferralQueue } from "@/src/ops/referrals/api"

type ReferralActionCardProps = {
  mode: "manager" | "admin"
}

export function ReferralActionCard({ mode }: ReferralActionCardProps) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [counts, setCounts] = React.useState({
    pendingReview: 0,
    infoRequested: 0,
    approved: 0,
    rejected: 0,
  })

  const load = React.useCallback(() => {
    let cancelled = false
    void getReferralQueue()
      .then((rows) => {
        if (cancelled) return
        setCounts({
          pendingReview: rows.filter((row) => row.status === "received" || row.status === "review_needed").length,
          infoRequested: rows.filter((row) => row.status === "info_requested").length,
          approved: rows.filter((row) => row.status === "approved").length,
          rejected: rows.filter((row) => row.status === "rejected").length,
        })
        setError(null)
      })
      .catch(() => {
        if (!cancelled) setError("We couldn't load this section. Try again.")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  const title = mode === "manager" ? "Referral approvals" : "Referral governance"
  const href = mode === "manager" ? "/manager/referrals" : "/admin/referrals"

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        {isLoading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
        {!isLoading && error ? <DashboardStateBlock variant="error" message={error} onRetry={load} /> : null}
        {!isLoading && !error ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <p>Pending review: {counts.pendingReview}</p>
              <p>Info requested: {counts.infoRequested}</p>
              <p>Approved: {counts.approved}</p>
              <p>Rejected: {counts.rejected}</p>
            </div>
            <div className="rounded-md border border-border/60 p-2">
              <Link href={href} className="text-primary underline-offset-4 hover:underline">
                Open referral queue
              </Link>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
