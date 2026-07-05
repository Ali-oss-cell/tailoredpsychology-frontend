"use client"

import Link from "next/link"

import { PortalMetricTile } from "@/components/shared/portal-list-row"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type NotesQueueCardProps = {
  pendingCount?: number
  signedCount?: number
  loading?: boolean
}

export function NotesQueueCard({ pendingCount = 0, signedCount = 0, loading = false }: NotesQueueCardProps) {
  return (
    <Card className="interactive-lift md:col-span-5">
      <CardHeader className="pb-3">
        <p className="card-eyebrow">Documentation</p>
        <CardTitle className="text-lg">Notes queue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2" aria-busy="true">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <PortalMetricTile label="Pending notes" value={pendingCount} />
              <PortalMetricTile label="Signed" value={signedCount} />
            </div>
            <Link href="/psychologist/notes" className="text-primary text-sm font-medium hover:underline">
              Open notes workspace
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  )
}
