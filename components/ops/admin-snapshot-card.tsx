"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type AdminSnapshotCardProps = {
  title: string
  rows: Array<Record<string, unknown>>
}

export function AdminSnapshotCard({ title, rows }: AdminSnapshotCardProps) {
  return (
    <Card className="interactive-lift">
      <CardHeader className="pb-3">
        <p className="card-eyebrow">Live data</p>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">No records to show.</p>
        ) : null}
        {rows.map((row, idx) => (
          <div
            key={`${title}-${idx}`}
            className="bg-muted/30 grid grid-cols-2 gap-2 rounded-xl border border-border/50 p-3 md:grid-cols-4"
          >
            {Object.entries(row).map(([key, value]) => (
              <p key={key} className="text-xs">
                <span className="text-muted-foreground">{key}: </span>
                <span>{String(value)}</span>
              </p>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
